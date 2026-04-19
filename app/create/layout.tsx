"use client";

import type { ReactNode } from "react";

import { CreateFlowProvider } from "@/app/create/create-flow-context";

function CreateShell({ children }: { children: ReactNode }) {
  return (
    <main className="h-screen overflow-hidden bg-background">
      <div className="h-full w-full px-2 py-2 sm:px-3 sm:py-3">
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
