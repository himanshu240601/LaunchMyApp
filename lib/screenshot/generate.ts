import type { ExportPreset, Slide } from "@/lib/screenshot/presets";
import {
  DEFAULT_PREVIEW_TEMPLATE_ID,
  getBackgroundStyle,
  getFontFamilyStack,
  getScreenshotTemplate,
  type BackgroundStyleId,
  type FontFamilyId,
  type LayoutId,
  type PreviewTemplateId,
} from "@/lib/screenshot/templates";

export type RenderControls = {
  backgroundStyleId?: BackgroundStyleId;
  customBackgroundColor?: string;
  customBackgroundAccentColor?: string;
  customBackgroundOpacity?: number;
  customBackgroundAccentOpacity?: number;
  customTextColor?: string;
  fontFamilyId?: FontFamilyId;
  customFontId?: string;
  customFontName?: string;
  customFontDataUrl?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  titleScaleMultiplier?: number;
  subtitleScaleMultiplier?: number;
  subtitleSpacingMultiplier?: number;
  textOffsetX?: number;
  textOffsetY?: number;
  screenshotScaleMultiplier?: number;
  screenshotOffsetX?: number;
  screenshotOffsetY?: number;
  layout?: LayoutId;
};

type RenderSlideOptions = {
  template?: PreviewTemplateId;
  frameEnabled?: boolean;
  controls?: RenderControls;
};

const imageCache = new Map<string, Promise<HTMLImageElement>>();
const customFontCache = new Map<string, Promise<string>>();

function loadImage(src: string) {
  const existing = imageCache.get(src);
  if (existing) {
    return existing;
  }

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

  imageCache.set(src, promise);
  return promise;
}

async function loadCustomFontFamily(dataUrl: string, fontName: string) {
  const cacheKey = `${fontName}:${dataUrl}`;
  const existing = customFontCache.get(cacheKey);
  if (existing) {
    return existing;
  }

  const promise = (async () => {
    const safeName = fontName.trim() || "Uploaded Font";
    const family = `LaunchMyAppCustom-${safeName.replace(/[^a-zA-Z0-9]+/g, "-")}-${cacheKey.length}`;

    if (typeof document === "undefined" || typeof FontFace === "undefined") {
      return `"${safeName}"`;
    }

    const alreadyLoaded = Array.from(document.fonts).some((font) => font.family === family);
    if (!alreadyLoaded) {
      const fontFace = new FontFace(family, `url(${dataUrl})`);
      await fontFace.load();
      document.fonts.add(fontFace);
    }

    await document.fonts.load(`16px "${family}"`);
    return `"${family}"`;
  })();

  customFontCache.set(cacheKey, promise);
  return promise;
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = words[0] ?? "";

  for (const word of words.slice(1)) {
    const candidate = `${current} ${word}`;
    if (context.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function hexToRgba(hex: string, opacity: number) {
  const normalized = hex.replace("#", "");
  const compactHex = /^[0-9a-fA-F]{3}$/.test(normalized)
    ? normalized
        .split("")
        .map((char) => char + char)
        .join("")
    : normalized;
  const safeHex = /^[0-9a-fA-F]{6}$/.test(compactHex) ? compactHex : "ffffff";

  const red = Number.parseInt(safeHex.slice(0, 2), 16);
  const green = Number.parseInt(safeHex.slice(2, 4), 16);
  const blue = Number.parseInt(safeHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${Math.min(1, Math.max(0, opacity))})`;
}

function getLayoutMetrics(
  layout: LayoutId,
  preset: ExportPreset,
  template: ReturnType<typeof getScreenshotTemplate>,
) {
  if (layout === "no-text") {
    const screenshotTop = 0.11;
    const screenshotHeight = 0.78;

    return {
      titleTop: template.title.top,
      slotTop: preset.height * screenshotTop,
      slotHeight: preset.height * screenshotHeight,
    };
  }

  if (layout === "image-top-text-bottom") {
    const screenshotTop = 0.11;
    const screenshotHeight = Math.min(template.screenshotSlot.height, 0.56);
    const defaultLayoutGap = template.screenshotSlot.top - template.subtitle.top;
    const titleTop = Math.min(screenshotTop + screenshotHeight + defaultLayoutGap, 0.78);

    return {
      titleTop,
      slotTop: preset.height * screenshotTop,
      slotHeight: preset.height * screenshotHeight,
    };
  }

  return {
    titleTop: template.title.top,
    slotTop: preset.height * template.screenshotSlot.top,
    slotHeight: preset.height * template.screenshotSlot.height,
  };
}

export async function renderSlideToCanvas(
  canvas: HTMLCanvasElement,
  slide: Slide,
  preset: ExportPreset,
  options: RenderSlideOptions = {},
) {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas context unavailable");
  }

  const template = getScreenshotTemplate(options.template ?? DEFAULT_PREVIEW_TEMPLATE_ID);
  const frameEnabled = options.frameEnabled ?? true;
  const controls = options.controls ?? {};
  const customBackgroundOpacity = controls.customBackgroundOpacity ?? 1;
  const customBackgroundAccentOpacity = controls.customBackgroundAccentOpacity ?? 1;
  const backgroundStyle = controls.backgroundStyleId
    ? getBackgroundStyle(controls.backgroundStyleId)?.background
    : null;
  const background =
    controls.customBackgroundColor && template.id === "default"
      ? {
          kind: "soft-orbs" as const,
          base: hexToRgba(controls.customBackgroundColor, customBackgroundOpacity),
          accentA: "rgba(255, 255, 255, 0)",
          accentB: "rgba(255, 255, 255, 0)",
        }
      : controls.customBackgroundColor &&
          template.id === "gradient-center"
        ? {
            kind: "linear-sunrise" as const,
            base: template.background.base,
            accentA: hexToRgba(controls.customBackgroundColor, customBackgroundOpacity),
            accentB: hexToRgba(
              controls.customBackgroundAccentColor ?? "#ff8a4c",
              customBackgroundAccentOpacity,
            ),
          }
      : backgroundStyle ?? template.background;
  const fontFamilyStack =
    controls.fontFamilyId === "custom-upload" &&
    controls.customFontDataUrl &&
    controls.customFontName
      ? await loadCustomFontFamily(controls.customFontDataUrl, controls.customFontName)
      : getFontFamilyStack(controls.fontFamilyId ?? "display");
  const titleScaleMultiplier = controls.titleScaleMultiplier ?? 1.2;
  const subtitleScaleMultiplier = controls.subtitleScaleMultiplier ?? 1.15;
  const subtitleSpacingMultiplier = controls.subtitleSpacingMultiplier ?? 1;
  const textOffsetX = controls.textOffsetX ?? 0;
  const textOffsetY = controls.textOffsetY ?? 0;
  const screenshotScaleMultiplier = controls.screenshotScaleMultiplier ?? 1;
  const screenshotOffsetX = controls.screenshotOffsetX ?? 0;
  const screenshotOffsetY = controls.screenshotOffsetY ?? 0;
  const customTextColor = controls.customTextColor;
  const layout = controls.layout ?? "text-top-image-bottom";
  const showTitle = controls.showTitle ?? true;
  const showSubtitle = controls.showSubtitle ?? true;

  canvas.width = preset.width;
  canvas.height = preset.height;

  context.fillStyle = background.base;
  context.fillRect(0, 0, preset.width, preset.height);

  if (background.kind === "radial-center") {
    const gradient = context.createRadialGradient(
      preset.width / 2,
      preset.height * 0.38,
      preset.width * 0.08,
      preset.width / 2,
      preset.height * 0.38,
      preset.width * 0.62,
    );
    gradient.addColorStop(0, background.accentA);
    gradient.addColorStop(1, background.accentB);
    context.fillStyle = gradient;
    context.fillRect(0, 0, preset.width, preset.height);
  }

  if (background.kind === "linear-sunrise") {
    const gradient = context.createLinearGradient(
      0,
      0,
      preset.width,
      preset.height,
    );
    gradient.addColorStop(0, background.accentA);
    gradient.addColorStop(1, background.accentB);
    context.fillStyle = gradient;
    context.fillRect(0, 0, preset.width, preset.height);

    const glow = context.createRadialGradient(
      preset.width * 0.18,
      preset.height * 0.14,
      preset.width * 0.02,
      preset.width * 0.18,
      preset.height * 0.14,
      preset.width * 0.52,
    );
    glow.addColorStop(0, "rgba(255,255,255,0.22)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, preset.width, preset.height);
  }

  if (background.kind !== "linear-sunrise") {
    context.fillStyle = background.accentA;
    context.beginPath();
    context.arc(preset.width * 0.82, preset.height * 0.16, preset.width * 0.18, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = background.accentB;
    context.beginPath();
    context.arc(preset.width * 0.16, preset.height * 0.84, preset.width * 0.16, 0, Math.PI * 2);
    context.fill();
  }

  const image = await loadImage(slide.image);
  const frameAsset =
    frameEnabled && template.frame ? await loadImage(template.frame.assetPath).catch(() => null) : null;

  const paddingX = preset.width * template.spacing.paddingX;
  const layoutMetrics = getLayoutMetrics(layout, preset, template);
  const normalizedTextOffsetX = Math.max(-1, Math.min(1, textOffsetX / 100));
  const normalizedTextOffsetY = Math.max(-1, Math.min(1, textOffsetY / 100));
  const textX = preset.width / 2 + preset.width * 0.18 * normalizedTextOffsetX;
  const textYOffset = preset.height * 0.12 * normalizedTextOffsetY;
  const slotTop = layoutMetrics.slotTop;
  const slotWidth = preset.width * template.screenshotSlot.width;
  const slotHeight = layoutMetrics.slotHeight;
  const slotX =
    template.screenshotSlot.align === "center"
      ? (preset.width - slotWidth) / 2
      : paddingX;

  const titleFontSizePx = Math.round(
    preset.width * template.title.fontScale * titleScaleMultiplier,
  );
  const subtitleFontSizePx = Math.round(
    preset.width * template.subtitle.fontScale * subtitleScaleMultiplier,
  );
  const titleLineHeightPx = preset.width * template.title.lineHeight;
  const subtitleLineHeightPx = preset.width * template.subtitle.lineHeight;
  const titleTopPx = preset.height * layoutMetrics.titleTop + textYOffset;
  const titleToSubtitleGapPx = Math.max(
    16,
    preset.height * (template.subtitle.top - template.title.top) -
      titleFontSizePx -
      (template.title.maxLines - 1) * titleLineHeightPx,
  ) * subtitleSpacingMultiplier;

  context.fillStyle = customTextColor || template.title.color;
  context.font = `700 ${titleFontSizePx}px ${fontFamilyStack}`;
  context.textAlign = "center";
  context.textBaseline = "top";

  const lines = wrapText(context, slide.title, preset.width * template.title.maxWidth).slice(
    0,
    template.title.maxLines,
  );
  if (showTitle && layout !== "no-text") {
    lines.forEach((line, index) => {
      context.fillText(
        line,
        textX,
        titleTopPx + index * titleLineHeightPx,
      );
    });
  }

  context.fillStyle = customTextColor || template.subtitle.color;
  context.font = `500 ${subtitleFontSizePx}px ${fontFamilyStack}`;
  const subtitleLines = wrapText(
    context,
    slide.subtitle,
    preset.width * template.subtitle.maxWidth,
  ).slice(0, template.subtitle.maxLines);
  const titleLineCount = lines.length || 1;
  const subtitleAnchorY =
    titleTopPx +
    titleFontSizePx +
    (titleLineCount - 1) * titleLineHeightPx +
    (showTitle && layout !== "no-text" ? titleToSubtitleGapPx : 0);
  const subtitleTopPx =
    showTitle && layout !== "no-text"
      ? subtitleAnchorY
      : preset.height * template.subtitle.top + textYOffset;

  if (showSubtitle && layout !== "no-text") {
    subtitleLines.forEach((line, index) => {
      context.fillText(
        line,
        textX,
        subtitleTopPx + index * subtitleLineHeightPx,
      );
    });
  }

  if (!frameAsset || !template.frame) {
    const scale =
      Math.min(slotWidth / image.width, slotHeight / image.height) * screenshotScaleMultiplier;
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const normalizedOffsetX = screenshotOffsetX / 100;
    const normalizedOffsetY = screenshotOffsetY / 100;
    const drawX = slotX + (slotWidth - drawWidth) / 2 + slotWidth * 0.18 * normalizedOffsetX;
    const drawY = slotTop + (slotHeight - drawHeight) / 2 + slotHeight * 0.18 * normalizedOffsetY;
    const imageRadius = Math.min(preset.width * 0.03, drawWidth * 0.08, drawHeight * 0.08);

    context.save();
    context.beginPath();
    context.roundRect(drawX, drawY, drawWidth, drawHeight, imageRadius);
    context.clip();
    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    context.restore();
  } else {
    const targetFill = 0.97;
    const screenScale =
      Math.min(slotWidth / image.width, slotHeight / image.height) * targetFill;
    const desiredScreenWidth = image.width * screenScale;
    const desiredScreenHeight = image.height * screenScale;

    const frameBoundsWidth =
      (desiredScreenWidth / template.frame.screenSlot.width) * screenshotScaleMultiplier;
    const frameBoundsHeight =
      (desiredScreenHeight / template.frame.screenSlot.height) * screenshotScaleMultiplier;

    const normalizedOffsetX = Math.max(-1, Math.min(1, screenshotOffsetX / 100));
    const normalizedOffsetY = Math.max(-1, Math.min(1, screenshotOffsetY / 100));
    const centeredFrameBoundsX = slotX + (slotWidth - frameBoundsWidth) / 2;
    const centeredFrameBoundsY = slotTop + (slotHeight - frameBoundsHeight) / 2;

    const frameBoundsX =
      template.frame.bounds.align === "center"
        ? centeredFrameBoundsX + (slotWidth * 0.18 * normalizedOffsetX)
        : paddingX;
    const frameBoundsY = centeredFrameBoundsY + (slotHeight * 0.18 * normalizedOffsetY);

    const screenX = frameBoundsX + frameBoundsWidth * template.frame.screenSlot.x;
    const screenY = frameBoundsY + frameBoundsHeight * template.frame.screenSlot.y;
    const screenWidth = frameBoundsWidth * template.frame.screenSlot.width;
    const screenHeight = frameBoundsHeight * template.frame.screenSlot.height;
    const screenRadius = frameBoundsWidth * template.frame.screenSlot.borderRadius;

    const scale = Math.min(screenWidth / image.width, screenHeight / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const drawX = screenX + (screenWidth - drawWidth) / 2;
    const drawY = screenY + (screenHeight - drawHeight) / 2;

    context.save();
    context.beginPath();
    context.roundRect(screenX, screenY, screenWidth, screenHeight, screenRadius);
    context.clip();
    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    context.restore();

    context.drawImage(frameAsset, frameBoundsX, frameBoundsY, frameBoundsWidth, frameBoundsHeight);
  }

}

export async function generateSlideBlob(
  slide: Slide,
  preset: ExportPreset,
  template: PreviewTemplateId = DEFAULT_PREVIEW_TEMPLATE_ID,
  frameEnabled = true,
  controls?: RenderControls,
  qualityScale = 1,
) {
  const canvas = document.createElement("canvas");
  await renderSlideToCanvas(
    canvas,
    slide,
    {
      ...preset,
      width: Math.round(preset.width * qualityScale),
      height: Math.round(preset.height * qualityScale),
    },
    { template, frameEnabled, controls },
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Unable to export screenshot"));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}
