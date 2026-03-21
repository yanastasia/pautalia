import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArrowLeft, Compass, Layers3, Maximize2 } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { UnitCard } from "@/components/apartments/unit-card";
import { StatusPill } from "@/components/ui/status-pill";
import { SectionHeading } from "@/components/ui/section-heading";
import { getBuildingLabel, getFloorLabel, getMessages } from "@/lib/i18n/messages";
import { PublicApiError, fetchAllPautaliaUnits, fetchPautaliaUnit } from "@/lib/public-api";
import { getLocale } from "@/lib/i18n/server";
import { getUnitJsonLd } from "@/lib/json-ld";
import { formatCurrency, titleCase } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getLocale();
  let unit: Awaited<ReturnType<typeof fetchPautaliaUnit>>;

  try {
    unit = await fetchPautaliaUnit(locale, id);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) {
      return { title: "Unit not found" };
    }

    throw error;
  }

  if (!unit) {
    return { title: "Unit not found" };
  }

  return {
    title: `Unit ${unit.code}`,
    description: `${unit.code} in building ${unit.buildingId.toUpperCase()} on floor ${unit.floor}.`,
  };
}

export default async function UnitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getLocale();
  const messages = getMessages(locale);
  let unit: Awaited<ReturnType<typeof fetchPautaliaUnit>>;
  try {
    unit = await fetchPautaliaUnit(locale, id);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  const relatedUnits = (await fetchAllPautaliaUnits(locale, {
    building: unit.building?.slug,
  }))
    .filter((candidate) => candidate.id !== unit.id)
    .slice(0, 2);

  return (
    <>
      <Script
        id={`unit-jsonld-${unit.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getUnitJsonLd(unit)) }}
      />

      <section className="page-cover">
        <div className="page-cover-media">
          <Image src={unit.gallery[0]} alt={`Unit ${unit.code}`} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="page-cover-inner">
          <div className="page-cover-copy">
            <Link href={`/building/${unit.building?.slug ?? unit.buildingId}`} className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/68">
              <ArrowLeft className="size-4" />
              {messages.unit.backToBuilding} {unit.buildingId.toUpperCase()}
            </Link>
            <div className="mt-8 flex items-center gap-4">
              <StatusPill status={unit.status} />
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/62">
                {getBuildingLabel(locale, unit.buildingId)}
              </span>
            </div>
            <h1 className="mt-8 font-serif text-[3.4rem] leading-[0.9] text-white sm:text-[4.8rem] lg:text-[6rem]">Unit {unit.code}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/74">{unit.highlight}</p>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-white/12 pt-5">
            <Link href={`/building/${unit.building?.slug ?? unit.buildingId}/floor/${unit.floor}`} className="rounded-full border border-white/12 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/82">
              {messages.unit.viewFloorOverlay}
            </Link>
          </div>
        </div>
      </section>

      <section className="page-stat-band page-stat-band-dark">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4">
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <p className="font-serif text-5xl leading-none">
                {unit.isPriceVisible && unit.price !== null ? formatCurrency(unit.price) : messages.common.priceOnRequest}
              </p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.common.price}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <p className="font-serif text-5xl leading-none">{unit.size} {messages.common.sqm}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.common.area}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <p className="font-serif text-5xl leading-none">{unit.rooms}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.common.rooms}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <p className="font-serif text-5xl leading-none">{titleCase(unit.orientation)}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.common.orientation}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
          <div>
            <SectionHeading eyebrow={messages.unit.floorplanEyebrow} title={messages.unit.floorplanTitle} copy={messages.unit.floorplanCopy} />
            <div className="page-line-list mt-10">
              {unit.features.map((feature) => (
                <div key={feature} className="page-line-item text-lg text-[color:var(--ink)]">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="page-image-block bg-[color:var(--surface-dark)]">
            <Image src={unit.floorplan} alt={`Floorplan for unit ${unit.code}`} fill className="object-contain p-6" sizes="(max-width: 1024px) 100vw, 55vw" />
          </div>
        </div>
      </section>

      <section className="section-space bg-white/34">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <SectionHeading eyebrow={messages.unit.galleryEyebrow} title={messages.unit.galleryTitle} />
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {unit.gallery.map((image, index) => (
                <div key={image} className={`page-image-block ${index === 0 ? "sm:col-span-2 min-h-[22rem]" : "min-h-[18rem]"}`}>
                  <Image src={image} alt={`${unit.code} gallery image ${index + 1}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
                </div>
              ))}
            </div>
          </div>

          <LeadForm unitId={unit.id} source={`unit-${unit.id}`} heading={`${messages.unit.inquireAboutUnit} ${unit.code}`} />
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 border-t border-[color:var(--line)] pt-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)]">{messages.unit.relatedEyebrow}</p>
              <h2 className="mt-3 font-serif text-4xl text-[color:var(--ink)]">{messages.unit.relatedTitle}</h2>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              <span className="inline-flex items-center gap-2">
                <Layers3 className="size-4 text-[color:var(--ink)]" />
                {getFloorLabel(locale, unit.floor)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Compass className="size-4 text-[color:var(--ink)]" />
                {titleCase(unit.orientation)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Maximize2 className="size-4 text-[color:var(--ink)]" />
                {unit.size} {messages.common.sqm}
              </span>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {relatedUnits.map((relatedUnit) => (
              <UnitCard key={relatedUnit.id} unit={relatedUnit} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
