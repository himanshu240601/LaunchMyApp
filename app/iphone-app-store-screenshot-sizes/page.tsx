import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";

const sizeSections = [
  {
    title: "1. Start from the device size you plan to publish",
    points: [
      'App Store screenshots are uploaded against Apple device classes, so the most practical workflow is to design for the iPhone size you actually want to export.',
      'In LaunchMyApp, that usually means choosing the export resolution you want first, then writing your title and subtitle against that final canvas rather than treating sizing as an afterthought.',
    ],
  },
  {
    title: "2. Keep copy short enough for two clean lines",
    points: [
      "App Store screenshot layouts work best when the headline is readable at a glance. Aim for a short title and one concise supporting subtitle rather than dense marketing copy.",
      "If the message starts wrapping too far, tighten the text before you rely on smaller type. Cleaner copy usually performs better than compressed layout fixes.",
    ],
  },
  {
    title: "3. Preview with the same frame and spacing you will export",
    points: [
      "Spacing, mockup scale, and title balance can look fine in an editor but feel cramped once the screenshots are viewed as a storefront set. Always preview the final order together.",
      "The safest approach is to check how all screens read as a sequence, not just whether each one looks good on its own.",
    ],
  },
  {
    title: "4. Build one consistent screenshot system",
    points: [
      "Your colors, text positioning, and device treatment should feel like one series across every screenshot. Consistency is especially important when users scroll the full listing horizontally.",
      "A reusable system makes it easier to export multiple screens quickly and keeps your App Store presence looking more polished.",
    ],
  },
];

const sizingNotes = [
  'Choose the export device that matches your intended iPhone presentation, such as 6.7" or 6.5", before you finalize spacing.',
  "Use the same title/subtitle hierarchy across the full set so no screenshot feels visually heavier than the others.",
  "Review screenshots at sequence level to make sure the first three images communicate your app value quickly.",
];

export const metadata: Metadata = {
  title: "iPhone App Store Screenshot Sizes",
  description:
    "Learn how to think about iPhone App Store screenshot sizes, spacing, copy fit, and export-ready layouts before publishing your listing.",
  alternates: {
    canonical: "/iphone-app-store-screenshot-sizes",
  },
};

export default function IPhoneAppStoreScreenshotSizesPage() {
  return (
    <main>
      <Navbar />
      <section className="py-20 sm:py-28">
        <div className="container">
          <div className="mx-auto max-w-5xl space-y-6">
            <section className="rounded-[2.5rem] border border-white/70 bg-white/82 p-8 shadow-soft backdrop-blur sm:p-10 lg:p-12">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                iPhone App Store Screenshot Sizes
              </h1>
              <p className="mt-4 max-w-4xl text-base leading-8 text-muted-foreground">
                The best screenshot size workflow is not just about raw dimensions. It is
                about choosing the right iPhone export target, keeping your message readable,
                and designing screenshots that still feel balanced once they appear together in
                an App Store listing.
              </p>
              <p className="mt-4 max-w-4xl text-base leading-8 text-muted-foreground">
                If you are creating screenshots inside LaunchMyApp, pick your export
                resolution early, then fine-tune title spacing, subtitle length, mockup
                placement, and layout using that final output size as your source of truth.
              </p>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
              <div className="rounded-[2.5rem] border border-white/70 bg-white/82 p-8 shadow-soft backdrop-blur sm:p-10">
                <div className="space-y-10">
                  {sizeSections.map((section) => (
                    <section key={section.title}>
                      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        {section.title}
                      </h2>
                      <div className="mt-4 space-y-4 text-base leading-8 text-muted-foreground">
                        {section.points.map((point) => (
                          <p key={point}>{point}</p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>

              <aside className="rounded-[2.5rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(251,245,239,0.94))] p-8 shadow-soft backdrop-blur sm:p-10">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Quick sizing notes
                </h2>
                <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
                  {sizingNotes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
                <div className="mt-8 rounded-[1.75rem] border border-primary/15 bg-primary/5 p-6">
                  <p className="text-sm font-semibold tracking-[0.08em] text-primary">
                    Next step
                  </p>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">
                    Want the workflow behind those exports too? Read{" "}
                    <Link
                      href="/how-to-make-app-store-screenshots"
                      className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
                    >
                      how to make App Store screenshots
                    </Link>
                    .
                  </p>
                </div>
              </aside>
            </section>

            <section className="rounded-[2.5rem] border border-white/70 bg-white/82 p-8 shadow-soft backdrop-blur sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Create export-ready screenshots faster
                </h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  LaunchMyApp helps you turn raw iPhone screenshots into polished App Store
                  layouts with title controls, preview tooling, device export settings, and
                  storefront-style review before export.
                </p>
              </div>
              <Link
                href="/create"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_18px_40px_-22px_rgba(255,107,44,0.75)] transition-transform hover:-translate-y-0.5 lg:mt-0"
              >
                Start creating
              </Link>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
