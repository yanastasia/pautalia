"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { formatCurrency } from "@/lib/utils";
import { getMessages } from "@/lib/i18n/messages";
import { getOrientationLabel } from "@/lib/i18n/property";
import { StatusPill } from "@/components/ui/status-pill";
import type { PublicUnit } from "@/types/public-api";

export function FloorplanMap({
  image,
  units,
  aspectRatio = "16 / 9",
}: {
  image: string;
  units: PublicUnit[];
  aspectRatio?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const messages = getMessages(locale);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(units[0]?.id ?? null);
  const activeUnit = units.find((unit) => unit.id === activeUnitId) ?? units[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="relative overflow-hidden rounded-[1.8rem] card-surface-dark p-4">
        <div className="mb-4 flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/8 bg-white/6 px-4 py-3 text-sm text-white/62 backdrop-blur">
          <span>{messages.floor.hoverHint}</span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/48">{messages.common.interactiveOverlay}</span>
        </div>

        <div className="relative overflow-hidden rounded-[1.45rem] border border-white/8 bg-[#0b0c0e]" style={{ aspectRatio }}>
          <Image
            src={image}
            alt={locale === "bg" ? "План на етажа" : "Floor plan"}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          <div className="absolute inset-0">
            {units.map((unit) => {
              const regions = unit.planRegions?.length ? unit.planRegions : [unit.planArea];

              return regions.map((region, index) => (
                <button
                  key={`${unit.id}-${index}`}
                  type="button"
                  aria-label={index === 0 ? (locale === "bg" ? `Отвори апартамент ${unit.code}` : `Open unit ${unit.code}`) : undefined}
                  aria-hidden={index > 0 ? true : undefined}
                  tabIndex={index === 0 ? 0 : -1}
                  onMouseEnter={() => setActiveUnitId(unit.id)}
                  onFocus={() => setActiveUnitId(unit.id)}
                  onClick={() => router.push(`/unit/${unit.slug}`)}
                  className={`absolute rounded-xl border transition-all ${
                    activeUnitId === unit.id
                      ? "border-[color:var(--accent)] bg-[color:var(--accent)]/35 shadow-[0_0_0_4px_rgba(173,138,86,0.16)]"
                      : "border-white/80 bg-[color:var(--accent)]/14 hover:bg-[color:var(--accent)]/24"
                  }`}
                  style={{
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                    width: `${region.width}%`,
                    height: `${region.height}%`,
                  }}
                >
                  {index === 0 ? <span className="sr-only">{unit.code}</span> : null}
                </button>
              ));
            })}
          </div>
        </div>
      </div>

      {activeUnit ? (
        <div className="rounded-[1.8rem] card-surface p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">{messages.floor.hoveredUnit}</p>
              <h3 className="mt-1 font-serif text-3xl text-[color:var(--ink)]">{activeUnit.code}</h3>
            </div>
            <StatusPill status={activeUnit.status} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-[color:var(--muted)]">
            <div className="inset-panel rounded-[1.15rem] p-4">
              <p className="text-xs uppercase tracking-[0.18em]">{messages.common.rooms}</p>
              <p className="mt-2 text-xl font-semibold text-[color:var(--ink)]">{activeUnit.rooms}</p>
            </div>
            <div className="inset-panel rounded-[1.15rem] p-4">
              <p className="text-xs uppercase tracking-[0.18em]">{messages.common.area}</p>
              <p className="mt-2 text-xl font-semibold text-[color:var(--ink)]">{activeUnit.size} {messages.common.sqm}</p>
            </div>
            <div className="inset-panel rounded-[1.15rem] p-4">
              <p className="text-xs uppercase tracking-[0.18em]">{messages.common.orientation}</p>
              <p className="mt-2 text-xl font-semibold text-[color:var(--ink)]">{getOrientationLabel(locale, activeUnit.orientation)}</p>
            </div>
            <div className="inset-panel rounded-[1.15rem] p-4">
              <p className="text-xs uppercase tracking-[0.18em]">{messages.common.price}</p>
              <p className="mt-2 text-xl font-semibold text-[color:var(--ink)]">
                {activeUnit.isPriceVisible && activeUnit.price !== null ? formatCurrency(activeUnit.price) : messages.common.priceOnRequest}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/unit/${activeUnit.slug}`)}
            className="premium-button mt-6 w-full justify-center text-sm font-semibold"
          >
            {messages.common.openUnitDetail}
          </button>
        </div>
      ) : null}
    </div>
  );
}
