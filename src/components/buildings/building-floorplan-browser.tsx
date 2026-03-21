"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getFloorLabel, getResidenceLabel, getStatusLabel } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import type { UnitStatus } from "@/types/domain";
import type { PublicFloor, PublicUnit } from "@/types/public-api";

type BuildingFloorplanBrowserProps = {
  floors: PublicFloor[];
  selectedFloor: PublicFloor;
  units: PublicUnit[];
  locale: Locale;
  onFloorSelect: (floorNumber: number | null) => void;
};

type OverlayTheme = {
  fill: string;
  border: string;
  shadow: string;
  button: string;
  dot: string;
};

const overlayThemes: Record<UnitStatus, OverlayTheme> = {
  available: {
    fill: "rgba(34, 197, 94, 0.28)",
    border: "rgba(21, 128, 61, 0.92)",
    shadow: "0 0 0 4px rgba(34, 197, 94, 0.18)",
    button: "border-emerald-400/40 bg-emerald-500/14 text-white",
    dot: "bg-emerald-400",
  },
  reserved: {
    fill: "rgba(234, 179, 8, 0.28)",
    border: "rgba(202, 138, 4, 0.96)",
    shadow: "0 0 0 4px rgba(234, 179, 8, 0.18)",
    button: "border-amber-300/40 bg-amber-400/16 text-white",
    dot: "bg-amber-300",
  },
  sold: {
    fill: "rgba(239, 68, 68, 0.24)",
    border: "rgba(220, 38, 38, 0.96)",
    shadow: "0 0 0 4px rgba(239, 68, 68, 0.16)",
    button: "border-red-400/40 bg-red-500/14 text-white",
    dot: "bg-red-400",
  },
  hidden: {
    fill: "rgba(148, 163, 184, 0.22)",
    border: "rgba(100, 116, 139, 0.92)",
    shadow: "0 0 0 4px rgba(148, 163, 184, 0.16)",
    button: "border-slate-400/28 bg-slate-400/10 text-white/88",
    dot: "bg-slate-300",
  },
};

export function BuildingFloorplanBrowser({
  floors,
  selectedFloor,
  units,
  locale,
  onFloorSelect,
}: BuildingFloorplanBrowserProps) {
  const router = useRouter();
  const [activeUnitId, setActiveUnitId] = useState<string | null>(units[0]?.id ?? null);

  const floorOptions = useMemo(
    () => [...floors].sort((left, right) => right.number - left.number),
    [floors],
  );

  const sortedUnits = useMemo(
    () =>
      [...units].sort((left, right) =>
        left.code.localeCompare(right.code, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      ),
    [units],
  );

  useEffect(() => {
    setActiveUnitId(sortedUnits[0]?.id ?? null);
  }, [sortedUnits]);

  const activeUnit = sortedUnits.find((unit) => unit.id === activeUnitId) ?? sortedUnits[0] ?? null;
  const ui = locale === "bg"
    ? {
        allFloors: "Всички етажи",
        floorLabel: "Етаж",
        hoverHint: "Посочете жилище или изберете от списъка.",
        apartmentsLabel: "Апартаменти",
        details: "Детайли",
        available: "Свободен",
      }
    : {
        allFloors: "All floors",
        floorLabel: "Floor",
        hoverHint: "Hover a home or choose it from the list.",
        apartmentsLabel: "Apartments",
        details: "Details",
        available: "Available",
      };

  return (
    <div className="card-surface-dark rounded-[1.9rem] p-4 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[11rem_minmax(0,1fr)]">
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:max-h-[52rem] lg:flex-col lg:overflow-visible lg:pb-0">
          {sortedUnits.map((unit) => {
            const isActive = activeUnit?.id === unit.id;
            const theme = overlayThemes[unit.status];

            return (
              <button
                key={unit.id}
                type="button"
                onMouseEnter={() => setActiveUnitId(unit.id)}
                onFocus={() => setActiveUnitId(unit.id)}
                onClick={() => router.push(`/unit/${unit.slug}`)}
                className={cn(
                  "min-w-[7.35rem] rounded-full border px-4 py-3 text-left text-sm font-semibold tracking-[0.01em] backdrop-blur lg:min-w-0",
                  isActive
                    ? theme.button
                    : "border-white/16 bg-white/6 text-white/82 hover:border-white/28 hover:bg-white/10",
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span>{unit.code}</span>
                  <span className={cn("size-2.5 rounded-full", theme.dot)} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="order-1 rounded-[1.55rem] border border-white/10 bg-[#f6f2ea] p-3 sm:p-5 lg:order-2">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="pr-4">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">
                {ui.floorLabel}
              </p>
              <h3 className="mt-2 font-serif text-4xl text-[color:var(--ink)]">
                {getFloorLabel(locale, selectedFloor.number)}
              </h3>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{ui.hoverHint}</p>
            </div>

            <label className="block min-w-[10.5rem]">
              <span className="sr-only">{ui.floorLabel}</span>
              <select
                value={String(selectedFloor.number)}
                onChange={(event) => onFloorSelect(event.target.value ? Number(event.target.value) : null)}
                className="premium-select border-[color:var(--line)] bg-white/86 text-[color:var(--ink)]"
              >
                <option value="">{ui.allFloors}</option>
                {floorOptions.map((floor) => (
                  <option key={floor.id} value={floor.number}>
                    {getFloorLabel(locale, floor.number)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div
            className="relative overflow-hidden rounded-[1.25rem] border border-[color:var(--line)] bg-white"
            style={{ aspectRatio: selectedFloor.mapAspectRatio ?? "829 / 765" }}
          >
            <Image
              src={selectedFloor.floorplanImage}
              alt={`${selectedFloor.label} floor plan`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 960px"
            />

            <div className="absolute inset-0">
              {sortedUnits.map((unit) => {
                const isActive = activeUnit?.id === unit.id;
                const theme = overlayThemes[unit.status];
                const regions = unit.planRegions?.length ? unit.planRegions : [unit.planArea];

                return regions.map((region, index) => (
                  <button
                    key={`${unit.id}-${index}`}
                    type="button"
                    aria-label={index === 0 ? `${ui.apartmentsLabel} ${unit.code}` : undefined}
                    aria-hidden={index > 0 ? true : undefined}
                    tabIndex={index === 0 ? 0 : -1}
                    onMouseEnter={() => setActiveUnitId(unit.id)}
                    onFocus={() => setActiveUnitId(unit.id)}
                    onClick={() => router.push(`/unit/${unit.slug}`)}
                    className="absolute rounded-[0.85rem] border transition-all duration-200"
                    style={{
                      left: `${region.x}%`,
                      top: `${region.y}%`,
                      width: `${region.width}%`,
                      height: `${region.height}%`,
                      backgroundColor: isActive ? theme.fill : "transparent",
                      borderColor: isActive ? theme.border : "transparent",
                      boxShadow: isActive ? theme.shadow : "none",
                    }}
                  >
                    {index === 0 ? <span className="sr-only">{unit.code}</span> : null}
                  </button>
                ));
              })}
            </div>
          </div>

          {activeUnit ? (
            <div className="mt-4 flex flex-col gap-3 rounded-[1.15rem] border border-[color:var(--line)] bg-white/84 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  {getStatusLabel(locale, activeUnit.status)}
                </p>
                <h4 className="mt-2 font-serif text-2xl text-[color:var(--ink)]">{activeUnit.code}</h4>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {getResidenceLabel(locale, activeUnit.rooms)} . {activeUnit.areaTotalSqm} {locale === "bg" ? "кв.м" : "sq m"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push(`/unit/${activeUnit.slug}`)}
                className="premium-button-secondary px-5 py-3 text-sm font-semibold"
              >
                {ui.details}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
