import Link from "next/link";
import type { PublicParkingUnit } from "@/types/public-api";

type ParkingUnitCardProps = {
  unit: PublicParkingUnit;
  areaUnitLabel: string;
};

export function ParkingUnitCard({ unit, areaUnitLabel }: ParkingUnitCardProps) {
  return (
    <Link href={`/units/${unit.slug}`} className="rounded-[var(--radius-xl)] card-surface p-6 transition hover:shadow-sm">
      <p className="premium-label text-[color:var(--muted)]">{unit.building?.name ?? unit.buildingId.toUpperCase()}</p>
      <h3 className="mt-3 font-serif text-4xl text-[color:var(--ink)]">{unit.code}</h3>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
        <span>
          {unit.size.toFixed(2)} {areaUnitLabel}
        </span>
        <span>{unit.status}</span>
      </div>
    </Link>
  );
}
