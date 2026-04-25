-- ═══════════════════════════════════════════════════════════════════
--  LYNDA BADMUS EDUCATION — SEED DATA
--  Run AFTER schema.sql.
--
--  IMPORTANT: Supabase Auth users must be created first via the
--  Authentication dashboard or API, then the profile rows here
--  will match them.
--
--  Step-by-step:
--  1. Go to Supabase Dashboard → Authentication → Users → Add User
--  2. Create these 4 accounts with the emails/passwords below
--  3. Copy each user's UUID from the list
--  4. Replace the UUIDs in this file with your real ones
--  5. Run this SQL in SQL Editor
--
--  Demo accounts to create in Auth:
--    student@demo.com  /  DemoPass123!
--    parent@demo.com   /  DemoPass123!
--    tutor@demo.com    /  DemoPass123!
--    admin@lbe.com     /  AdminPass123!
-- ═══════════════════════════════════════════════════════════════════

-- ── REPLACE THESE WITH YOUR REAL AUTH USER UUIDs ─────────────────────
-- Find them in: Authentication → Users → click each user → copy UUID

do $$
declare
  student_id uuid := '00000000-0000-0000-0000-000000000001'; -- REPLACE
  parent_id  uuid := '00000000-0000-0000-0000-000000000002'; -- REPLACE
  tutor_id   uuid := '00000000-0000-0000-0000-000000000003'; -- REPLACE
  admin_id   uuid := '00000000-0000-0000-0000-000000000004'; -- REPLACE
  ib_aa_hl_id uuid;
  tutor_profile_id uuid;
  enrollment_id uuid;
begin

-- ── PROFILES ───────────────────────────────────────────────────────────
insert into public.profiles (id, email, full_name, role) values
  (student_id, 'student@demo.com', 'Alex Chen',     'student'),
  (parent_id,  'parent@demo.com',  'Wei Chen',      'parent'),
  (tutor_id,   'tutor@demo.com',   'Dr. Sarah Mills','tutor'),
  (admin_id,   'admin@lbe.com',    'Lynda Badmus',  'admin')
on conflict (id) do update set
  full_name = excluded.full_name,
  role = excluded.role;

-- ── PARENT → STUDENT LINK ─────────────────────────────────────────────
insert into public.parent_student_links (parent_id, student_id, nickname)
values (parent_id, student_id, 'Alex')
on conflict (parent_id, student_id) do nothing;

-- ── TUTOR PROFILE ─────────────────────────────────────────────────────
insert into public.tutor_profiles (user_id, bio, qualifications, years_experience, subjects, curricula, pay_rate_gbp, pay_rate_usd, status)
values (
  tutor_id,
  'Experienced IB and A-Level Mathematics tutor with a PhD in Applied Mathematics.',
  ARRAY['PhD Applied Mathematics', 'PGCE Secondary Mathematics'],
  8,
  ARRAY['Mathematics', 'Chemistry'],
  ARRAY['IB Diploma', 'A-Level', 'GCSE'],
  25.00,
  32.00,
  'active'
)
on conflict (user_id) do update set status = 'active'
returning id into tutor_profile_id;

-- ── COURSE: IB MATH AA HL ─────────────────────────────────────────────
insert into public.courses (
  slug, title, short_title, category, subject, ib_pathway, ib_level,
  curriculum, description, target_student,
  total_hours_full, total_hours_half, total_hours_qtr, total_lessons,
  rate_gbp, rate_usd, color, is_published
) values (
  'ib-math-aa-hl',
  'IB Mathematics: Analysis & Approaches HL',
  'IB Math AA HL',
  'ib', 'mathematics', 'aa', 'hl',
  'IB Diploma Programme — Higher Level',
  'Full HL programme: complex numbers, matrices, proof by induction, ODEs, and Paper 3 technique. The deepest IB Mathematics course.',
  'IB Diploma students taking Math AA at Higher Level',
  50, 25, 12, 30,
  50.00, 70.00,
  '#6E5BB8',
  true
)
on conflict (slug) do nothing
returning id into ib_aa_hl_id;

-- If course already existed, get its id
if ib_aa_hl_id is null then
  select id into ib_aa_hl_id from public.courses where slug = 'ib-math-aa-hl';
end if;

-- ── ENROLLMENT: STUDENT IN IB MATH AA HL ─────────────────────────────
insert into public.enrollments (
  student_id, course_id, package_type,
  credits_total, credits_used, status, enrolled_at
) values (
  student_id, ib_aa_hl_id, 'full',
  50, 9, 'active', now() - interval '3 months'
)
on conflict do nothing
returning id into enrollment_id;

-- ── UPCOMING BOOKING ──────────────────────────────────────────────────
if enrollment_id is not null then
  insert into public.bookings (
    enrollment_id, student_id, tutor_id, course_id,
    scheduled_date, scheduled_time, duration_mins, timezone,
    status, zoom_link, zoom_meeting_id
  ) values (
    enrollment_id, student_id, tutor_profile_id, ib_aa_hl_id,
    current_date + interval '3 days',
    '15:30', 60, 'Europe/London',
    'scheduled',
    'https://zoom.us/j/123456789?pwd=lbeDemo',
    '123 456 789'
  ) on conflict do nothing;
end if;

-- ── BILLING RECORD ────────────────────────────────────────────────────
if enrollment_id is not null then
  insert into public.billing_records (
    student_id, enrollment_id, description, amount, currency, status
  ) values (
    student_id, enrollment_id,
    'IB Math AA HL — Full Course (50 hours)',
    2500.00, 'GBP', 'paid'
  ) on conflict do nothing;
end if;

end $$;

-- ── QUICK VERIFY ────────────────────────────────────────────────────────
-- Run these after to confirm everything is in place:
select id, full_name, role from profiles;
select id, slug, title from courses where is_published = true;
select id, package_type, credits_total, credits_used from enrollments;
select id, scheduled_date, zoom_link from bookings;
