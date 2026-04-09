"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

type ApartmentFilterSheetProps = {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function ApartmentFilterSheet({
  locale,
  isOpen,
  onClose,
  children,
}: ApartmentFilterSheetProps) {
  const messages = getMessages(locale);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements.length) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 top-0 z-50 lg:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label={locale === "bg" ? "Затвори филтрите" : "Close filters"}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[rgba(11,12,14,0.42)] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={messages.apartments.finderTitle}
        className={cn(
          "absolute inset-x-0 bottom-0 top-[4.75rem] flex flex-col overflow-hidden rounded-t-[1.75rem] border-t border-white/10 bg-[color:var(--surface-dark)] px-5 pb-6 pt-5 text-white shadow-[0_-24px_60px_rgba(12,13,15,0.3)] transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/46">
              {messages.apartments.filters}
            </p>
            <p className="mt-1 font-serif text-2xl text-white">{messages.apartments.finderTitle}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-white/8"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <div className="overflow-y-auto pb-4">{children}</div>
      </div>
    </div>
  );
}
