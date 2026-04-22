import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://launch-my-ras49d059-him83601-6794s-projects.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LaunchMyApp | App Store Screenshot Generator",
    template: "%s | LaunchMyApp",
  },
  description:
    "LaunchMyApp helps developers turn raw iPhone app screenshots into polished App Store screenshot sets without needing design skills.",
  applicationName: "LaunchMyApp",
  keywords: [
    "app store screenshot generator",
    "app store screenshot creator",
    "iphone screenshot generator",
    "app store screenshot tool",
    "app screenshot maker",
    "ios app store screenshots",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "LaunchMyApp",
    title: "LaunchMyApp | App Store Screenshot Generator",
    description:
      "Create polished iPhone App Store screenshots with titles, subtitles, preview tooling, and export-ready layouts.",
    images: [
      {
        url: "/brand-icon-2026.png",
        width: 512,
        height: 512,
        alt: "LaunchMyApp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchMyApp | App Store Screenshot Generator",
    description:
      "Create polished iPhone App Store screenshots with titles, subtitles, preview tooling, and export-ready layouts.",
    images: ["/brand-icon-2026.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
