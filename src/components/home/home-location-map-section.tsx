import { BuildingsMap } from "@/components/location/buildings-map";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getBuildingGeoBySlug } from "@/lib/building-geo";
import type { PublicBuilding } from "@/types/public-api";

type HomeLocationMapSectionProps = {
  locale: Locale;
  buildings: PublicBuilding[];
};

export function HomeLocationMapSection({ locale, buildings }: HomeLocationMapSectionProps) {
  const messages = getMessages(locale);
  const markers = buildings
    .map((building) => {
      const geo = getBuildingGeoBySlug(building.slug);
      if (!geo) return null;
      return {
        id: building.id,
        lat: geo.lat,
        lng: geo.lng,
        label: building.name,
        popup: `${building.name}<br/>${geo.address}`,
        color: geo.markerColor,
      };
    })
    .filter((marker): marker is NonNullable<typeof marker> => Boolean(marker));

  return (
    <div className="rounded-[var(--radius-xl)] border border-[color:var(--line)] bg-white p-4 shadow-[0_20px_60px_rgba(34,30,24,0.08)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="premium-label text-[color:var(--muted)]">{locale === "bg" ? "Локация" : "Location"}</p>
          <p className="mt-2 font-serif text-3xl leading-[1.02] text-[color:var(--ink)]">{messages.home.locationTitle}</p>
          <p className="mt-3 max-w-2xl text-[color:var(--muted)]">{messages.home.locationCopy}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.2rem] border border-[color:var(--line)] bg-[color:var(--surface)]">
        <BuildingsMap markers={markers} zoom={15} className="h-[22rem] w-full sm:h-[30rem]" />
      </div>
    </div>
  );
}
