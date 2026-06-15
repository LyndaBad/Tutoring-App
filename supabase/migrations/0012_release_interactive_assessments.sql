-- ─────────────────────────────────────────────────────────────────────────
-- 0012  Tutor-controlled release of lessons + interactive assessment papers
--
-- Lessons are tutor-only by default. A tutor "releases" individual lessons to
-- an individual student as they progress. Assessment papers are taken
-- interactively in-app by the student (answers stored as a submission); the
-- mark scheme is tutor-only and never exposed to students.
-- ─────────────────────────────────────────────────────────────────────────

-- staff = tutor or admin (defined via existing helpers, SECURITY DEFINER-safe)
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or public.current_user_role() = 'tutor';
$$;

-- Tutors need to see students (to pick who to release to) and their enrolments.
drop policy if exists profiles_staff_read on public.profiles;
create policy profiles_staff_read on public.profiles
  for select using (public.is_staff());
drop policy if exists enrollments_staff_read on public.enrollments;
create policy enrollments_staff_read on public.enrollments
  for select using (public.is_staff());

-- ── 1. Per-student lesson releases ────────────────────────────────────────
create table if not exists public.lesson_releases (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references public.profiles(id) on delete cascade,
  course_id   text not null references public.courses(id),
  lesson_num  integer not null,
  released_by uuid references public.profiles(id),
  created_at  timestamptz not null default now(),
  unique (student_id, course_id, lesson_num)
);
create index if not exists lesson_releases_student_idx on public.lesson_releases (student_id, course_id);

-- ── 2. Assessment papers (the interactive test definitions) ───────────────
-- questions: jsonb array of { section, n, prompt, marks, answer_type }
create table if not exists public.assessment_papers (
  id          uuid primary key default uuid_generate_v4(),
  course_id   text not null references public.courses(id),
  code        text,                         -- e.g. "EOT1", "BASELINE"
  title       text not null,
  time_min    integer,
  total_marks integer,
  questions   jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists assessment_papers_course_idx on public.assessment_papers (course_id);

-- ── 3. Mark schemes (TUTOR-ONLY) ──────────────────────────────────────────
create table if not exists public.paper_markschemes (
  paper_id   uuid primary key references public.assessment_papers(id) on delete cascade,
  scheme     jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── 4. Per-student paper releases ─────────────────────────────────────────
create table if not exists public.paper_releases (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references public.profiles(id) on delete cascade,
  paper_id    uuid not null references public.assessment_papers(id) on delete cascade,
  released_by uuid references public.profiles(id),
  created_at  timestamptz not null default now(),
  unique (student_id, paper_id)
);
create index if not exists paper_releases_student_idx on public.paper_releases (student_id);

-- ── 5. Student submissions (their typed answers) ──────────────────────────
create table if not exists public.paper_submissions (
  id           uuid primary key default uuid_generate_v4(),
  paper_id     uuid not null references public.assessment_papers(id) on delete cascade,
  student_id   uuid not null references public.profiles(id) on delete cascade,
  answers      jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  score        integer,                     -- null until the tutor marks it
  max_marks    integer,
  feedback     text,
  marked_by    uuid references public.profiles(id),
  marked_at    timestamptz,
  unique (paper_id, student_id)
);
create index if not exists paper_submissions_student_idx on public.paper_submissions (student_id);

-- ── RLS ───────────────────────────────────────────────────────────────────
alter table public.lesson_releases   enable row level security;
alter table public.assessment_papers enable row level security;
alter table public.paper_markschemes enable row level security;
alter table public.paper_releases    enable row level security;
alter table public.paper_submissions enable row level security;

-- lesson_releases: student sees their own, parent sees their child's, staff all
drop policy if exists lesson_releases_read on public.lesson_releases;
create policy lesson_releases_read on public.lesson_releases
  for select using (
    auth.uid() = student_id
    or public.current_user_child_id() = student_id
    or public.is_staff()
  );
drop policy if exists lesson_releases_write on public.lesson_releases;
create policy lesson_releases_write on public.lesson_releases
  for all using (public.is_staff()) with check (public.is_staff());

-- assessment_papers: questions readable by any signed-in user; staff write
drop policy if exists assessment_papers_read on public.assessment_papers;
create policy assessment_papers_read on public.assessment_papers
  for select using (auth.role() = 'authenticated');
drop policy if exists assessment_papers_write on public.assessment_papers;
create policy assessment_papers_write on public.assessment_papers
  for all using (public.is_staff()) with check (public.is_staff());

-- mark schemes: STAFF ONLY (never visible to students/parents)
drop policy if exists paper_markschemes_staff on public.paper_markschemes;
create policy paper_markschemes_staff on public.paper_markschemes
  for all using (public.is_staff()) with check (public.is_staff());

-- paper_releases: student/parent read own; staff all + write
drop policy if exists paper_releases_read on public.paper_releases;
create policy paper_releases_read on public.paper_releases
  for select using (
    auth.uid() = student_id
    or public.current_user_child_id() = student_id
    or public.is_staff()
  );
drop policy if exists paper_releases_write on public.paper_releases;
create policy paper_releases_write on public.paper_releases
  for all using (public.is_staff()) with check (public.is_staff());

-- paper_submissions: student/parent read own; staff read all.
-- Student inserts/updates their own (until marked); staff update (marking).
drop policy if exists paper_submissions_read on public.paper_submissions;
create policy paper_submissions_read on public.paper_submissions
  for select using (
    auth.uid() = student_id
    or public.current_user_child_id() = student_id
    or public.is_staff()
  );
drop policy if exists paper_submissions_insert on public.paper_submissions;
create policy paper_submissions_insert on public.paper_submissions
  for insert with check (auth.uid() = student_id);
drop policy if exists paper_submissions_update_self on public.paper_submissions;
create policy paper_submissions_update_self on public.paper_submissions
  for update using (auth.uid() = student_id and score is null)
  with check (auth.uid() = student_id);
drop policy if exists paper_submissions_update_staff on public.paper_submissions;
create policy paper_submissions_update_staff on public.paper_submissions
  for update using (public.is_staff()) with check (public.is_staff());
