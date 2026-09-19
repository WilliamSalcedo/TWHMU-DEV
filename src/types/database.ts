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
