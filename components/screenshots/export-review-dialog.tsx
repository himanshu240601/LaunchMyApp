"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemedDialog } from "@/components/ui/themed-dialog";
import { fetchCurrentUserProfile, type UserProfile } from "@/lib/supabase/profile";
import { submitReview } from "@/lib/supabase/reviews";

type ExportReviewDialogProps = {
  open: boolean;
  onClose: () => void;
  exportName: string;
  initialProfile?: UserProfile | null;
  onGoHome?: () => void;
};

const INITIAL_REVIEW_STATE = {
  rating: 5,
  message: "",
};

export function ExportReviewDialog({
  open,
  onClose,
  exportName,
  initialProfile = null,
  onGoHome,
}: ExportReviewDialogProps) {
  const [rating, setRating] = useState(INITIAL_REVIEW_STATE.rating);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [message, setMessage] = useState(INITIAL_REVIEW_STATE.message);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const visibleRating = hoveredRating ?? rating;

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!open || submitted) {
        return;
      }

      if (initialProfile) {
        setProfile(initialProfile);
        setSubmitError(
          initialProfile ? null : "Complete your profile before leaving a review.",
        );
        return;
      }

      setIsLoadingProfile(true);

      try {
        const nextProfile = await fetchCurrentUserProfile();
        if (!cancelled) {
          setProfile(nextProfile);
          setSubmitError(
            nextProfile ? null : "Complete your profile before leaving a review.",
          );
        }
      } catch {
        if (!cancelled) {
          setSubmitError("Unable to load your profile right now.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProfile(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [initialProfile, open, submitted]);

  const canSubmit = message.trim().length > 0 && !!profile && !isLoadingProfile;
  const showSimpleSuccessState = Boolean(profile?.has_submitted_review) && !submitted;
  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await submitReview({
        exportName,
        message: message.trim(),
        rating,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to save your review right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedDialog
      open={open}
      onClose={onClose}
      size="lg"
      showCloseButton={submitted || showSimpleSuccessState}
      closeButtonPosition="right"
      title={submitted ? "Thanks for the review" : "Export complete"}
      description={
        submitted
          ? "Your feedback helps us shape the next polishing pass for LaunchMyApp."
          : showSimpleSuccessState
            ? `Your screenshots were exported successfully${exportName ? ` for ${exportName}` : ""}.`
            : `Your screenshots were exported successfully${exportName ? ` for ${exportName}` : ""}. If you have a minute, share a quick review.`
      }
      footer={
        submitted || showSimpleSuccessState ? (
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full border border-border bg-white text-foreground shadow-none ring-0 hover:bg-white"
              onClick={onGoHome ?? onClose}
            >
              Home
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={onClose}
            >
              Okay
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full border border-border bg-white text-foreground shadow-none ring-0 hover:bg-white"
              onClick={onClose}
            >
              Maybe later
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={() => {
                void handleSubmit();
              }}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Submit review"}
            </Button>
          </div>
        )
      }
    >
      {submitted || showSimpleSuccessState ? (
        <div className="py-1" />
      ) : (
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,247,241,0.9))] p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Rate your experience</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your feedback helps improve the app.
              </p>
            </div>
            <div
              className="mt-4 flex items-center justify-center gap-2 p-1"
              onMouseLeave={() => setHoveredRating(null)}
            >
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                const active = value <= visibleRating;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onFocus={() => setHoveredRating(value)}
                    onBlur={() => setHoveredRating(null)}
                    className={[
                      "inline-flex h-12 w-12 items-center justify-center transition-all duration-200",
                      active
                        ? "text-[#f4c542] drop-shadow-[0_6px_14px_rgba(244,197,66,0.28)]"
                        : "text-[#d8cfc2] hover:text-[#f4c542]",
                    ].join(" ")}
                    aria-label={`Rate ${value} out of 5`}
                    aria-pressed={active}
                  >
                    <Star className={active ? "h-7 w-7 fill-current" : "h-7 w-7"} />
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between px-1 text-xs font-medium text-muted-foreground/90">
              <span>Not great</span>
              <span>Loved it</span>
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Your review</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-32 w-full rounded-[1.4rem] border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              placeholder="What felt smooth, what helped, or what should get better next."
            />
          </label>
          {submitError ? (
            <p className="text-sm leading-6 text-primary">{submitError}</p>
          ) : null}
        </div>
      )}
    </ThemedDialog>
  );
}
