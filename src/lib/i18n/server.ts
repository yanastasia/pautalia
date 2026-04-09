import { defaultLocale, normalizeLocale, type Locale } from "@/lib/i18n/config";

export async function getLocale(): Promise<Locale> {
  return defaultLocale;
}

export function getRequestLocale(request: Request): Locale {
  const url = new URL(request.url);
  const queryLocale = normalizeLocale(url.searchParams.get("lang"));
  if (queryLocale) {
    return queryLocale;
  }

  return defaultLocale;
}
