"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  fetchCurrentUserProfile,
  markCurrentUserHasSubmittedReview,
} from "@/lib/supabase/profile";
import type { TestimonialItem } from "@/types/landing";

export type ReviewInsert = {
  exportName?: string;
  message: string;
  rating: number;
};

type ReviewRow = {
  created_at: string;
  id: string;
  message: string;
  name: string;
  rating: number;
  role: string;
};

const REVIEWS_TABLE = "reviews";

function mapReviewRowToTestimonial(review: ReviewRow): TestimonialItem {
  return {
    id: review.id,
    name: review.name,
    quote: review.message,
    rating: review.rating,
    role: review.role,
  };
}

export async function submitReview(review: ReviewInsert) {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await fetchCurrentUserProfile();

  if (!profile) {
    throw new Error("Complete your profile before submitting a review.");
  }

  const { error } = await supabase.from(REVIEWS_TABLE).insert({
    export_name: review.exportName ?? null,
    message: review.message,
    name: profile.full_name,
    rating: review.rating,
    role: profile.role,
    show_on_landing: false,
    user_id: user?.id ?? null,
  });

  if (error) {
    throw error;
  }

  await markCurrentUserHasSubmittedReview();
}

export async function fetchLandingReviews(limit = 4) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .select("id, name, role, message, rating, created_at")
    .eq("show_on_landing", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return ((data ?? []) as ReviewRow[]).map(mapReviewRowToTestimonial);
}
