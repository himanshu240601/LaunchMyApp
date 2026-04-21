"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { CreateFlowProvider } from "@/app/create/create-flow-context";
import { fetchCurrentUserProfile } from "@/lib/supabase/profile";
import { useSupabaseSession } from "@/lib/supabase/use-supabase-session";

function CreateShell({ children }: { children: ReactNode }) {
  return (
    <main className="h-screen overflow-hidden bg-background">
      <div className="h-full w-full px-2 py-2 sm:px-3 sm:py-3">
        {children}
      </div>
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
