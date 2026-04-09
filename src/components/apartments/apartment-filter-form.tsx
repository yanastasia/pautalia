"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getFloorLabel, getMessages } from "@/lib/i18n/messages";
import { getOrientationLabel } from "@/lib/i18n/property";

export type FinderFilters = {
  building: string;
  rooms: string;
  floor: string;
  minPrice: string;
  maxPrice: string;
  orientation: string;
  status: string;
};

export type FinderOption = {
  value: string;
  label: string;
};

type ApartmentFilterFormProps = {
  locale: Locale;
  filters: FinderFilters;
  buildingOptions: FinderOption[];
  floorOptions: number[];
  orientationOptions: string[];
  onChange: (key: keyof FinderFilters, value: string) => void;
  onReset: () => void;
  compact?: boolean;
  showHeader?: boolean;
};

export function ApartmentFilterForm({
  locale,
  filters,
  buildingOptions,
  floorOptions,
  orientationOptions,
  onChange,
  onReset,
  compact = false,
  showHeader = true,
}: ApartmentFilterFormProps) {
  const messages = getMessages(locale);

  return (
    <>
      {showHeader ? (
        <>
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
        </>
      ) : null}

      <div className={`${showHeader ? "mt-8" : ""} grid gap-4 ${compact ? "" : "sm:grid-cols-2 lg:grid-cols-1"}`}>
        <label className="block">
          <span className="premium-label text-white/54">{messages.apartments.building}</span>
          <select
            value={filters.building}
            onChange={(event) => onChange("building", event.target.value)}
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
            onChange={(event) => onChange("rooms", event.target.value)}
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
            onChange={(event) => onChange("floor", event.target.value)}
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

        <div className={`grid grid-cols-2 gap-3 ${compact ? "" : "sm:col-span-2 lg:col-span-1"}`}>
          <label className="block">
            <span className="premium-label text-white/54">{messages.apartments.minPrice}</span>
            <input
              value={filters.minPrice}
              onChange={(event) => onChange("minPrice", event.target.value)}
              placeholder="80000"
              className="premium-input mt-2 border-white/8 bg-white/8 text-white placeholder:text-white/34"
            />
          </label>
          <label className="block">
            <span className="premium-label text-white/54">{messages.apartments.maxPrice}</span>
            <input
              value={filters.maxPrice}
              onChange={(event) => onChange("maxPrice", event.target.value)}
              placeholder="140000"
              className="premium-input mt-2 border-white/8 bg-white/8 text-white placeholder:text-white/34"
            />
          </label>
        </div>

        <label className="block">
          <span className="premium-label text-white/54">{messages.apartments.orientation}</span>
          <select
            value={filters.orientation}
            onChange={(event) => onChange("orientation", event.target.value)}
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
            onChange={(event) => onChange("status", event.target.value)}
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
          onClick={onReset}
          className="premium-button-secondary border-white/10 bg-white/8 px-5 py-3 text-sm font-semibold text-white"
        >
          {messages.apartments.reset}
        </button>
        <Link href="/contact" className="premium-button px-5 py-3 text-sm font-semibold">
          {messages.apartments.needAdvice}
        </Link>
      </div>
    </>
  );
}
