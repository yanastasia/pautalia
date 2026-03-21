import { cookies, headers } from "next/headers";
import { defaultLocale, localeCookieName, localeFromAcceptLanguage, normalizeLocale, type Locale } from "@/lib/i18n/config";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  return (
    normalizeLocale(cookieStore.get(localeCookieName)?.value) ??
    localeFromAcceptLanguage(headerStore.get("accept-language")) ??
    defaultLocale
  );
}

export function getRequestLocale(request: Request): Locale {
  const url = new URL(request.url);
  const queryLocale = normalizeLocale(url.searchParams.get("lang"));
  if (queryLocale) {
    return queryLocale;
  }

  const cookieLocale = normalizeLocale(request.headers.get("cookie")?.match(/pautalia_locale=([^;]+)/)?.[1] ?? null);
  return cookieLocale ?? localeFromAcceptLanguage(request.headers.get("accept-language")) ?? defaultLocale;
}
