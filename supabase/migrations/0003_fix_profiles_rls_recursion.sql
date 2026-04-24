-- Fix infinite recursion in profiles_self_read.
--
-- The original policy referenced `profiles` inside its own USING clause
-- (the parent→child lookup), which makes the policy recurse on itself when
-- evaluated. Postgres raises error 42P17 ("infinite recursion detected in
-- policy for relation 'profiles'").
--
-- Fix: move the lookups into security-definer functions that run with the
-- policy owner's privileges and therefore bypass RLS on their internal reads.

create or replace function public.current_user_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_child_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select child_id from public.profiles where id = auth.uid();
$$;

-- Replace is_admin() to use the helper so it never triggers RLS on profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin';
$$;

-- Rewrite profiles_self_read without the recursive subquery.
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (
    auth.uid() = id
    or public.is_admin()
    or id = public.current_user_child_id()
  );

-- Same treatment for the other policies that did `... in (select child_id from profiles ...)`.
drop policy if exists enrollments_read on public.enrollments;
create policy enrollments_read on public.enrollments
  for select using (
    student_id = auth.uid()
    or public.is_admin()
    or student_id = public.current_user_child_id()
  );

drop policy if exists bookings_read on public.bookings;
create policy bookings_read on public.bookings
  for select using (
    student_id = auth.uid()
    or tutor_id = auth.uid()
    or public.is_admin()
    or student_id = public.current_user_child_id()
  );

drop policy if exists assessments_read on public.assessments;
create policy assessments_read on public.assessments
  for select using (
    student_id = auth.uid()
    or public.is_admin()
    or student_id = public.current_user_child_id()
    or public.current_user_role() = 'tutor'
  );

drop policy if exists assessments_tutor_write on public.assessments;
create policy assessments_tutor_write on public.assessments
  for all using (
    public.is_admin() or public.current_user_role() = 'tutor'
  ) with check (
    public.is_admin() or public.current_user_role() = 'tutor'
  );
