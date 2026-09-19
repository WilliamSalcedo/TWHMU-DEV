import { supabase } from "../supabaseClient";
import type { WomanRow } from "../types/database";

export async function getWomen(): Promise<WomanRow[]> {
  const { data, error } = await supabase
    .from("women")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching women:", error.message);
    return [];
  }

  return data ?? [];
}
