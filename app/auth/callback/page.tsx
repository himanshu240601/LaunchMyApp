"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { fetchCurrentUserProfile } from "@/lib/supabase/profile";

function AuthCallbackFallback({ message = "Signing you in..." }: { message?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,167,111,0.12),transparent_28%),linear-gradient(180deg,#fffdf9,#f6efe5)] px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/90 p-8 text-center shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LoaderCircle className="h-6 w-6 animate-spin" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
          Connecting your account
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
      </div>
    </main>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    let cancelled = false;

    async function finishAuth() {
      const nextPath = searchParams.get("next") || "/create/edit";
      const intent = searchParams.get("intent");
      const code = searchParams.get("code");
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const errorDescription =
        searchParams.get("error_description") ||
        searchParams.get("error") ||
        hashParams.get("error_description") ||
        hashParams.get("error");

      if (errorDescription) {
        if (!cancelled) {
          setMessage(errorDescription);
        }
        return;
      }

      try {
        const supabase = getSupabaseBrowserClient();

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            throw error;
          }
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session && !code && !accessToken) {
          throw new Error("Unable to complete sign in. Please try again from the same browser tab.");
        }

        if (!cancelled) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          if (intent === "signup") {
            const profile = await fetchCurrentUserProfile();
            router.replace(profile ? nextPath : `/onboarding?next=${encodeURIComponent(nextPath)}`);
            return;
          }

          router.replace(nextPath);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Unable to complete sign in.");
        }
      }
    }

    void finishAuth();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return <AuthCallbackFallback message={message} />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
