"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ApartmentFinder } from "@/components/apartments/apartment-finder";
import { ParkingUnitCard } from "@/components/units/parking-unit-card";
import { getApartmentFinderFilters } from "@/lib/apartment-finder-filters";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";
import type { PublicParkingUnit, PublicUnit } from "@/types/public-api";

type UnitsFinderProps = {
  apartments: PublicUnit[];
  parking: PublicParkingUnit[];
};

function getKindParam(value: string | null) {
  return value === "all" || value === "parking" || value === "apartment" ? value : "apartment";
}

export function UnitsFinder({ apartments, parking }: UnitsFinderProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const areaUnitLabel = locale === "bg" ? "кв.м" : "sq m";
  const kind = getKindParam(searchParams.get("kind"));
  const filterText = searchParams.toString();
  const filters = useMemo(() => getApartmentFinderFilters(new URLSearchParams(filterText)), [filterText]);

  const parkingUnits = useMemo(() => {
    return parking.filter((unit) => {
      if (filters.status && unit.status !== filters.status) return false;
      if (filters.building) {
        const buildingKey = unit.building?.slug ?? unit.building?.id ?? unit.buildingId;
        if (filters.building !== buildingKey && filters.building !== unit.buildingId) return false;
      }
      return true;
    });
  }, [filters.building, filters.status, parking]);

  function setKind(next: "apartment" | "parking" | "all") {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (next === "apartment") {
      nextParams.delete("kind");
    } else {
      nextParams.set("kind", next);
    }
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-[color:var(--line)] pb-6">
        {[
          { key: "apartment" as const, label: locale === "bg" ? "Жилища" : "Homes" },
          { key: "parking" as const, label: locale === "bg" ? "Паркоместа" : "Parking" },
          { key: "all" as const, label: locale === "bg" ? "Всички" : "All" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setKind(item.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em]",
              kind === item.key ? "bg-[color:var(--ink)] text-white border-[color:var(--ink)]" : "border-[color:var(--line)] text-[color:var(--ink)]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {kind === "apartment" ? <ApartmentFinder allUnits={apartments} /> : null}

      {kind === "parking" ? (
        <div className="mt-10">
          <div className="flex items-end justify-between gap-6 border-b border-[color:var(--line)] pb-6">
            <div>
              <p className="premium-label text-[color:var(--muted)]">{locale === "bg" ? "Списък" : "List"}</p>
              <h2 className="mt-3 font-serif text-4xl text-[color:var(--ink)]">{locale === "bg" ? "Паркоместа" : "Parking spaces"}</h2>
              <p className="mt-3 text-[color:var(--muted)]">
                {parkingUnits.length} {locale === "bg" ? "резултата" : "results"}
              </p>
            </div>
          </div>
          {parkingUnits.length ? (
            <div className="mt-8 grid gap-8 sm:gap-10">
              {parkingUnits.map((unit) => (
                <ParkingUnitCard key={unit.id} unit={unit} areaUnitLabel={areaUnitLabel} />
              ))}
            </div>
          ) : (
            <div className="border-t border-[color:var(--line)] py-12 text-center">
              <h4 className="font-serif text-3xl text-[color:var(--ink)]">{locale === "bg" ? "Няма резултати" : "No results"}</h4>
              <p className="mt-3 text-[color:var(--muted)]">{locale === "bg" ? "Променете филтрите и опитайте отново." : "Adjust filters and try again."}</p>
            </div>
          )}
        </div>
      ) : null}

      {kind === "all" ? (
        <div className="mt-10">
          <ApartmentFinder allUnits={apartments} />
          <div className="mt-12 border-t border-[color:var(--line)] pt-10">
            <h2 className="font-serif text-4xl text-[color:var(--ink)]">{locale === "bg" ? "Паркоместа" : "Parking spaces"}</h2>
            <div className="mt-8 grid gap-8 sm:gap-10">
              {parkingUnits.map((unit) => (
                <ParkingUnitCard key={unit.id} unit={unit} areaUnitLabel={areaUnitLabel} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

