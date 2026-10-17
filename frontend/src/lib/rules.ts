/**
 * Migration rules used by the deadline calculator.
 *
 * These values change with Russian legislation. Keep them in one place and
 * have a lawyer confirm them before relying on the calculator in production.
 * `lastVerified` is intentionally null until that review happens.
 */
export const RULES = {
  /** Working days (Mon–Fri) after arrival to complete migration registration. */
  registrationWorkingDays: 7,
  /** Visa-free stay: at most `visaFreeDays` within any `visaFreeWindow` days. */
  visaFreeDays: 90,
  visaFreeWindow: 180,
  lastVerified: null as string | null,
} as const;

export type CitizenshipGroup = "other" | "eaeu";
