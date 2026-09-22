-- TWHMU — casting applications. Only signed-in users can apply.

create table if not exists public.casting_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  role_interest text not null,
  experience text not null,
  portfolio_url text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.casting_applications enable row level security;

-- Only the signed-in owner can submit and read their own application(s) —
-- no anonymous insert policy at all, unlike newsletter/city_requests.
drop policy if exists "Users can read their own casting applications" on public.casting_applications;
create policy "Users can read their own casting applications"
  on public.casting_applications for select
  using (auth.uid() = user_id);

drop policy if exists "Users can submit their own casting applications" on public.casting_applications;
create policy "Users can submit their own casting applications"
  on public.casting_applications for insert
  with check (auth.uid() = user_id);
