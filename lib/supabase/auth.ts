"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type GoogleAuthIntent = "signin" | "signup";

export async function startGoogleAuth(intent: GoogleAuthIntent) {
  const supabase = getSupabaseBrowserClient();
  const redirectUrl = new URL("/auth/callback", window.location.origin);

  redirectUrl.searchParams.set("next", "/create");
  redirectUrl.searchParams.set("intent", intent);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl.toString(),
      queryParams:
        intent === "signup"
          ? {
              prompt: "consent",
              access_type: "offline",
            }
          : {
              prompt: "select_account",
            },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOutSupabase() {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
