"use client";

import { Download } from "lucide-react";

import type { ExportPreset } from "@/lib/screenshot/presets";
import { Button } from "@/components/ui/button";

type ExportPanelProps = {
  presets: ExportPreset[];
  selectedPresets: ExportPreset[];
  disabled?: boolean;
  exporting?: boolean;
  onPresetToggle: (presetId: string) => void;
  onExport: () => void;
  panelless?: boolean;
};

export function ExportPanel({
  presets,
  selectedPresets,
  disabled,
  exporting,
  onPresetToggle,
  onExport,
  panelless = false,
}: ExportPanelProps) {
  return (
    <div className={panelless ? "" : "rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-soft"}>
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Export
      </h3>
      <div className={panelless ? "mt-3 space-y-2.5" : "mt-3 space-y-2.5"}>
        {presets.map((preset) => (
          <label
            key={preset.id}
            className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-white px-4 py-2.5"
          >
            <input
              type="checkbox"
              checked={selectedPresets.some((item) => item.id === preset.id)}
              onChange={() => onPresetToggle(preset.id)}
              className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
            />
            <div>
              <p className="font-medium text-foreground">{preset.label}</p>
              <p className="text-sm text-muted-foreground">
                {preset.width} × {preset.height}
              </p>
            </div>
          </label>
        ))}
      </div>
      <Button
        type="button"
        disabled={disabled || exporting || selectedPresets.length === 0}
        className="mt-4 w-full gap-2"
        onClick={onExport}
      >
        <Download className="h-4 w-4" />
        {exporting ? "Exporting..." : "Export Screenshots"}
      </Button>
    </div>
  );
}
