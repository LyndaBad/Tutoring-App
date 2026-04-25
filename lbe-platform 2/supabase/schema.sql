-- ═══════════════════════════════════════════════════════════════════
--  LYNDA BADMUS EDUCATION — DATABASE SCHEMA
--  Run this entire file in Supabase SQL Editor after project creation.
--  Go to: Dashboard → SQL Editor → New Query → paste → Run
-- ═══════════════════════════════════════════════════════════════════

-- ── PROFILES ─────────────────────────────────────────────────────────
create table public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  email        text unique not null,
  full_name    text not null,
  role         text not null default 'student'
               check (role in ('student','parent','tutor','admin')),
  avatar_url   text,
  phone        text,
  country      text,
  timezone     text default 'Europe/London',
  currency     text default 'GBP' check (currency in ('GBP','USD')),
  created_at   timestamptz default now()
);

alter table profiles enable row level security;

create policy "users read own profile" on profiles
  for select using (auth.uid() = id);

create policy "users update own profile" on profiles
  for update using (auth.uid() = id);

create policy "admin reads all profiles" on profiles
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── PARENT ↔ STUDENT LINKS ────────────────────────────────────────────
create table public.parent_student_links (
  id           uuid primary key default gen_random_uuid(),
  parent_id    uuid references profiles(id) on delete cascade,
  student_id   uuid references profiles(id) on delete cascade,
  nickname     text,
  created_at   timestamptz default now(),
  unique(parent_id, student_id)
);

alter table parent_student_links enable row level security;

create policy "parent reads own links" on parent_student_links
  for select using (auth.uid() = parent_id);

create policy "admin manages links" on parent_student_links
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── COURSES ──────────────────────────────────────────────────────────
create table public.courses (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  short_title       text,
  category          text not null,
  subject           text not null,
  ib_pathway        text,
  ib_level          text,
  curriculum        text,
  description       text,
  target_student    text,
  total_hours_full  int not null default 36,
  total_hours_half  int not null default 18,
  total_hours_qtr   int not null default 9,
  total_lessons     int not null default 12,
  rate_gbp          numeric(8,2) not null,
  rate_usd          numeric(8,2) not null,
  color             text default '#C9A86C',
  is_published      boolean default true,
  sort_order        int default 0,
  created_at        timestamptz default now()
);

alter table courses enable row level security;

create policy "anyone reads published courses" on courses
  for select using (is_published = true);

create policy "admin manages courses" on courses
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── COURSE UNITS ──────────────────────────────────────────────────────
create table public.course_units (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid references courses(id) on delete cascade,
  unit_code    text not null,
  title        text not null,
  sort_order   int not null
);

create index on course_units(course_id, sort_order);

alter table course_units enable row level security;
create policy "anyone reads units" on course_units for select using (true);
create policy "admin manages units" on course_units for all using (
  exists(select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── LESSONS ───────────────────────────────────────────────────────────
create table public.lessons (
  id                uuid primary key default gen_random_uuid(),
  course_id         uuid references courses(id) on delete cascade,
  unit_id           uuid references course_units(id) on delete set null,
  lesson_number     int not null,
  title             text not null,
  objective         text,
  topics            text[],
  teaching_notes    text,
  guided_examples   jsonb default '[]',
  practice_qs       jsonb default '[]',
  homework          text,
  homework_url      text,
  key_equations     jsonb default '[]',
  ppt_title         text,
  ppt_url           text,
  ppt_pdf_url       text,
  ppt_thumb_url     text,
  ppt_slide_count   int,
  is_assessment     boolean default false,
  assessment_type   text check (assessment_type in ('baseline','topic_check','mid_course','final')),
  sort_order        int not null,
  created_at        timestamptz default now(),
  unique(course_id, lesson_number)
);

create index on lessons(course_id, lesson_number);

alter table lessons enable row level security;

create policy "enrolled students read lessons" on lessons
  for select using (
    exists(
      select 1 from enrollments e
      where e.student_id = auth.uid()
      and e.course_id = lessons.course_id
      and e.status = 'active'
    )
    or exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('tutor','admin'))
  );

-- ── ASSESSMENTS ────────────────────────────────────────────────────────
create table public.assessments (
  id               uuid primary key default gen_random_uuid(),
  course_id        uuid references courses(id) on delete cascade,
  lesson_id        uuid references lessons(id) on delete set null,
  title            text not null,
  type             text not null check (type in ('baseline','topic_check','mid_course','final')),
  topics_assessed  text[],
  max_score        int not null default 100,
  questions        jsonb default '[]',
  created_at       timestamptz default now()
);

alter table assessments enable row level security;
create policy "tutors and admin manage assessments" on assessments
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('tutor','admin'))
  );
create policy "enrolled students read assessments" on assessments
  for select using (
    exists(select 1 from enrollments e where e.student_id = auth.uid() and e.course_id = assessments.course_id and e.status = 'active')
  );

-- ── ENROLLMENTS ────────────────────────────────────────────────────────
create table public.enrollments (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid references profiles(id) on delete cascade,
  course_id         uuid references courses(id) on delete cascade,
  package_type      text not null check (package_type in ('full','half','quarter')),
  credits_total     int not null,
  credits_used      int not null default 0,
  status            text default 'active' check (status in ('active','paused','expired')),
  stripe_session_id text,
  currency_paid     text,
  amount_paid       numeric(10,2),
  enrolled_at       timestamptz default now(),
  constraint no_overdraft check (credits_used <= credits_total)
);

create index on enrollments(student_id, status);

alter table enrollments enable row level security;

create policy "students read own enrollments" on enrollments
  for select using (student_id = auth.uid());

create policy "admin manages enrollments" on enrollments
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "service role insert enrollments" on enrollments
  for insert with check (true);

-- ── TUTOR PROFILES ─────────────────────────────────────────────────────
create table public.tutor_profiles (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references profiles(id) on delete cascade unique,
  bio                   text,
  qualifications        text[],
  years_experience      int,
  subjects              text[],
  curricula             text[],
  languages             text[],
  pay_rate_gbp          numeric(8,2) default 0,
  pay_rate_usd          numeric(8,2) default 0,
  can_upload_ppt        boolean default true,
  can_enter_assessments boolean default true,
  status                text default 'pending' check (status in ('pending','active','inactive')),
  created_at            timestamptz default now()
);

alter table tutor_profiles enable row level security;

create policy "tutors read own profile" on tutor_profiles
  for select using (user_id = auth.uid());

create policy "tutors update own profile" on tutor_profiles
  for update using (user_id = auth.uid());

create policy "admin manages tutor profiles" on tutor_profiles
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── TUTOR AVAILABILITY ─────────────────────────────────────────────────
create table public.tutor_availability (
  id           uuid primary key default gen_random_uuid(),
  tutor_id     uuid references tutor_profiles(id) on delete cascade,
  day_of_week  int not null check (day_of_week between 0 and 6),
  start_time   time not null,
  end_time     time not null,
  timezone     text not null default 'Europe/London',
  is_active    boolean default true
);

create table public.tutor_blocked_dates (
  id           uuid primary key default gen_random_uuid(),
  tutor_id     uuid references tutor_profiles(id) on delete cascade,
  blocked_date date not null,
  reason       text
);

alter table tutor_availability enable row level security;
create policy "tutors manage own availability" on tutor_availability
  for all using (
    exists(select 1 from tutor_profiles tp where tp.id = tutor_availability.tutor_id and tp.user_id = auth.uid())
  );

-- ── BOOKINGS ───────────────────────────────────────────────────────────
create table public.bookings (
  id                uuid primary key default gen_random_uuid(),
  enrollment_id     uuid references enrollments(id) on delete cascade,
  student_id        uuid references profiles(id),
  tutor_id          uuid references tutor_profiles(id),
  lesson_id         uuid references lessons(id),
  course_id         uuid references courses(id),
  scheduled_date    date not null,
  scheduled_time    time not null,
  duration_mins     int not null default 60,
  timezone          text not null default 'Europe/London',
  status            text default 'scheduled'
                    check (status in ('scheduled','completed','cancelled','no_show')),
  zoom_link         text,
  zoom_meeting_id   text,
  notes             text,
  created_at        timestamptz default now()
);

create index on bookings(student_id, scheduled_date);
create index on bookings(tutor_id, scheduled_date);

alter table bookings enable row level security;

create policy "students read own bookings" on bookings
  for select using (student_id = auth.uid());

create policy "students create own bookings" on bookings
  for insert with check (student_id = auth.uid());

create policy "tutors read assigned bookings" on bookings
  for select using (
    exists(select 1 from tutor_profiles tp where tp.id = bookings.tutor_id and tp.user_id = auth.uid())
  );

create policy "admin manages bookings" on bookings
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "parents read child bookings" on bookings
  for select using (
    exists(
      select 1 from parent_student_links psl
      where psl.parent_id = auth.uid() and psl.student_id = bookings.student_id
    )
  );

-- ── LESSON ATTENDANCE ──────────────────────────────────────────────────
create table public.lesson_attendance (
  id                      uuid primary key default gen_random_uuid(),
  booking_id              uuid references bookings(id) on delete cascade,
  student_id              uuid references profiles(id),
  attended                boolean,
  duration_actual_mins    int,
  tutor_session_notes     text,
  parent_visible_summary  text,
  created_at              timestamptz default now()
);

alter table lesson_attendance enable row level security;
create policy "admin and tutor manage attendance" on lesson_attendance
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('tutor','admin'))
  );

-- ── STUDENT PROGRESS ────────────────────────────────────────────────────
create table public.student_progress (
  id              uuid primary key default gen_random_uuid(),
  enrollment_id   uuid references enrollments(id) on delete cascade,
  student_id      uuid references profiles(id),
  lesson_id       uuid references lessons(id),
  status          text default 'not_started'
                  check (status in ('not_started','in_progress','completed')),
  ppt_viewed      boolean default false,
  homework_done   boolean default false,
  tutor_notes     text,
  completed_at    timestamptz,
  unique(enrollment_id, lesson_id)
);

alter table student_progress enable row level security;
create policy "students read own progress" on student_progress
  for select using (student_id = auth.uid());
create policy "tutors manage progress" on student_progress
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('tutor','admin'))
  );

-- ── ASSESSMENT RESULTS ─────────────────────────────────────────────────
create table public.assessment_results (
  id                  uuid primary key default gen_random_uuid(),
  assessment_id       uuid references assessments(id) on delete cascade,
  enrollment_id       uuid references enrollments(id) on delete cascade,
  student_id          uuid references profiles(id),
  tutor_id            uuid references tutor_profiles(id),
  score               int,
  max_score           int not null,
  grade               text,
  tutor_feedback      text,
  parent_feedback     text,
  strengths           text[] default '{}',
  areas_for_work      text[] default '{}',
  visible_to_student  boolean default true,
  visible_to_parent   boolean default true,
  completed_at        timestamptz,
  created_at          timestamptz default now()
);

alter table assessment_results enable row level security;

create policy "students read own visible results" on assessment_results
  for select using (student_id = auth.uid() and visible_to_student = true);

create policy "tutors manage results" on assessment_results
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('tutor','admin'))
  );

create policy "parents read visible results" on assessment_results
  for select using (
    visible_to_parent = true and
    exists(
      select 1 from parent_student_links psl
      where psl.parent_id = auth.uid() and psl.student_id = assessment_results.student_id
    )
  );

-- ── TUTOR SESSIONS (for payout tracking) ──────────────────────────────
create table public.tutor_sessions (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid references bookings(id),
  tutor_id        uuid references tutor_profiles(id),
  student_id      uuid references profiles(id),
  course_id       uuid references courses(id),
  session_date    date not null,
  duration_mins   int not null default 60,
  pay_rate_gbp    numeric(8,2) not null,
  invoice_id      uuid,
  created_at      timestamptz default now()
);

alter table tutor_sessions enable row level security;
create policy "tutors read own sessions" on tutor_sessions
  for select using (
    exists(select 1 from tutor_profiles tp where tp.id = tutor_sessions.tutor_id and tp.user_id = auth.uid())
  );
create policy "admin manages sessions" on tutor_sessions
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── TUTOR INVOICES ─────────────────────────────────────────────────────
create table public.tutor_invoices (
  id              uuid primary key default gen_random_uuid(),
  tutor_id        uuid references tutor_profiles(id),
  period_start    date not null,
  period_end      date not null,
  total_hours     numeric(6,2) not null,
  total_gbp       numeric(10,2) not null,
  status          text default 'pending'
                  check (status in ('pending','approved','paid','rejected')),
  submitted_at    timestamptz default now(),
  paid_at         timestamptz,
  payment_ref     text
);

alter table tutor_invoices enable row level security;
create policy "tutors read own invoices" on tutor_invoices
  for select using (
    exists(select 1 from tutor_profiles tp where tp.id = tutor_invoices.tutor_id and tp.user_id = auth.uid())
  );
create policy "tutors insert own invoices" on tutor_invoices
  for insert with check (
    exists(select 1 from tutor_profiles tp where tp.id = tutor_invoices.tutor_id and tp.user_id = auth.uid())
  );
create policy "admin manages invoices" on tutor_invoices
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── BILLING RECORDS ────────────────────────────────────────────────────
create table public.billing_records (
  id                    uuid primary key default gen_random_uuid(),
  student_id            uuid references profiles(id),
  enrollment_id         uuid references enrollments(id),
  description           text not null,
  amount                numeric(10,2) not null,
  currency              text not null,
  stripe_session_id     text,
  stripe_payment_intent text,
  status                text default 'paid' check (status in ('paid','pending','refunded')),
  paid_at               timestamptz default now()
);

alter table billing_records enable row level security;

create policy "students read own billing" on billing_records
  for select using (student_id = auth.uid());

create policy "parents read child billing" on billing_records
  for select using (
    exists(
      select 1 from parent_student_links psl
      where psl.parent_id = auth.uid() and psl.student_id = billing_records.student_id
    )
  );

create policy "admin manages billing" on billing_records
  for all using (
    exists(select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ── SUPABASE STORAGE BUCKETS ──────────────────────────────────────────
-- Run these separately in Supabase Dashboard → Storage → New Bucket
-- OR uncomment and run here:

-- insert into storage.buckets (id, name, public) values ('lesson-slides', 'lesson-slides', true);
-- insert into storage.buckets (id, name, public) values ('tutor-photos', 'tutor-photos', true);

-- Storage policies for lesson-slides:
-- create policy "authenticated users can view slides" on storage.objects
--   for select using (bucket_id = 'lesson-slides' and auth.role() = 'authenticated');
-- create policy "tutors and admin upload slides" on storage.objects
--   for insert with check (
--     bucket_id = 'lesson-slides' and
--     exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('tutor','admin'))
--   );
