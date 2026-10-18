"use client";

import { useEffect, type ReactNode } from "react";
import { Icon } from "./Icon";

/** Modal bottom sheet used for forms. */
export function Sheet({ title, closeLabel, onClose, children }: { title: string; closeLabel: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="sheet" role="presentation">
      <div className="sheet__scrim" onClick={onClose} />
      <div className="sheet__panel sheet__panel--form" role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet__grabber" aria-hidden="true" />
        <div className="sheet__head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn icon-btn--plain" aria-label={closeLabel} onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  );
}
