"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { StatusPill } from "@/components/ui/status-pill";
import { getFloorLabel, getMessages, getResidenceLabel } from "@/lib/i18n/messages";
import { getOrientationLabel } from "@/lib/i18n/property";
import { formatCurrency } from "@/lib/utils";
import type { PublicUnit } from "@/types/public-api";

export function UnitCard({ unit }: { unit: PublicUnit }) {
  const locale = useLocale();
  const messages = getMessages(locale);

  return (
    <article className="group grid gap-6 border-t border-[color:var(--line)] pt-6 lg:grid-cols-[minmax(22rem,26rem)_minmax(0,1fr)] lg:gap-12 lg:pt-8">
      <div className="relative min-h-[14.5rem] overflow-hidden bg-[color:var(--surface-dark)] sm:min-h-[18rem] lg:min-h-[22rem]">
        <Image
          src={unit.gallery[0]}
          alt={`${getResidenceLabel(locale, unit.rooms)} ${unit.code}`}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08111a]/82 via-[#08111a]/14 to-transparent" />
        <div className="absolute left-4 top-4">
          <StatusPill status={unit.status} />
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-white/56">{locale === "bg" ? `Апартамент ${unit.code}` : `Unit ${unit.code}`}</p>
            <h3 className="mt-1.5 font-serif text-[1.9rem] leading-[0.96] text-white sm:text-3xl">
              {getResidenceLabel(locale, unit.rooms)}
            </h3>
          </div>
          <p className="border border-white/12 bg-white/10 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur sm:px-4 sm:text-sm sm:tracking-normal">
            {unit.isPriceVisible && unit.price !== null ? formatCurrency(unit.price) : messages.common.priceOnRequest}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
            <span>{unit.buildingId.toUpperCase()}</span>
            <span>{getFloorLabel(locale, unit.floor)}</span>
            <span>{getOrientationLabel(locale, unit.orientation)}</span>
            <span>{unit.typologyId.replace("typology-", "").toUpperCase()}</span>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:mt-6 sm:text-xl sm:leading-9">
            {unit.highlight}
          </p>
        </div>

        <div className="mt-6 border-t border-[color:var(--line)] pt-5 sm:mt-8 sm:pt-6">
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{messages.common.area}</p>
              <p className="mt-2 font-serif text-[1.45rem] leading-none text-[color:var(--ink)] sm:mt-3 sm:text-[2.2rem]">
                {unit.areaTotalSqm} {messages.common.sqm}
              </p>
            </div>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{messages.common.rooms}</p>
              <p className="mt-2 font-serif text-[1.45rem] leading-none text-[color:var(--ink)] sm:mt-3 sm:text-[2.2rem]">{unit.rooms}</p>
            </div>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{messages.common.orientation}</p>
              <p className="mt-2 font-serif text-[1.2rem] leading-none text-[color:var(--ink)] sm:mt-3 sm:text-[2.2rem]">
                {getOrientationLabel(locale, unit.orientation)}
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/unit/${unit.slug}`}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-between rounded-full border border-[color:var(--line-strong)] bg-white px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)] shadow-[0_16px_32px_rgba(12,13,15,0.05)] sm:mt-8 sm:w-auto sm:justify-start sm:gap-2 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm sm:shadow-none"
        >
          {messages.common.viewDetails}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
