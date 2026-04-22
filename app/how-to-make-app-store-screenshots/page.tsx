import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";

const steps = [
  {
    title: "1. Upload your real product screens first",
    body: "Start with the clearest iPhone screenshots from your actual app. Strong App Store screenshots usually begin with real in-product moments rather than decorative mockups built from scratch.",
  },
  {
    title: "2. Write one clear message per screenshot",
    body: "Treat each screen like a single idea. Use a short title and a supporting subtitle that explains the benefit quickly. If the message needs a paragraph, it is probably trying to do too much.",
  },
  {
    title: "3. Keep the full set visually consistent",
    body: "Align your text position, device treatment, scale, and color decisions across the whole sequence. App Store listings feel stronger when every screenshot clearly belongs to the same system.",
  },
  {
    title: "4. Preview the listing as a row, not as isolated images",
    body: "The first few screenshots need to work together. Review them in order so you can catch repetitive copy, awkward pacing, or layout imbalance before you export.",
  },
  {
    title: "5. Export the device resolution you actually need",
    body: 'Finalize your device export setting at the end and export the screenshot set in the iPhone resolution you plan to publish, rather than resizing manually afterward.',
  },
];

const mistakes = [
  "Trying to explain too many features in one screenshot",
  "Letting titles run too long and wrap awkwardly",
  "Using inconsistent scale or spacing across the set",
  "Writing benefits that sound generic instead of product-specific",
];

export const metadata: Metadata = {
  title: "How to Make App Store Screenshots",
  description:
    "A practical guide to making App Store screenshots with better titles, stronger layout consistency, cleaner sequencing, and export-ready iPhone assets.",
  alternates: {
    canonical: "/how-to-make-app-store-screenshots",
  },
};

export default function HowToMakeAppStoreScreenshotsPage() {
  return (
    <main>
      <Navbar />
      <section className="py-20 sm:py-28">
        <div className="container">
          <div className="mx-auto max-w-5xl space-y-6">
            <section className="rounded-[2.5rem] border border-white/70 bg-white/82 p-8 shadow-soft backdrop-blur sm:p-10 lg:p-12">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                How to Make App Store Screenshots
              </h1>
              <p className="mt-4 max-w-4xl text-base leading-8 text-muted-foreground">
                Good App Store screenshots are usually simple: strong product screens, clear
                copy, consistent layout, and a preview flow that lets you review the whole set
                before export. The goal is not to decorate every screenshot. The goal is to
                make your product easier to understand at a glance.
              </p>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
              <div className="rounded-[2.5rem] border border-white/70 bg-white/82 p-8 shadow-soft backdrop-blur sm:p-10">
                <div className="space-y-10">
                  {steps.map((step) => (
                    <section key={step.title}>
                      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        {step.title}
                      </h2>
                      <p className="mt-4 text-base leading-8 text-muted-foreground">
                        {step.body}
                      </p>
                    </section>
                  ))}
                </div>
              </div>

              <aside className="space-y-6">
                <section className="rounded-[2.5rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(251,245,239,0.94))] p-8 shadow-soft backdrop-blur sm:p-10">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Common mistakes
                  </h2>
                  <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
                    {mistakes.map((mistake) => (
                      <p key={mistake}>{mistake}</p>
                    ))}
                  </div>
                </section>

                <section className="rounded-[2.5rem] border border-primary/15 bg-primary/5 p-8 shadow-soft">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Related guide
                  </h2>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">
                    Need help thinking about export targets and layout fit? Read{" "}
                    <Link
                      href="/iphone-app-store-screenshot-sizes"
                      className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
                    >
                      iPhone App Store screenshot sizes
                    </Link>
                    .
                  </p>
                </section>
              </aside>
            </section>

            <section className="rounded-[2.5rem] border border-white/70 bg-white/82 p-8 shadow-soft backdrop-blur sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Turn the guide into a real screenshot set
                </h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  LaunchMyApp gives you the workflow directly: upload screenshots, add title
                  and subtitle copy, preview the full listing, and export polished iPhone App
                  Store screenshots from one place.
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
