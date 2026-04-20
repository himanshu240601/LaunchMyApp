import type { RenderControls } from "@/lib/screenshot/generate";
import type { ExportPreset, ExportQualityId, Slide } from "@/lib/screenshot/presets";
import type { PreviewTemplateId } from "@/lib/screenshot/templates";

export const PREVIEW_SNAPSHOT_STORAGE_KEY = "launchmyapp.preview-snapshot";

export type PreviewSnapshot = {
  createdAt: number;
  exportName: string;
  slides: Slide[];
  preset: ExportPreset;
  selectedPresets: ExportPreset[];
  exportQuality: ExportQualityId;
  template: PreviewTemplateId;
  frameEnabled: boolean;
  controls: RenderControls;
  defaultFrameEnabled?: boolean;
  frameEnabledBySlideId?: Record<string, boolean>;
  defaultControls?: RenderControls;
  controlsBySlideId?: Record<string, Partial<RenderControls>>;
};

async function toDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
        return;
      }

      reject(new Error("Unable to read preview image data"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read preview image data"));
    reader.readAsDataURL(blob);
  });
}

async function normalizeSlideImage(image: string) {
  if (!image.startsWith("blob:")) {
    return image;
  }

  const response = await fetch(image);
  const blob = await response.blob();
  return toDataUrl(blob);
}

export async function savePreviewSnapshot(snapshot: PreviewSnapshot) {
  const slides = await Promise.all(
    snapshot.slides.map(async (slide) => ({
      ...slide,
      image: await normalizeSlideImage(slide.image),
    })),
  );

  localStorage.setItem(
    PREVIEW_SNAPSHOT_STORAGE_KEY,
    JSON.stringify({
      ...snapshot,
      slides,
    }),
  );
}

export function loadPreviewSnapshot(): PreviewSnapshot | null {
  const rawValue = localStorage.getItem(PREVIEW_SNAPSHOT_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as PreviewSnapshot;
  } catch {
    return null;
  }
}

export function clearPreviewSnapshot() {
  localStorage.removeItem(PREVIEW_SNAPSHOT_STORAGE_KEY);
}
