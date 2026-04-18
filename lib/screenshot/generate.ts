import type { ExportPreset, Slide } from "@/lib/screenshot/presets";
import {
  DEFAULT_PREVIEW_TEMPLATE_ID,
  getBackgroundStyle,
  getFontFamilyStack,
  getScreenshotTemplate,
  type BackgroundStyleId,
  type FontFamilyId,
  type PreviewTemplateId,
} from "@/lib/screenshot/templates";

export type RenderControls = {
  backgroundStyleId?: BackgroundStyleId;
  fontFamilyId?: FontFamilyId;
  titleScaleMultiplier?: number;
  subtitleScaleMultiplier?: number;
  screenshotScaleMultiplier?: number;
  screenshotOffsetX?: number;
  screenshotOffsetY?: number;
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
  const backgroundStyle = controls.backgroundStyleId
    ? getBackgroundStyle(controls.backgroundStyleId)?.background
    : null;
  const background = backgroundStyle ?? template.background;
  const fontFamilyStack = getFontFamilyStack(controls.fontFamilyId ?? "display");
  const titleScaleMultiplier = controls.titleScaleMultiplier ?? 1.2;
  const subtitleScaleMultiplier = controls.subtitleScaleMultiplier ?? 1.15;
  const screenshotScaleMultiplier = controls.screenshotScaleMultiplier ?? 1;
  const screenshotOffsetX = controls.screenshotOffsetX ?? 0;
  const screenshotOffsetY = controls.screenshotOffsetY ?? 0;

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
  const slotTop = preset.height * template.screenshotSlot.top;
  const slotWidth = preset.width * template.screenshotSlot.width;
  const slotHeight = preset.height * template.screenshotSlot.height;
  const slotX =
    template.screenshotSlot.align === "center"
      ? (preset.width - slotWidth) / 2
      : paddingX;

  context.fillStyle = template.title.color;
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
      preset.width / 2,
      preset.height * template.title.top + index * preset.width * template.title.lineHeight,
    );
  });

  context.fillStyle = template.subtitle.color;
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
      preset.width / 2,
      preset.height * template.subtitle.top +
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
    const frameBoundsWidth = preset.width * template.frame.bounds.width;
    const frameBoundsHeight = preset.height * template.frame.bounds.height;
    const frameBoundsX =
      template.frame.bounds.align === "center"
        ? (preset.width - frameBoundsWidth) / 2
        : paddingX;
    const frameBoundsY = preset.height * template.frame.bounds.top;

    const screenX = frameBoundsX + frameBoundsWidth * template.frame.screenSlot.x;
    const screenY = frameBoundsY + frameBoundsHeight * template.frame.screenSlot.y;
    const screenWidth = frameBoundsWidth * template.frame.screenSlot.width;
    const screenHeight = frameBoundsHeight * template.frame.screenSlot.height;
    const screenRadius = frameBoundsWidth * template.frame.screenSlot.borderRadius;

    const scale =
      Math.min(screenWidth / image.width, screenHeight / image.height) *
      screenshotScaleMultiplier;
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const normalizedOffsetX = screenshotOffsetX / 100;
    const normalizedOffsetY = screenshotOffsetY / 100;
    const drawX =
      screenX + (screenWidth - drawWidth) / 2 + screenWidth * 0.14 * normalizedOffsetX;
    const drawY =
      screenY + (screenHeight - drawHeight) / 2 + screenHeight * 0.14 * normalizedOffsetY;

    context.save();
    context.beginPath();
    context.roundRect(screenX, screenY, screenWidth, screenHeight, screenRadius);
    context.clip();
    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    context.restore();

    context.drawImage(frameAsset, frameBoundsX, frameBoundsY, frameBoundsWidth, frameBoundsHeight);
  }

  context.fillStyle = template.footerColor;
  context.font = `500 ${Math.round(preset.width * 0.022)}px ${fontFamilyStack}`;
  context.fillText(
    "LaunchMyApp Screenshot Generator",
    preset.width / 2,
    preset.height * template.spacing.footerY,
  );
}

export async function generateSlideBlob(
  slide: Slide,
  preset: ExportPreset,
  template: PreviewTemplateId = DEFAULT_PREVIEW_TEMPLATE_ID,
  frameEnabled = true,
  controls?: RenderControls,
) {
  const canvas = document.createElement("canvas");
  await renderSlideToCanvas(canvas, slide, preset, { template, frameEnabled, controls });

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
