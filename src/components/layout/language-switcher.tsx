"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/components/providers/locale-provider";
import { localeCookieName, locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

function persistLocale(locale: Locale) {
  const secureFlag = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${localeCookieName}=${encodeURIComponent(locale)}; path=/; max-age=31536000; samesite=lax${secureFlag}`;
}

export function LanguageSwitcher({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const locale = useLocale();
  const router = useRouter();
  const darkSurface = variant === "dark";
  const orderedLocales = [...locales].reverse();

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-2 py-1.5",
        darkSurface ? "border-white/12 bg-white/6" : "border-[color:var(--line)] bg-white/72 shadow-[0_10px_28px_rgba(13,14,16,0.05)]",
      )}
    >
      <div className="flex items-center gap-1">
        {orderedLocales.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              persistLocale(option);
              router.refresh();
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-all",
              darkSurface
                ? locale === option
                  ? "bg-white/14 text-white"
                  : "text-white/52 hover:bg-white/8 hover:text-white"
                : locale === option
                  ? "bg-[color:var(--surface-dark)] text-white"
                  : "text-[color:var(--muted)] hover:bg-[color:var(--background-deep)] hover:text-[color:var(--ink)]",
            )}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
