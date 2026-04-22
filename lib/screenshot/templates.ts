export type PreviewTemplateId =
  | "default"
  | "minimal-light"
  | "gradient-center"
  | "dark-premium";

export type BackgroundStyleId =
  | "template-default"
  | "soft-cream"
  | "warm-glow"
  | "dark-studio";

export type FontFamilyId = "display" | "clean" | "rounded";
export type LayoutId = "text-top-image-bottom" | "image-top-text-bottom";

export type TemplateAlignment = "center";

export type TemplateBackground =
  | {
      kind: "soft-orbs";
      base: string;
      accentA: string;
      accentB: string;
    }
  | {
      kind: "radial-center";
      base: string;
      accentA: string;
      accentB: string;
    }
  | {
      kind: "linear-sunrise";
      base: string;
      accentA: string;
      accentB: string;
    };

export type TemplateTextConfig = {
  color: string;
  maxWidth: number;
  top: number;
  fontScale: number;
  lineHeight: number;
  maxLines: number;
  align: TemplateAlignment;
};

export type TemplateScreenshotSlotConfig = {
  top: number;
  width: number;
  height: number;
  radius: number;
  padding: number;
  background: string;
  border: string;
  align: TemplateAlignment;
};

export type TemplateFrameConfig = {
  assetPath: string;
  bounds: {
    top: number;
    width: number;
    height: number;
    align: TemplateAlignment;
  };
  screenSlot: {
    x: number;
    y: number;
    width: number;
    height: number;
    borderRadius: number;
  };
};

export type TemplateSpacingConfig = {
  paddingX: number;
  footerY: number;
};

export type ScreenshotTemplate = {
  id: PreviewTemplateId;
  label: string;
  background: TemplateBackground;
  title: TemplateTextConfig;
  subtitle: TemplateTextConfig;
  screenshotSlot: TemplateScreenshotSlotConfig;
  frame?: TemplateFrameConfig;
  spacing: TemplateSpacingConfig;
  cardColor: string;
  cardBorder: string;
  footerColor: string;
};

export type BackgroundStyleOption = {
  id: BackgroundStyleId;
  label: string;
  background: TemplateBackground | null;
};

export type FontFamilyOption = {
  id: FontFamilyId;
  label: string;
  stack: string;
};

export type LayoutOption = {
  id: LayoutId;
  label: string;
};

const IPHONE_FRAME: TemplateFrameConfig = {
  assetPath: "/frames/iphone-dark-premium.png",
  bounds: {
    top: 0.24,
    width: 0.72,
    height: 0.61,
    align: "center",
  },
  screenSlot: {
    x: 0.02,
    y: 0.012,
    width: 0.96,
    height: 0.972,
    borderRadius: 0.14,
  },
};

export const LAYOUT_OPTIONS: LayoutOption[] = [
  { id: "text-top-image-bottom", label: "Text Top" },
  { id: "image-top-text-bottom", label: "Image Top" },
];

export const SCREENSHOT_TEMPLATES: ScreenshotTemplate[] = [
  {
    id: "default",
    label: "Default",
    background: {
      kind: "soft-orbs",
      base: "#ffffff",
      accentA: "rgba(255, 255, 255, 0)",
      accentB: "rgba(255, 255, 255, 0)",
    },
    title: {
      color: "#20130d",
      maxWidth: 0.8,
      top: 0.11,
      fontScale: 0.07,
      lineHeight: 0.092,
      maxLines: 2,
      align: "center",
    },
    subtitle: {
      color: "#6d564a",
      maxWidth: 0.72,
      top: 0.205,
      fontScale: 0.03,
      lineHeight: 0.04,
      maxLines: 2,
      align: "center",
    },
    screenshotSlot: {
      top: 0.3,
      width: 0.83,
      height: 0.56,
      radius: 0.04,
      padding: 0.045,
      background: "transparent",
      border: "rgba(0, 0, 0, 0)",
      align: "center",
    },
    spacing: {
      paddingX: 0.085,
      footerY: 0.92,
    },
    frame: IPHONE_FRAME,
    cardColor: "transparent",
    cardBorder: "rgba(0, 0, 0, 0)",
    footerColor: "rgba(0, 0, 0, 0)",
  },
  {
    id: "minimal-light",
    label: "Minimal",
    background: {
      kind: "soft-orbs",
      base: "#fbf4ec",
      accentA: "rgba(255, 122, 38, 0.08)",
      accentB: "rgba(117, 57, 28, 0.05)",
    },
    title: {
      color: "#2b140d",
      maxWidth: 0.8,
      top: 0.11,
      fontScale: 0.07,
      lineHeight: 0.092,
      maxLines: 2,
      align: "center",
    },
    subtitle: {
      color: "#7a5a47",
      maxWidth: 0.72,
      top: 0.205,
      fontScale: 0.03,
      lineHeight: 0.04,
      maxLines: 2,
      align: "center",
    },
    screenshotSlot: {
      top: 0.3,
      width: 0.83,
      height: 0.56,
      radius: 0.04,
      padding: 0.045,
      background: "#ffffff",
      border: "rgba(117, 57, 28, 0.08)",
      align: "center",
    },
    spacing: {
      paddingX: 0.085,
      footerY: 0.92,
    },
    frame: IPHONE_FRAME,
    cardColor: "#ffffff",
    cardBorder: "rgba(117, 57, 28, 0.08)",
    footerColor: "#cfb39b",
  },
  {
    id: "gradient-center",
    label: "Gradient",
    background: {
      kind: "linear-sunrise",
      base: "#fff7ef",
      accentA: "#ffd3ad",
      accentB: "#ff8a4c",
    },
    title: {
      color: "#33170f",
      maxWidth: 0.8,
      top: 0.11,
      fontScale: 0.07,
      lineHeight: 0.092,
      maxLines: 2,
      align: "center",
    },
    subtitle: {
      color: "#835f4d",
      maxWidth: 0.72,
      top: 0.205,
      fontScale: 0.03,
      lineHeight: 0.04,
      maxLines: 2,
      align: "center",
    },
    screenshotSlot: {
      top: 0.3,
      width: 0.83,
      height: 0.56,
      radius: 0.04,
      padding: 0.045,
      background: "#fffaf7",
      border: "rgba(188, 104, 49, 0.12)",
      align: "center",
    },
    spacing: {
      paddingX: 0.085,
      footerY: 0.92,
    },
    frame: IPHONE_FRAME,
    cardColor: "#fffaf7",
    cardBorder: "rgba(188, 104, 49, 0.12)",
    footerColor: "#d2ab90",
  },
  {
    id: "dark-premium",
    label: "Premium",
    background: {
      kind: "soft-orbs",
      base: "#1c0d09",
      accentA: "rgba(255, 122, 38, 0.2)",
      accentB: "rgba(255, 207, 171, 0.08)",
    },
    title: {
      color: "#fff3ea",
      maxWidth: 0.8,
      top: 0.11,
      fontScale: 0.07,
      lineHeight: 0.092,
      maxLines: 2,
      align: "center",
    },
    subtitle: {
      color: "#d8b7a3",
      maxWidth: 0.72,
      top: 0.205,
      fontScale: 0.03,
      lineHeight: 0.04,
      maxLines: 2,
      align: "center",
    },
    screenshotSlot: {
      top: 0.3,
      width: 0.83,
      height: 0.56,
      radius: 0.04,
      padding: 0.045,
      background: "#2a120d",
      border: "rgba(255, 255, 255, 0.08)",
      align: "center",
    },
    frame: IPHONE_FRAME,
    spacing: {
      paddingX: 0.085,
      footerY: 0.92,
    },
    cardColor: "#2a120d",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    footerColor: "#8f6753",
  },
];

export const DEFAULT_PREVIEW_TEMPLATE_ID: PreviewTemplateId = "default";

export const BACKGROUND_STYLE_OPTIONS: BackgroundStyleOption[] = [
  {
    id: "template-default",
    label: "Default",
    background: null,
  },
  {
    id: "soft-cream",
    label: "Cream",
    background: {
      kind: "soft-orbs",
      base: "#fbf4ec",
      accentA: "rgba(255, 146, 82, 0.10)",
      accentB: "rgba(107, 72, 52, 0.06)",
    },
  },
  {
    id: "warm-glow",
    label: "Glow",
    background: {
      kind: "radial-center",
      base: "#fff6ef",
      accentA: "rgba(255, 126, 54, 0.30)",
      accentB: "rgba(255, 223, 197, 0.64)",
    },
  },
  {
    id: "dark-studio",
    label: "Studio",
    background: {
      kind: "soft-orbs",
      base: "#160b08",
      accentA: "rgba(255, 122, 38, 0.18)",
      accentB: "rgba(255, 214, 184, 0.08)",
    },
  },
];

export const FONT_FAMILY_OPTIONS: FontFamilyOption[] = [
  {
    id: "display",
    label: "Display",
    stack: '"Avenir Next", "SF Pro Display", "Segoe UI", "Helvetica Neue", sans-serif',
  },
  {
    id: "clean",
    label: "Clean",
    stack: '"SF Pro Text", "Helvetica Neue", "Segoe UI", Arial, sans-serif',
  },
  {
    id: "rounded",
    label: "Rounded",
    stack: '"Avenir Next Rounded", "Avenir Next", "SF Pro Rounded", "Segoe UI", sans-serif',
  },
];

export function getScreenshotTemplate(templateId: PreviewTemplateId) {
  return (
    SCREENSHOT_TEMPLATES.find((template) => template.id === templateId) ??
    SCREENSHOT_TEMPLATES[0]
  );
}

export function getBackgroundStyle(backgroundStyleId: BackgroundStyleId) {
  return BACKGROUND_STYLE_OPTIONS.find((option) => option.id === backgroundStyleId);
}

export function getFontFamilyStack(fontFamilyId: FontFamilyId) {
  return (
    FONT_FAMILY_OPTIONS.find((option) => option.id === fontFamilyId)?.stack ??
    FONT_FAMILY_OPTIONS[0].stack
  );
}
