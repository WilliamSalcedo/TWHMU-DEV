-- TWHMU — site_content table
-- Run this once in the Supabase SQL Editor, after schema.sql.
-- Generic key/value store for loose images or text that don't need a full table
-- (e.g. the Story section's cast photo). Add more rows as new needs come up —
-- no migration required to add a new key.

create table if not exists public.site_content (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public read access on site_content" on public.site_content;
create policy "Public read access on site_content"
  on public.site_content for select
  using (true);

drop policy if exists "Authenticated users can upsert site_content" on public.site_content;
create policy "Authenticated users can upsert site_content"
  on public.site_content for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can update site_content" on public.site_content;
create policy "Authenticated users can update site_content"
  on public.site_content for update
  using (auth.role() = 'authenticated');

-- Seed the key used by Story.tsx — value starts empty, fill it in from the
-- Table Editor once you've uploaded the photo to the "media" bucket.
insert into public.site_content (key, value)
values ('story_photo_url', null)
on conflict (key) do nothing;
