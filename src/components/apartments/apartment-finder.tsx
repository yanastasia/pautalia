"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useMemo, useState } from "react";
import { Link2, ShieldCheck } from "lucide-react";
import { ApartmentFilterForm } from "@/components/apartments/apartment-filter-form";
import { ApartmentFilterSheet } from "@/components/apartments/apartment-filter-sheet";
import { ApartmentFilterToolbar } from "@/components/apartments/apartment-filter-toolbar";
import { UnitCard } from "@/components/apartments/unit-card";
import { useLocale } from "@/components/providers/locale-provider";
import {
  createApartmentFinderSearchParams,
  filterUnitsForApartmentFinder,
  getApartmentFinderFilters,
  type FinderFilters,
} from "@/lib/apartment-finder-filters";
import { getFloorLabel, getMessages } from "@/lib/i18n/messages";
import { getOrientationLabel } from "@/lib/i18n/property";
import type { PublicUnit } from "@/types/public-api";

type FinderProps = {
  allUnits: PublicUnit[];
};

export function ApartmentFinder({ allUnits }: FinderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const messages = getMessages(locale);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const searchParamText = searchParams.toString();
  const filters = useMemo(() => getApartmentFinderFilters(new URLSearchParams(searchParamText)), [searchParamText]);
  const displayedUnits = useMemo(
    () => filterUnitsForApartmentFinder(allUnits, filters),
    [allUnits, filters],
  );

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

  const roomOptions = useMemo(
    () => Array.from(new Set(allUnits.map((unit) => unit.rooms))).sort((left, right) => left - right),
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
    const nextQuery = createApartmentFinderSearchParams(new URLSearchParams(searchParamText), key, value);

    startTransition(() => {
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
        <aside className="hidden bg-[color:var(--surface-dark)] px-6 py-7 text-white sm:px-8 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100svh-7rem)] lg:self-start lg:overflow-y-auto">
          <ApartmentFilterForm
            locale={locale}
            filters={filters}
            buildingOptions={buildingOptions}
            roomOptions={roomOptions}
            floorOptions={floorOptions}
            orientationOptions={orientationOptions}
            onChange={updateFilter}
            onReset={reset}
            showHeader={false}
          />
        </aside>

        <div className="min-w-0">
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  {messages.common.searchResults}
                </p>
                <h3 className="mt-2 font-serif text-3xl text-[color:var(--ink)] sm:text-4xl xl:text-5xl">
                  {locale === "bg" ? `${displayedUnits.length} жилища съвпадат` : `${displayedUnits.length} homes match`}
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

          <ApartmentFilterToolbar
            locale={locale}
            resultCount={displayedUnits.length}
            activeFilters={activeFilters}
            onOpenFilters={() => setIsFilterSheetOpen(true)}
            onReset={reset}
          />

          {displayedUnits.length ? (
            <div className="grid gap-8 sm:gap-10">
              {displayedUnits.map((unit) => (
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
          roomOptions={roomOptions}
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
