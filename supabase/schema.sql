-- TWHMU — schema + seed data
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Safe to re-run: tables use IF NOT EXISTS, seeds are guarded with ON CONFLICT.

-- ============================================================
-- 1. STORAGE — public bucket for images (women, products, story)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- No SELECT policy needed here: the "media" bucket is public, so <img> tags load
-- files straight from their public URL without going through storage RLS at all.
-- A broad SELECT policy would only let any client list *every* file in the bucket,
-- which Supabase itself flags as an unnecessary exposure — skip it.
drop policy if exists "Public read access on media" on storage.objects;

-- Only authenticated users (i.e. you, logged in) can upload/replace/delete
drop policy if exists "Authenticated users can upload media" on storage.objects;
create policy "Authenticated users can upload media"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Authenticated users can update media" on storage.objects;
create policy "Authenticated users can update media"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Authenticated users can delete media" on storage.objects;
create policy "Authenticated users can delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

-- ============================================================
-- 2. TOUR DATES
-- ============================================================
create table if not exists public.tour_dates (
  id uuid primary key default gen_random_uuid(),
  event_date date not null,
  city text not null,
  venue text not null,
  tag_label text not null,
  tag_variant text not null check (tag_variant in ('coral', 'default', 'muted', 'aqua')),
  action_label text not null,
  action_href text not null,
  action_variant text not null check (action_variant in ('btn', 'link')),
  sold_out boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (event_date, city)
);

alter table public.tour_dates enable row level security;

drop policy if exists "Public read access on tour_dates" on public.tour_dates;
create policy "Public read access on tour_dates"
  on public.tour_dates for select
  using (true);

-- ============================================================
-- 3. WOMEN (lineage gallery)
-- ============================================================
create table if not exists public.women (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  role text not null,
  image_url text,
  is_large boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.women enable row level security;

drop policy if exists "Public read access on women" on public.women;
create policy "Public read access on women"
  on public.women for select
  using (true);

-- ============================================================
-- 4. PRODUCTS (shop)
-- ============================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null unique,
  price numeric(10, 2) not null,
  image_url text,
  stock int not null default 100,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Public read access on products" on public.products;
create policy "Public read access on products"
  on public.products for select
  using (true);

-- ============================================================
-- 5. ORDERS + ORDER ITEMS (filled by the checkout simulation later)
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  total numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Users can read their own orders" on public.orders;
create policy "Users can read their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own orders" on public.orders;
create policy "Users can create their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price numeric(10, 2) not null,
  quantity int not null default 1
);

alter table public.order_items enable row level security;

drop policy if exists "Users can read items of their own orders" on public.order_items;
create policy "Users can read items of their own orders"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

drop policy if exists "Users can create items on their own orders" on public.order_items;
create policy "Users can create items on their own orders"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ============================================================
-- 6. NEWSLETTER SUBSCRIBERS
-- ============================================================
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Anyone (even logged out) can subscribe, but nobody can read the list back from the client
drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

-- ============================================================
-- 7. SEED DATA — migrated from the hardcoded arrays in the frontend
-- ============================================================

insert into public.tour_dates (event_date, city, venue, tag_label, tag_variant, action_label, action_href, action_variant, sold_out, sort_order)
values
  ('2026-06-05', 'New York, NY', 'Brooklyn Steel · Opening Night', 'Few Left', 'coral', 'Tickets ›', '#', 'btn', false, 1),
  ('2026-06-12', 'Boston, MA', 'Royale', 'On Sale', 'default', 'Tickets ›', '#', 'btn', false, 2),
  ('2026-06-19', 'Philadelphia, PA', 'The Fillmore', 'On Sale', 'default', 'Tickets ›', '#', 'btn', false, 3),
  ('2026-07-03', 'Washington, DC', 'The Anthem', 'Sold Out', 'muted', 'Join waitlist', '#', 'link', true, 4),
  ('2026-07-24', 'Nashville, TN', 'Ryman Auditorium · Historic Stage', 'Few Left', 'coral', 'Tickets ›', '#', 'btn', false, 5),
  ('2026-08-21', 'Los Angeles, CA', 'The Wiltern', 'Pre-Sale · Members', 'aqua', 'Sign in to access', '/account', 'link', false, 6)
on conflict (event_date, city) do nothing;

insert into public.women (name, role, is_large, sort_order)
values
  ('Whitney', 'Vocalist · 90s', true, 1),
  ('Aaliyah', 'R&B · 90s', false, 2),
  ('Lauryn', 'Hip-Hop · 90s', false, 3),
  ('Mariah', 'Pop · 90s', false, 4),
  ('Janet', 'Pop · 90s', false, 5),
  ('Sade', 'Soul · legend', true, 6),
  ('Toni', 'R&B · 90s', false, 7),
  ('Tina', 'Rock · legend', false, 8),
  ('Selena', 'Latin · 90s', false, 9)
on conflict (name) do nothing;

insert into public.products (category, name, price, sort_order)
values
  ('Ticket', 'Opening Night · NYC', 95.00, 1),
  ('Apparel', 'Tour Tee · Aqua', 38.00, 2),
  ('Apparel', 'Hoodie · Black', 72.00, 3),
  ('Music', 'Vinyl · Live in NYC', 28.00, 4)
on conflict (name) do nothing;
