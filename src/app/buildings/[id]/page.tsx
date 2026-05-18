import Script from "next/script";
import { notFound } from "next/navigation";
import { BuildingInventorySelector } from "@/components/buildings/building-inventory-selector";
import { LeadForm } from "@/components/forms/lead-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages } from "@/lib/i18n/messages";
import { PublicApiError, fetchAllPautaliaUnits, fetchPautaliaBuilding, fetchPautaliaParkingUnits } from "@/lib/public-api";
import { getLocale } from "@/lib/i18n/server";
import { getBuildingJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/metadata";
import { getUserType } from "@/lib/access-control";
import { getBuildingLabel, getStatusLabel } from "@/lib/i18n/messages";

function normalizeUnitSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    const firstValue = Array.isArray(value) ? value[0] : value;
    if (!firstValue) {
      continue;
    }

    if (key === "price_min") {
      normalized.minPrice = firstValue;
      continue;
    }

    if (key === "price_max") {
      normalized.maxPrice = firstValue;
      continue;
    }

    if (key === "availability") {
      normalized.status = firstValue;
      continue;
    }

    normalized[key] = firstValue;
  }

  return normalized;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getLocale();
  const userType = await getUserType();
  let buildingResponse: Awaited<ReturnType<typeof fetchPautaliaBuilding>>;

  try {
    buildingResponse = await fetchPautaliaBuilding(locale, id);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) {
      return { title: locale === "bg" ? "Сградата не е намерена" : "Building not found" };
    }

    throw error;
  }

  const building = buildingResponse.item;

  if (!building) {
    return { title: locale === "bg" ? "Сградата не е намерена" : "Building not found" };
  }

  const buildingLabel = getBuildingLabel(locale, building.id, userType);

  return buildPageMetadata({
    locale,
    pathname: `/buildings/${building.slug}`,
    title: buildingLabel,
    description: building.fullDescription,
    imagePath: building.heroImage,
    imageAlt: `${buildingLabel} facade`,
  });
}

export default async function BuildingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const userType = await getUserType();
  const messages = getMessages(locale);
  const normalizedSearchParams = normalizeUnitSearchParams(await searchParams);
  let buildingResponse: Awaited<ReturnType<typeof fetchPautaliaBuilding>>;

  try {
    buildingResponse = await fetchPautaliaBuilding(locale, id);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  const { item: building, floors: buildingFloors } = buildingResponse;
  const buildingLabel = getBuildingLabel(locale, building.id, userType);
  const [buildingUnits, filteredUnits, parkingUnits] = await Promise.all([
    fetchAllPautaliaUnits(locale, {
      building: building.slug,
    }),
    fetchAllPautaliaUnits(locale, {
      ...normalizedSearchParams,
      building: building.slug,
    }),
    fetchPautaliaParkingUnits(locale, building.slug),
  ]);

  return (
    <>
      <Script
        id={`building-jsonld-${building.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBuildingJsonLd(building)) }}
      />

      <section id="apartments" className="section-space">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <BuildingInventorySelector building={building} floors={buildingFloors} units={buildingUnits} filteredUnits={filteredUnits} locale={locale} />
        </div>
      </section>

      {parkingUnits.length > 0 ? (
        <section id="parking" className="section-space bg-white/34">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={locale === "bg" ? "Паркиране" : "Parking"}
              title={locale === "bg" ? "Паркоместа" : "Parking spaces"}
              copy={locale === "bg" ? "Наличните паркоместа за тази сграда." : "Available parking spaces for this building."}
            />
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {parkingUnits.map((spot) => (
                <div key={spot.id} className="rounded-2xl border border-[color:var(--line)] bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-serif text-2xl text-[color:var(--ink)]">{spot.code}</p>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                      {getStatusLabel(locale, spot.status)}
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-[color:var(--muted)]">
                    {spot.size.toFixed(2)} {locale === "bg" ? "кв.м" : "sq m"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="overview" className="section-space bg-white/34">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionHeading eyebrow={messages.building.overview} title={messages.building.overviewTitle} copy={messages.building.overviewCopy} />
          </div>
          <div className="page-line-list">
            {building.amenities.map((amenity) => (
              <div key={amenity} className="page-line-item text-lg text-[color:var(--ink)]">
                {amenity}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <LeadForm buildingId={building.id} source={`building-${building.slug}`} heading={`${messages.building.askAbout} ${buildingLabel}`} />
        </div>
      </section>
    </>
  );
}

