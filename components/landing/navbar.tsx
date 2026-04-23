"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { navItems } from "@/data/landing-content";
import { signOutSupabase, startGoogleAuth } from "@/lib/supabase/auth";
import { useSupabaseSession } from "@/lib/supabase/use-supabase-session";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { ThemedDialog } from "@/components/ui/themed-dialog";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useSupabaseSession();
  const [isLoadingIntent, setIsLoadingIntent] = useState<"signin" | "signup" | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleAuthClick = async (intent: "signin" | "signup") => {
    setAuthError(null);
    setIsLoadingIntent(intent);

    try {
      await startGoogleAuth(intent);
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to start Google authentication.",
      );
      setIsLoadingIntent(null);
    }
  };

  const handleLogout = async () => {
    setAuthError(null);
    setIsLoadingIntent("signin");

    try {
      await signOutSupabase();
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to log out right now.",
      );
    } finally {
      setIsLoadingIntent(null);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-background/80 backdrop-blur-xl">
      <ThemedDialog
        open={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        title="Log out of LaunchMyApp?"
        description="You’ll be signed out on this browser. You can sign back in whenever you need."
        footer={(
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full border border-border bg-white text-foreground shadow-none ring-0 hover:bg-white"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={() => {
                setShowLogoutDialog(false);
                void handleLogout();
              }}
            >
              Log out
            </Button>
          </div>
        )}
      />
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden">
            <Image
              src="/brand-icon-2026.png"
              alt="LaunchMyApp logo"
              width={44}
              height={44}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">LaunchMyApp</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              App Store Screenshot Generator
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={
                item.href.startsWith("#") && pathname !== "/"
                  ? `/${item.href}`
                  : item.href
              }
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="rounded-full"
                  onClick={() => {
                    setShowLogoutDialog(true);
                  }}
                  disabled={isLoadingIntent !== null}
                >
                  {isLoadingIntent === "signin" ? "Logging out..." : "Logout"}
                </Button>
                <div className="hidden sm:block">
                  <Link href="/create" className={buttonVariants({ size: "lg", className: "gap-2" })}>
                    Create
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="rounded-full"
                  onClick={() => {
                    void handleAuthClick("signin");
                  }}
                  disabled={isLoadingIntent !== null}
                >
                  {isLoadingIntent === "signin" ? "Signing in..." : "Sign in"}
                </Button>
                <div className="hidden sm:block">
                  <button
                    type="button"
                    className={buttonVariants({ size: "lg", className: "gap-2" })}
                    onClick={() => {
                      void handleAuthClick("signup");
                    }}
                    disabled={isLoadingIntent !== null}
                  >
                    {isLoadingIntent === "signup" ? "Starting..." : "Try it for Free"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
          {authError ? (
            <p className="max-w-xs text-right text-xs leading-5 text-primary">
              {authError}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
