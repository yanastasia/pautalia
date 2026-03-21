"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { UnitCard } from "@/components/apartments/unit-card";
import { BuildingFloorplanBrowser } from "@/components/buildings/building-floorplan-browser";
import { buildingSelectorVisuals } from "@/data/building-selector-visuals";
import { getFloorLabel, getResidenceLabel, getStatusLabel } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/config";
import { cn, formatCurrency } from "@/lib/utils";
import type { UnitStatus } from "@/types/domain";
import type { PublicBuilding, PublicFloor, PublicUnit } from "@/types/public-api";

type BuildingInventorySelectorProps = {
  building: PublicBuilding;
  floors: PublicFloor[];
  units: PublicUnit[];
  filteredUnits: PublicUnit[];
  locale: Locale;
};

type Filters = {
  floor: string;
  rooms: string;
  status: string;
  maxPrice: string;
  maxArea: string;
};

function getFilters(searchParams: URLSearchParams): Filters {
  return {
    floor: searchParams.get("floor") ?? "",
    rooms: searchParams.get("rooms") ?? "",
    status: searchParams.get("status") ?? searchParams.get("availability") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? searchParams.get("price_max") ?? "",
    maxArea: searchParams.get("maxArea") ?? "",
  };
}

export function BuildingInventorySelector({
  building,
  floors,
  units,
  filteredUnits,
  locale,
}: BuildingInventorySelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = getFilters(searchParams);
  const visiblePrices = units.filter((unit) => unit.isPriceVisible && unit.price !== null);
  const hasVisiblePrices = visiblePrices.length > 0;
  const minVisiblePrice = hasVisiblePrices ? Math.min(...visiblePrices.map((unit) => unit.price ?? 0)) : 0;
  const absoluteMaxPrice = hasVisiblePrices ? Math.max(...visiblePrices.map((unit) => unit.price ?? 0)) : 0;
  const absoluteMaxArea = Math.max(...units.map((unit) => unit.areaTotalSqm), 0);
  const selectedFloor = filters.floor ? Number(filters.floor) : null;
  const selectedRooms = filters.rooms ? Number(filters.rooms) : null;
  const selectedStatus = (filters.status || "all") as UnitStatus | "all";
  const maxPriceFilter = filters.maxPrice ? Number(filters.maxPrice) : absoluteMaxPrice;
  const maxAreaFilter = filters.maxArea ? Number(filters.maxArea) : absoluteMaxArea;

  const floorsDescending = useMemo(
    () => [...floors].sort((left, right) => right.number - left.number),
    [floors],
  );

  const roomOptions = useMemo(
    () => Array.from(new Set(units.map((unit) => unit.rooms))).sort((left, right) => left - right),
    [units],
  );

  const previewUnits = useMemo(() => {
    const availableUnits = filteredUnits.filter((unit) => unit.status === "available");
    return (availableUnits.length ? availableUnits : filteredUnits).slice(0, 2);
  }, [filteredUnits]);

  const selectedFloorMeta = selectedFloor === null
    ? null
    : floors.find((floor) => floor.number === selectedFloor) ?? null;

  const selectedFloorUnits = useMemo(() => {
    if (selectedFloorMeta === null) {
      return [];
    }

    return units.filter((unit) => unit.floor === selectedFloorMeta.number);
  }, [selectedFloorMeta, units]);

  const selectedFloorCount =
    selectedFloor === null ? units.length : units.filter((unit) => unit.floor === selectedFloor).length;

  const selectedFloorAvailable =
    selectedFloor === null
      ? units.filter((unit) => unit.status === "available").length
      : units.filter((unit) => unit.floor === selectedFloor && unit.status === "available").length;

  const ui = locale === "bg"
    ? {
        eyebrow: "Интерактивен избор",
        title: "Свободни жилища по етаж.",
        copy: "Изберете етаж и прегледайте наличните жилища по-долу.",
        selectedFloor: "Избран етаж",
        allFloors: "Всички етажи",
        homesShown: "Показани жилища",
        availableNow: "Свободни сега",
        filterTitle: "Филтри",
        type: "Тип",
        status: "Статус",
        priceLimit: "Макс. цена",
        areaLimit: "Макс. площ",
        reset: "Нулирай",
        tableEyebrow: "Наличност",
        tableTitle: "Списък на жилищата",
        tableCopy: "Преглед по етаж, статус, площ и цена.",
        priceOnRequest: "Цена при запитване",
        apartmentNumber: "Апартамент",
        details: "Детайли",
        previewEyebrow: "Преглед",
        previewTitle: "Избрани жилища от текущия резултат",
        previewCopy: "Кратък преглед на наличните жилища от текущата селекция.",
        empty: "Няма жилища за тази комбинация от филтри.",
      }
    : {
        eyebrow: "Interactive selector",
        title: "Available homes by floor.",
        copy: "Select a floor and review the available homes below.",
        selectedFloor: "Selected floor",
        allFloors: "All floors",
        homesShown: "Homes shown",
        availableNow: "Available now",
        filterTitle: "Filters",
        type: "Type",
        status: "Status",
        priceLimit: "Max price",
        areaLimit: "Max area",
        reset: "Reset",
        tableEyebrow: "Availability",
        tableTitle: "Apartment list",
        tableCopy: "View the homes by floor, status, area, and price.",
        priceOnRequest: "Price on request",
        apartmentNumber: "Apartment",
        details: "Details",
        previewEyebrow: "Preview",
        previewTitle: "Selected homes from the current result",
        previewCopy: "A short preview of the currently available homes in this selection.",
        empty: "No homes match this filter combination.",
      };

  const visual = buildingSelectorVisuals[building.id as keyof typeof buildingSelectorVisuals] ?? buildingSelectorVisuals.a;

  function updateFilter(key: keyof Filters, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (!value) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    nextParams.delete("availability");
    nextParams.delete("price_max");
    nextParams.delete("page");

    startTransition(() => {
      const nextQuery = nextParams.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    });
  }

  function handleFloorSelect(floorNumber: number | null) {
    updateFilter("floor", floorNumber === null ? "" : String(floorNumber));
  }

  function resetFilters() {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  return (
    <div>
      <div className="overflow-hidden bg-[color:var(--surface-dark)]">
        {selectedFloorMeta ? (
          <BuildingFloorplanBrowser
            floors={floors}
            selectedFloor={selectedFloorMeta}
            units={selectedFloorUnits}
            locale={locale}
            onFloorSelect={handleFloorSelect}
          />
        ) : (
          <div
            className="relative overflow-hidden bg-[color:var(--surface-dark)]"
            style={{ aspectRatio: visual.aspectRatio ?? "16 / 9" }}
          >
            <Image
              src={visual.src}
              alt={building.name}
              fill
              className={cn("object-cover", visual.position)}
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,12,14,0.14),rgba(11,12,14,0.28)_42%,rgba(11,12,14,0.72)_100%)]" />
            <div className="absolute inset-0">
              {floorsDescending.map((floor, index) => {
                const isActive = selectedFloor === floor.number;
                const band = visual.floorBands?.[floor.number];
                const fallbackHeight = 100 / floorsDescending.length;

                return (
                  <button
                    key={floor.id}
                    type="button"
                    onClick={() => handleFloorSelect(floor.number)}
                    className={cn(
                      "absolute left-0 right-0 flex items-center justify-between border border-white/16 px-5 text-left text-white transition",
                      isActive ? "bg-[rgba(197,160,89,0.32)]" : "bg-black/12 hover:bg-[rgba(197,160,89,0.2)]",
                    )}
                    style={{
                      top: band ? `${band.top}%` : `${11 + index * fallbackHeight * 0.78}%`,
                      left: band ? `${band.left}%` : "12%",
                      right: band ? `${band.right}%` : "12%",
                      height: band ? `${band.height}%` : `calc(${fallbackHeight * 0.78}% - 0.45rem)`,
                    }}
                  >
                    <span className="text-[0.76rem] font-semibold uppercase tracking-[0.26em] text-white/74">
                      {getFloorLabel(locale, floor.number)}
                    </span>
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/56">
                      {units.filter((unit) => unit.floor === floor.number).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className={cn("border-t border-white/10 px-6 py-8 text-white sm:px-8", selectedFloorMeta ? "pt-7" : "")}>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-white/42">{ui.eyebrow}</p>
          <h3 className="mt-4 font-serif text-5xl leading-[0.96] text-white">
            {selectedFloorMeta
              ? locale === "bg"
                ? `Жилища на ${getFloorLabel(locale, selectedFloorMeta.number).toLowerCase()}.`
                : `Homes on ${getFloorLabel(locale, selectedFloorMeta.number).toLowerCase()}.`
              : ui.title}
          </h3>
          <p className="mt-5 max-w-xl text-[1rem] leading-8 text-white/64">
            {selectedFloorMeta
              ? locale === "bg"
                ? "Прегледайте плана, посочете жилище и продължете към неговите детайли."
                : "Review the plan, hover a home, and continue to its details."
              : ui.copy}
          </p>

          <div className="mt-8 grid gap-5 border-t border-white/10 pt-6 lg:grid-cols-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/44">{ui.selectedFloor}</p>
              <p className="mt-3 font-serif text-3xl text-white">
                {selectedFloor === null ? ui.allFloors : getFloorLabel(locale, selectedFloor)}
              </p>
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/44">{ui.homesShown}</p>
              <p className="mt-3 font-serif text-3xl text-white">{selectedFloorCount}</p>
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/44">{ui.availableNow}</p>
              <p className="mt-3 font-serif text-3xl text-white">{selectedFloorAvailable}</p>
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/44">{ui.tableEyebrow}</p>
              <p className="mt-3 font-serif text-3xl text-white">{filteredUnits.length}</p>
            </div>
          </div>

          {!selectedFloorMeta ? (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={() => handleFloorSelect(null)}
                className={cn(
                  "px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em]",
                  selectedFloor === null ? "bg-white text-[color:var(--ink)]" : "border border-white/12 text-white/78",
                )}
              >
                {ui.allFloors}
              </button>
              {floors.map((floor) => (
                <button
                  key={floor.id}
                  type="button"
                  onClick={() => handleFloorSelect(floor.number)}
                  className={cn(
                    "px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em]",
                    selectedFloor === floor.number ? "bg-white text-[color:var(--ink)]" : "border border-white/12 text-white/78",
                  )}
                >
                  {getFloorLabel(locale, floor.number)}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-10 border-t border-[color:var(--line)] pt-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">{ui.filterTitle}</p>
            <h3 className="mt-3 font-serif text-4xl text-[color:var(--ink)]">{ui.tableTitle}</h3>
            <p className="mt-3 max-w-2xl text-[0.98rem] leading-8 text-[color:var(--muted)]">{ui.tableCopy}</p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 border border-[color:var(--line-strong)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--ink)]"
          >
            <RotateCcw className="size-4" />
            {ui.reset}
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-[0.95fr_0.95fr_0.95fr_1.2fr_1.2fr]">
          <label className="block">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{ui.type}</span>
            <select
              value={filters.rooms}
              onChange={(event) => updateFilter("rooms", event.target.value)}
              className="premium-select mt-2"
            >
              <option value="">{locale === "bg" ? "Всички" : "All"}</option>
              {roomOptions.map((roomCount) => (
                <option key={roomCount} value={roomCount}>
                  {getResidenceLabel(locale, roomCount)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{getFloorLabel(locale, 1).split(" ")[0]}</span>
            <select
              value={filters.floor}
              onChange={(event) => updateFilter("floor", event.target.value)}
              className="premium-select mt-2"
            >
              <option value="">{ui.allFloors}</option>
              {floors.map((floor) => (
                <option key={floor.id} value={floor.number}>
                  {getFloorLabel(locale, floor.number)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{ui.status}</span>
            <select
              value={selectedStatus === "all" ? "" : selectedStatus}
              onChange={(event) => updateFilter("status", event.target.value)}
              className="premium-select mt-2"
            >
              <option value="">{locale === "bg" ? "Всички" : "All"}</option>
              <option value="available">{getStatusLabel(locale, "available")}</option>
              <option value="reserved">{getStatusLabel(locale, "reserved")}</option>
              <option value="sold">{getStatusLabel(locale, "sold")}</option>
            </select>
          </label>

          <label className="block">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{ui.priceLimit}</span>
              <span className="text-sm font-semibold text-[color:var(--ink)]">
                {hasVisiblePrices ? formatCurrency(maxPriceFilter) : ui.priceOnRequest}
              </span>
            </div>
            {hasVisiblePrices ? (
              <input
                type="range"
                min={minVisiblePrice}
                max={absoluteMaxPrice}
                step={1000}
                value={maxPriceFilter}
                onChange={(event) => updateFilter("maxPrice", event.target.value)}
                className="mt-4 w-full accent-[color:var(--accent)]"
              />
            ) : (
              <div className="mt-4 rounded-[1rem] border border-[color:var(--line)] bg-[color:var(--background-deep)] px-4 py-3 text-sm text-[color:var(--muted)]">
                {ui.priceOnRequest}
              </div>
            )}
          </label>

          <label className="block">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{ui.areaLimit}</span>
              <span className="text-sm font-semibold text-[color:var(--ink)]">
                {maxAreaFilter} {locale === "bg" ? "кв.м" : "sq m"}
              </span>
            </div>
            <input
              type="range"
              min={units.length ? Math.min(...units.map((unit) => unit.areaTotalSqm)) : 0}
              max={absoluteMaxArea}
              step={1}
              value={maxAreaFilter}
              onChange={(event) => updateFilter("maxArea", event.target.value)}
              className="mt-4 w-full accent-[color:var(--accent)]"
            />
          </label>
        </div>

        <div className="mt-10 overflow-hidden border border-[color:var(--line)]">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.75fr_0.9fr_0.9fr_0.8fr] gap-4 bg-[color:var(--surface)] px-4 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
            <span>{ui.apartmentNumber}</span>
            <span>{ui.type}</span>
            <span>{getFloorLabel(locale, 1).split(" ")[0]}</span>
            <span>{locale === "bg" ? "Площ" : "Area"}</span>
            <span>{ui.status}</span>
            <span>{locale === "bg" ? "Цена" : "Price"}</span>
          </div>
          {filteredUnits.length ? (
            filteredUnits.map((unit) => (
              <div
                key={unit.id}
                className="grid grid-cols-[1.2fr_0.8fr_0.75fr_0.9fr_0.9fr_0.8fr] gap-4 border-t border-[color:var(--line)] px-4 py-4 text-sm text-[color:var(--ink)]"
              >
                <Link href={`/unit/${unit.slug}`} className="font-semibold hover:text-[color:var(--accent)]">
                  {unit.code}
                </Link>
                <span>{getResidenceLabel(locale, unit.rooms)}</span>
                <span>{unit.floor}</span>
                <span>{unit.areaTotalSqm} {locale === "bg" ? "кв.м" : "sq m"}</span>
                <span>{getStatusLabel(locale, unit.status)}</span>
                <span>
                  {unit.isPriceVisible && unit.price !== null ? formatCurrency(unit.price) : ui.priceOnRequest}
                </span>
              </div>
            ))
          ) : (
            <div className="border-t border-[color:var(--line)] px-4 py-10 text-sm text-[color:var(--muted)]">
              {ui.empty}
            </div>
          )}
        </div>

        {previewUnits.length ? (
          <div className="mt-14">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">{ui.previewEyebrow}</p>
            <h4 className="mt-3 font-serif text-4xl text-[color:var(--ink)]">{ui.previewTitle}</h4>
            <p className="mt-3 max-w-2xl text-[0.98rem] leading-8 text-[color:var(--muted)]">{ui.previewCopy}</p>
            <div className="mt-10 grid gap-10">
              {previewUnits.map((unit) => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
