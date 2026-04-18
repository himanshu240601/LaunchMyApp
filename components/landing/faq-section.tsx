import { faqItems } from "@/data/landing-content";

import { SectionReveal } from "@/components/landing/section-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function FaqSection() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions teams usually ask before getting started."
          description="A few quick answers before you try it."
        />
        <div className="mt-12 space-y-4">
          {faqItems.map((item, index) => (
            <SectionReveal key={item.question} delay={index * 0.05}>
              <details className="group rounded-3xl border border-white/70 bg-white/75 p-6 shadow-soft backdrop-blur">
                <summary className="cursor-pointer list-none text-lg font-semibold tracking-tight">
                  <span className="inline-flex items-center justify-between gap-4">
                    {item.question}
                    <span className="text-primary transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
