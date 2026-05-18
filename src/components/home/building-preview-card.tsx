import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import type { PublicBuilding } from "@/types/public-api";

export function BuildingPreviewCard({ building, locale }: { building: PublicBuilding; locale: Locale }) {
  const messages = getMessages(locale);

  return (
    <Link href={`/buildings/${building.slug}`} className="group block motion-fade-up">
      <div className="selector-building-card overflow-hidden rounded-[1.1rem] border border-[color:var(--line)] bg-white shadow-[0_20px_60px_rgba(34,30,24,0.08)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={building.heroImage}
            alt={building.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <span className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full border border-black/8 bg-white/88 text-[color:var(--ink)] shadow-sm backdrop-blur">
            <ArrowUpRight className="size-5" />
          </span>
        </div>

        <div className="p-5 text-[color:var(--ink)] sm:p-6">
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.32em] text-[color:var(--muted)]">{messages.common.building}</p>
          <h3 className="mt-3 font-serif text-4xl leading-none text-[color:var(--ink)]">{building.name}</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[color:var(--muted)]">{building.tagline}</p>
        </div>
      </div>

      <div className="px-1 py-5 text-[color:var(--ink)]">
        <p className="text-base leading-7 text-[color:var(--muted)]">{building.shortDescription}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[color:var(--line)] pt-4 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
          <span>{building.floorsCount} {messages.common.floors.toLowerCase()}</span>
          <span>{building.availableUnits} {messages.common.available}</span>
          <span>{building.deliveryQuarter}</span>
        </div>
      </div>
    </Link>
  );
}
