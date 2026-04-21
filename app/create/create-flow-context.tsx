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
  EXPORT_QUALITY_OPTIONS,
  EXPORT_PRESETS,
  type ExportQualityId,
  type ExportPreset,
  type Slide,
} from "@/lib/screenshot/presets";
import {
  type BackgroundStyleId,
  DEFAULT_PREVIEW_TEMPLATE_ID,
  type FontFamilyId,
  type LayoutId,
  type PreviewTemplateId,
} from "@/lib/screenshot/templates";
import { clearPreviewSnapshot } from "@/lib/screenshot/preview-snapshot";
import { downloadZip } from "@/lib/screenshot/zip";

const INVALID_EXPORT_NAME_PATTERN = /[<>:"/\\|?*\u0000-\u001F]/g;

export function sanitizeExportName(value: string) {
  const cleaned = value.replace(INVALID_EXPORT_NAME_PATTERN, "").trim();
  return cleaned || "Untitled_1";
}

const DEFAULT_TITLE_SIZE_PX = 128;
const DEFAULT_SUBTITLE_SIZE_PX = 48;
const DEFAULT_TITLE_BASE_SCALE = 1290 * 0.07;
const DEFAULT_SUBTITLE_BASE_SCALE = 1290 * 0.03;
const MAX_SCREENSHOTS = 4;
const MAX_TITLE_CHARACTERS = 20;
const MAX_SUBTITLE_CHARACTERS = 70;

function clampTitleCharacters(value: string, maxCharacters: number) {
  return value.slice(0, maxCharacters);
}

function clampSubtitleCharacters(value: string, maxCharacters: number) {
  return value.slice(0, maxCharacters);
}

const DEFAULT_RENDER_CONTROLS: RenderControls = {
  backgroundStyleId: "template-default",
  customBackgroundColor: "#ffffff",
  customBackgroundOpacity: 1,
  customTextColor: "#20130d",
  fontFamilyId: "display",
  layout: "text-top-image-bottom",
  titleScaleMultiplier: DEFAULT_TITLE_SIZE_PX / DEFAULT_TITLE_BASE_SCALE,
  subtitleScaleMultiplier: DEFAULT_SUBTITLE_SIZE_PX / DEFAULT_SUBTITLE_BASE_SCALE,
  subtitleSpacingMultiplier: 1,
  textOffsetX: 0,
  textOffsetY: 0,
  screenshotScaleMultiplier: 1,
  screenshotOffsetX: 0,
  screenshotOffsetY: 0,
};

type CreateFlowContextValue = {
  slides: Slide[];
  activeSlideIndex: number;
  activeSlide: Slide | null;
  selectedPresets: ExportPreset[];
  selectedTemplate: PreviewTemplateId;
  backgroundStyleId: BackgroundStyleId;
  customBackgroundColor: string;
  customBackgroundOpacity: number;
  customTextColor: string;
  fontFamilyId: FontFamilyId;
  layout: LayoutId;
  titleScaleMultiplier: number;
  subtitleScaleMultiplier: number;
  subtitleSpacingMultiplier: number;
  textOffsetX: number;
  textOffsetY: number;
  screenshotScaleMultiplier: number;
  screenshotOffsetX: number;
  screenshotOffsetY: number;
  exportName: string;
  previewPreset: ExportPreset;
  exportQuality: ExportQualityId;
  frameEnabled: boolean;
  applyPreviewToAll: boolean;
  previewTargetSlideIds: string[];
  isExporting: boolean;
  renderControls: RenderControls;
  defaultRenderControls: RenderControls;
  slideRenderControlsById: Record<string, Partial<RenderControls>>;
  defaultFrameEnabled: boolean;
  slideFrameEnabledById: Record<string, boolean>;
  handleFilesSelected: (files: File[]) => void;
  setActiveSlideIndex: (index: number) => void;
  handleTitleChange: (title: string) => void;
  handleSubtitleChange: (subtitle: string) => void;
  setSelectedTemplate: (template: PreviewTemplateId) => void;
  setBackgroundStyleId: (backgroundStyleId: BackgroundStyleId) => void;
  setCustomBackgroundColor: (value: string) => void;
  setCustomBackgroundOpacity: (value: number) => void;
  setCustomTextColor: (value: string) => void;
  setFontFamilyId: (fontFamilyId: FontFamilyId) => void;
  setLayout: (layout: LayoutId) => void;
  setTitleScaleMultiplier: (value: number) => void;
  setSubtitleScaleMultiplier: (value: number) => void;
  setSubtitleSpacingMultiplier: (value: number) => void;
  setTextOffsetX: (value: number) => void;
  setTextOffsetY: (value: number) => void;
  setScreenshotScaleMultiplier: (value: number) => void;
  setScreenshotOffsetX: (value: number) => void;
  setScreenshotOffsetY: (value: number) => void;
  setExportName: (value: string) => void;
  setPreviewPresetId: (presetId: string) => void;
  toggleExportPreset: (presetId: string) => void;
  setExportQuality: (value: ExportQualityId) => void;
  setApplyPreviewToAll: (value: boolean) => void;
  togglePreviewTargetSlideId: (slideId: string) => void;
  setFrameEnabled: (enabled: boolean) => void;
  removeSlide: (slideId: string) => void;
  handleExport: () => Promise<boolean>;
  resetCreateFlow: () => void;
};

const CreateFlowContext = createContext<CreateFlowContextValue | null>(null);

export function CreateFlowProvider({ children }: { children: ReactNode }) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedPresets, setSelectedPresets] = useState<ExportPreset[]>(EXPORT_PRESETS);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PreviewTemplateId>(DEFAULT_PREVIEW_TEMPLATE_ID);
  const [globalRenderControls, setGlobalRenderControls] =
    useState<RenderControls>(DEFAULT_RENDER_CONTROLS);
  const [slideRenderControlsById, setSlideRenderControlsById] = useState<
    Record<string, Partial<RenderControls>>
  >({});
  const [exportName, setExportName] = useState("Untitled_1");
  const [previewPresetId, setPreviewPresetId] = useState(EXPORT_PRESETS[0].id);
  const [exportQuality, setExportQuality] = useState<ExportQualityId>("default");
  const [defaultFrameEnabled, setDefaultFrameEnabled] = useState(true);
  const [slideFrameEnabledById, setSlideFrameEnabledById] = useState<Record<string, boolean>>({});
  const [applyPreviewToAll, setApplyPreviewToAllState] = useState(true);
  const [previewTargetSlideIds, setPreviewTargetSlideIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const urlsRef = objectUrlsRef;

    return () => {
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const activeSlide = slides[activeSlideIndex] ?? null;
  const previewPreset =
    EXPORT_PRESETS.find((preset) => preset.id === previewPresetId) ?? EXPORT_PRESETS[0];
  const getRenderControlsForSlide = useCallback((slideId?: string | null) => ({
    ...DEFAULT_RENDER_CONTROLS,
    ...globalRenderControls,
    ...(slideId ? slideRenderControlsById[slideId] ?? {} : {}),
  }), [globalRenderControls, slideRenderControlsById]);

  const getFrameEnabledForSlide = useCallback((slideId?: string | null) => (
    slideId && Object.prototype.hasOwnProperty.call(slideFrameEnabledById, slideId)
      ? slideFrameEnabledById[slideId]
      : defaultFrameEnabled
  ), [defaultFrameEnabled, slideFrameEnabledById]);

  const setApplyPreviewToAll = useCallback((value: boolean) => {
    setApplyPreviewToAllState(value);

    if (value) {
      if (activeSlide) {
        setGlobalRenderControls(getRenderControlsForSlide(activeSlide.id));
        setDefaultFrameEnabled(getFrameEnabledForSlide(activeSlide.id));
      }
      setSlideRenderControlsById({});
      setSlideFrameEnabledById({});
      return;
    }

    setPreviewTargetSlideIds((currentIds) => {
      if (currentIds.length) {
        return currentIds;
      }

      return activeSlide ? [activeSlide.id] : [];
    });
  }, [activeSlide, getFrameEnabledForSlide, getRenderControlsForSlide]);

  const renderControls = useMemo<RenderControls>(
    () => getRenderControlsForSlide(activeSlide?.id),
    [activeSlide?.id, getRenderControlsForSlide],
  );
  const resolvedPreviewTargetSlideIds = useMemo(() => {
    if (!applyPreviewToAll) {
      return activeSlide ? [activeSlide.id] : [];
    }

    return previewTargetSlideIds.filter((slideId) =>
      slides.some((slide) => slide.id === slideId),
    );
  }, [activeSlide, applyPreviewToAll, previewTargetSlideIds, slides]);
  const frameEnabled = useMemo(
    () => getFrameEnabledForSlide(activeSlide?.id),
    [activeSlide?.id, getFrameEnabledForSlide],
  );
  const backgroundStyleId = renderControls.backgroundStyleId ?? DEFAULT_RENDER_CONTROLS.backgroundStyleId!;
  const customBackgroundColor =
    renderControls.customBackgroundColor ?? DEFAULT_RENDER_CONTROLS.customBackgroundColor!;
  const customBackgroundOpacity =
    renderControls.customBackgroundOpacity ?? DEFAULT_RENDER_CONTROLS.customBackgroundOpacity!;
  const customTextColor = renderControls.customTextColor ?? DEFAULT_RENDER_CONTROLS.customTextColor!;
  const fontFamilyId = renderControls.fontFamilyId ?? DEFAULT_RENDER_CONTROLS.fontFamilyId!;
  const layout = renderControls.layout ?? DEFAULT_RENDER_CONTROLS.layout!;
  const titleScaleMultiplier =
    renderControls.titleScaleMultiplier ?? DEFAULT_RENDER_CONTROLS.titleScaleMultiplier!;
  const subtitleScaleMultiplier =
    renderControls.subtitleScaleMultiplier ?? DEFAULT_RENDER_CONTROLS.subtitleScaleMultiplier!;
  const subtitleSpacingMultiplier =
    renderControls.subtitleSpacingMultiplier ?? DEFAULT_RENDER_CONTROLS.subtitleSpacingMultiplier!;
  const textOffsetX = renderControls.textOffsetX ?? DEFAULT_RENDER_CONTROLS.textOffsetX!;
  const textOffsetY = renderControls.textOffsetY ?? DEFAULT_RENDER_CONTROLS.textOffsetY!;
  const screenshotScaleMultiplier =
    renderControls.screenshotScaleMultiplier ?? DEFAULT_RENDER_CONTROLS.screenshotScaleMultiplier!;
  const screenshotOffsetX =
    renderControls.screenshotOffsetX ?? DEFAULT_RENDER_CONTROLS.screenshotOffsetX!;
  const screenshotOffsetY =
    renderControls.screenshotOffsetY ?? DEFAULT_RENDER_CONTROLS.screenshotOffsetY!;

  const updateRenderControls = useCallback((updates: Partial<RenderControls>) => {
    const targetKeys = Object.keys(updates) as (keyof RenderControls)[];

    if (applyPreviewToAll) {
      setGlobalRenderControls((currentControls) => ({
        ...currentControls,
        ...updates,
      }));
      setSlideRenderControlsById((currentById) =>
        Object.fromEntries(
          Object.entries(currentById)
            .map(([slideId, controls]) => {
              const nextControls = { ...controls };
              targetKeys.forEach((key) => {
                delete nextControls[key];
              });

              return [slideId, nextControls];
            })
            .filter(([, controls]) => Object.keys(controls).length > 0),
        ),
      );
      return;
    }

    const targetIds = resolvedPreviewTargetSlideIds.length
      ? resolvedPreviewTargetSlideIds
      : activeSlide
        ? [activeSlide.id]
        : [];

    if (!targetIds.length) {
      return;
    }

    setSlideRenderControlsById((currentById) => {
      const nextById = { ...currentById };

      targetIds.forEach((slideId) => {
        nextById[slideId] = {
          ...(nextById[slideId] ?? {}),
          ...updates,
        };
      });

      return nextById;
    });
  }, [activeSlide, applyPreviewToAll, resolvedPreviewTargetSlideIds]);

  const setFrameEnabled = useCallback((enabled: boolean) => {
    if (applyPreviewToAll) {
      setDefaultFrameEnabled(enabled);
      setSlideFrameEnabledById({});
      return;
    }

    const targetIds = resolvedPreviewTargetSlideIds.length
      ? resolvedPreviewTargetSlideIds
      : activeSlide
        ? [activeSlide.id]
        : [];

    if (!targetIds.length) {
      return;
    }

    setSlideFrameEnabledById((currentById) => {
      const nextById = { ...currentById };
      targetIds.forEach((slideId) => {
        nextById[slideId] = enabled;
      });
      return nextById;
    });
  }, [activeSlide, applyPreviewToAll, resolvedPreviewTargetSlideIds]);

  const setBackgroundStyleId = useCallback((value: BackgroundStyleId) => {
    updateRenderControls({ backgroundStyleId: value });
  }, [updateRenderControls]);
  const setCustomBackgroundColor = useCallback((value: string) => {
    updateRenderControls({ customBackgroundColor: value });
  }, [updateRenderControls]);
  const setCustomBackgroundOpacity = useCallback((value: number) => {
    updateRenderControls({ customBackgroundOpacity: value });
  }, [updateRenderControls]);
  const setCustomTextColor = useCallback((value: string) => {
    updateRenderControls({ customTextColor: value });
  }, [updateRenderControls]);
  const setFontFamilyId = useCallback((value: FontFamilyId) => {
    updateRenderControls({ fontFamilyId: value });
  }, [updateRenderControls]);
  const setLayout = useCallback((value: LayoutId) => {
    updateRenderControls({ layout: value });
  }, [updateRenderControls]);
  const setTitleScaleMultiplier = useCallback((value: number) => {
    updateRenderControls({ titleScaleMultiplier: value });
  }, [updateRenderControls]);
  const setSubtitleScaleMultiplier = useCallback((value: number) => {
    updateRenderControls({ subtitleScaleMultiplier: value });
  }, [updateRenderControls]);
  const setSubtitleSpacingMultiplier = useCallback((value: number) => {
    updateRenderControls({ subtitleSpacingMultiplier: value });
  }, [updateRenderControls]);
  const setTextOffsetX = useCallback((value: number) => {
    updateRenderControls({ textOffsetX: value });
  }, [updateRenderControls]);
  const setTextOffsetY = useCallback((value: number) => {
    updateRenderControls({ textOffsetY: value });
  }, [updateRenderControls]);
  const setScreenshotScaleMultiplier = useCallback((value: number) => {
    updateRenderControls({ screenshotScaleMultiplier: value });
  }, [updateRenderControls]);
  const setScreenshotOffsetX = useCallback((value: number) => {
    updateRenderControls({ screenshotOffsetX: value });
  }, [updateRenderControls]);
  const setScreenshotOffsetY = useCallback((value: number) => {
    updateRenderControls({ screenshotOffsetY: value });
  }, [updateRenderControls]);

  const togglePreviewTargetSlideId = useCallback((slideId: string) => {
    setPreviewTargetSlideIds((currentIds) => {
      const validCurrentIds = currentIds.filter((currentId) =>
        slides.some((slide) => slide.id === currentId),
      );
      const exists = validCurrentIds.includes(slideId);
      if (exists) {
        return validCurrentIds.length === 1
          ? validCurrentIds
          : validCurrentIds.filter((currentId) => currentId !== slideId);
      }

      return [...validCurrentIds, slideId];
    });
  }, [slides]);
  const handleFilesSelected = useCallback((files: File[]) => {
    const timestamp = Date.now();

    setSlides((currentSlides) => {
      const availableSlots = Math.max(0, MAX_SCREENSHOTS - currentSlides.length);
      if (!availableSlots) {
        return currentSlides;
      }

      const validFiles = files.filter((file) => file.type.startsWith("image/"));
      if (!validFiles.length) {
        return currentSlides;
      }

      const startIndex = currentSlides.length;
      const nextSlides = validFiles.slice(0, availableSlots).map((file, index) => {
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
    const nextTitle = clampTitleCharacters(title, MAX_TITLE_CHARACTERS);

    setSlides((currentSlides) =>
      currentSlides.map((slide, index) =>
        index === activeSlideIndex ? { ...slide, title: nextTitle } : slide,
      ),
    );
  }, [activeSlideIndex]);

  const handleSubtitleChange = useCallback((subtitle: string) => {
    const nextSubtitle = clampSubtitleCharacters(subtitle, MAX_SUBTITLE_CHARACTERS);

    setSlides((currentSlides) =>
      currentSlides.map((slide, index) =>
        index === activeSlideIndex ? { ...slide, subtitle: nextSubtitle } : slide,
      ),
    );
  }, [activeSlideIndex]);

  const removeSlide = useCallback((slideId: string) => {
    setSlides((currentSlides) => {
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
    setPreviewTargetSlideIds((currentIds) => currentIds.filter((currentId) => currentId !== slideId));
    setSlideRenderControlsById((currentById) =>
      Object.fromEntries(
        Object.entries(currentById).filter(([currentId]) => currentId !== slideId),
      ),
    );
    setSlideFrameEnabledById((currentById) =>
      Object.fromEntries(
        Object.entries(currentById).filter(([currentId]) => currentId !== slideId),
      ),
    );
  }, []);

  const handleExport = useCallback(async () => {
    const exportableSlides = slides.filter((slide) => slide.enabled);
    const qualityScale =
      EXPORT_QUALITY_OPTIONS.find((option) => option.id === exportQuality)?.scale ?? 1;

    if (!exportableSlides.length || !selectedPresets.length) {
      return false;
    }

    setIsExporting(true);
    try {
      const files = [];

      for (const slide of exportableSlides) {
        for (const preset of selectedPresets) {
          const blob = await generateSlideBlob(
            slide,
            preset,
            selectedTemplate,
            getFrameEnabledForSlide(slide.id),
            getRenderControlsForSlide(slide.id),
            qualityScale,
          );
          files.push({
            name: `${preset.id}/${slide.order + 1}_${preset.id}.png`,
            blob,
          });
        }
      }

      await downloadZip(files, `${sanitizeExportName(exportName)}.zip`);
      return true;
    } finally {
      setIsExporting(false);
    }
  }, [
    exportName,
    exportQuality,
    getFrameEnabledForSlide,
    getRenderControlsForSlide,
    selectedPresets,
    selectedTemplate,
    slides,
  ]);

  const resetCreateFlow = useCallback(() => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];

    setSlides([]);
    setActiveSlideIndex(0);
    setSelectedPresets(EXPORT_PRESETS);
    setSelectedTemplate(DEFAULT_PREVIEW_TEMPLATE_ID);
    setGlobalRenderControls(DEFAULT_RENDER_CONTROLS);
    setSlideRenderControlsById({});
    setExportName("Untitled_1");
    setPreviewPresetId(EXPORT_PRESETS[0].id);
    setExportQuality("default");
    setDefaultFrameEnabled(true);
    setSlideFrameEnabledById({});
    setApplyPreviewToAllState(true);
    setPreviewTargetSlideIds([]);
    setIsExporting(false);
    clearPreviewSnapshot();
  }, []);

  const toggleExportPreset = useCallback((presetId: string) => {
    setSelectedPresets((currentPresets) => {
      const exists = currentPresets.some((preset) => preset.id === presetId);

      if (exists) {
        if (currentPresets.length === 1) {
          return currentPresets;
        }

        const nextPresets = currentPresets.filter((preset) => preset.id !== presetId);
        if (previewPresetId === presetId && nextPresets.length) {
          setPreviewPresetId(nextPresets[0].id);
        }

        return nextPresets;
      }

      const presetToAdd = EXPORT_PRESETS.find((preset) => preset.id === presetId);
      if (!presetToAdd) {
        return currentPresets;
      }

      return [...currentPresets, presetToAdd];
    });
  }, [previewPresetId]);

  const value = useMemo<CreateFlowContextValue>(
    () => ({
      slides,
      activeSlideIndex,
      activeSlide,
      selectedPresets,
      selectedTemplate,
      backgroundStyleId,
      customBackgroundColor,
      customBackgroundOpacity,
      customTextColor,
      fontFamilyId,
      layout,
      titleScaleMultiplier,
      subtitleScaleMultiplier,
      subtitleSpacingMultiplier,
      textOffsetX,
      textOffsetY,
      screenshotScaleMultiplier,
      screenshotOffsetX,
      screenshotOffsetY,
      exportName,
      previewPreset,
      exportQuality,
      frameEnabled,
      applyPreviewToAll,
      previewTargetSlideIds: resolvedPreviewTargetSlideIds,
      isExporting,
      renderControls,
      defaultRenderControls: globalRenderControls,
      slideRenderControlsById,
      defaultFrameEnabled,
      slideFrameEnabledById,
      handleFilesSelected,
      setActiveSlideIndex,
      handleTitleChange,
      handleSubtitleChange,
      setSelectedTemplate,
      setBackgroundStyleId,
      setCustomBackgroundColor,
      setCustomBackgroundOpacity,
      setCustomTextColor,
      setFontFamilyId,
      setLayout,
      setTitleScaleMultiplier,
      setSubtitleScaleMultiplier,
      setSubtitleSpacingMultiplier,
      setTextOffsetX,
      setTextOffsetY,
      setScreenshotScaleMultiplier,
      setScreenshotOffsetX,
      setScreenshotOffsetY,
      setExportName,
      setPreviewPresetId,
      toggleExportPreset,
      setExportQuality,
      setApplyPreviewToAll,
      togglePreviewTargetSlideId,
      setFrameEnabled,
      removeSlide,
      handleExport,
      resetCreateFlow,
    }),
    [
      activeSlide,
      activeSlideIndex,
      backgroundStyleId,
      customBackgroundColor,
      customBackgroundOpacity,
      customTextColor,
      defaultFrameEnabled,
      globalRenderControls,
      fontFamilyId,
      layout,
      exportQuality,
      frameEnabled,
      applyPreviewToAll,
      isExporting,
      previewPreset,
      resolvedPreviewTargetSlideIds,
      renderControls,
      slideFrameEnabledById,
      slideRenderControlsById,
      selectedPresets,
      selectedTemplate,
      slides,
      screenshotOffsetX,
      screenshotOffsetY,
      screenshotScaleMultiplier,
      textOffsetX,
      textOffsetY,
      subtitleSpacingMultiplier,
      subtitleScaleMultiplier,
      titleScaleMultiplier,
      exportName,
      handleExport,
      handleFilesSelected,
      handleSubtitleChange,
      handleTitleChange,
      removeSlide,
      resetCreateFlow,
      setBackgroundStyleId,
      setCustomBackgroundColor,
      setCustomBackgroundOpacity,
      setCustomTextColor,
      setFontFamilyId,
      setFrameEnabled,
      setLayout,
      setScreenshotOffsetX,
      setScreenshotOffsetY,
      setScreenshotScaleMultiplier,
      setSubtitleScaleMultiplier,
      setSubtitleSpacingMultiplier,
      setTextOffsetX,
      setTextOffsetY,
      setTitleScaleMultiplier,
      setApplyPreviewToAll,
      togglePreviewTargetSlideId,
      toggleExportPreset,
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
