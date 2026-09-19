import { supabase } from "../supabaseClient";

export async function getSiteContentValue(key: string): Promise<string | null> {
  const { data, error } = await supabase.from("site_content").select("value").eq("key", key).maybeSingle();

  if (error) {
    console.error(`Error fetching site_content "${key}":`, error.message);
    return null;
  }

  return data?.value ?? null;
}
