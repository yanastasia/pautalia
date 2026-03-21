import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import type { Building } from "@/types/domain";

export function BuildingPreviewCard({ building, locale }: { building: Building; locale: Locale }) {
  const messages = getMessages(locale);

  return (
    <Link href={`/building/${building.slug}`} className="group block motion-fade-up">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.55rem]">
        <Image
          src={building.heroImage}
          alt={building.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08111a]/88 via-[#08111a]/18 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.32em] text-white/54">{messages.common.building}</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <h3 className="font-serif text-4xl text-white">{building.name}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-white/68">{building.tagline}</p>
            </div>
            <span className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur">
              <ArrowUpRight className="size-5" />
            </span>
          </div>
        </div>
      </div>

      <div className="px-1 py-5">
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
