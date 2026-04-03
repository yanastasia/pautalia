import Script from "next/script";
import { notFound } from "next/navigation";
import { BuildingInventorySelector } from "@/components/buildings/building-inventory-selector";
import { LeadForm } from "@/components/forms/lead-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages } from "@/lib/i18n/messages";
import { PublicApiError, fetchAllPautaliaUnits, fetchPautaliaBuilding } from "@/lib/public-api";
import { getLocale } from "@/lib/i18n/server";
import { getBuildingJsonLd } from "@/lib/json-ld";

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
  let buildingResponse: Awaited<ReturnType<typeof fetchPautaliaBuilding>>;

  try {
    buildingResponse = await fetchPautaliaBuilding(locale, id);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) {
      return { title: "Building not found" };
    }

    throw error;
  }

  const building = buildingResponse.item;

  if (!building) {
    return { title: "Building not found" };
  }

  return {
    title: building.name,
    description: building.description,
  };
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
  const [buildingUnits, filteredUnits] = await Promise.all([
    fetchAllPautaliaUnits(locale, {
      building: building.slug,
    }),
    fetchAllPautaliaUnits(locale, {
      ...normalizedSearchParams,
      building: building.slug,
    }),
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
          <BuildingInventorySelector
            building={building}
            floors={buildingFloors}
            units={buildingUnits}
            filteredUnits={filteredUnits}
            locale={locale}
          />
        </div>
      </section>

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
          <LeadForm
            buildingId={building.id}
            source={`building-${building.slug}`}
            heading={`${messages.building.askAbout} ${building.name}`}
          />
        </div>
      </section>
    </>
  );
}
