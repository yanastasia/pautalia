import { cookies } from "next/headers";
import { defaultLocale, localeCookieName, normalizeLocale, type Locale } from "@/lib/i18n/config";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();

  return normalizeLocale(cookieStore.get(localeCookieName)?.value) ?? defaultLocale;
}

export function getRequestLocale(request: Request): Locale {
  const url = new URL(request.url);
  const queryLocale = normalizeLocale(url.searchParams.get("lang"));
  if (queryLocale) {
    return queryLocale;
  }

  const cookieLocale = normalizeLocale(request.headers.get("cookie")?.match(/pautalia_locale=([^;]+)/)?.[1] ?? null);
  return cookieLocale ?? defaultLocale;
}
