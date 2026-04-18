"use client";

import Image from "next/image";

import type { Slide } from "@/lib/screenshot/presets";

type ScreenshotListProps = {
  activeSlideIndex: number;
  slides: Slide[];
  onSelect: (index: number) => void;
};

export function ScreenshotList({ activeSlideIndex, slides, onSelect }: ScreenshotListProps) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft">
      <div className="mb-5 shrink-0">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Screens
        </h3>
      </div>
      {slides.length ? (
        <div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => onSelect(index)}
              className={[
                "flex w-full items-center gap-3 rounded-[1.35rem] border px-3 py-3 text-left transition-all duration-200",
                activeSlideIndex === index
                  ? "border-primary bg-primary/10 shadow-[0_10px_24px_rgba(255,122,38,0.14)]"
                  : "border-border bg-white hover:border-primary/25 hover:bg-orange-50/40",
                !slide.enabled ? "opacity-60" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-slate-100",
                  activeSlideIndex === index ? "border-primary/30" : "border-border",
                ].join(" ")}
              >
                <Image src={slide.image} alt={slide.title} fill className="object-cover" unoptimized />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={[
                    "text-xs font-semibold uppercase tracking-[0.16em]",
                    activeSlideIndex === index ? "text-primary" : "text-muted-foreground",
                  ].join(" ")}
                >
                  Screen {index + 1}
                </p>
                <p className="mt-1 truncate font-semibold text-foreground">{slide.title}</p>
                <p className="mt-1 truncate text-sm text-muted-foreground">{slide.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-slate-50 px-4 py-8 text-center text-sm leading-6 text-muted-foreground">
          No screenshots yet. Upload PNG or JPG files to build your first screen list.
        </div>
      )}
    </div>
  );
}
