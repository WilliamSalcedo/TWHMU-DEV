import { supabase } from "../supabaseClient";

type SubscribeResult = { success: true } | { success: false; error: string };

export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim() });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "This email is already subscribed." };
    }
    console.error("Error subscribing to newsletter:", error.message);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
