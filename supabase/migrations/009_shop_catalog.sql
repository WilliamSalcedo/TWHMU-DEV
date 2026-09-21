

alter table public.products
  add column if not exists description text,
  add column if not exists compare_at_price numeric(10, 2);

delete from public.products;

insert into public.products (category, name, price, compare_at_price, description, image_url, sort_order) values
  ('Apparel', 'Tour Tee · Classic Black', 42.00, null,
   'Heavyweight cotton tee with the full tour graphic across the chest. Oversized fit, washed black.',
   'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/tourtee1.jpeg', 1),

  ('Apparel', 'Tour Tee · White Reissue', 38.00, 45.00,
   'A clean white reissue of the opening-night tee. Bold front print, tribute-tour staple.',
   'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/tourtee2.jpeg', 2),

  ('Apparel', 'Tour Tee Bundle · Two-Piece', 68.00, 80.00,
   'Matching front-and-back graphic tees, sold as a limited two-piece bundle.',
   'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/tourtee3.jpeg', 3),

  ('Apparel', '90s Icons Hoodie · Forest Green', 78.00, null,
   'Heavyweight hoodie honoring the icons of the ''90s, graphic front and back.',
   'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/hoodie91s.jpeg', 4),

  ('Apparel', 'Patchwork Hoodie · Multi', 85.00, 95.00,
   'All-over patchwork print, one-of-a-kind feel. Limited quantities.',
   'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/hoodie92s.jpeg', 5),

  ('Apparel', 'Hip-Hop Soul Hoodie · Black', 78.00, null,
   'A tribute to the hip-hop soul era — bold graphic hoodie in washed black.',
   'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/hoodie93s.jpeg', 6),

  ('Apparel', 'Vintage Wash Hoodie · Grey', 72.00, null,
   'Garment-dyed grey hoodie with a distressed, vintage tour finish.',
   'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/hodie902.jpeg', 7),

  ('Music', 'Picture Disc · Collector''s Edition', 45.00, null,
   'Limited picture-disc pressing with collectible artwork on both sides.',
   'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/vinyl1.jpeg', 8),

  ('Music', 'Live Sessions · Tribute Pressing', 34.00, 40.00,
   'A tribute pressing honoring the women who shaped the sound — recorded live.',
   'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/vinyl2.jpeg', 9),

  ('Music', 'Splatter Vinyl · Limited Colorway', 36.00, null,
   'Hand-numbered splatter vinyl, pressed in a limited colorway run.',
   'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/vinyl3.jpeg', 10),

  ('Music', 'Vinyl · Live in NYC', 28.00, null,
   'The tour''s official live recording from opening night in Brooklyn.',
   'https://scclrzgtairgjlhpysgw.supabase.co/storage/v1/object/public/media/vinyl4.jpeg', 11)
on conflict (name) do nothing;
