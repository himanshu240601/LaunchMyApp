"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ThemedDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  size?: "md" | "lg";
  closeLabel?: string;
  eyebrow?: string;
  showCloseButton?: boolean;
  closeButtonPosition?: "left" | "right";
};

export function ThemedDialog({
  open,
  title,
  description,
  children,
  footer,
  onClose,
  size = "md",
  closeLabel = "Close dialog",
  eyebrow,
  showCloseButton = true,
  closeButtonPosition = "right",
}: ThemedDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-[rgba(26,14,9,0.36)] px-4 py-6 backdrop-blur-md">
      <div
        className={[
          "relative w-full overflow-hidden rounded-[1.9rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(251,245,239,0.98))] shadow-[0_30px_80px_rgba(65,33,20,0.22)]",
          size === "lg" ? "max-w-2xl" : "max-w-md",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "themed-dialog-title" : undefined}
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,167,111,0.22),transparent_72%)]" />
        {showCloseButton ? (
          <button
            type="button"
            onClick={onClose}
            className={[
              "absolute top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/88 text-muted-foreground shadow-[0_12px_26px_rgba(65,33,20,0.12)] transition-colors hover:text-foreground",
              closeButtonPosition === "left" ? "left-4" : "right-4",
            ].join(" ")}
            aria-label={closeLabel}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <div className="relative p-6 sm:p-7">
          <div
            className={
              showCloseButton
                ? closeButtonPosition === "left"
                  ? "pl-12"
                  : "pr-12"
                : undefined
            }
          >
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                id="themed-dialog-title"
                className={[eyebrow ? "mt-2" : "mt-0", "text-2xl font-semibold tracking-tight text-foreground"].join(" ")}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className={[title ? "mt-3" : "mt-2", "text-sm leading-6 text-muted-foreground"].join(" ")}>
                {description}
              </p>
            ) : null}
          </div>
          {children ? <div className="mt-5">{children}</div> : null}
          {footer ? <div className="mt-6">{footer}</div> : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
