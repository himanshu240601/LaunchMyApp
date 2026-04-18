"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  generateSlideBlob,
  type RenderControls,
} from "@/lib/screenshot/generate";
import {
  AUTO_SUBTITLES,
  AUTO_TITLES,
  EXPORT_PRESETS,
  type ExportPreset,
  type Slide,
} from "@/lib/screenshot/presets";
import {
  type BackgroundStyleId,
  DEFAULT_PREVIEW_TEMPLATE_ID,
  type FontFamilyId,
  type PreviewTemplateId,
} from "@/lib/screenshot/templates";
import { downloadZip } from "@/lib/screenshot/zip";

const INVALID_EXPORT_NAME_PATTERN = /[<>:"/\\|?*\u0000-\u001F]/g;

export function sanitizeExportName(value: string) {
  const cleaned = value.replace(INVALID_EXPORT_NAME_PATTERN, "").trim();
  return cleaned || "Untitled_1";
}

type CreateFlowContextValue = {
  slides: Slide[];
  activeSlideIndex: number;
  activeSlide: Slide | null;
  selectedPresets: ExportPreset[];
  selectedTemplate: PreviewTemplateId;
  backgroundStyleId: BackgroundStyleId;
  fontFamilyId: FontFamilyId;
  titleScaleMultiplier: number;
  subtitleScaleMultiplier: number;
  screenshotScaleMultiplier: number;
  screenshotOffsetX: number;
  screenshotOffsetY: number;
  exportName: string;
  previewPreset: ExportPreset;
  frameEnabled: boolean;
  isExporting: boolean;
  renderControls: RenderControls;
  handleFilesSelected: (files: File[]) => void;
  setActiveSlideIndex: (index: number) => void;
  handleTitleChange: (title: string) => void;
  handleSubtitleChange: (subtitle: string) => void;
  setSelectedTemplate: (template: PreviewTemplateId) => void;
  setBackgroundStyleId: (backgroundStyleId: BackgroundStyleId) => void;
  setFontFamilyId: (fontFamilyId: FontFamilyId) => void;
  setTitleScaleMultiplier: (value: number) => void;
  setSubtitleScaleMultiplier: (value: number) => void;
  setScreenshotScaleMultiplier: (value: number) => void;
  setScreenshotOffsetX: (value: number) => void;
  setScreenshotOffsetY: (value: number) => void;
  setExportName: (value: string) => void;
  setPreviewPresetId: (presetId: string) => void;
  setFrameEnabled: (enabled: boolean) => void;
  handlePresetToggle: (presetId: string) => void;
  removeSlide: (slideId: string) => void;
  handleExport: () => Promise<void>;
};

const CreateFlowContext = createContext<CreateFlowContextValue | null>(null);

export function CreateFlowProvider({ children }: { children: ReactNode }) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedPresets, setSelectedPresets] = useState<ExportPreset[]>(EXPORT_PRESETS);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PreviewTemplateId>(DEFAULT_PREVIEW_TEMPLATE_ID);
  const [backgroundStyleId, setBackgroundStyleId] =
    useState<BackgroundStyleId>("template-default");
  const [fontFamilyId, setFontFamilyId] = useState<FontFamilyId>("display");
  const [titleScaleMultiplier, setTitleScaleMultiplier] = useState(1.22);
  const [subtitleScaleMultiplier, setSubtitleScaleMultiplier] = useState(1.15);
  const [screenshotScaleMultiplier, setScreenshotScaleMultiplier] = useState(1);
  const [screenshotOffsetX, setScreenshotOffsetX] = useState(0);
  const [screenshotOffsetY, setScreenshotOffsetY] = useState(0);
  const [exportName, setExportName] = useState("Untitled_1");
  const [previewPresetId, setPreviewPresetId] = useState(EXPORT_PRESETS[0].id);
  const [frameEnabled, setFrameEnabled] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const urlsRef = objectUrlsRef;

    return () => {
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const activeSlide = slides[activeSlideIndex] ?? null;
  const activePresets = useMemo(() => selectedPresets, [selectedPresets]);
  const previewPreset =
    EXPORT_PRESETS.find((preset) => preset.id === previewPresetId) ?? EXPORT_PRESETS[0];
  const renderControls = useMemo<RenderControls>(
    () => ({
      backgroundStyleId,
      fontFamilyId,
      titleScaleMultiplier,
      subtitleScaleMultiplier,
      screenshotScaleMultiplier,
      screenshotOffsetX,
      screenshotOffsetY,
    }),
    [
      backgroundStyleId,
      fontFamilyId,
      screenshotScaleMultiplier,
      screenshotOffsetX,
      screenshotOffsetY,
      subtitleScaleMultiplier,
      titleScaleMultiplier,
    ],
  );

  const handleFilesSelected = useCallback((files: File[]) => {
    const timestamp = Date.now();

    setSlides((currentSlides) => {
      const startIndex = currentSlides.length;
      const nextSlides = files.map((file, index) => {
        const objectUrl = URL.createObjectURL(file);
        objectUrlsRef.current.push(objectUrl);

        const order = startIndex + index;

        return {
          id: `${file.name}-${order}-${timestamp}`,
          image: objectUrl,
          title: AUTO_TITLES[order % AUTO_TITLES.length],
          subtitle: AUTO_SUBTITLES[order % AUTO_SUBTITLES.length],
          order,
          enabled: true,
        };
      });

      return [...currentSlides, ...nextSlides];
    });
  }, []);

  const handleTitleChange = useCallback((title: string) => {
    setSlides((currentSlides) =>
      currentSlides.map((slide, index) =>
        index === activeSlideIndex ? { ...slide, title } : slide,
      ),
    );
  }, [activeSlideIndex]);

  const handleSubtitleChange = useCallback((subtitle: string) => {
    setSlides((currentSlides) =>
      currentSlides.map((slide, index) =>
        index === activeSlideIndex ? { ...slide, subtitle } : slide,
      ),
    );
  }, [activeSlideIndex]);

  const handlePresetToggle = useCallback((presetId: string) => {
    setSelectedPresets((current) =>
      current.some((preset) => preset.id === presetId)
        ? current.filter((preset) => preset.id !== presetId)
        : [...current, EXPORT_PRESETS.find((preset) => preset.id === presetId)!],
    );
  }, []);

  const removeSlide = useCallback((slideId: string) => {
    setSlides((currentSlides) => {
      const slideToRemove = currentSlides.find((slide) => slide.id === slideId);

      if (slideToRemove) {
        URL.revokeObjectURL(slideToRemove.image);
        objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== slideToRemove.image);
      }

      const nextSlides = currentSlides
        .filter((slide) => slide.id !== slideId)
        .map((slide, index) => ({
          ...slide,
          order: index,
        }));

      setActiveSlideIndex((currentIndex) => {
        if (!nextSlides.length) {
          return 0;
        }

        if (currentIndex >= nextSlides.length) {
          return nextSlides.length - 1;
        }

        return currentIndex;
      });

      return nextSlides;
    });
  }, []);

  const handleExport = useCallback(async () => {
    const exportableSlides = slides.filter((slide) => slide.enabled);

    if (!exportableSlides.length || !activePresets.length) {
      return;
    }

    setIsExporting(true);
    try {
      const files = [];

      for (const slide of exportableSlides) {
        for (const preset of activePresets) {
          const blob = await generateSlideBlob(
            slide,
            preset,
            selectedTemplate,
            frameEnabled,
            renderControls,
          );
          files.push({
            name: `${slide.order + 1}_${preset.id}.png`,
            blob,
          });
        }
      }

      await downloadZip(files, `${sanitizeExportName(exportName)}.zip`);
    } finally {
      setIsExporting(false);
    }
  }, [activePresets, exportName, frameEnabled, renderControls, selectedTemplate, slides]);

  const value = useMemo<CreateFlowContextValue>(
    () => ({
      slides,
      activeSlideIndex,
      activeSlide,
      selectedPresets,
      selectedTemplate,
      backgroundStyleId,
      fontFamilyId,
      titleScaleMultiplier,
      subtitleScaleMultiplier,
      screenshotScaleMultiplier,
      screenshotOffsetX,
      screenshotOffsetY,
      exportName,
      previewPreset,
      frameEnabled,
      isExporting,
      renderControls,
      handleFilesSelected,
      setActiveSlideIndex,
      handleTitleChange,
      handleSubtitleChange,
      setSelectedTemplate,
      setBackgroundStyleId,
      setFontFamilyId,
      setTitleScaleMultiplier,
      setSubtitleScaleMultiplier,
      setScreenshotScaleMultiplier,
      setScreenshotOffsetX,
      setScreenshotOffsetY,
      setExportName,
      setPreviewPresetId,
      setFrameEnabled,
      handlePresetToggle,
      removeSlide,
      handleExport,
    }),
    [
      activeSlide,
      activeSlideIndex,
      backgroundStyleId,
      fontFamilyId,
      frameEnabled,
      isExporting,
      previewPreset,
      renderControls,
      selectedPresets,
      selectedTemplate,
      slides,
      screenshotOffsetX,
      screenshotOffsetY,
      screenshotScaleMultiplier,
      subtitleScaleMultiplier,
      titleScaleMultiplier,
      exportName,
      handleExport,
      handleFilesSelected,
      handlePresetToggle,
      handleSubtitleChange,
      handleTitleChange,
      removeSlide,
    ],
  );

  return <CreateFlowContext.Provider value={value}>{children}</CreateFlowContext.Provider>;
}

export function useCreateFlow() {
  const context = useContext(CreateFlowContext);

  if (!context) {
    throw new Error("useCreateFlow must be used within CreateFlowProvider");
  }

  return context;
}
