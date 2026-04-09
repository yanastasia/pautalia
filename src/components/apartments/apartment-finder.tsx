"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useMemo } from "react";
import { Link2, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { UnitCard } from "@/components/apartments/unit-card";
import { getFloorLabel, getMessages } from "@/lib/i18n/messages";
import { getOrientationLabel } from "@/lib/i18n/property";
import type { PublicUnit } from "@/types/public-api";

type FinderProps = {
  units: PublicUnit[];
  allUnits: PublicUnit[];
};

type Filters = {
  building: string;
  rooms: string;
  floor: string;
  minPrice: string;
  maxPrice: string;
  orientation: string;
  status: string;
};

function getFilters(searchParams: URLSearchParams): Filters {
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
  const filters = getFilters(searchParams);
  const buildingOptions = useMemo(() => {
    return Array.from(
      new Map(
        allUnits.map((unit) => [
          unit.building?.slug ?? unit.buildingId,
          {
            value: unit.building?.slug ?? unit.buildingId,
            label: unit.building?.name ?? unit.buildingId.toUpperCase(),
          },
        ]),
      ).values(),
    ).sort((left, right) => left.label.localeCompare(right.label));
  }, [allUnits]);
  const floorOptions = useMemo(() => {
    return Array.from(new Set(allUnits.map((unit) => unit.floor))).sort((left, right) => left - right);
  }, [allUnits]);
  const orientationOptions = useMemo(() => {
    return Array.from(new Set(allUnits.map((unit) => unit.orientation))).sort();
  }, [allUnits]);

  function updateFilter(key: keyof Filters, value: string) {
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
    <div className="grid gap-12 lg:grid-cols-[minmax(22rem,25rem)_minmax(0,1fr)] xl:gap-16">
      <aside className="bg-[color:var(--surface-dark)] px-6 py-8 text-white sm:px-8 lg:sticky lg:top-28 lg:self-start">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-white/48">{messages.apartments.filters}</p>
            <h2 className="mt-1 font-serif text-3xl text-white">{messages.apartments.finderTitle}</h2>
          </div>
          <SlidersHorizontal className="size-5 text-[color:var(--accent)]" />
        </div>

        <div className="mt-4 border-t border-white/10 pt-4 text-sm leading-7 text-white/66">
          {messages.apartments.finderCopy}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <label className="block">
            <span className="premium-label text-white/54">{messages.apartments.building}</span>
            <select
              value={filters.building}
              onChange={(event) => updateFilter("building", event.target.value)}
              className="premium-select mt-2 border-white/8 bg-white/8 text-white"
            >
              <option value="">{messages.apartments.any}</option>
              {buildingOptions.map((building) => (
                <option key={building.value} value={building.value}>
                  {building.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="premium-label text-white/54">{messages.apartments.rooms}</span>
            <select
              value={filters.rooms}
              onChange={(event) => updateFilter("rooms", event.target.value)}
              className="premium-select mt-2 border-white/8 bg-white/8 text-white"
            >
              <option value="">{messages.apartments.any}</option>
              <option value="2">{locale === "bg" ? "2 стаи" : "2 rooms"}</option>
              <option value="3">{locale === "bg" ? "3 стаи" : "3 rooms"}</option>
              <option value="4">{locale === "bg" ? "4 стаи" : "4 rooms"}</option>
            </select>
          </label>

          <label className="block">
            <span className="premium-label text-white/54">{messages.apartments.floor}</span>
            <select
              value={filters.floor}
              onChange={(event) => updateFilter("floor", event.target.value)}
              className="premium-select mt-2 border-white/8 bg-white/8 text-white"
            >
              <option value="">{messages.apartments.any}</option>
              {floorOptions.map((floor) => (
                <option key={floor} value={floor}>
                  {getFloorLabel(locale, floor)}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
            <label className="block">
              <span className="premium-label text-white/54">{messages.apartments.minPrice}</span>
              <input
                value={filters.minPrice}
                onChange={(event) => updateFilter("minPrice", event.target.value)}
                placeholder="80000"
                className="premium-input mt-2 border-white/8 bg-white/8 text-white placeholder:text-white/34"
              />
            </label>
            <label className="block">
              <span className="premium-label text-white/54">{messages.apartments.maxPrice}</span>
              <input
                value={filters.maxPrice}
                onChange={(event) => updateFilter("maxPrice", event.target.value)}
                placeholder="140000"
                className="premium-input mt-2 border-white/8 bg-white/8 text-white placeholder:text-white/34"
              />
            </label>
          </div>

          <label className="block">
            <span className="premium-label text-white/54">{messages.apartments.orientation}</span>
            <select
              value={filters.orientation}
              onChange={(event) => updateFilter("orientation", event.target.value)}
              className="premium-select mt-2 border-white/8 bg-white/8 text-white"
            >
              <option value="">{messages.apartments.any}</option>
              {orientationOptions.map((orientation) => (
                <option key={orientation} value={orientation}>
                  {getOrientationLabel(locale, orientation)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="premium-label text-white/54">{messages.apartments.availability}</span>
            <select
              value={filters.status}
              onChange={(event) => updateFilter("status", event.target.value)}
              className="premium-select mt-2 border-white/8 bg-white/8 text-white"
            >
              <option value="">{messages.apartments.any}</option>
              <option value="available">{locale === "bg" ? "Свободен" : "Available"}</option>
              <option value="reserved">{locale === "bg" ? "Резервиран" : "Reserved"}</option>
              <option value="sold">{locale === "bg" ? "Продаден" : "Sold"}</option>
            </select>
          </label>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={reset}
            className="premium-button-secondary border-white/10 bg-white/8 px-5 py-3 text-sm font-semibold text-white"
          >
            {messages.apartments.reset}
          </button>
          <Link href="/contact" className="premium-button px-5 py-3 text-sm font-semibold">
            {messages.apartments.needAdvice}
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-10 border-t border-[color:var(--line)] pt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">{messages.common.searchResults}</p>
              <h3 className="mt-2 font-serif text-4xl text-[color:var(--ink)] xl:text-5xl">
                {locale === "bg" ? `${units.length} жилища съвпадат` : `${units.length} homes match`}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
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

          <p className="mt-5 max-w-3xl text-base leading-8 text-[color:var(--muted)]">
            {messages.apartments.resultsCopy}
          </p>
        </div>

        {units.length ? (
          <div className="grid gap-10">
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
  );
}
