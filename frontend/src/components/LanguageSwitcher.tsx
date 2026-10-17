"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE, locales, localeNames, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function change(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    const segments = (pathname ?? "/").split("/");
    segments[1] = next;
    router.push(segments.join("/") || `/${next}`);
  }

  return (
    <div className="lang" role="group" aria-label={label}>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          className="lang__btn"
          aria-pressed={code === current}
          lang={code}
          onClick={() => change(code)}
        >
          {localeNames[code]}
        </button>
      ))}
    </div>
  );
}
