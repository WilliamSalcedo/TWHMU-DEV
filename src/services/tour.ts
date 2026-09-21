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

export async function getTourDateById(id: string): Promise<TourDateRow | null> {
  const { data, error } = await supabase.from("tour_dates").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("Error fetching tour date:", error.message);
    return null;
  }

  return data;
}
