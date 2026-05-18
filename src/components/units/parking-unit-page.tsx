import Link from "next/link";
import { ArrowLeft, Maximize2 } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { StatusPill } from "@/components/ui/status-pill";
import { getBuildingLabel, getMessages, getStatusLabel } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/config";
import type { PublicParkingUnit } from "@/types/public-api";

type ParkingUnitPageProps = {
  unit: PublicParkingUnit;
  locale: Locale;
  userType: "internal" | "external";
};

export function ParkingUnitPage({ unit, locale, userType }: ParkingUnitPageProps) {
  const messages = getMessages(locale);
  const buildingLabel = getBuildingLabel(locale, unit.buildingId, userType);
  const priceLabel = unit.isPriceVisible && unit.price !== null ? `${unit.price} ${unit.currency ?? ""}`.trim() : messages.common.priceOnRequest;

  return (
    <>
      <section className="page-cover bg-[color:var(--surface-dark)]">
        <div className="page-cover-inner">
          <div className="page-cover-copy">
            <Link href={`/buildings/${unit.building?.slug ?? unit.buildingId}`} className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/68">
              <ArrowLeft className="size-4" />
              {messages.unit.backToBuilding} {buildingLabel}
            </Link>
            <div className="mt-8 flex items-center gap-4">
              <StatusPill status={unit.status} />
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/62">{buildingLabel}</span>
            </div>
            <h1 className="mt-7 font-serif text-[2rem] leading-[0.98] text-white sm:text-[2.6rem] lg:text-[3.35rem] xl:text-[3.7rem]">
              {locale === "bg" ? `Паркомясто ${unit.code}` : `Parking ${unit.code}`}
            </h1>
            <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-white/74">
              {locale === "bg" ? "Свободно паркомясто." : "Parking space."}
            </p>
          </div>
        </div>
      </section>

      <section className="page-stat-band page-stat-band-dark">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4">
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <p className="font-serif text-5xl leading-none">{priceLabel}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.common.price}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <p className="font-serif text-5xl leading-none">{unit.size.toFixed(2)} {messages.common.sqm}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.common.area}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <p className="font-serif text-5xl leading-none">{getStatusLabel(locale, unit.status)}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{locale === "bg" ? "Статус" : "Status"}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <Maximize2 className="size-5 text-white/56" />
              <p className="mt-5 font-serif text-5xl leading-none">{unit.unitNumber}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{locale === "bg" ? "Код" : "Code"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-white/34">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="premium-label text-[color:var(--muted)]">{locale === "bg" ? "Детайли" : "Details"}</p>
            <h2 className="mt-3 font-serif text-4xl text-[color:var(--ink)]">{locale === "bg" ? "Паркомясто" : "Parking space"}</h2>
            <p className="mt-4 text-[color:var(--muted)]">
              {locale === "bg"
                ? "Свържете се с екипа ни за наличност и цена."
                : "Contact the sales team for availability and price."}
            </p>
          </div>
          <LeadForm unitId={unit.id} buildingId={unit.buildingId} source={`unit-${unit.id}`} heading={`${messages.unit.inquireAboutUnit} ${unit.code}`} />
        </div>
      </section>
    </>
  );
}
