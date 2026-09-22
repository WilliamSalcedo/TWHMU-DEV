import { supabase } from "../supabaseClient";

type SubscribeResult = { success: true } | { success: false; error: string };

export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  const trimmedEmail = email.trim();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email: trimmedEmail });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "This email is already subscribed." };
    }
    console.error("Error subscribing to newsletter:", error.message);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  // Best-effort welcome email — a failure here shouldn't block the subscription itself.
  supabase.functions.invoke("send-welcome-email", { body: { email: trimmedEmail } }).catch((err) => {
    console.error("Error sending welcome email:", err);
  });

  return { success: true };
}
