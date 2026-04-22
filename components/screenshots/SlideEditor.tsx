"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemedDialog } from "@/components/ui/themed-dialog";
import {
  EXPORT_PRESETS,
  type Slide,
} from "@/lib/screenshot/presets";
import {
  BACKGROUND_STYLE_OPTIONS,
  FONT_FAMILY_OPTIONS,
  getScreenshotTemplate,
  LAYOUT_OPTIONS,
  SCREENSHOT_TEMPLATES,
  type BackgroundStyleId,
  type FontFamilyId,
  type LayoutId,
  type PreviewTemplateId,
} from "@/lib/screenshot/templates";
import type { ExportPreset } from "@/lib/screenshot/presets";

type SlideEditorProps = {
  slide: Slide | null;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
  selectedTemplate: PreviewTemplateId;
  onTemplateChange: (template: PreviewTemplateId) => void;
  customBackgroundColor: string;
  onCustomBackgroundColorChange: (value: string) => void;
  customBackgroundAccentColor: string;
  onCustomBackgroundAccentColorChange: (value: string) => void;
  customBackgroundOpacity: number;
  onCustomBackgroundOpacityChange: (value: number) => void;
  customBackgroundAccentOpacity: number;
  onCustomBackgroundAccentOpacityChange: (value: number) => void;
  customTextColor: string;
  onCustomTextColorChange: (value: string) => void;
  layout: LayoutId;
  onLayoutChange: (value: LayoutId) => void;
  frameEnabled: boolean;
  onFrameToggle: (enabled: boolean) => void;
  showDesignControls?: boolean;
  applyPreviewToAll?: boolean;
  onApplyPreviewToAllChange?: (value: boolean) => void;
  previewPreset: ExportPreset;
  selectedPresets: ExportPreset[];
  onToggleExportPreset: (presetId: string) => void;
  backgroundStyleId: BackgroundStyleId;
  onBackgroundStyleChange: (backgroundStyleId: BackgroundStyleId) => void;
  fontFamilyId: FontFamilyId;
  onFontFamilyChange: (fontFamilyId: FontFamilyId) => void;
  titleScaleMultiplier: number;
  onTitleScaleMultiplierChange: (value: number) => void;
  subtitleScaleMultiplier: number;
  onSubtitleScaleMultiplierChange: (value: number) => void;
  subtitleSpacingMultiplier: number;
  onSubtitleSpacingMultiplierChange: (value: number) => void;
  textOffsetX: number;
  onTextOffsetXChange: (value: number) => void;
  textOffsetY: number;
  onTextOffsetYChange: (value: number) => void;
  screenshotScaleMultiplier: number;
  onScreenshotScaleMultiplierChange: (value: number) => void;
  screenshotOffsetX: number;
  onScreenshotOffsetXChange: (value: number) => void;
  screenshotOffsetY: number;
  onScreenshotOffsetYChange: (value: number) => void;
  showTextFields?: boolean;
  panelless?: boolean;
  hideHeader?: boolean;
};

export function SlideEditor({
  slide,
  onTitleChange,
  onSubtitleChange,
  selectedTemplate,
  onTemplateChange,
  customBackgroundColor,
  onCustomBackgroundColorChange,
  customBackgroundAccentColor,
  onCustomBackgroundAccentColorChange,
  customBackgroundOpacity,
  onCustomBackgroundOpacityChange,
  customBackgroundAccentOpacity,
  onCustomBackgroundAccentOpacityChange,
  customTextColor,
  onCustomTextColorChange,
  layout,
  onLayoutChange,
  frameEnabled,
  onFrameToggle,
  showDesignControls = false,
  applyPreviewToAll = true,
  onApplyPreviewToAllChange,
  previewPreset,
  selectedPresets,
  onToggleExportPreset,
  backgroundStyleId,
  onBackgroundStyleChange,
  fontFamilyId,
  onFontFamilyChange,
  titleScaleMultiplier,
  onTitleScaleMultiplierChange,
  subtitleScaleMultiplier,
  onSubtitleScaleMultiplierChange,
  subtitleSpacingMultiplier,
  onSubtitleSpacingMultiplierChange,
  textOffsetX,
  onTextOffsetXChange,
  textOffsetY,
  onTextOffsetYChange,
  screenshotScaleMultiplier,
  onScreenshotScaleMultiplierChange,
  screenshotOffsetX,
  onScreenshotOffsetXChange,
  screenshotOffsetY,
  onScreenshotOffsetYChange,
  showTextFields = true,
  panelless = false,
  hideHeader = false,
}: SlideEditorProps) {
  const [activeDesignTab, setActiveDesignTab] = useState<"settings" | "templates" | "export">("settings");
  const [showApplyAllDialog, setShowApplyAllDialog] = useState(false);
  const titleCharacterCount = slide?.title.length ?? 0;
  const subtitleCharacterCount = slide?.subtitle.length ?? 0;
  const normalizedColorValue = /^#([0-9a-fA-F]{6})$/.test(customBackgroundColor)
    ? customBackgroundColor
    : "#ffffff";
  const normalizedAccentColorValue = /^#([0-9a-fA-F]{6})$/.test(customBackgroundAccentColor)
    ? customBackgroundAccentColor
    : "#ff8a4c";
  const normalizedTextColorValue = /^#([0-9a-fA-F]{6})$/.test(customTextColor)
    ? customTextColor
    : "#20130d";

  const activeTemplate = getScreenshotTemplate(selectedTemplate);
  const baseTitleSizePx = previewPreset.width * activeTemplate.title.fontScale;
  const baseSubtitleSizePx = previewPreset.width * activeTemplate.subtitle.fontScale;
  const titleSizePx = Math.round(
    baseTitleSizePx * titleScaleMultiplier,
  );
  const subtitleSizePx = Math.round(
    baseSubtitleSizePx * subtitleScaleMultiplier,
  );
  const titleSizeOptions = Array.from(
    new Set([56, 64, 72, 80, 88, 96, 104, 112, 120, 128, titleSizePx]),
  ).sort((a, b) => a - b);
  const subtitleSizeOptions = Array.from(
    new Set([24, 28, 32, 36, 40, 44, 48, 52, 56, subtitleSizePx]),
  ).sort((a, b) => a - b);

  const renderColorField = ({
    colorValue,
    opacity,
    onColorChange,
    onOpacityChange,
    inputId,
    fallbackColor,
    showOpacity = false,
  }: {
    colorValue: string;
    opacity: number;
    onColorChange: (value: string) => void;
    onOpacityChange?: (value: number) => void;
    inputId: string;
    fallbackColor: string;
    showOpacity?: boolean;
  }) => (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
      <label
        className="relative block h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-border/80 ring-1 ring-black/5"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(207,197,187,0.35) 25%, transparent 25%, transparent 75%, rgba(207,197,187,0.35) 75%, rgba(207,197,187,0.35)), linear-gradient(45deg, rgba(207,197,187,0.35) 25%, transparent 25%, transparent 75%, rgba(207,197,187,0.35) 75%, rgba(207,197,187,0.35))",
          backgroundPosition: "0 0, 6px 6px",
          backgroundSize: "12px 12px",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
        }}
      >
        <span
          className="absolute inset-0"
          style={{
            backgroundColor: colorValue,
            opacity,
          }}
        />
        <span className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/10 to-transparent" />
        <input
          type="color"
          value={colorValue}
          onChange={(event) => onColorChange(event.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label="Pick color"
        />
      </label>
      <input
        id={inputId}
        type="text"
        value={colorValue}
        onChange={(event) => onColorChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-sm font-medium uppercase tracking-[0.08em] text-foreground outline-none placeholder:text-muted-foreground"
        placeholder={fallbackColor}
        spellCheck={false}
        aria-label="Color hex"
      />
      {showOpacity ? (
        <>
          <div className="h-6 w-px shrink-0 bg-border" />
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={Math.round(opacity * 100)}
            onChange={(event) =>
              onOpacityChange?.(
                Math.min(100, Math.max(0, Number(event.target.value) || 0)) / 100,
              )
            }
            className="w-16 shrink-0 bg-transparent text-right text-sm font-medium text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label="Color opacity"
          />
          <span className="shrink-0 text-sm text-muted-foreground">%</span>
        </>
      ) : null}
    </div>
  );

  const handleApplyPreviewToggle = () => {
    if (!onApplyPreviewToAllChange) {
      return;
    }

    if (!applyPreviewToAll) {
      setShowApplyAllDialog(true);
      return;
    }

    onApplyPreviewToAllChange(!applyPreviewToAll);
  };

  const handleConfirmApplyAll = () => {
    onApplyPreviewToAllChange?.(true);
    setShowApplyAllDialog(false);
  };

  return (
    <div className={panelless ? "flex h-full min-h-0 min-w-0 max-w-full w-full flex-col overflow-hidden" : "flex h-full min-h-0 min-w-0 max-w-full w-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft"}>
      <ThemedDialog
        open={showApplyAllDialog}
        onClose={() => setShowApplyAllDialog(false)}
        title="Match all screens to this design?"
        description="Turning this on will update every screenshot design to match the selected screen."
        footer={(
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full border border-border bg-white text-foreground shadow-none ring-0 hover:bg-white"
              onClick={() => setShowApplyAllDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={handleConfirmApplyAll}
            >
              Apply To All
            </Button>
          </div>
        )}
      />
      {!hideHeader ? (
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {showDesignControls
                ? "Preview Editor"
                : slide
                  ? `Create Screenshot Screen ${slide.order + 1}`
                  : "Create Screenshot Screen"}
            </h3>
            {!showDesignControls ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Write the title and subtitle for this screenshot screen.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
      {slide ? (
        <div
          className={[
            hideHeader ? "min-w-0 space-y-4" : panelless ? "mt-3 min-w-0 space-y-4" : "mt-4 min-w-0 space-y-4",
          ].join(" ")}
        >
          {showTextFields ? (
            <>
              <div className="min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-foreground" htmlFor="slide-title">
                    Title
                  </label>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {titleCharacterCount}/20 chars
                  </span>
                </div>
                <input
                  id="slide-title"
                  value={slide.title}
                  onChange={(event) => onTitleChange(event.target.value)}
                  maxLength={20}
                  className="min-w-0 max-w-full w-full overflow-x-hidden rounded-2xl border border-border bg-white px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Enter screen title"
                />
              </div>
              <div className="min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-foreground" htmlFor="slide-subtitle">
                    Subtitle
                  </label>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {subtitleCharacterCount}/70 chars
                  </span>
                </div>
                <textarea
                  id="slide-subtitle"
                  value={slide.subtitle}
                  onChange={(event) => onSubtitleChange(event.target.value)}
                  maxLength={70}
                  className="min-h-28 min-w-0 max-w-full w-full resize-none overflow-x-hidden rounded-2xl border border-border bg-white px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Add supporting copy"
                />
              </div>
            </>
          ) : null}

          {showDesignControls ? (
            <>
              <div className="rounded-[1.35rem] border border-border/80 bg-background/80 p-1">
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: "settings", label: "Properties" },
                    { id: "templates", label: "Templates" },
                    { id: "export", label: "Settings" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setActiveDesignTab(tab.id as "settings" | "templates" | "export")
                      }
                      className={[
                        "rounded-[1rem] px-3 py-2 text-sm font-medium transition-colors",
                        activeDesignTab === tab.id
                          ? "bg-white text-foreground shadow-[0_8px_20px_rgba(66,36,23,0.08)]"
                          : "text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeDesignTab === "settings" ? (
                <>
                  <div className="space-y-2.5 rounded-[1.5rem] border border-border bg-background/80 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">Apply to all screens</p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {applyPreviewToAll
                            ? "Turn off to edit single screens."
                            : "Turn on to apply same style across screens."}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyPreviewToggle}
                        className={[
                          "relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors",
                          applyPreviewToAll ? "bg-primary" : "bg-border",
                        ].join(" ")}
                        aria-pressed={applyPreviewToAll}
                      >
                        <span
                          className={[
                            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                            applyPreviewToAll ? "translate-x-6" : "translate-x-1",
                          ].join(" ")}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-sm font-medium text-foreground">Mockup Frame</p>
                    <button
                      type="button"
                      onClick={() => onFrameToggle(!frameEnabled)}
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

                  <div className="space-y-2.5">
                    <p className="text-sm font-medium text-foreground">Layout</p>
                    <div className="grid grid-cols-2 gap-2">
                      {LAYOUT_OPTIONS.map((layoutOption) => (
                        <button
                          key={layoutOption.id}
                          type="button"
                          onClick={() => onLayoutChange(layoutOption.id)}
                          className={[
                            "rounded-2xl border px-4 py-2.5 text-center text-sm font-medium transition-colors",
                            layout === layoutOption.id
                              ? "border-primary/30 bg-orange-50/80 text-foreground"
                              : "border-border bg-white text-muted-foreground hover:border-primary/20 hover:text-foreground",
                          ].join(" ")}
                        >
                          {layoutOption.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="space-y-1.5">
                        <span className="text-sm font-medium text-foreground">Scale</span>
                        <input
                          type="number"
                          min="0"
                          max="2"
                          step="0.1"
                          value={screenshotScaleMultiplier}
                          onChange={(event) =>
                            onScreenshotScaleMultiplierChange(
                              Math.min(2, Math.max(0, Number(event.target.value) || 0)),
                            )
                          }
                          className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                        />
                      </label>
                      <label className="space-y-1.5">
                        <span className="text-sm font-medium text-foreground">Position X</span>
                        <input
                          type="number"
                          value={screenshotOffsetX}
                          onChange={(event) =>
                            onScreenshotOffsetXChange(Number(event.target.value) || 0)
                          }
                          className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </label>
                      <label className="space-y-1.5">
                        <span className="text-sm font-medium text-foreground">Position Y</span>
                        <input
                          type="number"
                          value={screenshotOffsetY}
                          onChange={(event) =>
                            onScreenshotOffsetYChange(Number(event.target.value) || 0)
                          }
                          className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-sm font-medium text-foreground">Background</p>
                    {selectedTemplate === "default" ? (
                      <div>
                        {renderColorField({
                          colorValue: normalizedColorValue,
                          opacity: customBackgroundOpacity,
                          onColorChange: onCustomBackgroundColorChange,
                          onOpacityChange: onCustomBackgroundOpacityChange,
                          inputId: "custom-background-hex",
                          fallbackColor: "#FFFFFF",
                          showOpacity: true,
                        })}
                      </div>
                    ) : selectedTemplate === "gradient-center" ? (
                      <div className="space-y-3">
                        <div>
                          <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            Gradient 1
                          </p>
                          {renderColorField({
                            colorValue: normalizedColorValue,
                            opacity: customBackgroundOpacity,
                            onColorChange: onCustomBackgroundColorChange,
                            onOpacityChange: onCustomBackgroundOpacityChange,
                            inputId: "gradient-1-hex",
                            fallbackColor: "#FFD3AD",
                            showOpacity: true,
                          })}
                        </div>
                        <div>
                          <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            Gradient 2
                          </p>
                          {renderColorField({
                            colorValue: normalizedAccentColorValue,
                            opacity: customBackgroundAccentOpacity,
                            onColorChange: onCustomBackgroundAccentColorChange,
                            onOpacityChange: onCustomBackgroundAccentOpacityChange,
                            inputId: "gradient-2-hex",
                            fallbackColor: "#FF8A4C",
                            showOpacity: true,
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {BACKGROUND_STYLE_OPTIONS.map((backgroundOption) => (
                          <button
                            key={backgroundOption.id}
                            type="button"
                            onClick={() => onBackgroundStyleChange(backgroundOption.id)}
                            className={[
                              "rounded-2xl border px-4 py-2.5 text-left text-sm font-medium transition-colors",
                              backgroundStyleId === backgroundOption.id
                                ? "border-primary/30 bg-orange-50/80 text-foreground"
                                : "border-border bg-white text-muted-foreground hover:border-primary/20 hover:text-foreground",
                            ].join(" ")}
                          >
                            {backgroundOption.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-sm font-medium text-foreground">Font</p>
                    <div className="grid grid-cols-3 gap-2">
                      {FONT_FAMILY_OPTIONS.map((fontOption) => (
                        <button
                          key={fontOption.id}
                          type="button"
                          onClick={() => onFontFamilyChange(fontOption.id)}
                          className={[
                            "rounded-2xl border px-3 py-2.5 text-center text-sm font-medium transition-colors",
                            fontFamilyId === fontOption.id
                              ? "border-primary/30 bg-orange-50/80 text-foreground"
                              : "border-border bg-white text-muted-foreground hover:border-primary/20 hover:text-foreground",
                          ].join(" ")}
                        >
                          {fontOption.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-[1.5rem] border border-border bg-background/80 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-sm font-medium text-foreground" htmlFor="title-size">
                          Title Size
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {titleSizePx}px
                        </span>
                      </div>
                      <select
                        id="title-size"
                        value={titleSizePx}
                        onChange={(event) =>
                          onTitleScaleMultiplierChange(Number(event.target.value) / baseTitleSizePx)
                        }
                        className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                      >
                        {titleSizeOptions.map((size) => (
                          <option key={size} value={size}>
                            {size}px
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-sm font-medium text-foreground" htmlFor="subtitle-size">
                          Subtitle Size
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {subtitleSizePx}px
                        </span>
                      </div>
                      <select
                        id="subtitle-size"
                        value={subtitleSizePx}
                        onChange={(event) =>
                          onSubtitleScaleMultiplierChange(
                            Number(event.target.value) / baseSubtitleSizePx,
                          )
                        }
                        className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                      >
                        {subtitleSizeOptions.map((size) => (
                          <option key={size} value={size}>
                            {size}px
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-sm font-medium text-foreground" htmlFor="subtitle-spacing">
                          Title/Subtitle Spacing
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {subtitleSpacingMultiplier.toFixed(2)}x
                        </span>
                      </div>
                      <input
                        id="subtitle-spacing"
                        type="range"
                        min="0.6"
                        max="1.8"
                        step="0.05"
                        value={subtitleSpacingMultiplier}
                        onChange={(event) =>
                          onSubtitleSpacingMultiplierChange(Number(event.target.value))
                        }
                        className="w-full accent-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="space-y-1.5">
                          <span className="text-sm font-medium text-foreground">Position X</span>
                          <input
                            type="number"
                            value={textOffsetX}
                            onChange={(event) => onTextOffsetXChange(Number(event.target.value) || 0)}
                            className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        </label>
                        <label className="space-y-1.5">
                          <span className="text-sm font-medium text-foreground">Position Y</span>
                          <input
                            type="number"
                            value={textOffsetY}
                            onChange={(event) => onTextOffsetYChange(Number(event.target.value) || 0)}
                            className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-sm font-medium text-foreground">Text Color</p>
                    {renderColorField({
                      colorValue: normalizedTextColorValue,
                      opacity: 1,
                      onColorChange: onCustomTextColorChange,
                      inputId: "custom-text-hex",
                      fallbackColor: "#20130D",
                    })}
                  </div>

                </>
              ) : activeDesignTab === "export" ? (
                <div className="space-y-5">
                  <div className="rounded-[1.25rem] border border-border bg-background/80 px-4 py-3">
                    <p className="text-sm leading-6 text-muted-foreground">
                      Select the device resolution to export.
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    <p className="text-sm font-medium text-foreground">Device Frame</p>
                    <div className="grid gap-2">
                      {EXPORT_PRESETS.map((preset) => {
                        const isSelected = selectedPresets.some((item) => item.id === preset.id);

                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => onToggleExportPreset(preset.id)}
                            className={[
                              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors",
                              isSelected
                                ? "border-primary/30 bg-orange-50/80"
                                : "border-border bg-white hover:border-primary/20",
                            ].join(" ")}
                          >
                            <div>
                              <span className="block font-medium text-foreground">{preset.label}</span>
                              <span className="block text-sm text-muted-foreground">
                                {preset.width} × {preset.height}
                              </span>
                            </div>
                            <span
                              className={[
                                "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-white text-transparent",
                              ].join(" ")}
                              aria-hidden="true"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="rounded-[1.25rem] border border-border bg-background/80 px-4 py-3">
                    <p className="text-sm leading-6 text-muted-foreground">
                      Templates always apply across all screens.
                    </p>
                  </div>
                  <p className="text-sm font-medium text-foreground">Templates</p>
                  <div className="grid gap-2">
                    {SCREENSHOT_TEMPLATES.filter((template) => template.id === "default").map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => onTemplateChange(template.id)}
                        className={[
                          "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors",
                          selectedTemplate === template.id
                            ? "border-primary/30 bg-orange-50/80"
                            : "border-border bg-white hover:border-primary/20",
                        ].join(" ")}
                      >
                        <span className="font-medium text-foreground">{template.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 flex min-h-0 flex-1 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-slate-50 px-6 py-8 text-center">
          <div className="relative w-full max-w-[11.5rem]">
            <Image
              src="/placeholder-upload.png"
              alt="Create screenshot placeholder"
              width={768}
              height={768}
              className="mx-auto h-auto w-full object-contain"
              priority
            />
          </div>
          <p className="mt-1.5 max-w-xs text-sm leading-6 text-muted-foreground">
            Upload screenshots from the Screens card to start adding title and subtitle content here.
          </p>
        </div>
      )}
    </div>
  );
}
