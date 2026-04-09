"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { cn } from "@/lib/utils";

type MobileLink = {
  href: string;
  label: string;
};

type SiteHeaderMobileMenuProps = {
  links: MobileLink[];
  pathname: string | null;
  transparent: boolean;
  contactLabel: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function SiteHeaderMobileMenu({
  links,
  pathname,
  transparent,
  contactLabel,
  isOpen,
  onToggle,
  onClose,
}: SiteHeaderMobileMenuProps) {
  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={onToggle}
        className={cn(
          "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border transition-all lg:hidden",
          transparent
            ? "border-white/12 bg-white/6 text-white"
            : "border-[color:var(--line)] bg-white/78 text-[color:var(--ink)] shadow-[0_10px_28px_rgba(13,14,16,0.05)]",
        )}
      >
        {isOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
      </button>

      <div
        className={cn(
          "absolute inset-x-0 top-full z-40 h-[calc(100dvh-4.75rem)] bg-[rgba(11,12,14,0.42)] transition-opacity duration-300 sm:h-[calc(100dvh-5.5rem)] lg:hidden",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute left-0 top-full z-50 flex h-[calc(100dvh-4.75rem)] w-[min(21rem,calc(100vw-2rem))] flex-col border-r border-[color:var(--line)] bg-[rgba(249,245,238,0.98)] px-5 pb-6 pt-6 text-[color:var(--ink)] shadow-[0_24px_60px_rgba(12,13,15,0.18)] backdrop-blur-xl transition-transform duration-300 ease-out sm:h-[calc(100dvh-5.5rem)] lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-[104%]",
        )}
      >
        <div className="mb-6 flex justify-end">
          <LanguageSwitcher variant="light" />
        </div>

        <div className="space-y-2">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname === link.href || pathname?.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex min-h-12 items-center rounded-[1.15rem] px-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em]",
                  active
                    ? "bg-[rgba(178,147,102,0.16)] text-[color:var(--ink)]"
                    : "text-[color:var(--muted)] hover:bg-[rgba(178,147,102,0.1)] hover:text-[color:var(--ink)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto border-t border-[color:var(--line)] pt-5">
          <Link
            href="/contact"
            onClick={onClose}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[color:var(--accent)]/28 bg-[rgba(178,147,102,0.14)] px-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]"
          >
            {contactLabel}
          </Link>
        </div>
      </div>
    </>
  );
}
