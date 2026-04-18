"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { CreateFlowProvider } from "@/app/create/create-flow-context";

const FLOW_STEPS = [
  {
    href: "/create/upload",
    label: "Upload",
    description: "Add your raw screenshots",
  },
  {
    href: "/create/edit",
    label: "Screen Titles",
    description: "Write title and subtitle",
  },
  {
    href: "/create/studio",
    label: "Preview & Export",
    description: "Tune layout, device, and style",
  },
] as const;

function CreateShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentStep = FLOW_STEPS.findIndex((step) => step.href === pathname);
  const isPreviewPage = pathname === "/create/studio" || pathname === "/create/preview";
  const isEditPage = pathname === "/create/edit";
  const backHref = isEditPage ? "/create/upload" : "/";
  const backLabel = isEditPage ? "Back to upload" : "Back to landing page";

  if (isPreviewPage) {
    return (
      <main className="h-screen overflow-hidden bg-background">
        <div className="mx-auto h-full w-full max-w-[1600px] px-2 py-2 sm:px-3 sm:py-3">
          {children}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8 sm:py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
            <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Create Screenshots
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
              Move through the flow in order: upload, refine your copy, then finish in a focused preview editor.
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-3 rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-soft sm:grid-cols-3 sm:p-5">
          {FLOW_STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isDone = currentStep > index;

            return (
              <div
                key={step.href}
                className={[
                  "rounded-[1.5rem] border px-4 py-4 text-left transition-colors",
                  isActive
                    ? "border-primary/30 bg-orange-50/80"
                    : "border-border bg-background/70",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                      isActive || isDone
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground",
                    ].join(" ")}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{step.label}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {children}
      </div>
    </main>
  );
}

export default function CreateLayout({ children }: { children: ReactNode }) {
  return (
    <CreateFlowProvider>
      <CreateShell>{children}</CreateShell>
    </CreateFlowProvider>
  );
}
