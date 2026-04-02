export const locales = ["en", "bg"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "bg";
export const localeCookieName = "pautalia_locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "bg";
}

export function normalizeLocale(value: string | null | undefined): Locale | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (isLocale(normalized)) {
    return normalized;
  }

  if (normalized.startsWith("bg")) {
    return "bg";
  }

  if (normalized.startsWith("en")) {
    return "en";
  }

  return null;
}

export function localeFromAcceptLanguage(value: string | null | undefined): Locale | null {
  if (!value) {
    return null;
  }

  const tokens = value.split(",").map((token) => token.trim());
  for (const token of tokens) {
    const candidate = normalizeLocale(token.split(";")[0] ?? token);
    if (candidate) {
      return candidate;
    }
  }

  return null;
}
