/** Date helpers operating on local-time `YYYY-MM-DD` strings. */

export function parseISODate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Adds working days, skipping Saturdays and Sundays (public holidays are not considered). */
export function addWorkingDays(date: Date, days: number): Date {
  const next = new Date(date);
  let remaining = days;
  while (remaining > 0) {
    next.setDate(next.getDate() + 1);
    const day = next.getDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return next;
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Whole days from `from` to `to` (negative when `to` is in the past). */
export function diffInDays(to: Date, from: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

const intlLocales: Record<string, string> = {
  tg: "tg-TJ",
  ru: "ru-RU",
  uz: "uz-UZ",
  ky: "ky-KG",
};

export function formatDate(date: Date, locale: string): string {
  try {
    return new Intl.DateTimeFormat(intlLocales[locale] ?? "ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return toISODate(date);
  }
}

/** Adds calendar months, clamping to the last day of a shorter month (31 Jan + 1 month = 28/29 Feb). */
export function addMonths(date: Date, months: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(date.getDate(), lastDay));
  return next;
}
