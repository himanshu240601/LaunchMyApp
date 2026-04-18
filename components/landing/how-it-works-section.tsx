import { Upload, Wand2, Download } from "lucide-react";

import { steps } from "@/data/landing-content";

import { SectionReveal } from "@/components/landing/section-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/72 px-6 py-12 shadow-soft backdrop-blur sm:px-10 lg:px-12">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-orange-50/70 to-transparent" />
          <div className="absolute left-12 top-16 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-12 top-12 h-44 w-44 rounded-full bg-orange-200/20 blur-3xl" />
          <SectionHeading
            eyebrow="How it works"
            title="From raw screens to polished screens in three steps."
            description="A cleaner, faster workflow for shipping App Store screenshots."
          />
          <div className="relative mt-14">
            <div className="absolute left-1/2 top-9 hidden h-[2px] w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/15 to-transparent lg:block" />
            <div className="grid gap-5 lg:grid-cols-3">
              {steps.map((step, index) => (
                <SectionReveal key={step.title} delay={index * 0.08}>
                  <article className="relative h-full rounded-[2rem] border border-white/80 bg-white/92 p-7 text-center shadow-soft">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-orange-100 text-primary shadow-sm">
                      {index === 0 ? (
                        <Upload className="h-5 w-5" />
                      ) : index === 1 ? (
                        <Wand2 className="h-5 w-5" />
                      ) : (
                        <Download className="h-5 w-5" />
                      )}
                    </div>
                    <h3 className="mt-6 min-h-[4rem] text-2xl font-semibold tracking-tight text-foreground">
                      {index === 0 ? (
                        <>
                          Upload your app
                          <br />
                          screenshots
                        </>
                      ) : index === 2 ? (
                        <>
                          Export your App Store
                          <br />
                          set
                        </>
                      ) : (
                        step.title
                      )}
                    </h3>
                    <p className="mx-auto mt-4 max-w-[28ch] text-base leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </article>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
