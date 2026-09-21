import { supabase } from "../supabaseClient";

type RequestCityResult = { success: true } | { success: false; error: string };

export async function requestCity(city: string, email?: string | null): Promise<RequestCityResult> {
  const { error } = await supabase.from("city_requests").insert({ city: city.trim(), email: email ?? null });

  if (error) {
    console.error("Error requesting city:", error.message);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
