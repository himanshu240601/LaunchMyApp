"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { fetchLandingReviews } from "@/lib/supabase/reviews";
import type { TestimonialItem } from "@/types/landing";

import { SectionReveal } from "@/components/landing/section-reveal";
import { ThemedDialog } from "@/components/ui/themed-dialog";
import { SectionHeading } from "@/components/ui/section-heading";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isLoading = !hasLoaded;
  const loopedTestimonials = useMemo(
    () => [...testimonials, ...testimonials, ...testimonials],
    [testimonials],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadTestimonials() {
      try {
        const reviews = await fetchLandingReviews(4);

        if (!cancelled) {
          setTestimonials(reviews);
          setHasLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setTestimonials([]);
          setHasLoaded(true);
        }
      }
    }

    void loadTestimonials();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const centerTrack = () => {
      const segmentWidth = container.scrollWidth / 3;
      container.scrollLeft = segmentWidth;
    };

    centerTrack();

    window.addEventListener("resize", centerTrack);
    return () => {
      window.removeEventListener("resize", centerTrack);
    };
  }, [testimonials]);

  const handleInfiniteScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const segmentWidth = container.scrollWidth / 3;
    const minimumEdge = segmentWidth * 0.5;
    const maximumEdge = segmentWidth * 1.5;

    if (container.scrollLeft < minimumEdge) {
      container.scrollLeft += segmentWidth;
    } else if (container.scrollLeft > maximumEdge) {
      container.scrollLeft -= segmentWidth;
    }
  };

  if (hasLoaded && testimonials.length <= 3) {
    return null;
  }

  return (
    <section className="py-24 sm:py-32">
      <ThemedDialog
        open={Boolean(selectedTestimonial)}
        onClose={() => setSelectedTestimonial(null)}
        eyebrow="Reviews"
      >
        {selectedTestimonial ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-1 text-[1.2rem] text-primary">
              {Array.from({ length: selectedTestimonial.rating ?? 5 }).map((_, starIndex) => (
                <span key={starIndex}>★</span>
              ))}
            </div>
            <p className="text-center text-lg leading-8 text-foreground">
              “{selectedTestimonial.quote}”
            </p>
            <div className="px-1 pt-1 text-center">
              <p className="font-semibold tracking-tight text-foreground">
                {selectedTestimonial.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedTestimonial.role}
              </p>
            </div>
          </div>
        ) : null}
      </ThemedDialog>
      <div className="container">
        <SectionHeading
          eyebrow="Reviews"
          title="Builders use LaunchMyApp to ship cleaner screenshot sets."
          description="Less scrambling. Better presentation. Faster updates."
        />
        {isLoading ? (
          <SectionReveal className="mt-12">
            <div className="mx-auto max-w-6xl overflow-hidden">
              <div className="flex justify-center gap-5 py-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="relative flex h-[18.5rem] w-[min(88vw,32rem)] shrink-0 flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/75 p-8 text-center shadow-[0_10px_30px_rgba(71,38,24,0.05),0_2px_10px_rgba(71,38,24,0.03)] backdrop-blur"
                  >
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] [animation:skeleton-shimmer_1.7s_ease-in-out_infinite]" />
                    </div>
                    <div className="relative flex items-center justify-center gap-1 text-[1.1rem] text-[rgba(244,197,66,0.35)]">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <span key={starIndex}>★</span>
                      ))}
                    </div>
                    <div className="mt-5 min-h-[4rem] space-y-3">
                      <div className="h-5 w-full rounded-full bg-[rgba(255,255,255,0.82)]" />
                      <div className="h-5 w-[84%] rounded-full bg-[rgba(255,255,255,0.72)]" />
                    </div>
                    <div className="mt-auto space-y-3 pt-8">
                      <div className="mx-auto h-5 w-28 rounded-full bg-[rgba(255,255,255,0.82)]" />
                      <div className="mx-auto h-4 w-36 rounded-full bg-[rgba(255,255,255,0.68)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        ) : null}
        {!isLoading ? (
        <SectionReveal className="mt-12">
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background via-background/80 to-transparent sm:w-32" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background via-background/80 to-transparent sm:w-32" />
            <div
              ref={scrollContainerRef}
              className="no-scrollbar overflow-x-auto pb-2"
              onScroll={handleInfiniteScroll}
            >
              <div
                className="flex w-max gap-5 px-[max(1rem,calc(50vw-16rem))] py-2 pr-[calc(max(1rem,calc(50vw-16rem))+1.25rem)]"
                aria-label="User reviews"
              >
                {loopedTestimonials.map((testimonial, index) => (
                  <button
                    key={`${testimonial.id ?? testimonial.name}-${index}`}
                    type="button"
                    onClick={() => setSelectedTestimonial(testimonial)}
                    className="flex h-[18.5rem] w-[min(88vw,32rem)] shrink-0 flex-col rounded-3xl border border-white/70 bg-white/80 p-8 text-center shadow-[0_10px_30px_rgba(71,38,24,0.05),0_2px_10px_rgba(71,38,24,0.03)] backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:border-primary/20 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    aria-label={`Open review from ${testimonial.name}`}
                  >
                    <div className="flex items-center justify-center gap-1 text-[1.1rem] text-primary">
                      {Array.from({ length: testimonial.rating ?? 5 }).map((_, starIndex) => (
                        <span key={starIndex}>★</span>
                      ))}
                    </div>
                    <blockquote className="mt-5 min-h-[4rem] overflow-hidden text-lg leading-8 text-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      “{testimonial.quote}”
                    </blockquote>
                    <figcaption className="mt-auto pt-8">
                      <p className="font-semibold tracking-tight">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </figcaption>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
        ) : null}
      </div>
    </section>
  );
}
