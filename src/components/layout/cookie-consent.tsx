"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { getMessages } from "@/lib/i18n/messages";

const consentCookieName = "pautalia_cookie_consent";

function setConsentCookie(value: string) {
  document.cookie = `${consentCookieName}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

export function CookieConsent() {
  const locale = useLocale();
  const messages = getMessages(locale);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = document.cookie.includes(`${consentCookieName}=`);
    setIsVisible(!hasConsent);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-3xl rounded-[1.25rem] border border-white/12 bg-[color:var(--surface-dark)] p-4 text-white shadow-[0_20px_80px_rgba(0,0,0,0.32)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-white/72">
          {messages.cookieConsent.copy}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => {
              setConsentCookie("necessary");
              setIsVisible(false);
            }}
            className="rounded-full border border-white/16 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/76"
          >
            {messages.cookieConsent.necessary}
          </button>
          <button
            type="button"
            onClick={() => {
              setConsentCookie("analytics");
              setIsVisible(false);
            }}
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--surface-dark)]"
          >
            {messages.cookieConsent.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
