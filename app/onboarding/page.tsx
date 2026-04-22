"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fetchCurrentUserProfile, upsertCurrentUserProfile } from "@/lib/supabase/profile";
import { useSupabaseSession } from "@/lib/supabase/use-supabase-session";

const ROLE_OPTIONS = [
  "Founder",
  "Indie Developer",
  "Product Manager",
  "Designer",
  "Agency",
  "Other",
] as const;

function OnboardingFallback() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,167,111,0.12),transparent_28%),linear-gradient(180deg,#fffdf9,#f6efe5)] px-6 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl rounded-[2.2rem] border border-white/80 bg-white/90 p-8 shadow-soft sm:p-10">
        <p className="text-sm font-medium text-muted-foreground">Welcome</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Tell us a little about you
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
          Before you start creating screenshots, add your name and choose what you do.
          This will help to personalize your experience.
        </p>
      </div>
    </main>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useSupabaseSession();
  const [name, setName] = useState("");
  const [roleOption, setRoleOption] = useState<(typeof ROLE_OPTIONS)[number] | "">("");
  const [customRole, setCustomRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkProfile() {
      if (isLoading || !isAuthenticated) {
        return;
      }

      try {
        const profile = await fetchCurrentUserProfile();
        if (!cancelled && profile) {
          router.replace(searchParams.get("next") || "/create/edit");
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load your account details right now.");
        }
      }
    }

    void checkProfile();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, router, searchParams]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const resolvedRole =
    roleOption === "Other" ? customRole.trim() : roleOption;
  const canContinue = name.trim().length > 0 && resolvedRole.trim().length > 0;

  const handleContinue = async () => {
    if (!canContinue) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await upsertCurrentUserProfile({
        fullName: name.trim(),
        role: resolvedRole.trim(),
        roleOption: roleOption || "Other",
      });
      router.replace(searchParams.get("next") || "/create/edit");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save your details right now.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,167,111,0.12),transparent_28%),linear-gradient(180deg,#fffdf9,#f6efe5)] px-6 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl rounded-[2.2rem] border border-white/80 bg-white/90 p-8 shadow-soft sm:p-10">
        <p className="text-sm font-medium text-muted-foreground">Welcome</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Tell us a little about you
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
          Before you start creating screenshots, add your name and choose what you do.
          This will help to personalize your experience.
        </p>

        <div className="mt-10 space-y-6">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Your name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              placeholder="Your full name"
            />
          </label>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">What do you do?</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ROLE_OPTIONS.map((option) => {
                const isSelected = roleOption === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRoleOption(option)}
                    className={[
                      "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                      isSelected
                        ? "border-primary/30 bg-orange-50/80 text-foreground"
                        : "border-border bg-white text-muted-foreground hover:border-primary/20 hover:text-foreground",
                    ].join(" ")}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {roleOption === "Other" ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Other *</span>
              <input
                value={customRole}
                onChange={(event) => setCustomRole(event.target.value)}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                placeholder="Your role"
              />
            </label>
          ) : null}

          {error ? (
            <p className="text-sm leading-6 text-primary">{error}</p>
          ) : null}

          <Button
            type="button"
            className="rounded-full gap-2"
            disabled={!canContinue || isSubmitting || isLoading}
            onClick={() => {
              void handleContinue();
            }}
          >
            {isSubmitting ? "Saving..." : (
              <>
                <ArrowRight className="h-4 w-4" />
                Continue
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingFallback />}>
      <OnboardingContent />
    </Suspense>
  );
}
