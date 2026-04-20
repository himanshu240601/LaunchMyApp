"use client";

import { ChangeEvent, useId, useState } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemedDialog } from "@/components/ui/themed-dialog";
import type { Slide } from "@/lib/screenshot/presets";

type ScreenshotListProps = {
  activeSlideIndex: number;
  slides: Slide[];
  onSelect: (index: number) => void;
  onFilesSelected?: (files: File[]) => void;
  onRemoveSlide?: (slideId: string) => void;
};

const MAX_FILES_TOTAL = 4;

export function ScreenshotList({
  activeSlideIndex,
  slides,
  onSelect,
  onFilesSelected,
  onRemoveSlide,
}: ScreenshotListProps) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);
  const [slidePendingRemoval, setSlidePendingRemoval] = useState<Slide | null>(null);
  const remainingSlots = Math.max(0, MAX_FILES_TOTAL - slides.length);
  const canUploadMore = Boolean(onFilesSelected) && remainingSlots > 0;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files || !onFilesSelected || !canUploadMore) {
      event.target.value = "";
      return;
    }

    const selectedFiles = Array.from(files);
    const availableSlots = remainingSlots;

    if (!selectedFiles.length) {
      setError("No files were selected.");
      event.target.value = "";
      return;
    }

    const hasNonImageFile = selectedFiles.some((file) => !file.type.startsWith("image/"));
    if (hasNonImageFile) {
      setError("Please select image files only.");
      event.target.value = "";
      return;
    }

    const acceptedFiles = selectedFiles.slice(0, availableSlots);
    setError(
      selectedFiles.length > availableSlots
        ? `Only the first ${availableSlots} screenshot${availableSlots === 1 ? "" : "s"} were added.`
        : null,
    );
    onFilesSelected(acceptedFiles);
    event.target.value = "";
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft">
      <ThemedDialog
        open={Boolean(slidePendingRemoval)}
        onClose={() => setSlidePendingRemoval(null)}
        title="Remove this screenshot?"
        description={
          slidePendingRemoval
            ? `This will remove ${slidePendingRemoval.title || "the current screen"} from your set. You can always upload it again later.`
            : undefined
        }
        footer={(
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full border border-border bg-white text-foreground shadow-none ring-0 hover:bg-white"
              onClick={() => setSlidePendingRemoval(null)}
            >
              Keep it
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={() => {
                if (slidePendingRemoval && onRemoveSlide) {
                  onRemoveSlide(slidePendingRemoval.id);
                }
                setSlidePendingRemoval(null);
              }}
            >
              Remove
            </Button>
          </div>
        )}
      />
      <div className="mb-5 shrink-0">
        <div className="flex items-center justify-between gap-3 pr-1">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Screens
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {slides.length}/{MAX_FILES_TOTAL} uploaded
            </p>
          </div>
          {slides.length > 0 && canUploadMore ? (
            <label
              htmlFor={inputId}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#ff5a12] px-4 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(255,90,18,0.24)] transition-colors hover:bg-[#f0530d]"
            >
              <UploadCloud className="h-4 w-4" />
              Upload
            </label>
          ) : null}
        </div>
        {error ? <p className="mt-3 text-sm text-primary">{error}</p> : null}
      </div>
      {slides.length ? (
        <div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={[
                "group relative rounded-[1.35rem] border transition-all duration-200",
                activeSlideIndex === index
                  ? "border-primary bg-primary/10 shadow-[0_10px_24px_rgba(255,122,38,0.14)]"
                  : "border-border bg-white hover:border-primary/25 hover:bg-orange-50/40",
                !slide.enabled ? "opacity-60" : "",
              ].join(" ")}
            >
              {onRemoveSlide ? (
                <button
                  type="button"
                  onClick={() => setSlidePendingRemoval(slide)}
                  className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/80 bg-[rgba(29,16,10,0.78)] text-white shadow-[0_10px_20px_rgba(29,16,10,0.18)] transition-colors hover:bg-[rgba(29,16,10,0.9)]"
                  aria-label={`Remove screen ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onSelect(index)}
                className="flex w-full items-center gap-3 px-3 py-3 text-left"
              >
                <div
                  className={[
                    "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-slate-50 p-1",
                    activeSlideIndex === index ? "border-primary/30" : "border-border",
                  ].join(" ")}
                >
                  <Image src={slide.image} alt={slide.title} fill className="object-contain" unoptimized />
                </div>
                <div className="min-w-0 flex-1 pr-8">
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
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-slate-50 px-6 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">Upload up to 4 screenshots</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
            Add PNG or JPG screenshots here to start writing titles and subtitles.
          </p>
          <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground/90">
            iPhone screenshots work best here.
          </p>
          {canUploadMore ? (
            <label
              htmlFor={inputId}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#ff5a12] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(255,90,18,0.24)] transition-colors hover:bg-[#f0530d]"
            >
              <UploadCloud className="h-4 w-4" />
              Upload Files
            </label>
          ) : null}
        </div>
      )}
      <input
        id={inputId}
        className="hidden"
        type="file"
        accept="image/*"
        multiple={remainingSlots > 1}
        onChange={handleChange}
      />
    </div>
  );
}
