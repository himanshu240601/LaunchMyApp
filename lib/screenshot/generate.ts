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
  customBackgroundOpacity?: number;
  customTextColor?: string;
  fontFamilyId?: FontFamilyId;
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

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
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
  if (layout === "image-top-text-bottom") {
    const screenshotTop = 0.11;
    const screenshotHeight = Math.min(template.screenshotSlot.height, 0.56);
    const titleTop = Math.min(screenshotTop + screenshotHeight + 0.05, 0.78);

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

function getSubtitleTop(
  layoutMetrics: ReturnType<typeof getLayoutMetrics>,
  template: ReturnType<typeof getScreenshotTemplate>,
  subtitleSpacingMultiplier: number,
) {
  const defaultOffset = template.subtitle.top - template.title.top;
  const adjustedOffset = defaultOffset * subtitleSpacingMultiplier;

  return Math.min(layoutMetrics.titleTop + adjustedOffset, 0.9);
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
      : backgroundStyle ?? template.background;
  const fontFamilyStack = getFontFamilyStack(controls.fontFamilyId ?? "display");
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

  context.fillStyle = background.accentA;
  context.beginPath();
  context.arc(preset.width * 0.82, preset.height * 0.16, preset.width * 0.18, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = background.accentB;
  context.beginPath();
  context.arc(preset.width * 0.16, preset.height * 0.84, preset.width * 0.16, 0, Math.PI * 2);
  context.fill();

  const image = await loadImage(slide.image);
  const frameAsset =
    frameEnabled && template.frame ? await loadImage(template.frame.assetPath).catch(() => null) : null;

  const paddingX = preset.width * template.spacing.paddingX;
  const layoutMetrics = getLayoutMetrics(layout, preset, template);
  const subtitleTop = getSubtitleTop(layoutMetrics, template, subtitleSpacingMultiplier);
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

  context.fillStyle = customTextColor || template.title.color;
  context.font = `700 ${Math.round(
    preset.width * template.title.fontScale * titleScaleMultiplier,
  )}px ${fontFamilyStack}`;
  context.textAlign = "center";
  context.textBaseline = "top";

  const lines = wrapText(context, slide.title, preset.width * template.title.maxWidth).slice(
    0,
    template.title.maxLines,
  );
  lines.forEach((line, index) => {
    context.fillText(
      line,
      textX,
      preset.height * layoutMetrics.titleTop +
        textYOffset +
        index * preset.width * template.title.lineHeight,
    );
  });

  context.fillStyle = customTextColor || template.subtitle.color;
  context.font = `500 ${Math.round(
    preset.width * template.subtitle.fontScale * subtitleScaleMultiplier,
  )}px ${fontFamilyStack}`;
  const subtitleLines = wrapText(
    context,
    slide.subtitle,
    preset.width * template.subtitle.maxWidth,
  ).slice(0, template.subtitle.maxLines);
  subtitleLines.forEach((line, index) => {
    context.fillText(
      line,
      textX,
      preset.height * subtitleTop +
        textYOffset +
        index * preset.width * template.subtitle.lineHeight,
    );
  });

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
