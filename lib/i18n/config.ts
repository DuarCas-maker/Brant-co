export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "brant_locale";

export function normalizeLocale(value: unknown): Locale {
  return value === "es" ? "es" : defaultLocale;
}

export function pickLocale<T>(locale: Locale, values: Record<Locale, T>): T {
  return values[locale];
}
