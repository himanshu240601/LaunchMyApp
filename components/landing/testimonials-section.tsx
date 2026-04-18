import { testimonials } from "@/data/landing-content";

import { SectionReveal } from "@/components/landing/section-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Reviews"
          title="Builders use LaunchMyApp to ship cleaner screenshot sets."
          description="Less scrambling. Better presentation. Faster updates."
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <SectionReveal key={testimonial.name} delay={index * 0.08}>
              <figure className="h-full rounded-3xl border border-white/70 bg-white/80 p-8 text-center shadow-soft backdrop-blur">
                <div className="flex items-center justify-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span key={starIndex}>★</span>
                  ))}
                </div>
                <blockquote className="mt-5 text-lg leading-8 text-foreground">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-8">
                  <p className="font-semibold tracking-tight">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </figcaption>
              </figure>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
