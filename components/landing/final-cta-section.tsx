import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="pb-24 pt-10 sm:pb-32">
      <div className="container">
        <div className="overflow-hidden rounded-[2.75rem] border border-primary/15 bg-[#3a1208] px-6 py-12 text-white shadow-glow sm:px-10 lg:px-14 lg:py-18">
          <div className="absolute" />
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Launch faster
            </p>
            <h2 className="font-display mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Give your app a screenshot set that feels ready before launch week gets chaotic.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Join the LaunchMyApp waitlist to turn raw screens into polished App Store
              screenshots that feel ready from day one.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 px-7">
                Start generating screenshots
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="lg">
                Book a product walkthrough
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Early access invites are prioritized for mobile teams preparing a real launch or major update.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
