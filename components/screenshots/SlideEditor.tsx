"use client";

import {
  type Slide,
} from "@/lib/screenshot/presets";
import {
  BACKGROUND_STYLE_OPTIONS,
  FONT_FAMILY_OPTIONS,
  SCREENSHOT_TEMPLATES,
  type BackgroundStyleId,
  type FontFamilyId,
  type PreviewTemplateId,
} from "@/lib/screenshot/templates";
import type { ExportPreset } from "@/lib/screenshot/presets";

type SlideEditorProps = {
  slide: Slide | null;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
  selectedTemplate: PreviewTemplateId;
  onTemplateChange: (template: PreviewTemplateId) => void;
  frameEnabled: boolean;
  onFrameToggle: (enabled: boolean) => void;
  showDesignControls?: boolean;
  previewPreset: ExportPreset;
  presets: ExportPreset[];
  onPreviewPresetChange: (presetId: string) => void;
  backgroundStyleId: BackgroundStyleId;
  onBackgroundStyleChange: (backgroundStyleId: BackgroundStyleId) => void;
  fontFamilyId: FontFamilyId;
  onFontFamilyChange: (fontFamilyId: FontFamilyId) => void;
  titleScaleMultiplier: number;
  onTitleScaleMultiplierChange: (value: number) => void;
  subtitleScaleMultiplier: number;
  onSubtitleScaleMultiplierChange: (value: number) => void;
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
  showDesignControls = false,
  previewPreset,
  presets,
  onPreviewPresetChange,
  backgroundStyleId,
  onBackgroundStyleChange,
  fontFamilyId,
  onFontFamilyChange,
  titleScaleMultiplier,
  onTitleScaleMultiplierChange,
  subtitleScaleMultiplier,
  onSubtitleScaleMultiplierChange,
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
  return (
    <div className={panelless ? "h-full" : "h-full rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft"}>
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
            hideHeader ? "space-y-4" : panelless ? "mt-3 space-y-4" : "mt-4 space-y-4",
          ].join(" ")}
        >
          {showTextFields ? (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground" htmlFor="slide-title">
                  Title
                </label>
                <input
                  id="slide-title"
                  value={slide.title}
                  onChange={(event) => onTitleChange(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Enter screen title"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground" htmlFor="slide-subtitle">
                  Subtitle
                </label>
                <textarea
                  id="slide-subtitle"
                  value={slide.subtitle}
                  onChange={(event) => onSubtitleChange(event.target.value)}
                  className="min-h-28 w-full rounded-2xl border border-border bg-white px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Add supporting copy"
                />
              </div>
            </>
          ) : null}

          {showDesignControls ? (
            <>
              <div className="space-y-2.5">
                <p className="text-sm font-medium text-foreground">Preview Device</p>
                <div className="grid gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onPreviewPresetChange(preset.id)}
                      className={[
                        "flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-left transition-colors",
                        previewPreset.id === preset.id
                          ? "border-primary/30 bg-orange-50/80"
                          : "border-border bg-white hover:border-primary/20",
                      ].join(" ")}
                    >
                      <span className="font-medium text-foreground">{preset.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {preset.width} x {preset.height}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="grid gap-3 pt-1 sm:grid-cols-3">
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
                <p className="text-sm font-medium text-foreground">Template</p>
                <div className="grid gap-2">
                  {SCREENSHOT_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => onTemplateChange(template.id)}
                      className={[
                        "flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 text-left transition-colors",
                        selectedTemplate === template.id
                          ? "border-primary/30 bg-orange-50/80"
                          : "border-border bg-white hover:border-primary/20",
                      ].join(" ")}
                    >
                      <span className="font-medium text-foreground">{template.label}</span>
                      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        Style
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-sm font-medium text-foreground">Background</p>
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
                      {Math.round(titleScaleMultiplier * 100)}%
                    </span>
                  </div>
                  <input
                    id="title-size"
                    type="range"
                    min="0.9"
                    max="1.6"
                    step="0.05"
                    value={titleScaleMultiplier}
                    onChange={(event) =>
                      onTitleScaleMultiplierChange(Number(event.target.value))
                    }
                    className="w-full accent-[hsl(var(--primary))]"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-sm font-medium text-foreground" htmlFor="subtitle-size">
                      Subtitle Size
                    </label>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(subtitleScaleMultiplier * 100)}%
                    </span>
                  </div>
                  <input
                    id="subtitle-size"
                    type="range"
                    min="0.9"
                    max="1.5"
                    step="0.05"
                    value={subtitleScaleMultiplier}
                    onChange={(event) =>
                      onSubtitleScaleMultiplierChange(Number(event.target.value))
                    }
                    className="w-full accent-[hsl(var(--primary))]"
                  />
                </div>
              </div>

            </>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Upload images to start editing screen text.
        </p>
      )}
    </div>
  );
}
