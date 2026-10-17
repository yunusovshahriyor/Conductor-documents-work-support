"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { LOCALE_COOKIE, locales, localeNames, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ current, label, closeLabel }: { current: Locale; label: string; closeLabel: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function change(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    const segments = (pathname ?? "/").split("/");
    segments[1] = next;
    setOpen(false);
    router.push(segments.join("/") || `/${next}`);
  }

  return (
    <>
      {/* wide screens: inline pills */}
      <div className="lang lang--inline" role="group" aria-label={label}>
        {locales.map((code) => (
          <button key={code} type="button" className="lang__btn" aria-pressed={code === current} lang={code} onClick={() => change(code)}>
            {localeNames[code]}
          </button>
        ))}
      </div>

      {/* phones: icon button + bottom sheet */}
      <button type="button" className="icon-btn lang--sheet-btn" aria-label={label} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <Icon name="globe" />
        <span className="lang__code">{current.toUpperCase()}</span>
      </button>

      {open && (
        <div className="sheet" role="presentation">
          <div className="sheet__scrim" onClick={() => setOpen(false)} />
          <div className="sheet__panel" role="dialog" aria-modal="true" aria-label={label}>
            <div className="sheet__grabber" aria-hidden="true" />
            <div className="sheet__head">
              <h2>{label}</h2>
              <button type="button" className="icon-btn icon-btn--plain" aria-label={closeLabel} onClick={() => setOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <ul className="sheet__list">
              {locales.map((code) => (
                <li key={code}>
                  <button type="button" className="sheet__item" lang={code} aria-current={code === current} onClick={() => change(code)}>
                    <span>{localeNames[code]}</span>
                    {code === current && <Icon name="check" size={22} />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
