import { Check } from "lucide-react";

import { pricingTiers } from "@/data/landing-content";

import { SectionReveal } from "@/components/landing/section-reveal";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing for App Store screenshot generation."
          description="Pick the plan that fits your release workflow."
          align="center"
        />
        <div className="mt-12 grid gap-5 xl:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <SectionReveal key={tier.name} delay={index * 0.08}>
              <article
                className={[
                  "flex h-full flex-col rounded-[2rem] border p-8 shadow-soft",
                  tier.featured
                    ? "border-primary/25 bg-[#3a1208] text-white shadow-glow"
                    : "border-white/70 bg-white/75 backdrop-blur",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{tier.name}</h3>
                    <p
                      className={
                        tier.featured ? "mt-3 text-slate-300" : "mt-3 text-muted-foreground"
                      }
                    >
                      {tier.description}
                    </p>
                  </div>
                  {tier.featured ? (
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Best
                    </span>
                  ) : null}
                </div>
                <div className="mt-8 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight">{tier.price}</span>
                  {tier.price !== "$0" ? (
                    <span className={tier.featured ? "pb-1 text-slate-400" : "pb-1 text-muted-foreground"}>
                      /month
                    </span>
                  ) : null}
                </div>
                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className={tier.featured ? "text-slate-200" : "text-muted-foreground"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  variant={tier.featured ? "default" : "secondary"}
                  className="mt-8 w-full"
                >
                  {tier.ctaLabel}
                </Button>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
