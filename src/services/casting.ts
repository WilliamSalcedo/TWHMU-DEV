import { supabase } from "../supabaseClient";
import type { CastingApplicationRow } from "../types/database";

export type NewCastingApplication = {
  full_name: string;
  email: string;
  phone: string;
  role_interest: string;
  experience: string;
  portfolio_url: string | null;
  message: string | null;
};

type SubmitResult = { success: true } | { success: false; error: string };

export async function submitCastingApplication(userId: string, application: NewCastingApplication): Promise<SubmitResult> {
  const { error } = await supabase.from("casting_applications").insert({ user_id: userId, ...application });

  if (error) {
    console.error("Error submitting casting application:", error.message);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}

export async function getMyCastingApplications(): Promise<CastingApplicationRow[]> {
  const { data, error } = await supabase
    .from("casting_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching casting applications:", error.message);
    return [];
  }

  return data ?? [];
}
