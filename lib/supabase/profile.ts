"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type UserProfile = {
  full_name: string;
  has_submitted_review: boolean;
  role: string;
  role_option: string;
  user_id: string;
};

const PROFILES_TABLE = "profiles";

export async function fetchCurrentUserProfile() {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .select("user_id, full_name, role, role_option, has_submitted_review")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as UserProfile | null) ?? null;
}

export async function upsertCurrentUserProfile(input: {
  fullName: string;
  role: string;
  roleOption: string;
}) {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You need to be signed in to continue.");
  }

  const { error } = await supabase.from(PROFILES_TABLE).upsert(
    {
      full_name: input.fullName,
      role: input.role,
      role_option: input.roleOption,
      user_id: user.id,
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) {
    throw error;
  }
}

export async function markCurrentUserHasSubmittedReview() {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You need to be signed in to continue.");
  }

  const { error } = await supabase
    .from(PROFILES_TABLE)
    .update({ has_submitted_review: true })
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }
}
