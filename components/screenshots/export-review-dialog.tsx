"use client";

import { useState } from "react";
import { CheckCircle2, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemedDialog } from "@/components/ui/themed-dialog";

const REVIEW_STORAGE_KEY = "launchmyapp.export-reviews";

type ExportReviewDialogProps = {
  open: boolean;
  onClose: () => void;
  exportName: string;
};

const INITIAL_REVIEW_STATE = {
  rating: 5,
  name: "",
  role: "",
  message: "",
};

export function ExportReviewDialog({
  open,
  onClose,
  exportName,
}: ExportReviewDialogProps) {
  const [rating, setRating] = useState(INITIAL_REVIEW_STATE.rating);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [name, setName] = useState(INITIAL_REVIEW_STATE.name);
  const [role, setRole] = useState(INITIAL_REVIEW_STATE.role);
  const [message, setMessage] = useState(INITIAL_REVIEW_STATE.message);
  const [submitted, setSubmitted] = useState(false);
  const visibleRating = hoveredRating ?? rating;

  const canSubmit = name.trim().length > 0 && role.trim().length > 0 && message.trim().length > 0;
  const handleSubmit = () => {
    if (!canSubmit || typeof window === "undefined") {
      return;
    }

    const existingReviews = window.localStorage.getItem(REVIEW_STORAGE_KEY);
    const parsedReviews = existingReviews ? (JSON.parse(existingReviews) as unknown[]) : [];

    window.localStorage.setItem(
      REVIEW_STORAGE_KEY,
      JSON.stringify([
        ...parsedReviews,
        {
          rating,
          name: name.trim(),
          role: role.trim(),
          message: message.trim(),
          exportName,
          createdAt: Date.now(),
        },
      ]),
    );

    setSubmitted(true);
  };

  return (
    <ThemedDialog
      open={open}
      onClose={onClose}
      size="lg"
      title={submitted ? "Thanks for the review" : "Export complete"}
      description={
        submitted
          ? "Your feedback helps us shape the next polishing pass for LaunchMyApp."
          : `Your screenshots were exported successfully${exportName ? ` for ${exportName}` : ""}. If you have a minute, share a quick review while everything is fresh.`
      }
      footer={
        submitted ? (
          <div className="flex justify-end">
            <Button type="button" className="rounded-full" onClick={onClose}>
              Close
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
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              Submit review
            </Button>
          </div>
        )
      }
    >
      {submitted ? (
        <div className="rounded-[1.5rem] border border-border/80 bg-white/75 p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-semibold text-foreground">
                Review captured
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your note was saved on this device, so we can keep the experience smooth now and wire in a real reviews destination later.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,247,241,0.9))] p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Rate your export experience</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your feedback helps us make screenshot creation feel even smoother.
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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Your name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                placeholder="Alex Morgan"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">What do you do?</span>
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                placeholder="Indie app founder"
              />
            </label>
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
        </div>
      )}
    </ThemedDialog>
  );
}
