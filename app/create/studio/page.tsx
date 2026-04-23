"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ExportReviewDialog } from "@/components/screenshots/export-review-dialog";
import { sanitizeExportName } from "@/app/create/create-flow-context";
import { PreviewCanvas } from "@/components/screenshots/PreviewCanvas";
import { ScreenshotList } from "@/components/screenshots/ScreenshotList";
import { SlideEditor } from "@/components/screenshots/SlideEditor";
import { useCreateFlow } from "@/app/create/create-flow-context";
import { clearPreviewSnapshot, savePreviewSnapshot } from "@/lib/screenshot/preview-snapshot";
import { fetchCurrentUserProfile, type UserProfile } from "@/lib/supabase/profile";

export default function StudioPage() {
  const router = useRouter();
  const [showExportReviewDialog, setShowExportReviewDialog] = useState(false);
  const [preloadedReviewProfile, setPreloadedReviewProfile] = useState<UserProfile | null>(null);
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
    customBackgroundAccentColor,
    setCustomBackgroundAccentColor,
    customBackgroundOpacity,
    setCustomBackgroundOpacity,
    customBackgroundAccentOpacity,
    setCustomBackgroundAccentOpacity,
    customTextColor,
    setCustomTextColor,
    layout,
    setLayout,
    frameEnabled,
    setFrameEnabled,
    exportName,
    previewPreset,
    exportQuality,
    isExporting,
    renderControls,
    defaultRenderControls,
    slideRenderControlsById,
    defaultFrameEnabled,
    slideFrameEnabledById,
    setExportName,
    toggleExportPreset,
    setApplyPreviewToAll,
    backgroundStyleId,
    setBackgroundStyleId,
    fontFamilyId,
    setFontFamilyId,
    customFontId,
    setCustomFont,
    showTitle,
    setShowTitle,
    showSubtitle,
    setShowSubtitle,
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
    handleExport,
    resetPreviewEditorState,
    resetCreateFlow,
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
      resetPreviewEditorState();
      clearPreviewSnapshot();
      router.replace("/create/edit");
    }
  }, [resetPreviewEditorState, router, slides.length]);

  useEffect(() => {
    if (!slides.length) {
      clearPreviewSnapshot();
      return;
    }

    void savePreviewSnapshot({
      createdAt: Date.now(),
      exportName: sanitizeExportName(exportName),
      slides,
      preset: previewPreset,
      selectedPresets,
      exportQuality,
      template: selectedTemplate,
      frameEnabled,
      controls: renderControls,
      defaultFrameEnabled,
      frameEnabledBySlideId: slideFrameEnabledById,
      defaultControls: defaultRenderControls,
      controlsBySlideId: slideRenderControlsById,
    });
  }, [
    defaultFrameEnabled,
    defaultRenderControls,
    exportName,
    exportQuality,
    frameEnabled,
    previewPreset,
    renderControls,
    selectedPresets,
    selectedTemplate,
    slideFrameEnabledById,
    slideRenderControlsById,
    slides,
  ]);

  if (!slides.length) {
    return null;
  }

  const openPreviewTab = () => {
    window.open("/create/preview", "_blank", "noopener,noreferrer");

    void savePreviewSnapshot({
      createdAt: Date.now(),
      exportName: sanitizeExportName(exportName),
      slides,
      preset: previewPreset,
      selectedPresets,
      exportQuality,
      template: selectedTemplate,
      frameEnabled,
      controls: renderControls,
      defaultFrameEnabled,
      frameEnabledBySlideId: slideFrameEnabledById,
      defaultControls: defaultRenderControls,
      controlsBySlideId: slideRenderControlsById,
    });
  };

  const handleExportClick = async () => {
    const exported = await handleExport();
    if (exported) {
      const profile = await fetchCurrentUserProfile().catch(() => null);
      setPreloadedReviewProfile(profile);
      setShowExportReviewDialog(true);
    }
  };

  const handleReviewGoHome = () => {
    setShowExportReviewDialog(false);
    setPreloadedReviewProfile(null);
    resetCreateFlow();
    router.push("/create/edit");
  };

  return (
    <section className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
      {showExportReviewDialog ? (
        <ExportReviewDialog
          open={showExportReviewDialog}
          onClose={() => {
            setShowExportReviewDialog(false);
            setPreloadedReviewProfile(null);
          }}
          initialProfile={preloadedReviewProfile}
          onGoHome={handleReviewGoHome}
          exportName={sanitizeExportName(exportName)}
        />
      ) : null}
      <div className="relative flex shrink-0 items-center justify-between gap-4 rounded-[1.25rem] border border-white/70 bg-white/85 px-4 py-3">
        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/create/edit"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Back"
            title="Back"
            onClick={() => {
              resetPreviewEditorState();
            }}
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
        <div className="relative z-10 flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="gap-2 rounded-full border border-border bg-white text-foreground shadow-none ring-0 hover:bg-white"
            onClick={openPreviewTab}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            type="button"
            className="gap-2 rounded-full"
            onClick={() => {
              void handleExportClick();
            }}
            disabled={isExporting || Boolean(exportNameError)}
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 items-start gap-3 xl:[grid-template-columns:375px_minmax(0,1fr)_400px]">
        <aside className="min-w-0 max-w-full overflow-hidden grid min-h-0 gap-3 xl:h-full xl:w-[375px] xl:max-w-[375px] xl:min-w-[375px] xl:grid-rows-[minmax(0,1fr)_auto]">
          <div className="min-h-0 min-w-0 overflow-hidden">
            <ScreenshotList
              activeSlideIndex={activeSlideIndex}
              slides={slides}
              onSelect={setActiveSlideIndex}
              onFilesSelected={handleFilesSelected}
              onRemoveSlide={removeSlide}
            />
          </div>
          <div className="min-h-0 min-w-0 overflow-hidden">
            <SlideEditor
              slide={activeSlide}
              onTitleChange={handleTitleChange}
              onSubtitleChange={handleSubtitleChange}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              customBackgroundColor={customBackgroundColor}
              onCustomBackgroundColorChange={setCustomBackgroundColor}
              customBackgroundAccentColor={customBackgroundAccentColor}
              onCustomBackgroundAccentColorChange={setCustomBackgroundAccentColor}
              customBackgroundOpacity={customBackgroundOpacity}
              onCustomBackgroundOpacityChange={setCustomBackgroundOpacity}
              customBackgroundAccentOpacity={customBackgroundAccentOpacity}
              onCustomBackgroundAccentOpacityChange={setCustomBackgroundAccentOpacity}
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
              customFontId={customFontId}
              onCustomFontChange={setCustomFont}
              showTitle={showTitle}
              onShowTitleChange={setShowTitle}
              showSubtitle={showSubtitle}
              onShowSubtitleChange={setShowSubtitle}
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
                />
              </div>
            </div>
          </div>
        </section>

        <aside className="no-scrollbar min-w-0 rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[-18px_0_36px_rgba(65,33,20,0.04)] xl:sticky xl:top-0 xl:h-full xl:w-[400px] xl:overflow-y-auto xl:self-stretch">
          <div className="space-y-5 px-6 py-5">
            <SlideEditor
              slide={activeSlide}
              onTitleChange={handleTitleChange}
              onSubtitleChange={handleSubtitleChange}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              customBackgroundColor={customBackgroundColor}
              onCustomBackgroundColorChange={setCustomBackgroundColor}
              customBackgroundAccentColor={customBackgroundAccentColor}
              onCustomBackgroundAccentColorChange={setCustomBackgroundAccentColor}
              customBackgroundOpacity={customBackgroundOpacity}
              onCustomBackgroundOpacityChange={setCustomBackgroundOpacity}
              customBackgroundAccentOpacity={customBackgroundAccentOpacity}
              onCustomBackgroundAccentOpacityChange={setCustomBackgroundAccentOpacity}
              customTextColor={customTextColor}
              onCustomTextColorChange={setCustomTextColor}
              layout={layout}
              onLayoutChange={setLayout}
              frameEnabled={frameEnabled}
              onFrameToggle={setFrameEnabled}
              showDesignControls
              applyPreviewToAll={applyPreviewToAll}
              onApplyPreviewToAllChange={setApplyPreviewToAll}
              previewPreset={previewPreset}
              selectedPresets={selectedPresets}
              onToggleExportPreset={toggleExportPreset}
              backgroundStyleId={backgroundStyleId}
              onBackgroundStyleChange={setBackgroundStyleId}
              fontFamilyId={fontFamilyId}
              onFontFamilyChange={setFontFamilyId}
              customFontId={customFontId}
              onCustomFontChange={setCustomFont}
              showTitle={showTitle}
              onShowTitleChange={setShowTitle}
              showSubtitle={showSubtitle}
              onShowSubtitleChange={setShowSubtitle}
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
              showTextFields={false}
              panelless
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
