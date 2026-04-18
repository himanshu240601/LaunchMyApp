import { ArrowRight, Sparkles } from "lucide-react";

import { SectionReveal } from "@/components/landing/section-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const useCases = [
  {
    title: "Launch week screenshots",
    description: "Build a full gallery fast when release pressure is highest.",
  },
  {
    title: "Feature update refreshes",
    description: "Refresh messaging without rebuilding every screen.",
  },
  {
    title: "ASO testing sets",
    description: "Create alternate sets to test positioning.",
  },
  {
    title: "Agency client delivery",
    description: "Keep multiple screenshot systems organized.",
  },
];

export function ShowcaseSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <SectionReveal>
            <SectionHeading
              eyebrow="Use Cases"
              title="One tool, many screenshot jobs across the release cycle."
              description="LaunchMyApp fits launches, updates, testing, and client delivery."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {useCases.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.7rem] border border-white/70 bg-white/78 p-5 shadow-soft"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
          <SectionReveal delay={0.12}>
            <div className="rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-glow backdrop-blur">
              <div className="rounded-[1.7rem] border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Before / after
                        </p>
                        <h3 className="mt-2 text-lg font-semibold">Store Screenshot Composer</h3>
                      </div>
                      <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
                        Preview synced
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.3rem] border border-dashed border-slate-300 bg-slate-100 p-3">
                        <div className="aspect-[9/19] rounded-[1rem] bg-slate-300" />
                        <p className="mt-3 text-sm font-medium text-slate-500">Raw screenshot</p>
                      </div>
                      <div className="rounded-[1.3rem] border border-primary/15 bg-gradient-to-br from-primary/10 via-white to-orange-100/20 p-3">
                        <div className="aspect-[9/19] rounded-[1rem] bg-gradient-to-br from-[#ff6a00] via-[#ff8a1c] to-[#ffd7bb] p-3">
                          <div className="flex h-full flex-col justify-between rounded-[0.85rem] bg-[#3a1208]/82 p-4">
                            <div className="space-y-2">
                              <div className="h-3 w-24 rounded-full bg-white/90" />
                              <div className="h-3 w-32 rounded-full bg-white/40" />
                            </div>
                            <div className="h-28 rounded-2xl border border-white/10 bg-white/10" />
                          </div>
                        </div>
                        <p className="mt-3 text-sm font-medium text-slate-700">LaunchMyApp output</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Screen strategy
                      </p>
                      <div className="mt-4 space-y-3">
                        {[
                          "Lead with the main product outcome",
                          "Keep each screen consistent",
                          "End with a stronger conversion message",
                        ].map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-soft">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Workflow fit
                      </p>
                      <div className="mt-4 grid gap-3">
                        {[
                          "Reusable presets",
                          "Fast placeholder concepts",
                          "Export-ready output",
                        ].map((item) => (
                          <div
                            key={item}
                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                          >
                            <span>{item}</span>
                            <ArrowRight className="h-4 w-4 text-orange-200" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
