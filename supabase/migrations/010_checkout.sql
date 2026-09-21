-- TWHMU — checkout: shipping/contact info + payment method on orders,
-- support for ticket line items (not just products) on order_items.

alter table public.orders
  add column if not exists customer_name text,
  add column if not exists customer_email text,
  add column if not exists customer_phone text,
  add column if not exists shipping_address text,
  add column if not exists shipping_city text,
  add column if not exists shipping_region text,
  add column if not exists shipping_postal_code text,
  add column if not exists shipping_country text,
  add column if not exists payment_method text check (payment_method in ('card', 'cash', 'other'));

alter table public.order_items
  add column if not exists item_type text not null default 'product' check (item_type in ('product', 'ticket')),
  add column if not exists tour_date_id uuid references public.tour_dates(id) on delete set null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'order_items' and column_name = 'product_name'
  ) then
    alter table public.order_items rename column product_name to item_name;
  end if;
end $$;
