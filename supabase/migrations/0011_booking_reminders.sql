-- Columns to support calendar feed + email reminders.
alter table bookings add column if not exists starts_at   timestamptz;
alter table bookings add column if not exists reminded_1h  boolean not null default false;
alter table bookings add column if not exists reminded_10m boolean not null default false;
alter table bookings add column if not exists notified     boolean not null default false;
create index if not exists bookings_starts_at_idx on bookings (starts_at);
