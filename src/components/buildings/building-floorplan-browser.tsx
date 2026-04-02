"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { getFloorLabel, getStatusLabel } from "@/lib/i18n/messages";
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

type CalloutPosition = {
  left: string;
  top: string;
  transform: string;
  maxWidthClass: string;
  pointerClassName: string;
};

type Point = [number, number];

type TrimmedPlanConfig = {
  aspectRatio: string;
  imageScaleClassName: string;
  hotspotScale: number;
  hotspotOffsetX: number;
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

const trimmedPlanConfigs: Record<string, TrimmedPlanConfig> = {
  "/assets/floorplans/first_floor.png": {
    aspectRatio: "1000 / 634",
    imageScaleClassName: "origin-center scale-[1.07]",
    hotspotScale: 1.8,
    hotspotOffsetX: 1.2,
  },
  "/assets/floorplans/second_floor.png": {
    aspectRatio: "1000 / 634",
    imageScaleClassName: "origin-center scale-[1.07]",
    hotspotScale: 1,
    hotspotOffsetX: 0,
  },
  "/assets/floorplans/third_floor.png": {
    aspectRatio: "1000 / 634",
    imageScaleClassName: "origin-center scale-[1.07]",
    hotspotScale: 1,
    hotspotOffsetX: 0,
  },
  "/assets/floorplans/fourth_floor.png": {
    aspectRatio: "1000 / 634",
    imageScaleClassName: "origin-center scale-[1.07]",
    hotspotScale: 1,
    hotspotOffsetX: 0,
  },
};

function parsePolygonPoints(points: string): Point[] {
  return points
    .split(" ")
    .map((point) => point.split(",").map(Number))
    .filter((pair): pair is Point => pair.length === 2 && pair.every((value) => Number.isFinite(value)));
}

function scalePoints(points: Point[], factor: number): Point[] {
  if (factor === 1) {
    return points;
  }

  return points.map(([x, y]) => [50 + (x - 50) * factor, 50 + (y - 50) * factor]);
}

function offsetPoints(points: Point[], offsetX: number, offsetY = 0): Point[] {
  if (offsetX === 0 && offsetY === 0) {
    return points;
  }

  return points.map(([x, y]) => [x + offsetX, y + offsetY]);
}

function stringifyPoints(points: Point[]): string {
  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

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
  const trimmedPlanConfig = trimmedPlanConfigs[selectedFloor.floorplanImage];
  const trimmedHotspotScale = trimmedPlanConfig?.hotspotScale ?? 1;
  const trimmedHotspotOffsetX = trimmedPlanConfig?.hotspotOffsetX ?? 0;
  const mapAspectRatio = trimmedPlanConfig
    ? trimmedPlanConfig.aspectRatio
    : selectedFloor.mapAspectRatio === "1 / 1"
      ? "1000 / 640"
      : (selectedFloor.mapAspectRatio ?? "829 / 765");
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

  const activeCalloutPosition = useMemo<CalloutPosition | null>(() => {
    if (!activeUnit) {
      return null;
    }

    const getCalloutPosition = (left: number, right: number, top: number): CalloutPosition => {
      const centerX = (left + right) / 2;
      const anchorTop = top < 33 ? top + 5.5 : top + 2.5;

      if (centerX < 28) {
        return {
          left: `${Math.min(right + 5.5, 40)}%`,
          top: `${Math.max(anchorTop, 31)}%`,
          transform: "translate(0, -50%)",
          maxWidthClass: "max-w-[10.5rem] sm:max-w-[11.25rem]",
          pointerClassName:
            "left-0 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-b",
        };
      }

      if (centerX > 72) {
        return {
          left: `${Math.max(left - 5.5, 60)}%`,
          top: `${Math.max(anchorTop, 31)}%`,
          transform: "translate(-100%, -50%)",
          maxWidthClass: "max-w-[10.5rem] sm:max-w-[11.25rem]",
          pointerClassName:
            "left-full top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-t border-r",
        };
      }

      return {
        left: `${centerX}%`,
        top: `${Math.max(anchorTop, 31)}%`,
        transform: "translate(-50%, -92%)",
        maxWidthClass: "max-w-[11.25rem] sm:max-w-[12rem]",
        pointerClassName:
          "left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b",
      };
    };

    if (activeUnit.planPolygonPoints?.length) {
      const points = offsetPoints(
        scalePoints(parsePolygonPoints(activeUnit.planPolygonPoints[0]), trimmedHotspotScale),
        trimmedHotspotOffsetX,
      );

      if (points.length > 0) {
        const left = points.reduce((min, [x]) => Math.min(min, x), Number.POSITIVE_INFINITY);
        const right = points.reduce((max, [x]) => Math.max(max, x), Number.NEGATIVE_INFINITY);
        const top = points.reduce((min, [, y]) => Math.min(min, y), Number.POSITIVE_INFINITY);
        return getCalloutPosition(left, right, top);
      }
    }

    const region = activeUnit.planRegions?.[0] ?? activeUnit.planArea;
    return getCalloutPosition(region.x, region.x + region.width, region.y);
  }, [activeUnit, trimmedHotspotOffsetX, trimmedHotspotScale]);

  const handleUnitKeyDown = (event: KeyboardEvent<SVGPolygonElement | SVGRectElement>, slug: string, unitId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      router.push(`/unit/${slug}`);
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const currentIndex = sortedUnits.findIndex((unit) => unit.id === unitId);
      const nextUnit = sortedUnits[(currentIndex + 1) % sortedUnits.length];
      setActiveUnitId(nextUnit?.id ?? unitId);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const currentIndex = sortedUnits.findIndex((unit) => unit.id === unitId);
      const nextUnit = sortedUnits[(currentIndex - 1 + sortedUnits.length) % sortedUnits.length];
      setActiveUnitId(nextUnit?.id ?? unitId);
    }
  };

  return (
    <div className="card-surface-dark rounded-[1.9rem] p-4 sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[10.5rem_minmax(0,1fr)]">
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

        <div className="order-1 rounded-[1.55rem] border border-white/10 bg-[#f6f2ea] p-2.5 sm:p-4 lg:order-2">
          <div className="mb-1.5 flex justify-start">
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
            className="relative overflow-hidden rounded-[1rem] border border-[color:var(--line)] bg-white"
            style={{ aspectRatio: mapAspectRatio }}
          >
            <div
              className={cn(
                "absolute inset-0",
                trimmedPlanConfig?.imageScaleClassName ?? "origin-top scale-[1.42] -translate-y-[35%]",
              )}
            >
              <Image
                src={selectedFloor.floorplanImage}
                alt={`${selectedFloor.label} floor plan`}
                fill
                className={cn("object-contain", trimmedPlanConfig ? "object-center" : "object-top")}
                sizes="(max-width: 1024px) 100vw, 960px"
              />

              {activeUnit && activeTheme && activeCalloutPosition ? (
                <div
                  className="pointer-events-none absolute z-10"
                  style={{
                    left: activeCalloutPosition.left,
                    top: activeCalloutPosition.top,
                    transform: activeCalloutPosition.transform,
                  }}
                >
                  <div
                    className={cn(
                      "pointer-events-auto relative inline-flex w-full items-center gap-1.5 rounded-[1.35rem] border px-2.5 py-1.5 backdrop-blur-xl sm:px-3 sm:py-1.75",
                      activeCalloutPosition.maxWidthClass,
                      activeTheme.floating,
                    )}
                  >
                    <div>
                      <p className="text-[0.45rem] font-semibold uppercase tracking-[0.16em] opacity-70">
                        {getStatusLabel(locale, activeUnit.status)}
                      </p>
                      <div className="mt-0.5 flex items-end gap-1">
                        <span className="font-serif text-[1.15rem] leading-none sm:text-[1.35rem]">{activeUnit.code}</span>
                        <span className="pb-0.5 text-[0.62rem] opacity-75 sm:text-[0.68rem]">
                          {activeUnit.areaTotalSqm} {locale === "bg" ? "кв.м" : "sq m"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push(`/unit/${activeUnit.slug}`)}
                      className={cn(
                        "rounded-full border border-current/14 px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.08em] sm:px-2.5 sm:text-[0.56rem]",
                        activeTheme.floatingAction,
                      )}
                    >
                      {ui.details}
                    </button>
                    <span
                      className={cn("absolute", activeCalloutPosition.pointerClassName)}
                      style={{
                        backgroundColor: "rgba(248,245,239,0.94)",
                        borderColor: "currentColor",
                        opacity: 0.9,
                      }}
                    />
                  </div>
                </div>
              ) : null}

              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 size-full"
                aria-label={`${ui.apartmentsLabel} ${getFloorLabel(locale, selectedFloor.number)}`}
              >
                {sortedUnits.map((unit) => {
                  const isActive = activeUnit?.id === unit.id;
                  const theme = overlayThemes[unit.status];

                if (unit.planPolygonPoints?.length) {
                  return unit.planPolygonPoints.map((points, index) => {
                    const displayPoints = stringifyPoints(
                      offsetPoints(scalePoints(parsePolygonPoints(points), trimmedHotspotScale), trimmedHotspotOffsetX),
                    );

                    return (
                        <polygon
                          key={`${unit.id}-polygon-${index}`}
                          points={displayPoints}
                          role="button"
                          aria-label={index === 0 ? `${ui.apartmentsLabel} ${unit.code}` : undefined}
                          aria-hidden={index > 0 ? true : undefined}
                          tabIndex={index === 0 ? 0 : -1}
                          onMouseEnter={() => setActiveUnitId(unit.id)}
                          onFocus={() => setActiveUnitId(unit.id)}
                          onClick={() => router.push(`/unit/${unit.slug}`)}
                          onKeyDown={(event) => handleUnitKeyDown(event, unit.slug, unit.id)}
                          className="cursor-pointer outline-none transition-all duration-200"
                          fill={isActive ? theme.fill : "rgba(255,255,255,0.01)"}
                          stroke={isActive ? theme.border : "rgba(255,255,255,0.02)"}
                          strokeWidth={isActive ? 0.65 : 0.35}
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                  });
                }

                  const regions = unit.planRegions?.length ? unit.planRegions : [unit.planArea];
                  return regions.map((region, index) => (
                    <rect
                      key={`${unit.id}-rect-${index}`}
                      x={region.x}
                      y={region.y}
                      width={region.width}
                      height={region.height}
                      rx={1.2}
                      role="button"
                      aria-label={index === 0 ? `${ui.apartmentsLabel} ${unit.code}` : undefined}
                      aria-hidden={index > 0 ? true : undefined}
                      tabIndex={index === 0 ? 0 : -1}
                      onMouseEnter={() => setActiveUnitId(unit.id)}
                      onFocus={() => setActiveUnitId(unit.id)}
                      onClick={() => router.push(`/unit/${unit.slug}`)}
                      onKeyDown={(event) => handleUnitKeyDown(event, unit.slug, unit.id)}
                      className="cursor-pointer outline-none transition-all duration-200"
                      fill={isActive ? theme.fill : "rgba(255,255,255,0.01)"}
                      stroke={isActive ? theme.border : "rgba(255,255,255,0.02)"}
                      strokeWidth={isActive ? 0.65 : 0.35}
                      vectorEffect="non-scaling-stroke"
                    />
                  ));
                })}
              </svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
