"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

import { heroStats } from "@/data/landing-content";
import { startGoogleAuth } from "@/lib/supabase/auth";
import { useSupabaseSession } from "@/lib/supabase/use-supabase-session";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const { isAuthenticated } = useSupabaseSession();
  const [isStartingSignup, setIsStartingSignup] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleStartFree = async () => {
    setAuthError(null);
    setIsStartingSignup(true);

    try {
      await startGoogleAuth("signup");
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to start sign up right now.",
      );
      setIsStartingSignup(false);
    }
  };

  return (
    <section className="section-shell relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden pb-16 pt-16 sm:pb-20 sm:pt-20">
      <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-hero-grid bg-[size:52px_52px] opacity-70 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      <div className="absolute left-[12%] top-8 -z-10 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute right-[10%] top-24 -z-10 h-56 w-56 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
            className="font-display mx-auto max-w-[8ch] text-balance text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl lg:text-[4.5rem]"
          >
            Better Screenshots. Faster.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease }}
            className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-muted-foreground sm:text-xl"
          >
            Create polished App Store screens from raw app screens in just a few clicks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease }}
            className="mt-10 flex flex-col items-center justify-center gap-4"
          >
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <Link href="/create" className={buttonVariants({ size: "lg", className: "gap-2 px-7" })}>
                  Start Creating
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  className="gap-2 px-7"
                  onClick={() => {
                    void handleStartFree();
                  }}
                  disabled={isStartingSignup}
                >
                  {isStartingSignup ? "Starting..." : "Start Creating for Free"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              <Link
                href="#how-it-works"
                className={buttonVariants({ variant: "secondary", size: "lg", className: "gap-2 px-7" })}
              >
                <Play className="h-4 w-4" />
                See How It Works
              </Link>
            </div>
            {authError ? (
              <p className="max-w-md text-center text-xs leading-5 text-primary">
                {authError}
              </p>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease }}
            className="mt-14 grid gap-4 sm:grid-cols-3"
          >
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/70 bg-white/80 p-6 text-center shadow-soft backdrop-blur"
              >
                <p className="text-2xl font-semibold tracking-tight text-foreground">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
