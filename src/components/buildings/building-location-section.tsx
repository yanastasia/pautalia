import Link from "next/link";
import { BuildingsMap } from "@/components/location/buildings-map";
import { getBuildingGeoBySlug } from "@/lib/building-geo";
import type { Locale } from "@/lib/i18n/config";
import type { PublicBuilding } from "@/types/public-api";

type BuildingLocationSectionProps = {
  locale: Locale;
  building: PublicBuilding;
};

export function BuildingLocationSection({ locale, building }: BuildingLocationSectionProps) {
  const geo = getBuildingGeoBySlug(building.slug);
  if (!geo) return null;

  const markers = [
    {
      id: building.id,
      lat: geo.lat,
      lng: geo.lng,
      label: building.name,
      popup: `${building.name}<br/>${geo.address}`,
      color: geo.markerColor,
    },
  ];
  const osmHref = `https://www.openstreetmap.org/?mlat=${geo.lat}&mlon=${geo.lng}#map=18/${geo.lat}/${geo.lng}`;

  return (
    <section id="location" className="section-space">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="premium-label text-[color:var(--muted)]">{locale === "bg" ? "Локация" : "Location"}</p>
            <h2 className="mt-3 font-serif text-4xl text-[color:var(--ink)]">{building.name}</h2>
            <p className="mt-4 text-[color:var(--muted)]">{geo.address}</p>
          </div>
          <Link
            href={osmHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[color:var(--line)] bg-[rgba(249,245,238,0.7)] px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--ink)] hover:bg-[rgba(249,245,238,0.95)]"
          >
            {locale === "bg" ? "Отвори карта" : "Open map"}
          </Link>
        </div>
        <div className="mt-10 overflow-hidden rounded-[1.8rem] border border-[color:var(--line)] bg-white">
          <BuildingsMap markers={markers} zoom={16} className="h-[20rem] w-full sm:h-[28rem]" />
        </div>
      </div>
    </section>
  );
}
