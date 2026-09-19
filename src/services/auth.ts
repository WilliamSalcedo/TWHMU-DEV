import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

type AuthResult =
  | { success: true; user: User | null; session?: Session | null }
  | { success: false; error: string };

export async function registerUser(name: string, email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { name: name.trim() },
    },
  });

  if (error) {
    console.error("Registration error:", error.message);
    return { success: false, error: error.message };
  }

  // Supabase returns an "empty" user (no identities) instead of an error
  // when the email already exists, to avoid leaking which emails are registered.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { success: false, error: "That email is already registered. Please sign in." };
  }

  return { success: true, user: data.user };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    console.error("Sign in error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user, session: data.session };
}
