"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Slide } from "@/lib/screenshot/presets";

type UploadDropzoneProps = {
  onFilesSelected: (files: File[]) => void;
  uploadedCount?: number;
  slides?: Slide[];
  onRemoveSlide?: (slideId: string) => void;
};

const ALLOWED_TYPES = ["image/png", "image/jpeg"];
const MAX_FILES_TOTAL = 4;

export function UploadDropzone({
  onFilesSelected,
  uploadedCount = 0,
  slides = [],
  onRemoveSlide,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canUploadMore = uploadedCount < MAX_FILES_TOTAL;

  function handleFiles(files: FileList | null) {
    if (!files) {
      return;
    }

    if (!canUploadMore) {
      return;
    }

    const selectedFiles = Array.from(files);
    const availableSlots = MAX_FILES_TOTAL - uploadedCount;
    const limitedFiles = selectedFiles.slice(0, availableSlots);
    const imageFiles = limitedFiles.filter((file) => ALLOWED_TYPES.includes(file.type));

    if (!selectedFiles.length) {
      setError("No files were selected.");
      return;
    }

    if (selectedFiles.length > availableSlots) {
      setError(
        `You can keep up to ${MAX_FILES_TOTAL} screenshots at a time. We added the first ${availableSlots}.`,
      );
    }

    if (!imageFiles.length) {
      setError("Please upload PNG or JPG files only.");
      return;
    }

    if (imageFiles.length !== limitedFiles.length) {
      setError("Some files were skipped. Only PNG and JPG are supported.");
    } else if (selectedFiles.length <= availableSlots) {
      setError(null);
    }

    onFilesSelected(imageFiles);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (!canUploadMore) {
      return;
    }
    handleFiles(event.dataTransfer.files);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    handleFiles(event.target.files);
    event.target.value = "";
  }

  return (
    <div
      className={[
        "rounded-[2rem] border border-dashed bg-white/80 p-6 text-center shadow-soft transition-colors",
        isDragging && canUploadMore ? "border-primary bg-orange-50/80" : "border-border",
        !canUploadMore ? "opacity-90" : "",
      ].join(" ")}
      onDragEnter={(event) => {
        event.preventDefault();
        if (canUploadMore) {
          setIsDragging(true);
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (canUploadMore) {
          setIsDragging(true);
        }
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {isDragging ? <ImagePlus className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
      </div>
      <h2 className="mt-5 text-lg font-semibold tracking-tight text-foreground">Upload Screenshots</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {uploadedCount > 0
          ? `${uploadedCount} screenshot${uploadedCount === 1 ? "" : "s"} ready.`
          : "Drop PNG or JPG files here to instantly create your first screens."}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Max 4 uploads allowed at a time.
      </p>
      {error ? <p className="mt-3 text-sm text-primary">{error}</p> : null}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() => inputRef.current?.click()}
          type="button"
          disabled={!canUploadMore}
        >
          {uploadedCount > 0 ? "Upload More" : "Choose Files"}
        </Button>
      </div>
      {slides.length ? (
        <div className="mt-6 overflow-x-auto overflow-y-visible px-2 pt-2 pb-2">
          <div className="flex min-w-full justify-center gap-3">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="group relative w-32 shrink-0 overflow-visible rounded-[1.25rem] text-left"
            >
              {onRemoveSlide ? (
                <button
                  type="button"
                  onClick={() => onRemoveSlide(slide.id)}
                  className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-[rgba(29,16,10,0.78)] text-white shadow-[0_10px_20px_rgba(29,16,10,0.18)] transition-colors hover:bg-[rgba(29,16,10,0.9)]"
                  aria-label={`Remove screen ${slide.order + 1}`}
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
              <div className="relative aspect-square overflow-hidden rounded-[1.25rem] border border-border bg-white shadow-[0_10px_24px_rgba(65,33,20,0.05)]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  unoptimized
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[rgba(29,16,10,0.68)] via-[rgba(29,16,10,0.18)] to-transparent px-3 py-2">
                  <span className="rounded-full bg-white/88 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground">
                    Ready
                  </span>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      ) : null}
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/png,image/jpeg"
        multiple
        onChange={handleChange}
      />
    </div>
  );
}
