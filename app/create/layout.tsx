"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Laptop, LoaderCircle } from "lucide-react";

import { CreateFlowProvider } from "@/app/create/create-flow-context";
import { fetchCurrentUserProfile } from "@/lib/supabase/profile";
import { useSupabaseSession } from "@/lib/supabase/use-supabase-session";

function CreateShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,167,111,0.16),transparent_30%),linear-gradient(180deg,#fffdf9,#f6efe5)] px-5 py-8 lg:hidden">
        <div className="w-full max-w-md rounded-[2.25rem] border border-white/80 bg-white/92 p-6 shadow-soft backdrop-blur sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-26px_rgba(82,38,10,0.35)]">
              <Image
                src="/brand-icon-2026.png"
                alt="LaunchMyApp"
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">LaunchMyApp</p>
              <p className="text-xs text-muted-foreground">Screenshot creation works best on desktop</p>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-primary/10 bg-[linear-gradient(180deg,rgba(255,247,242,0.96),rgba(255,255,255,0.98))] p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Laptop className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              Open on desktop
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Your current device is not supported for generating screenshots. Open the
              website on a desktop or laptop to continue.
            </p>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-border/70 bg-background/80 p-5">
            <p className="text-sm font-medium text-foreground">Best experience on larger screens</p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <p>Preview editing, screenshot layout controls, and export tools are optimized for desktop.</p>
              <p>You can still browse the rest of the website normally on mobile.</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_18px_40px_-22px_rgba(255,107,44,0.72)] transition-transform hover:-translate-y-0.5"
            >
              Back to home
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden h-full w-full px-2 py-2 sm:px-3 sm:py-3 lg:block">{children}</div>
    </main>
  );
}

function CreateAccessGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSupabaseSession();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkProfile() {
      if (isLoading) {
        return;
      }

      if (!isAuthenticated) {
        if (!cancelled) {
          setIsCheckingProfile(false);
        }
        return;
      }

      try {
        const profile = await fetchCurrentUserProfile();

        if (!cancelled) {
          if (!profile) {
            router.replace(`/onboarding?next=${encodeURIComponent(pathname || "/create/edit")}`);
            return;
          }

          setIsCheckingProfile(false);
        }
      } catch {
        if (!cancelled) {
          router.replace(`/onboarding?next=${encodeURIComponent(pathname || "/create/edit")}`);
        }
      }
    }

    void checkProfile();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading || isCheckingProfile) {
    return (
      <main className="flex h-screen items-center justify-center bg-background px-6">
        <div className="flex items-center gap-3 rounded-full border border-white/70 bg-white/90 px-5 py-3 text-sm text-muted-foreground shadow-soft">
          <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
          Preparing your workspace...
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

export default function CreateLayout({ children }: { children: ReactNode }) {
  return (
    <CreateFlowProvider>
      <CreateAccessGuard>
        <CreateShell>{children}</CreateShell>
      </CreateAccessGuard>
    </CreateFlowProvider>
  );
}
