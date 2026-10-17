export const locales = ["tg", "ru", "uz", "ky"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";
export const LOCALE_COOKIE = "provodnik-locale";

export const localeNames: Record<Locale, string> = {
  tg: "Тоҷикӣ",
  ru: "Русский",
  uz: "Oʻzbekcha",
  ky: "Кыргызча",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Picks the best supported locale from an Accept-Language header. */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const wanted = acceptLanguage
    .split(",")
    .map((part) => part.trim().split(";")[0].toLowerCase().split("-")[0]);
  for (const code of wanted) {
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}
