"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { ScreenshotList } from "@/components/screenshots/ScreenshotList";
import { SlideEditor } from "@/components/screenshots/SlideEditor";
import { Button } from "@/components/ui/button";
import { EXPORT_PRESETS } from "@/lib/screenshot/presets";
import { useCreateFlow } from "@/app/create/create-flow-context";

export default function EditStepPage() {
  const router = useRouter();
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
    previewPreset,
    setPreviewPresetId,
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
  } = useCreateFlow();

  useEffect(() => {
    if (!slides.length) {
      router.replace("/create/upload");
    }
  }, [router, slides.length]);

  if (!slides.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Screen Titles
        </h2>
        <Button onClick={() => router.push("/create/studio")} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          Continue to preview
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="space-y-6">
        <ScreenshotList
          activeSlideIndex={activeSlideIndex}
          slides={slides}
          onSelect={setActiveSlideIndex}
        />
      </aside>

      <div className="space-y-6">
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
        />
      </div>
      </div>
    </section>
  );
}
