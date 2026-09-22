export type TourDateRow = {
  id: string;
  event_date: string;
  city: string;
  venue: string;
  venue_address: string | null;
  event_time: string | null;
  price: number;
  capacity: number;
  tickets_sold: number;
  headliner: string | null;
  description: string | null;
  age_restriction: string;
  tag_label: string;
  tag_variant: "coral" | "default" | "muted" | "aqua";
  action_label: string;
  action_href: string;
  action_variant: "btn" | "link";
  sold_out: boolean;
  sort_order: number;
};

export type WomanRow = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  is_large: boolean;
  sort_order: number;
};

export type ProductRow = {
  id: string;
  category: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  description: string | null;
  image_url: string | null;
  stock: number;
  sort_order: number;
};

export type SiteContentRow = {
  key: string;
  value: string | null;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  item_type: "product" | "ticket";
  product_id: string | null;
  tour_date_id: string | null;
  item_name: string;
  unit_price: number;
  quantity: number;
};

export type AddressRow = {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
};

export type CastingApplicationRow = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  role_interest: string;
  experience: string;
  portfolio_url: string | null;
  message: string | null;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  created_at: string;
};

export type OrderRow = {
  id: string;
  user_id: string;
  status: "pending" | "confirmed" | "cancelled";
  total: number;
  created_at: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_region: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  payment_method: "card" | "cash" | "other" | null;
  order_items: OrderItemRow[];
};
