import { featureItems } from "@/data/landing-content";

import { SectionReveal } from "@/components/landing/section-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to create iPhone App Store screenshots."
          description="Built as a focused App Store screenshot creator, so you can go from raw screens to polished listing assets in one flow."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureItems.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <SectionReveal key={feature.title} delay={index * 0.06}>
                <article className="group h-full rounded-3xl border border-white/70 bg-white/75 p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-glow">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-orange-100 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
