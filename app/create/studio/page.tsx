"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Minus, Plus, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { sanitizeExportName } from "@/app/create/create-flow-context";
import { PreviewCanvas } from "@/components/screenshots/PreviewCanvas";
import { ScreenshotList } from "@/components/screenshots/ScreenshotList";
import { SlideEditor } from "@/components/screenshots/SlideEditor";
import { EXPORT_PRESETS } from "@/lib/screenshot/presets";
import { useCreateFlow } from "@/app/create/create-flow-context";

export default function StudioPage() {
  const router = useRouter();
  const [previewZoom, setPreviewZoom] = useState(0.8);
  const {
    slides,
    activeSlide,
    activeSlideIndex,
    setActiveSlideIndex,
    handleTitleChange,
    handleSubtitleChange,
    selectedTemplate,
    setSelectedTemplate,
    frameEnabled,
    setFrameEnabled,
    exportName,
    previewPreset,
    isExporting,
    renderControls,
    setPreviewPresetId,
    setExportName,
    backgroundStyleId,
    setBackgroundStyleId,
    fontFamilyId,
    setFontFamilyId,
    titleScaleMultiplier,
    setTitleScaleMultiplier,
    subtitleScaleMultiplier,
    setSubtitleScaleMultiplier,
    screenshotScaleMultiplier,
    setScreenshotScaleMultiplier,
    screenshotOffsetX,
    setScreenshotOffsetX,
    screenshotOffsetY,
    setScreenshotOffsetY,
    handleExport,
  } = useCreateFlow();
  const trimmedExportName = exportName.trim();
  const exportNameHasInvalidChars = /[<>:"/\\|?*\u0000-\u001F]/.test(exportName);
  const exportNameError =
    !trimmedExportName
      ? "File name is required."
      : exportNameHasInvalidChars
        ? 'Remove invalid characters like \\ / : * ? " < > |'
        : null;

  useEffect(() => {
    if (!slides.length) {
      router.replace("/create/upload");
    }
  }, [router, slides.length]);

  if (!slides.length) {
    return null;
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
      <div className="relative flex shrink-0 items-center justify-between gap-4 rounded-[1.25rem] border border-white/70 bg-white/85 px-4 py-3">
        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/create/edit"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="pointer-events-none absolute inset-x-0 flex justify-center px-16">
          <div className="pointer-events-auto w-full max-w-md">
            <input
              value={exportName}
              onChange={(event) => setExportName(event.target.value)}
              onBlur={() => setExportName(sanitizeExportName(exportName))}
              className={[
                "w-full bg-transparent text-center text-lg font-semibold tracking-tight outline-none",
                exportNameError ? "text-destructive" : "text-foreground",
              ].join(" ")}
              aria-label="Export file name"
            />
            {exportNameError ? (
              <p className="mt-1 text-center text-xs text-destructive">{exportNameError}</p>
            ) : null}
          </div>
        </div>
        <Button
          type="button"
          className="relative z-10 gap-2 rounded-full"
          onClick={() => {
            void handleExport();
          }}
          disabled={isExporting || Boolean(exportNameError)}
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 items-start gap-3 xl:grid-cols-[375px_minmax(0,1fr)_400px]">
        <aside className="flex min-h-0 flex-col gap-3 xl:h-full">
          <div className="min-h-0 basis-[60%]">
            <ScreenshotList
              activeSlideIndex={activeSlideIndex}
              slides={slides}
              onSelect={setActiveSlideIndex}
            />
          </div>
          <div className="min-h-0 basis-[40%]">
            <SlideEditor
              slide={activeSlide}
              onTitleChange={handleTitleChange}
              onSubtitleChange={handleSubtitleChange}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              frameEnabled={frameEnabled}
              onFrameToggle={setFrameEnabled}
              previewPreset={previewPreset}
              presets={EXPORT_PRESETS}
              onPreviewPresetChange={setPreviewPresetId}
              backgroundStyleId={backgroundStyleId}
              onBackgroundStyleChange={setBackgroundStyleId}
              fontFamilyId={fontFamilyId}
              onFontFamilyChange={setFontFamilyId}
              titleScaleMultiplier={titleScaleMultiplier}
              onTitleScaleMultiplierChange={setTitleScaleMultiplier}
              subtitleScaleMultiplier={subtitleScaleMultiplier}
              onSubtitleScaleMultiplierChange={setSubtitleScaleMultiplier}
              screenshotScaleMultiplier={screenshotScaleMultiplier}
              onScreenshotScaleMultiplierChange={setScreenshotScaleMultiplier}
              screenshotOffsetX={screenshotOffsetX}
              onScreenshotOffsetXChange={setScreenshotOffsetX}
              screenshotOffsetY={screenshotOffsetY}
              onScreenshotOffsetYChange={setScreenshotOffsetY}
              hideHeader
            />
          </div>
        </aside>

        <section className="min-w-0 min-h-0 xl:h-full">
          <div className="flex h-full min-h-0 rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(250,244,237,0.34))] px-2 py-1 xl:items-center xl:justify-center">
            <div className="mx-auto flex h-full w-full max-w-[42rem] flex-col justify-between">
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <PreviewCanvas
                  slide={activeSlide}
                  preset={previewPreset}
                  template={selectedTemplate}
                  frameEnabled={frameEnabled}
                  controls={renderControls}
                  zoom={previewZoom}
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 w-9 rounded-full border border-transparent bg-transparent px-0 text-muted-foreground hover:bg-white/40 hover:text-foreground"
                  onClick={() => setPreviewZoom((current) => Math.max(0.75, current - 0.1))}
                  aria-label="Zoom out"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-14 text-center text-sm font-medium text-muted-foreground">
                  {Math.round(previewZoom * 100)}%
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 w-9 rounded-full border border-transparent bg-transparent px-0 text-muted-foreground hover:bg-white/40 hover:text-foreground"
                  onClick={() => setPreviewZoom((current) => Math.min(2, current + 0.1))}
                  aria-label="Zoom in"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <aside className="no-scrollbar rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[-18px_0_36px_rgba(65,33,20,0.04)] xl:sticky xl:top-0 xl:h-full xl:overflow-y-auto xl:self-stretch">
          <div className="space-y-5 px-6 py-5">
            <SlideEditor
              slide={activeSlide}
              onTitleChange={handleTitleChange}
              onSubtitleChange={handleSubtitleChange}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              frameEnabled={frameEnabled}
              onFrameToggle={setFrameEnabled}
              showDesignControls
              previewPreset={previewPreset}
              presets={EXPORT_PRESETS}
              onPreviewPresetChange={setPreviewPresetId}
              backgroundStyleId={backgroundStyleId}
              onBackgroundStyleChange={setBackgroundStyleId}
              fontFamilyId={fontFamilyId}
              onFontFamilyChange={setFontFamilyId}
              titleScaleMultiplier={titleScaleMultiplier}
              onTitleScaleMultiplierChange={setTitleScaleMultiplier}
              subtitleScaleMultiplier={subtitleScaleMultiplier}
              onSubtitleScaleMultiplierChange={setSubtitleScaleMultiplier}
              screenshotScaleMultiplier={screenshotScaleMultiplier}
              onScreenshotScaleMultiplierChange={setScreenshotScaleMultiplier}
              screenshotOffsetX={screenshotOffsetX}
              onScreenshotOffsetXChange={setScreenshotOffsetX}
              screenshotOffsetY={screenshotOffsetY}
              onScreenshotOffsetYChange={setScreenshotOffsetY}
              showTextFields={false}
              panelless
            />
            <div className="border-t border-border/80 pt-5">
              <button
                type="button"
                onClick={() => setFrameEnabled(!frameEnabled)}
                className={[
                  "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors",
                  frameEnabled
                    ? "border-primary/30 bg-orange-50/80"
                    : "border-border bg-white hover:border-primary/20",
                ].join(" ")}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-medium text-foreground">Mockup Frame</span>
                    <span className="block text-sm text-muted-foreground">
                      {frameEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </span>
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {frameEnabled ? "On" : "Off"}
                </span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
