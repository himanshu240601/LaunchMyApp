"use client";

export const CUSTOM_FONTS_STORAGE_KEY = "launchmyapp.custom-fonts";

export type SavedCustomFont = {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: number;
};

export function loadSavedCustomFonts(): SavedCustomFont[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = localStorage.getItem(CUSTOM_FONTS_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as SavedCustomFont[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSavedCustomFonts(fonts: SavedCustomFont[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(CUSTOM_FONTS_STORAGE_KEY, JSON.stringify(fonts));
}

export function addSavedCustomFont(name: string, dataUrl: string) {
  const currentFonts = loadSavedCustomFonts();
  const existingFont = currentFonts.find((font) => font.name === name && font.dataUrl === dataUrl);

  if (existingFont) {
    return existingFont;
  }

  const nextFont: SavedCustomFont = {
    id: `custom-font-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    dataUrl,
    createdAt: Date.now(),
  };

  saveSavedCustomFonts([...currentFonts, nextFont]);
  return nextFont;
}

export function clearSavedCustomFonts() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(CUSTOM_FONTS_STORAGE_KEY);
}
