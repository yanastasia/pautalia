import { locales, type Locale } from "@/lib/i18n/config";

export function getPostRequestLocale(request: Request, fallback: Locale): Locale {
  const locale = new URL(request.url).searchParams.get("locale");

  if (locales.includes(locale as Locale)) {
    return locale as Locale;
  }

  return fallback;
}
