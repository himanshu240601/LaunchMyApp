import { problemItems } from "@/data/landing-content";

import { SectionReveal } from "@/components/landing/section-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function ProblemSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="The bottleneck"
          title="Shipping the app is hard enough. Screenshot design should not slow the launch."
          description="LaunchMyApp is designed around the moment when developers need polished App Store screenshots quickly, but do not have the time or design support to produce them."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {problemItems.map((item, index) => (
            <SectionReveal key={item.title} delay={index * 0.08}>
              <article className="h-full rounded-3xl border border-white/70 bg-white/75 p-7 shadow-soft backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">
                  0{index + 1}
                </p>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">{item.description}</p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
