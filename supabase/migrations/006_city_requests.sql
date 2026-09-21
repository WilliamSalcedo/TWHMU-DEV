-- TWHMU — "Vote for your city" requests
-- Run this once in the Supabase SQL Editor.

create table if not exists public.city_requests (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  email text,
  created_at timestamptz not null default now()
);

alter table public.city_requests enable row level security;

-- Anyone (even logged out) can submit a request. No public SELECT — same
-- pattern as newsletter_subscribers: we don't need clients reading this back.
drop policy if exists "Anyone can request a city" on public.city_requests;
create policy "Anyone can request a city"
  on public.city_requests for insert
  with check (true);
