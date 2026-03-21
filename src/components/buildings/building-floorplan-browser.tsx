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
  panel: string;
  panelTag: string;
  floating: string;
  floatingAction: string;
};

const overlayThemes: Record<UnitStatus, OverlayTheme> = {
  available: {
    fill: "rgba(80, 166, 112, 0.42)",
    border: "rgba(46, 111, 72, 0.98)",
    shadow: "0 0 0 3px rgba(80, 166, 112, 0.18), inset 0 0 0 1px rgba(255,255,255,0.14)",
    button: "border-emerald-300/40 bg-[rgba(77,138,101,0.28)] text-white shadow-[0_14px_30px_rgba(31,72,47,0.24)]",
    dot: "bg-emerald-400",
    panel: "border-[rgba(77,138,101,0.22)] bg-[rgba(255,255,255,0.92)]",
    panelTag: "bg-[rgba(77,138,101,0.12)] text-[rgb(46,111,72)]",
    floating: "border-[rgba(77,138,101,0.26)] bg-[rgba(248,245,239,0.94)] text-[rgb(28,65,41)] shadow-[0_22px_48px_rgba(31,72,47,0.18)]",
    floatingAction: "text-[rgb(46,111,72)]",
  },
  reserved: {
    fill: "rgba(196, 156, 79, 0.38)",
    border: "rgba(154, 114, 38, 0.98)",
    shadow: "0 0 0 3px rgba(196, 156, 79, 0.18), inset 0 0 0 1px rgba(255,255,255,0.14)",
    button: "border-amber-200/40 bg-[rgba(182,140,64,0.28)] text-white shadow-[0_14px_30px_rgba(102,74,24,0.24)]",
    dot: "bg-amber-300",
    panel: "border-[rgba(182,140,64,0.2)] bg-[rgba(255,255,255,0.92)]",
    panelTag: "bg-[rgba(182,140,64,0.14)] text-[rgb(134,96,28)]",
    floating: "border-[rgba(182,140,64,0.26)] bg-[rgba(248,245,239,0.94)] text-[rgb(92,67,23)] shadow-[0_22px_48px_rgba(102,74,24,0.18)]",
    floatingAction: "text-[rgb(134,96,28)]",
  },
  sold: {
    fill: "rgba(180, 89, 89, 0.34)",
    border: "rgba(143, 56, 56, 0.98)",
    shadow: "0 0 0 3px rgba(180, 89, 89, 0.18), inset 0 0 0 1px rgba(255,255,255,0.14)",
    button: "border-red-300/36 bg-[rgba(143,56,56,0.28)] text-white shadow-[0_14px_30px_rgba(91,34,34,0.24)]",
    dot: "bg-red-400",
    panel: "border-[rgba(143,56,56,0.18)] bg-[rgba(255,255,255,0.92)]",
    panelTag: "bg-[rgba(143,56,56,0.1)] text-[rgb(122,48,48)]",
    floating: "border-[rgba(143,56,56,0.24)] bg-[rgba(248,245,239,0.94)] text-[rgb(96,37,37)] shadow-[0_22px_48px_rgba(91,34,34,0.18)]",
    floatingAction: "text-[rgb(122,48,48)]",
  },
  hidden: {
    fill: "rgba(148, 163, 184, 0.22)",
    border: "rgba(100, 116, 139, 0.92)",
    shadow: "0 0 0 4px rgba(148, 163, 184, 0.16)",
    button: "border-slate-400/28 bg-slate-400/10 text-white/88",
    dot: "bg-slate-300",
    panel: "border-[rgba(100,116,139,0.14)] bg-[rgba(255,255,255,0.92)]",
    panelTag: "bg-[rgba(100,116,139,0.1)] text-[rgb(71,85,105)]",
    floating: "border-[rgba(100,116,139,0.18)] bg-[rgba(248,245,239,0.94)] text-[rgb(51,65,85)] shadow-[0_22px_48px_rgba(51,65,85,0.14)]",
    floatingAction: "text-[rgb(71,85,105)]",
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
  const activeTheme = activeUnit ? overlayThemes[activeUnit.status] : null;
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

            {activeUnit && activeTheme ? (
              <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center px-3 sm:top-4">
                <div
                  className={cn(
                    "pointer-events-auto inline-flex items-center gap-4 rounded-full border px-4 py-3 backdrop-blur-xl sm:px-5",
                    activeTheme.floating,
                  )}
                >
                  <div>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] opacity-70">
                      {getStatusLabel(locale, activeUnit.status)}
                    </p>
                    <div className="mt-1 flex items-end gap-3">
                      <span className="font-serif text-3xl leading-none">{activeUnit.code}</span>
                      <span className="pb-1 text-sm opacity-75">
                        {activeUnit.areaTotalSqm} {locale === "bg" ? "кв.м" : "sq m"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(`/unit/${activeUnit.slug}`)}
                    className={cn(
                      "rounded-full border border-current/14 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em]",
                      activeTheme.floatingAction,
                    )}
                  >
                    {ui.details}
                  </button>
                </div>
              </div>
            ) : null}

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

          {activeUnit && activeTheme ? (
            <div
              className={cn(
                "mt-4 flex flex-col gap-4 rounded-[1.4rem] border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6",
                activeTheme.panel,
              )}
            >
              <div className="min-w-0">
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.22em]",
                    activeTheme.panelTag,
                  )}
                >
                  {getStatusLabel(locale, activeUnit.status)}
                </span>
                <h4 className="mt-3 font-serif text-[2.35rem] leading-none text-[color:var(--ink)]">{activeUnit.code}</h4>
                <p className="mt-2 text-[1.02rem] text-[color:var(--muted)]">
                  {getResidenceLabel(locale, activeUnit.rooms)} . {activeUnit.areaTotalSqm} {locale === "bg" ? "кв.м" : "sq m"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push(`/unit/${activeUnit.slug}`)}
                className="rounded-full border border-[color:var(--line-strong)] bg-white/86 px-7 py-3.5 text-sm font-semibold text-[color:var(--ink)] shadow-[0_10px_24px_rgba(18,19,20,0.06)]"
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
