import { benefits } from "@/data/landing-content";

import { SectionReveal } from "@/components/landing/section-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function WhyLaunchMyAppSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Why It Converts"
          title="A tighter landing page for a tool people want to understand in seconds."
          description="The product works best when the page feels immediate: one clear promise, strong visual proof, and enough supporting detail to build confidence without slowing the scroll."
          align="center"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <SectionReveal key={benefit.title} delay={index * 0.08}>
              <article className="h-full rounded-3xl border border-white/70 bg-gradient-to-b from-white to-slate-50 p-7 shadow-soft">
                <h3 className="text-xl font-semibold tracking-tight">{benefit.title}</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  {benefit.description}
                </p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
