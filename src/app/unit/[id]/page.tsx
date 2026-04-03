import Image from "next/image";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Compass, Layers3, Maximize2 } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { UnitCard } from "@/components/apartments/unit-card";
import { UnitFloorplanSection } from "@/components/units/unit-floorplan-section";
import { UnitPageHero } from "@/components/units/unit-page-hero";
import { UnitPageSectionHeading } from "@/components/units/unit-page-section-heading";
import { getBuildingLabel, getFloorLabel, getMessages, getStatusLabel } from "@/lib/i18n/messages";
import { PublicApiError, fetchAllPautaliaUnits, fetchPautaliaBuilding, fetchPautaliaUnit } from "@/lib/public-api";
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

  const buildingResponse = await fetchPautaliaBuilding(locale, unit.building?.slug ?? unit.buildingId);
  const currentFloor = buildingResponse.floors.find((candidate) => candidate.number === unit.floor);

  const relatedUnits = (await fetchAllPautaliaUnits(locale, {
    building: unit.building?.slug,
  }))
    .filter((candidate) => candidate.id !== unit.id)
    .slice(0, 2);
  const unitPriceLabel = unit.isPriceVisible && unit.price !== null ? formatCurrency(unit.price) : messages.common.priceOnRequest;

  return (
    <>
      <Script
        id={`unit-jsonld-${unit.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getUnitJsonLd(unit)) }}
      />

      <UnitPageHero
        buildingId={unit.buildingId}
        buildingSlug={unit.building?.slug ?? unit.buildingId}
        buildingLabel={getBuildingLabel(locale, unit.buildingId)}
        backToBuildingLabel={messages.unit.backToBuilding}
        highlight={unit.highlight}
        image={unit.gallery[0]}
        status={unit.status}
        unitCode={unit.code}
      />

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

      {currentFloor ? (
        <UnitFloorplanSection
          features={unit.features}
          unitCode={unit.code}
          unitFloorplan={unit.floorplan}
          floorPlanImage={currentFloor.floorplanImage}
          floorNumber={unit.floor}
          rooms={unit.rooms}
          bedrooms={unit.bedrooms}
          bathrooms={unit.bathrooms}
          areaInternalSqm={unit.areaInternalSqm}
          areaTotalSqm={unit.areaTotalSqm}
          outdoorType={unit.outdoorType}
          terraceSqm={unit.terraceSqm}
          priceLabel={unitPriceLabel}
          statusLabel={getStatusLabel(locale, unit.status)}
          status={unit.status}
          locale={locale}
        />
      ) : null}

      <section className="section-space bg-white/34">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <UnitPageSectionHeading eyebrow={messages.unit.galleryEyebrow} title={messages.unit.galleryTitle} />
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
            <UnitPageSectionHeading eyebrow={messages.unit.relatedEyebrow} title={messages.unit.relatedTitle} />
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
