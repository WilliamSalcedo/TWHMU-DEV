import { supabase } from "../supabaseClient";
import type { TourDateRow } from "../types/database";

export async function getTourDates(): Promise<TourDateRow[]> {
  const { data, error } = await supabase
    .from("tour_dates")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching tour dates:", error.message);
    return [];
  }

  return data ?? [];
}
