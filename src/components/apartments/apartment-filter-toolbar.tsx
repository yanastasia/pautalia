"use client";

import { SlidersHorizontal } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

type ApartmentFilterToolbarProps = {
  locale: Locale;
  resultCount: number;
  activeFilters: string[];
  onOpenFilters: () => void;
  onReset: () => void;
};

export function ApartmentFilterToolbar({
  locale,
  resultCount,
  activeFilters,
  onOpenFilters,
  onReset,
}: ApartmentFilterToolbarProps) {
  const messages = getMessages(locale);

  return (
    <div className="sticky top-[4.75rem] z-20 -mx-4 mb-8 border-y border-[color:var(--line)] bg-[rgba(248,245,239,0.94)] px-4 py-4 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
            {messages.apartments.shortlist}
          </p>
          <p className="mt-1 text-sm text-[color:var(--ink)]">
            {locale === "bg" ? `${resultCount} резултата` : `${resultCount} results`}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-white px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)] shadow-[0_16px_32px_rgba(12,13,15,0.08)]"
        >
          <SlidersHorizontal className="size-4" />
          {messages.apartments.filters}
        </button>
      </div>

      {activeFilters.length ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <span
              key={filter}
              className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 text-[0.72rem] font-semibold text-[color:var(--muted)]"
            >
              {filter}
            </span>
          ))}
          <button
            type="button"
            onClick={onReset}
            className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]"
          >
            {messages.apartments.reset}
          </button>
        </div>
      ) : null}
    </div>
  );
}
