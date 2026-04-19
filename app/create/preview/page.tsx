"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, RefreshCw } from "lucide-react";

import { sanitizeExportName } from "@/app/create/create-flow-context";
import { Button } from "@/components/ui/button";
import { PreviewCanvas } from "@/components/screenshots/PreviewCanvas";
import { generateSlideBlob } from "@/lib/screenshot/generate";
import {
  PREVIEW_SNAPSHOT_STORAGE_KEY,
  loadPreviewSnapshot,
  type PreviewSnapshot,
} from "@/lib/screenshot/preview-snapshot";
import { downloadZip } from "@/lib/screenshot/zip";

function formatPresetLabels(snapshot: PreviewSnapshot) {
  const presets = snapshot.selectedPresets?.length
    ? snapshot.selectedPresets
    : [snapshot.preset];

  return presets.map((preset) => preset.label);
}

function getSlideControls(snapshot: PreviewSnapshot, slideId: string) {
  return {
    ...(snapshot.defaultControls ?? snapshot.controls),
    ...(snapshot.controlsBySlideId?.[slideId] ?? {}),
  };
}

function getSlideFrameEnabled(snapshot: PreviewSnapshot, slideId: string) {
  if (snapshot.frameEnabledBySlideId && slideId in snapshot.frameEnabledBySlideId) {
    return snapshot.frameEnabledBySlideId[slideId];
  }

  return snapshot.defaultFrameEnabled ?? snapshot.frameEnabled;
}

export default function PreviewPage() {
  const [snapshot, setSnapshot] = useState<PreviewSnapshot | null>(() => loadPreviewSnapshot());
  const [isExporting, setIsExporting] = useState(false);
  const syncSnapshot = useCallback(() => {
    setSnapshot(loadPreviewSnapshot());
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== PREVIEW_SNAPSHOT_STORAGE_KEY) {
        return;
      }

      syncSnapshot();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncSnapshot();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", syncSnapshot);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", syncSnapshot);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [syncSnapshot]);

  const navbarTitle = snapshot?.exportName || "Untitled_1";
  const activeSlides = useMemo(
    () => snapshot?.slides.filter((slide) => slide.enabled) ?? [],
    [snapshot],
  );
  const presetLabels = useMemo(
    () => (snapshot ? formatPresetLabels(snapshot) : []),
    [snapshot],
  );

  const handleExport = async () => {
    if (!snapshot) {
      return;
    }

    const exportableSlides = snapshot.slides.filter((slide) => slide.enabled);
    const activePresets = snapshot.selectedPresets?.length
      ? snapshot.selectedPresets
      : [snapshot.preset];

    if (!exportableSlides.length || !activePresets.length) {
      return;
    }

    setIsExporting(true);
    try {
      const files = [];

      for (const slide of exportableSlides) {
        for (const preset of activePresets) {
          const blob = await generateSlideBlob(
            slide,
            preset,
            snapshot.template,
            getSlideFrameEnabled(snapshot, slide.id),
            getSlideControls(snapshot, slide.id),
          );

          files.push({
            name: `${preset.id}/${slide.order + 1}_${preset.id}.png`,
            blob,
          });
        }
      }

      await downloadZip(files, `${sanitizeExportName(snapshot.exportName)}.zip`);
    } finally {
      setIsExporting(false);
    }
  };

  if (!snapshot) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf9,#f6efe5)] px-6 py-10 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/80 bg-white/92 p-8 text-center shadow-soft">
          <p className="text-lg font-semibold text-foreground">No preview available</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Open Preview from the studio page to generate a live listing preview in this tab.
          </p>
          <Link
            href="/create/studio"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-white"
          >
            Back to Studio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,167,111,0.12),transparent_28%),linear-gradient(180deg,#fffdf9,#f6efe5)] text-foreground">
      <div className="mx-auto max-w-none px-2 py-2 sm:px-3 lg:px-3">
        <header className="relative flex shrink-0 items-center justify-between gap-4 rounded-[1.25rem] border border-white/70 bg-white/85 px-4 py-3">
          <div className="relative z-10 flex items-center gap-3">
            <button
              type="button"
              onClick={syncSnapshot}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Refresh preview"
              title="Refresh preview"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 flex justify-center px-16">
            <div className="pointer-events-auto w-full max-w-md">
              <div className="w-full bg-transparent text-center text-lg font-semibold tracking-tight text-foreground">
                {navbarTitle}
              </div>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <Button
              type="button"
              className="gap-2 rounded-full"
              onClick={() => {
                void handleExport();
              }}
              disabled={isExporting}
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </header>

        <div className="mt-4 flex flex-col gap-3 px-2 sm:px-3 lg:flex-row lg:items-start lg:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            App Store Preview
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground lg:justify-end">
            {presetLabels.map((label) => (
              <span
                key={label}
                className="rounded-full border border-border/80 bg-white/85 px-3 py-1.5"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 px-2 sm:px-3">
          <p className="mt-2 w-full max-w-none text-sm leading-7 text-muted-foreground sm:text-base">
            See your screenshot sequence in a storefront-style layout. Changes from the editor
            update here automatically while both tabs are open.
          </p>
        </div>

        <div className="mt-5 border-b border-border/70" />

        <section className="pt-2">
          <div className="no-scrollbar w-full overflow-x-auto px-1 pb-4 sm:px-2">
            <div className="flex w-max min-w-full gap-1.5 sm:gap-2">
              {activeSlides.map((slide) => (
                <article
                  key={slide.id}
                  className="w-[260px] shrink-0 snap-start sm:w-[280px] lg:w-[300px]"
                >
                  <div
                    className="overflow-hidden rounded-[1.8rem]"
                    style={{
                      aspectRatio: `${snapshot.preset.width} / ${snapshot.preset.height}`,
                    }}
                  >
                    <PreviewCanvas
                      slide={slide}
                      preset={snapshot.preset}
                      template={snapshot.template}
                      frameEnabled={getSlideFrameEnabled(snapshot, slide.id)}
                      controls={getSlideControls(snapshot, slide.id)}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
