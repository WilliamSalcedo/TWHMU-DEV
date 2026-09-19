export type TourDateRow = {
  id: string;
  event_date: string;
  city: string;
  venue: string;
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
  image_url: string | null;
  is_large: boolean;
  sort_order: number;
};

export type ProductRow = {
  id: string;
  category: string;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
  sort_order: number;
};

export type SiteContentRow = {
  key: string;
  value: string | null;
};
