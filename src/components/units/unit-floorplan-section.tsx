import { UnitPlanGallery } from "@/components/units/unit-plan-gallery";
import { buildUnitPlanGalleryContent } from "@/components/units/unit-plan-gallery-content";
import type { UnitArea, UnitOwnership, UnitStatus } from "@/types/domain";

type UnitFloorplanSectionProps = {
  features: string[];
  unitCode: string;
  unitFloorplan: string;
  floorPlanImage: string;
  floorNumber: number;
  rooms: number;
  bedrooms: number | null;
  bathrooms: number;
  area: UnitArea;
  ownership: UnitOwnership;
  outdoorType: "yard" | "terrace" | "balcony" | null;
  priceLabel: string;
  statusLabel: string;
  status: UnitStatus;
  locale: "bg" | "en";
};

export function UnitFloorplanSection({
  features,
  unitCode,
  unitFloorplan,
  floorPlanImage,
  floorNumber,
  rooms,
  bedrooms,
  bathrooms,
  area,
  ownership,
  outdoorType,
  priceLabel,
  statusLabel,
  status,
  locale,
}: UnitFloorplanSectionProps) {
  const areaUnitLabel = locale === "bg" ? "кв.м" : "sq m";
  const { galleryItems, detailRows } = buildUnitPlanGalleryContent({
    locale,
    unitCode,
    unitFloorplan,
    floorPlanImage,
    floorNumber,
    rooms,
    bedrooms,
    bathrooms,
    area,
    ownership,
    outdoorType,
    areaUnitLabel,
    priceLabel,
  });

  return (
    <section className="section-space">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <UnitPlanGallery
          items={galleryItems}
          detailRows={detailRows}
          unitCode={unitCode}
          features={features}
          locale={locale}
          statusLabel={statusLabel}
          status={status}
        />
      </div>
    </section>
  );
}
