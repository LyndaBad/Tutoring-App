-- Lynda Badmus Education — initial schema
-- Derived from the mock data shapes in src/App.jsx.
-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI).
--
-- Conventions:
--   * `profiles` is keyed on auth.users.id (Supabase auth is the source of truth for users).
--   * Everything is timestamped with created_at / updated_at.
--   * RLS is enabled on every table; policies below grant the minimum needed for each portal.
--   * The `role` column on `profiles` is what the app reads to decide which portal to show.

-- ─── extensions ────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── enums ─────────────────────────────────────────────────────────────
create type user_role     as enum ('student', 'parent', 'tutor', 'admin');
create type booking_status as enum ('scheduled', 'completed', 'cancelled');
create type session_status as enum ('upcoming', 'completed', 'cancelled');
create type pay_status     as enum ('pending', 'approved', 'paid');
create type assessment_type as enum ('baseline', 'topic_check', 'mid_course', 'final');
create type pkg_type       as enum ('full', 'half', 'quarter');

-- ─── profiles ──────────────────────────────────────────────────────────
-- One row per auth user. Created via trigger when someone signs up.
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  name        text not null default '',
  role        user_role not null default 'student',
  avatar      text,                 -- short initials like "AC", displayed in UI
  pay_rate    numeric(10,2),        -- tutors only: £/hr
  child_id    uuid references profiles(id), -- parents only: points at the linked student
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a profile row when a new auth user signs up.
-- Metadata (name, role) comes from supabase.auth.signUp({ options: { data: { ... } } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── courses ───────────────────────────────────────────────────────────
-- Kept as a real table (rather than hardcoded) so admin can manage pricing later.
-- The 20 rows in COURSES[] in App.jsx should be seeded here.
create table courses (
  id            text primary key,          -- e.g. "ib-aa-hl" — matches mock data IDs
  title         text not null,
  grp           text not null,             -- ib | al | gcse | pre | preib | ap | hon | ms | us
  subject       text not null,             -- math | chem | sci
  path          text,                      -- IB only: aa | ai
  level         text,                      -- IB/A-Level: sl | hl
  curriculum    text not null,             -- human-readable "IB Diploma · HL"
  description   text not null,
  rate_gbp      numeric(10,2) not null,
  rate_usd      numeric(10,2) not null,
  hours_full    integer not null,
  hours_half    integer not null,
  hours_quarter integer not null,
  lessons       integer not null,
  created_at    timestamptz not null default now()
);

-- ─── enrollments ───────────────────────────────────────────────────────
-- A student's purchase of a course package. Credits are hours remaining.
create table enrollments (
  id                  uuid primary key default uuid_generate_v4(),
  student_id          uuid not null references profiles(id) on delete cascade,
  course_id           text not null references courses(id),
  package             pkg_type not null,
  credits_purchased   integer not null,
  credits_used        integer not null default 0,
  completed_lessons   integer[] not null default '{}',
  enrolled_at         timestamptz not null default now(),
  unique (student_id, course_id)
);

-- ─── bookings ──────────────────────────────────────────────────────────
-- A scheduled live session between a student and a tutor.
create table bookings (
  id            uuid primary key default uuid_generate_v4(),
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  student_id    uuid not null references profiles(id),
  tutor_id      uuid references profiles(id),
  course_id     text not null references courses(id),
  session_date  date not null,
  session_time  time not null,
  lesson_number integer,
  status        booking_status not null default 'scheduled',
  zoom_url      text,
  meeting_id    text,
  created_at    timestamptz not null default now()
);

create index on bookings (student_id, session_date);
create index on bookings (tutor_id, session_date);

-- ─── sessions ──────────────────────────────────────────────────────────
-- Tutor-side view of work done (separate from bookings so tutors can log hours
-- that didn't come through the booking flow — matches the USERS[u3].sessions shape).
create table sessions (
  id          uuid primary key default uuid_generate_v4(),
  booking_id  uuid references bookings(id),
  tutor_id    uuid not null references profiles(id),
  student_id  uuid not null references profiles(id),
  course_id   text not null references courses(id),
  session_date date not null,
  session_time time not null,
  duration_min integer not null default 60,
  status      session_status not null default 'upcoming',
  zoom_url    text,
  meeting_id  text,
  amount      numeric(10,2),             -- tutor pay for this session
  pay_status  pay_status,                -- null until logged into an invoice
  created_at  timestamptz not null default now()
);

-- ─── assessments ───────────────────────────────────────────────────────
create table assessments (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references profiles(id) on delete cascade,
  course_id   text not null references courses(id),
  title       text not null,
  type        assessment_type not null,
  score       integer,                   -- null until graded
  max_score   integer not null,
  taken_at    date,
  notes       text,
  strengths   text[],
  work_on     text[],
  done        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─── invoices ──────────────────────────────────────────────────────────
-- Tutor-submitted invoice covering a pay period.
create table invoices (
  id            uuid primary key default uuid_generate_v4(),
  tutor_id      uuid not null references profiles(id) on delete cascade,
  period        text not null,           -- "Nov 2025"
  session_count integer not null,
  hours         numeric(6,2) not null,
  rate          numeric(10,2) not null,
  total         numeric(10,2) not null,
  status        pay_status not null default 'pending',
  submitted_at  timestamptz not null default now(),
  paid_at       timestamptz
);

-- ─── payouts ───────────────────────────────────────────────────────────
-- Admin-tracked disbursement (can cover one invoice or a batch).
create table payouts (
  id          uuid primary key default uuid_generate_v4(),
  tutor_id    uuid not null references profiles(id) on delete cascade,
  invoice_id  uuid references invoices(id),
  period      text not null,
  hours       numeric(6,2) not null,
  rate        numeric(10,2) not null,
  total       numeric(10,2) not null,
  status      pay_status not null default 'pending',
  paid_at     timestamptz,
  reference   text                       -- e.g. "BACS-OCT25-SM"
);

-- ─── updated_at trigger for profiles ──────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on profiles
  for each row execute function public.touch_updated_at();

-- ─── RLS ───────────────────────────────────────────────────────────────
-- Enable on all tables. Without policies, nothing is readable. With these, each
-- role can read/write only what belongs to them. Admin bypass is via service_role key.

alter table profiles    enable row level security;
alter table courses     enable row level security;
alter table enrollments enable row level security;
alter table bookings    enable row level security;
alter table sessions    enable row level security;
alter table assessments enable row level security;
alter table invoices    enable row level security;
alter table payouts     enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: users can read their own row, admins can read all, parents can read their child.
create policy profiles_self_read on profiles
  for select using (
    auth.uid() = id
    or public.is_admin()
    or id in (select child_id from profiles where id = auth.uid())
  );
create policy profiles_self_update on profiles
  for update using (auth.uid() = id or public.is_admin());

-- courses: public read (the homepage catalog needs this), admin write.
create policy courses_public_read on courses for select using (true);
create policy courses_admin_write on courses
  for all using (public.is_admin()) with check (public.is_admin());

-- enrollments: student sees their own, parent sees their child's, admin sees all.
create policy enrollments_read on enrollments
  for select using (
    student_id = auth.uid()
    or public.is_admin()
    or student_id in (select child_id from profiles where id = auth.uid())
  );
create policy enrollments_admin_write on enrollments
  for all using (public.is_admin()) with check (public.is_admin());

-- bookings: student sees own, tutor sees own, parent sees child's, admin sees all.
create policy bookings_read on bookings
  for select using (
    student_id = auth.uid()
    or tutor_id = auth.uid()
    or public.is_admin()
    or student_id in (select child_id from profiles where id = auth.uid())
  );
create policy bookings_student_insert on bookings
  for insert with check (student_id = auth.uid());
create policy bookings_tutor_update on bookings
  for update using (tutor_id = auth.uid() or public.is_admin());

-- sessions: tutor sees own, student sees own, admin sees all.
create policy sessions_read on sessions
  for select using (
    tutor_id = auth.uid()
    or student_id = auth.uid()
    or public.is_admin()
  );
create policy sessions_tutor_write on sessions
  for all using (tutor_id = auth.uid() or public.is_admin())
  with check (tutor_id = auth.uid() or public.is_admin());

-- assessments: student sees own, parent sees child's, tutor/admin can write.
create policy assessments_read on assessments
  for select using (
    student_id = auth.uid()
    or public.is_admin()
    or student_id in (select child_id from profiles where id = auth.uid())
    or exists (
      select 1 from profiles where id = auth.uid() and role = 'tutor'
    )
  );
create policy assessments_tutor_write on assessments
  for all using (
    public.is_admin()
    or exists (select 1 from profiles where id = auth.uid() and role = 'tutor')
  ) with check (
    public.is_admin()
    or exists (select 1 from profiles where id = auth.uid() and role = 'tutor')
  );

-- invoices: tutor sees/submits own, admin approves.
create policy invoices_read on invoices
  for select using (tutor_id = auth.uid() or public.is_admin());
create policy invoices_tutor_insert on invoices
  for insert with check (tutor_id = auth.uid());
create policy invoices_admin_update on invoices
  for update using (public.is_admin());

-- payouts: tutor sees own, admin manages.
create policy payouts_read on payouts
  for select using (tutor_id = auth.uid() or public.is_admin());
create policy payouts_admin_write on payouts
  for all using (public.is_admin()) with check (public.is_admin());
