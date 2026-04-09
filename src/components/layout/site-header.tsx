"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SiteHeaderMobileMenu } from "@/components/layout/site-header-mobile-menu";
import { useLocale } from "@/components/providers/locale-provider";
import { getMessages } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

export function SiteHeader({ brandName }: { brandName: string }) {
  const pathname = usePathname();
  const locale = useLocale();
  const messages = getMessages(locale);
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const links = [
    { href: "/", label: messages.header.nav.home },
    { href: "/project", label: messages.header.nav.project },
    { href: "/apartments", label: messages.header.nav.apartments },
    { href: "/gallery", label: messages.header.nav.gallery },
    { href: "/location", label: messages.header.nav.location },
    { href: "/contact", label: messages.header.nav.contact },
  ];
  const mobileLinks = [
    { href: "/project", label: messages.header.mobile.project },
    { href: "/apartments", label: messages.header.mobile.units },
    { href: "/gallery", label: messages.header.mobile.gallery },
    { href: "/location", label: messages.header.mobile.location },
    { href: "/contact", label: messages.header.mobile.lead },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      if (isMobileMenuOpen) {
        setIsHidden(false);
        return;
      }

      const currentScrollY = window.scrollY;
      const isNearTop = currentScrollY < 32;
      const scrollingDown = currentScrollY > lastScrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);

      setIsScrolled(currentScrollY > 50);

      if (isNearTop) {
        setIsHidden(false);
      } else if (scrollDelta > 0) {
        setIsHidden(scrollingDown);
      }

      lastScrollY = currentScrollY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const transparent = isHome && !isScrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-transform duration-300 ease-out",
        isHidden && !isMobileMenuOpen ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div
        className={cn(
          "w-full border-b transition-all duration-500",
          transparent
            ? "border-white/10 bg-transparent text-white"
            : "border-[rgba(16,18,20,0.08)] bg-[rgba(249,245,238,0.94)] text-[color:var(--ink)] shadow-[0_18px_44px_rgba(12,13,15,0.08)] backdrop-blur-xl",
        )}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className={cn("flex items-center justify-between gap-3 transition-all duration-500", transparent ? "py-3.5 sm:py-5" : "py-3 sm:py-4")}>
            <Link href="/" className="flex min-w-0 items-center sm:shrink-0">
              <span className="sr-only">{brandName}</span>
              <span className="relative block h-[3.5rem] w-[3.5rem] overflow-visible sm:h-[4.35rem] sm:w-[4.35rem] lg:h-[5rem] lg:w-[5rem]">
                <Image
                  src="/assets/branding/pautalia-logo.png"
                  alt={brandName}
                  fill
                  className="object-contain object-center scale-[1.95]"
                  sizes="(max-width: 640px) 56px, 80px"
                  priority
                />
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

            <div className="flex items-center gap-2 sm:gap-3">
              <SiteHeaderMobileMenu
                links={mobileLinks}
                pathname={pathname}
                transparent={transparent}
                contactLabel={messages.header.callback}
                isOpen={isMobileMenuOpen}
                onToggle={() => setIsMobileMenuOpen((current) => !current)}
                onClose={() => setIsMobileMenuOpen(false)}
              />
              <div className="hidden lg:block">
                <LanguageSwitcher variant={transparent ? "dark" : "light"} />
              </div>
              <div className="hidden lg:block">
                <Link
                  href="/contact"
                  className={cn(
                    "inline-flex min-h-11 items-center justify-center rounded-full px-3.5 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.18em] shadow-[0_12px_26px_rgba(18,15,14,0.08)] sm:px-4 sm:py-2.5 sm:text-[0.72rem] sm:tracking-[0.22em]",
                    transparent
                      ? "border border-white/12 bg-white/6 text-white/82 shadow-none hover:bg-white/10 hover:text-white hover:translate-y-[-1px]"
                      : "border border-[color:var(--accent)]/28 bg-[rgba(178,147,102,0.14)] text-[color:var(--ink)] hover:border-[color:var(--accent)]/42 hover:bg-[rgba(178,147,102,0.22)] hover:translate-y-[-1px]",
                  )}
                >
                  {messages.header.callback}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
