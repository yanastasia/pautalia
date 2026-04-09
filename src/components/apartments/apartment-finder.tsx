"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useMemo, useState } from "react";
import { Link2, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { ApartmentFilterForm, type FinderFilters } from "@/components/apartments/apartment-filter-form";
import { ApartmentFilterSheet } from "@/components/apartments/apartment-filter-sheet";
import { UnitCard } from "@/components/apartments/unit-card";
import { useLocale } from "@/components/providers/locale-provider";
import { getFloorLabel, getMessages } from "@/lib/i18n/messages";
import { getOrientationLabel } from "@/lib/i18n/property";
import type { PublicUnit } from "@/types/public-api";

type FinderProps = {
  units: PublicUnit[];
  allUnits: PublicUnit[];
};

function getFilters(searchParams: URLSearchParams): FinderFilters {
  return {
    building: searchParams.get("building") ?? "",
    rooms: searchParams.get("rooms") ?? "",
    floor: searchParams.get("floor") ?? "",
    minPrice: searchParams.get("minPrice") ?? searchParams.get("price_min") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? searchParams.get("price_max") ?? "",
    orientation: searchParams.get("orientation") ?? "",
    status: searchParams.get("status") ?? searchParams.get("availability") ?? "",
  };
}

export function ApartmentFinder({ units, allUnits }: FinderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const messages = getMessages(locale);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const filters = getFilters(searchParams);

  const buildingOptions = useMemo(
    () =>
      Array.from(
        new Map(
          allUnits.map((unit) => [
            unit.building?.slug ?? unit.buildingId,
            {
              value: unit.building?.slug ?? unit.buildingId,
              label: unit.building?.name ?? unit.buildingId.toUpperCase(),
            },
          ]),
        ).values(),
      ).sort((left, right) => left.label.localeCompare(right.label)),
    [allUnits],
  );

  const floorOptions = useMemo(
    () => Array.from(new Set(allUnits.map((unit) => unit.floor))).sort((left, right) => left - right),
    [allUnits],
  );

  const orientationOptions = useMemo(
    () => Array.from(new Set(allUnits.map((unit) => unit.orientation))).sort(),
    [allUnits],
  );

  const activeFilters = useMemo(() => {
    const statusLabel =
      filters.status === "available"
        ? locale === "bg"
          ? "Свободен"
          : "Available"
        : filters.status === "reserved"
          ? locale === "bg"
            ? "Резервиран"
            : "Reserved"
          : filters.status === "sold"
            ? locale === "bg"
              ? "Продаден"
              : "Sold"
            : "";

    return [
      filters.building
        ? buildingOptions.find((building) => building.value === filters.building)?.label ?? filters.building
        : "",
      filters.rooms ? (locale === "bg" ? `${filters.rooms} стаи` : `${filters.rooms} rooms`) : "",
      filters.floor ? getFloorLabel(locale, Number(filters.floor)) : "",
      filters.minPrice ? `${messages.apartments.minPrice}: ${filters.minPrice}` : "",
      filters.maxPrice ? `${messages.apartments.maxPrice}: ${filters.maxPrice}` : "",
      filters.orientation ? getOrientationLabel(locale, filters.orientation) : "",
      statusLabel,
    ].filter(Boolean);
  }, [buildingOptions, filters, locale, messages.apartments.maxPrice, messages.apartments.minPrice]);

  function updateFilter(key: keyof FinderFilters, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (!value) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    nextParams.delete("price_min");
    nextParams.delete("price_max");
    nextParams.delete("availability");
    nextParams.delete("page");

    startTransition(() => {
      const nextQuery = nextParams.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    });
  }

  function reset() {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  return (
    <>
      <div className="grid gap-12 lg:grid-cols-[minmax(22rem,25rem)_minmax(0,1fr)] xl:gap-16">
        <aside className="hidden bg-[color:var(--surface-dark)] px-6 py-8 text-white sm:px-8 lg:sticky lg:top-28 lg:block lg:self-start">
          <ApartmentFilterForm
            locale={locale}
            filters={filters}
            buildingOptions={buildingOptions}
            floorOptions={floorOptions}
            orientationOptions={orientationOptions}
            onChange={updateFilter}
            onReset={reset}
          />
        </aside>

        <div className="min-w-0">
          <div className="mb-8 border-t border-[color:var(--line)] pt-6 sm:mb-10 sm:pt-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  {messages.common.searchResults}
                </p>
                <h3 className="mt-2 font-serif text-3xl text-[color:var(--ink)] sm:text-4xl xl:text-5xl">
                  {locale === "bg" ? `${units.length} жилища съвпадат` : `${units.length} homes match`}
                </h3>
              </div>
              <div className="hidden flex-wrap gap-3 lg:flex">
                <span className="info-chip">
                  <Link2 className="size-4 text-[color:var(--accent)]" />
                  {messages.common.shareableUrlState}
                </span>
                <span className="info-chip">
                  <ShieldCheck className="size-4 text-[color:var(--accent)]" />
                  {messages.common.publishedInventoryOnly}
                </span>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--muted)] sm:mt-5 sm:text-base sm:leading-8">
              {messages.apartments.resultsCopy}
            </p>
          </div>

          <div className="sticky top-[4.75rem] z-20 -mx-4 mb-8 border-y border-[color:var(--line)] bg-[rgba(248,245,239,0.94)] px-4 py-4 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                  {messages.apartments.shortlist}
                </p>
                <p className="mt-1 text-sm text-[color:var(--ink)]">
                  {locale === "bg" ? `${units.length} резултата` : `${units.length} results`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(true)}
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
                  onClick={reset}
                  className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]"
                >
                  {messages.apartments.reset}
                </button>
              </div>
            ) : null}
          </div>

          {units.length ? (
            <div className="grid gap-8 sm:gap-10">
              {units.map((unit) => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </div>
          ) : (
            <div className="border-t border-[color:var(--line)] py-12 text-center">
              <h4 className="font-serif text-3xl text-[color:var(--ink)]">{messages.apartments.noResultsTitle}</h4>
              <p className="mt-3 text-[color:var(--muted)]">{messages.apartments.noResultsCopy}</p>
            </div>
          )}
        </div>
      </div>

      <ApartmentFilterSheet locale={locale} isOpen={isFilterSheetOpen} onClose={() => setIsFilterSheetOpen(false)}>
        <ApartmentFilterForm
          locale={locale}
          filters={filters}
          buildingOptions={buildingOptions}
          floorOptions={floorOptions}
          orientationOptions={orientationOptions}
          onChange={updateFilter}
          onReset={reset}
          compact
          showHeader={false}
        />
      </ApartmentFilterSheet>
    </>
  );
}
