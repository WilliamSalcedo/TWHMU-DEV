-- TWHMU — wire up the first batch of uploaded images
-- Run this once in the Supabase SQL Editor, after schema.sql and 002_site_content.sql.

update public.women set image_url = 'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/1.jpeg' where name = 'Whitney';
update public.women set image_url = 'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/2.jpeg' where name = 'Aaliyah';
update public.women set image_url = 'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/3.jpeg' where name = 'Lauryn';
update public.women set image_url = 'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/4.jpeg' where name = 'Mariah';
update public.women set image_url = 'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/5.jpeg' where name = 'Janet';
update public.women set image_url = 'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/6.jpeg' where name = 'Sade';
update public.women set image_url = 'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/7.jpeg' where name = 'Toni';
update public.women set image_url = 'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/8.jpeg' where name = 'Tina';
-- Selena has no photo yet (9.jpeg is unused for now) — falls back to Placeholder until you assign one.

update public.site_content set value = 'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/10.jpeg' where key = 'story_photo_url';
