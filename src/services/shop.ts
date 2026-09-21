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

export async function getProductById(id: string): Promise<ProductRow | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("Error fetching product:", error.message);
    return null;
  }

  return data;
}
