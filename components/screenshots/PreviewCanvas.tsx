"use client";

import { useEffect, useRef } from "react";

import {
  type ExportPreset,
  type Slide,
} from "@/lib/screenshot/presets";
import { renderSlideToCanvas, type RenderControls } from "@/lib/screenshot/generate";
import { type PreviewTemplateId } from "@/lib/screenshot/templates";

type PreviewCanvasProps = {
  slide: Slide | null;
  preset: ExportPreset;
  template: PreviewTemplateId;
  frameEnabled: boolean;
  controls: RenderControls;
};

export function PreviewCanvas({
  slide,
  preset,
  template,
  frameEnabled,
  controls,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !slide) {
      return;
    }

    renderSlideToCanvas(canvasRef.current, slide, preset, {
      template,
      frameEnabled,
      controls,
    }).catch(
      () => undefined,
    );
  }, [controls, frameEnabled, preset, slide, template]);

  return (
    <div className="h-full rounded-[1.75rem] bg-transparent">
      <div className="flex h-full min-h-0 items-center justify-center overflow-hidden">
        {slide ? (
          <div
            className="rounded-[1.1rem] border border-black/8 select-none"
            style={{
              transform: "scale(0.9)",
              transformOrigin: "center center",
            }}
          >
            <canvas
              ref={canvasRef}
              className="mx-auto block h-auto max-h-[calc(100vh-5rem)] w-auto max-w-full rounded-[1rem]"
            />
          </div>
        ) : (
          <div className="flex aspect-[1290/2796] items-center justify-center rounded-[1rem] border border-dashed border-border/70 bg-white/50 px-6 text-center text-sm leading-6 text-muted-foreground">
            Upload screenshots and move to the final step to preview your marketing layout.
          </div>
        )}
      </div>
    </div>
  );
}
