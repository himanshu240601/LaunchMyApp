"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, Home } from "lucide-react";

import { ScreenshotList } from "@/components/screenshots/ScreenshotList";
import { SlideEditor } from "@/components/screenshots/SlideEditor";
import { Button } from "@/components/ui/button";
import { useCreateFlow } from "@/app/create/create-flow-context";
import { clearPreviewSnapshot } from "@/lib/screenshot/preview-snapshot";

export default function EditStepPage() {
  const router = useRouter();
  const {
    slides,
    activeSlide,
    activeSlideIndex,
    selectedPresets,
    applyPreviewToAll,
    setActiveSlideIndex,
    handleFilesSelected,
    removeSlide,
    handleTitleChange,
    handleSubtitleChange,
    selectedTemplate,
    setSelectedTemplate,
    customBackgroundColor,
    setCustomBackgroundColor,
    customBackgroundOpacity,
    setCustomBackgroundOpacity,
    customTextColor,
    setCustomTextColor,
    layout,
    setLayout,
    frameEnabled,
    setFrameEnabled,
    previewPreset,
    toggleExportPreset,
    setApplyPreviewToAll,
    backgroundStyleId,
    setBackgroundStyleId,
    fontFamilyId,
    setFontFamilyId,
    titleScaleMultiplier,
    setTitleScaleMultiplier,
    subtitleScaleMultiplier,
    setSubtitleScaleMultiplier,
    subtitleSpacingMultiplier,
    setSubtitleSpacingMultiplier,
    textOffsetX,
    setTextOffsetX,
    textOffsetY,
    setTextOffsetY,
    screenshotScaleMultiplier,
    setScreenshotScaleMultiplier,
    screenshotOffsetX,
    setScreenshotOffsetX,
    screenshotOffsetY,
    setScreenshotOffsetY,
  } = useCreateFlow();
  const hasPreviousSlide = activeSlideIndex > 0;
  const hasNextSlide = activeSlideIndex < slides.length - 1;
  const showSlideNavigation = slides.length > 1;

  useEffect(() => {
    if (!slides.length) {
      clearPreviewSnapshot();
    }
  }, [slides.length]);

  return (
    <section className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
      <div className="relative flex shrink-0 items-center justify-between gap-4 rounded-[1.25rem] border border-white/70 bg-white/85 px-4 py-3">
        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Back"
            title="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </div>
        <div className="pointer-events-none absolute inset-x-0 flex justify-center px-16">
          <div className="pointer-events-auto w-full max-w-md text-center">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Upload Screenshots</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload and add text to your screenshots
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push("/create/studio")}
          className="relative z-10 gap-2 rounded-full"
          disabled={!slides.length}
        >
          <ArrowRight className="h-4 w-4" />
          Continue
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 xl:[grid-template-columns:375px_minmax(0,1fr)]">
        <aside className="min-h-0 min-w-0 max-w-full overflow-hidden xl:h-full xl:w-[375px] xl:max-w-[375px] xl:min-w-[375px]">
          <ScreenshotList
            activeSlideIndex={activeSlideIndex}
            slides={slides}
            onSelect={setActiveSlideIndex}
            onFilesSelected={handleFilesSelected}
            onRemoveSlide={removeSlide}
          />
        </aside>

        <div className="relative min-h-0 min-w-0 xl:h-full">
          <div className="h-full min-w-0 overflow-hidden">
            <SlideEditor
              slide={activeSlide}
              onTitleChange={handleTitleChange}
              onSubtitleChange={handleSubtitleChange}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              customBackgroundColor={customBackgroundColor}
              onCustomBackgroundColorChange={setCustomBackgroundColor}
              customBackgroundOpacity={customBackgroundOpacity}
              onCustomBackgroundOpacityChange={setCustomBackgroundOpacity}
              customTextColor={customTextColor}
              onCustomTextColorChange={setCustomTextColor}
              layout={layout}
              onLayoutChange={setLayout}
              frameEnabled={frameEnabled}
              onFrameToggle={setFrameEnabled}
              applyPreviewToAll={applyPreviewToAll}
              onApplyPreviewToAllChange={setApplyPreviewToAll}
              previewPreset={previewPreset}
              selectedPresets={selectedPresets}
              onToggleExportPreset={toggleExportPreset}
              backgroundStyleId={backgroundStyleId}
              onBackgroundStyleChange={setBackgroundStyleId}
              fontFamilyId={fontFamilyId}
              onFontFamilyChange={setFontFamilyId}
              titleScaleMultiplier={titleScaleMultiplier}
              onTitleScaleMultiplierChange={setTitleScaleMultiplier}
              subtitleScaleMultiplier={subtitleScaleMultiplier}
              onSubtitleScaleMultiplierChange={setSubtitleScaleMultiplier}
              subtitleSpacingMultiplier={subtitleSpacingMultiplier}
              onSubtitleSpacingMultiplierChange={setSubtitleSpacingMultiplier}
              textOffsetX={textOffsetX}
              onTextOffsetXChange={setTextOffsetX}
              textOffsetY={textOffsetY}
              onTextOffsetYChange={setTextOffsetY}
              screenshotScaleMultiplier={screenshotScaleMultiplier}
              onScreenshotScaleMultiplierChange={setScreenshotScaleMultiplier}
              screenshotOffsetX={screenshotOffsetX}
              onScreenshotOffsetXChange={setScreenshotOffsetX}
              screenshotOffsetY={screenshotOffsetY}
              onScreenshotOffsetYChange={setScreenshotOffsetY}
            />
          </div>
          {showSlideNavigation ? (
            <div className="pointer-events-none absolute bottom-5 right-5">
              <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/70 bg-white/90 p-2 shadow-soft backdrop-blur">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 w-10 rounded-full px-0"
                  disabled={!hasPreviousSlide}
                  onClick={() => setActiveSlideIndex(activeSlideIndex - 1)}
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 w-10 rounded-full px-0"
                  disabled={!hasNextSlide}
                  onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
                  aria-label="Next screenshot"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
