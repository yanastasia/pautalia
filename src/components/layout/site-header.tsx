"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useLocale } from "@/components/providers/locale-provider";
import { getMessages } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

export function SiteHeader({ brandName }: { brandName: string }) {
  const pathname = usePathname();
  const locale = useLocale();
  const messages = getMessages(locale);
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const links = [
    { href: "/", label: messages.header.nav.home },
    { href: "/project", label: messages.header.nav.project },
    { href: "/apartments", label: messages.header.nav.apartments },
    { href: "/gallery", label: messages.header.nav.gallery },
    { href: "/location", label: messages.header.nav.location },
    { href: "/contact", label: messages.header.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !isScrolled;

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "w-full border-b transition-all duration-500",
          transparent
            ? "border-white/10 bg-transparent text-white"
            : "border-[rgba(16,18,20,0.08)] bg-[rgba(249,245,238,0.94)] text-[color:var(--ink)] shadow-[0_18px_44px_rgba(12,13,15,0.08)] backdrop-blur-xl",
        )}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className={cn("flex items-center justify-between gap-4 transition-all duration-500", transparent ? "py-5" : "py-4")}>
            <Link href="/" className="flex min-w-0 items-center sm:shrink-0">
              <span className={cn("font-serif text-[1.18rem] leading-none sm:text-[1.5rem] sm:whitespace-nowrap", transparent ? "text-white" : "text-[color:var(--ink)]")}>
                {brandName}
              </span>
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              {links.map((link) => {
                const active = link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-colors",
                      transparent
                        ? active
                          ? "text-white"
                          : "text-white/62 hover:text-white"
                        : active
                          ? "text-[color:var(--ink)]"
                          : "text-[color:var(--muted)] hover:text-[color:var(--ink)]",
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute inset-x-0 -bottom-[0.1rem] h-px transition-opacity duration-300",
                        transparent ? "bg-white/80" : "bg-[color:var(--ink)]",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <LanguageSwitcher variant={transparent ? "dark" : "light"} />
              </div>
              <Link
                href="/contact"
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] shadow-[0_12px_26px_rgba(18,15,14,0.08)]",
                  transparent
                    ? "border border-white/18 bg-[rgba(247,244,239,0.9)] text-[color:var(--ink)] hover:bg-[rgba(247,244,239,0.96)] hover:translate-y-[-1px]"
                    : "border border-[color:var(--accent)]/28 bg-[rgba(178,147,102,0.14)] text-[color:var(--ink)] hover:border-[color:var(--accent)]/42 hover:bg-[rgba(178,147,102,0.22)] hover:translate-y-[-1px]",
                )}
              >
                {messages.header.callback}
              </Link>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center gap-5 overflow-x-auto border-t py-3 lg:hidden",
              transparent ? "border-white/10" : "border-[color:var(--line)]",
            )}
          >
            {links.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap text-[0.68rem] font-semibold uppercase tracking-[0.22em]",
                    transparent
                      ? active
                        ? "text-white"
                        : "text-white/62"
                      : active
                        ? "text-[color:var(--ink)]"
                        : "text-[color:var(--muted)]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="ml-auto shrink-0 md:hidden">
              <LanguageSwitcher variant={transparent ? "dark" : "light"} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
