export type ExportPreset = {
  id: string;
  label: string;
  width: number;
  height: number;
};

export type Slide = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  order: number;
  enabled: boolean;
};

export const EXPORT_PRESETS: ExportPreset[] = [
  { id: "iphone-67", label: 'iPhone 6.7"', width: 1290, height: 2796 },
  { id: "iphone-65", label: 'iPhone 6.5"', width: 1242, height: 2688 },
  { id: "ipad-129", label: 'iPad 12.9"', width: 2048, height: 2732 },
];

export const AUTO_TITLES = [
  "Track everything",
  "Powerful insights",
  "Stay in control",
  "Move faster",
  "See what matters",
  "Built for focus",
];

export const AUTO_SUBTITLES = [
  "See your core metrics at a glance.",
  "Turn raw activity into useful decisions.",
  "Keep your workflow clear and organized.",
  "Take action without extra complexity.",
  "Surface the details that matter most.",
  "Designed for a faster daily routine.",
];
