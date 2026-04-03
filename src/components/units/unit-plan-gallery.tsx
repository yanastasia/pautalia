"use client";

import Image from "next/image";
import { Expand, ZoomIn } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { UnitStatus } from "@/types/domain";
import type { UnitPlanDetailRow, UnitPlanGalleryItem } from "@/components/units/unit-plan-gallery-content";
import { ZoomablePlanLightbox } from "@/components/units/zoomable-plan-lightbox";

type UnitPlanGalleryProps = {
  items: UnitPlanGalleryItem[];
  detailRows: UnitPlanDetailRow[];
  unitCode: string;
  features: string[];
  locale: "bg" | "en";
  statusLabel: string;
  status: UnitStatus;
};

const statusDotStyles: Record<UnitStatus, string> = {
  available: "bg-emerald-500",
  reserved: "bg-amber-400",
  sold: "bg-rose-400",
  hidden: "bg-slate-300",
};

export function UnitPlanGallery({
  items,
  detailRows,
  unitCode,
  features,
  locale,
  statusLabel,
  status,
}: UnitPlanGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const selectedItem = items[selectedIndex];
  const ui = useMemo(
    () =>
      locale === "bg"
        ? { zoom: "Отвори и увеличи", features: "Акценти" }
        : { zoom: "Open and zoom", features: "Highlights" },
    [locale],
  );

  return (
    <>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
        <div>
          <button
            type="button"
            onClick={() => setLightboxIndex(selectedIndex)}
            className="card-surface group w-full rounded-[2rem] p-4 text-left sm:p-5"
            aria-haspopup="dialog"
          >
            <div className="mb-4 flex justify-end">
              <span className="premium-button-secondary px-3.5 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.16em]">
                <ZoomIn className="size-4" />
                {ui.zoom}
              </span>
            </div>

            <div className="page-image-block min-h-[17rem] overflow-hidden rounded-[1.4rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.58)] sm:min-h-[25rem]">
              <Image
                src={selectedItem.src}
                alt={selectedItem.alt}
                fill
                className="object-contain p-4 transition duration-500 group-hover:scale-[1.015] sm:p-6"
                sizes="(max-width: 1280px) 100vw, 66vw"
              />
            </div>
          </button>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {items.map((item, index) => {
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(index)}
                  onFocus={() => setSelectedIndex(index)}
                  onClick={() => {
                    setSelectedIndex(index);
                    setLightboxIndex(index);
                  }}
                  className={cn(
                    "card-surface group rounded-[1.35rem] p-3.5 text-left transition",
                    isSelected ? "ring-2 ring-[rgba(178,147,102,0.24)]" : "hover:-translate-y-0.5",
                  )}
                  aria-haspopup="dialog"
                >
                  <div className="page-image-block min-h-[9.5rem] overflow-hidden rounded-[1rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.58)] sm:min-h-[10.5rem]">
                    <Image src={item.src} alt={item.alt} fill className="object-contain p-2.5 sm:p-3.5" sizes="(max-width: 768px) 100vw, 22vw" />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.82rem] font-semibold text-[color:var(--ink)]">{item.title}</p>
                    </div>
                    <Expand className="size-4 text-[color:var(--muted)]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="card-surface-dark rounded-[2rem] p-5 text-white xl:sticky xl:top-28 sm:p-6">
          <div className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/74">
            <span className={cn("size-4 rounded-full", statusDotStyles[status])} />
            <span>{statusLabel}</span>
          </div>
          <h3 className="mt-6 font-serif text-[2.2rem] leading-[0.92] text-white sm:text-[2.8rem]">{unitCode}</h3>

          <div className="mt-6 border-t border-white/14">
            {detailRows.map((row) => (
              <div key={row.label} className="flex items-end justify-between gap-4 border-b border-white/14 py-4">
                <span className="text-[0.95rem] text-white/68">{row.label}</span>
                <span className="text-right font-serif text-[1.2rem] leading-none text-white sm:text-[1.45rem]">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/56">{ui.features}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {features.map((feature) => (
                <span key={feature} className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[0.8rem] text-white/82">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {lightboxIndex !== null ? (
        <ZoomablePlanLightbox items={items} initialIndex={lightboxIndex} locale={locale} onClose={() => setLightboxIndex(null)} />
      ) : null}
    </>
  );
}
