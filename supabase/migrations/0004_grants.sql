-- Grant table-level privileges to the Supabase roles.
--
-- RLS policies are a FILTER on top of table privileges — they don't grant
-- access on their own. Without these GRANTs, signed-in users get
-- "permission denied for table X" before any policy is evaluated.
--
-- Roles:
--   anon          — unauthenticated visitors (public site only)
--   authenticated — signed-in users (policies decide what they can see)
--   service_role  — server-side admin, bypasses RLS (already has full access)

-- Public read for the course catalog (homepage / courses page).
grant select on public.courses to anon, authenticated;

-- Signed-in users get full CRUD; RLS policies constrain which rows.
grant select, insert, update, delete on
  public.profiles,
  public.enrollments,
  public.bookings,
  public.sessions,
  public.assessments,
  public.invoices,
  public.payouts
to authenticated;

-- uuid_generate_v4() and other default-value functions need execute access.
grant usage on schema public to anon, authenticated;
