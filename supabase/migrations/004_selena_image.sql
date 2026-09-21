-- TWHMU — assign the remaining uploaded image to Selena
update public.women
set image_url = 'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/9.jpeg'
where name = 'Selena';
