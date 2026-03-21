import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { FloorplanMap } from "@/components/project/floorplan-map";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages } from "@/lib/i18n/messages";
import { PublicApiError, fetchAllPautaliaUnits, fetchPautaliaBuilding } from "@/lib/public-api";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata({ params }: { params: Promise<{ id: string; floor: string }> }) {
  const { id, floor: floorParam } = await params;
  const locale = await getLocale();
  let buildingResponse: Awaited<ReturnType<typeof fetchPautaliaBuilding>>;

  try {
    buildingResponse = await fetchPautaliaBuilding(locale, id);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) {
      return { title: "Floor not found" };
    }

    throw error;
  }
  const building = buildingResponse?.item;
  const floorNumber = Number(floorParam);
  const floor = buildingResponse?.floors.find((candidate) => candidate.number === floorNumber);

  if (!building || !floor) {
    return { title: "Floor not found" };
  }

  return {
    title: `${building.name} Floor ${floor.number}`,
    description: `Floor plan and available homes in ${building.name} on floor ${floor.number}.`,
  };
}

export default async function FloorPage({ params }: { params: Promise<{ id: string; floor: string }> }) {
  const { id, floor: floorParam } = await params;
  const locale = await getLocale();
  const messages = getMessages(locale);
  let buildingResponse: Awaited<ReturnType<typeof fetchPautaliaBuilding>>;
  try {
    buildingResponse = await fetchPautaliaBuilding(locale, id);
  } catch (error) {
    if (error instanceof PublicApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
  const floorNumber = Number(floorParam);

  const building = buildingResponse.item;
  const floor = buildingResponse.floors.find((candidate) => candidate.number === floorNumber);

  if (!floor) {
    notFound();
  }

  const units = await fetchAllPautaliaUnits(locale, {
    building: building.slug,
    floor: floor.number,
  });

  return (
    <>
      <section className="page-cover">
        <div className="page-cover-media">
          <Image
            src={floor.floorplanImage}
            alt={floor.label}
            fill
            className="object-contain p-8 opacity-95 sm:p-12"
            sizes="100vw"
          />
        </div>
        <div className="page-cover-inner">
          <div className="page-cover-copy">
            <Link href={`/building/${building.slug}`} className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/68">
              <ChevronLeft className="size-4" />
              {messages.floor.backTo} {building.name}
            </Link>
            <span className="eyebrow-chip mt-8">{locale === "bg" ? `Етаж ${floor.number}` : `Floor ${floor.number}`}</span>
            <h1 className="mt-8 font-serif text-[3.2rem] leading-[0.9] text-white sm:text-[4.4rem] lg:text-[5.4rem]">{floor.label}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">{messages.floor.planCopy}</p>
          </div>
        </div>
      </section>

      <section className="page-stat-band page-stat-band-dark">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3">
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <p className="font-serif text-5xl leading-none">{building.name}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.common.building}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <p className="font-serif text-5xl leading-none">{units.length}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.floor.unitsShown}</p>
            </div>
            <div className="page-stat-cell px-6 py-8 text-white sm:px-8">
              <p className="font-serif text-5xl leading-none">{messages.floor.overlayModeValue}</p>
              <p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-white/54">{messages.floor.overlayMode}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={messages.floor.planEyebrow} title={messages.floor.planTitle} copy={messages.floor.planCopy} />

          <div className="mt-12">
            <FloorplanMap image={floor.floorplanImage} units={units} aspectRatio={floor.mapAspectRatio} />
          </div>
        </div>
      </section>
    </>
  );
}
