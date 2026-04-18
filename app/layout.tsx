import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchMyApp | App Store Screenshot Generator",
  description:
    "LaunchMyApp helps developers turn raw app screenshots into polished App Store screenshot sets without needing design skills.",
  icons: {
    icon: "/brand-icon-2026.png",
    apple: "/apple-icon.png",
    shortcut: "/brand-icon-2026.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={
        {
          "--font-display":
            '"Avenir Next", "SF Pro Display", "Segoe UI", "Helvetica Neue", sans-serif',
          "--font-body":
            '"Avenir Next", "SF Pro Text", "Segoe UI", "Helvetica Neue", sans-serif',
        } as CSSProperties
      }
    >
      <body className="text-foreground">
        <div className="relative min-h-screen">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-primary/10 via-orange-100/40 to-transparent blur-3xl" />
          {children}
        </div>
      </body>
    </html>
  );
}
