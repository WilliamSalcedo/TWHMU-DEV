import { supabase } from "../supabaseClient";
import type { ProductRow } from "../types/database";

export async function getProducts(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }

  return data ?? [];
}
