-- TWHMU — saved addresses per user, selectable at checkout.

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home',
  full_name text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  region text not null,
  postal_code text not null,
  country text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.addresses enable row level security;

drop policy if exists "Users can read their own addresses" on public.addresses;
create policy "Users can read their own addresses"
  on public.addresses for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own addresses" on public.addresses;
create policy "Users can create their own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own addresses" on public.addresses;
create policy "Users can update their own addresses"
  on public.addresses for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own addresses" on public.addresses;
create policy "Users can delete their own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);
