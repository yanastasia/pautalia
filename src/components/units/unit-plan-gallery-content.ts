export type UnitPlanGalleryItem = {
  id: "unit-plan" | "floor-plan";
  src: string;
  title: string;
  alt: string;
};

export type UnitPlanDetailRow = {
  label: string;
  value: string;
};

type BuildUnitPlanGalleryContentInput = {
  locale: "bg" | "en";
  unitCode: string;
  unitFloorplan: string;
  floorPlanImage: string;
  floorNumber: number;
  rooms: number;
  bedrooms: number | null;
  bathrooms: number;
  areaInternalSqm: number;
  areaTotalSqm: number;
  outdoorType: "yard" | "terrace" | "balcony" | null;
  terraceSqm: number;
  areaUnitLabel: string;
  priceLabel: string;
};

function formatMeasure(value: number, areaUnitLabel: string) {
  return `${value.toFixed(2)} ${areaUnitLabel}`;
}

function getOutdoorLabel(locale: "bg" | "en", outdoorType: BuildUnitPlanGalleryContentInput["outdoorType"]) {
  if (outdoorType === "terrace") {
    return locale === "bg" ? "Тераса" : "Terrace";
  }

  if (outdoorType === "balcony") {
    return locale === "bg" ? "Балкон" : "Balcony";
  }

  if (outdoorType === "yard") {
    return locale === "bg" ? "Двор" : "Yard";
  }

  return locale === "bg" ? "Външно" : "Outdoor";
}

export function buildUnitPlanGalleryContent({
  locale,
  unitCode,
  unitFloorplan,
  floorPlanImage,
  floorNumber,
  rooms,
  bedrooms,
  bathrooms,
  areaInternalSqm,
  areaTotalSqm,
  outdoorType,
  terraceSqm,
  areaUnitLabel,
  priceLabel,
}: BuildUnitPlanGalleryContentInput) {
  const localizedFloorLabel = locale === "bg" ? `Етаж ${floorNumber}` : `Floor ${floorNumber}`;
  const galleryItems: UnitPlanGalleryItem[] = [
    {
      id: "unit-plan",
      src: unitFloorplan,
      title: locale === "bg" ? `Апартамент ${unitCode}` : `Apartment ${unitCode}`,
      alt: locale === "bg" ? `План на апартамент ${unitCode}` : `Apartment ${unitCode} plan`,
    },
    {
      id: "floor-plan",
      src: floorPlanImage,
      title: localizedFloorLabel,
      alt: locale === "bg" ? `План на ${localizedFloorLabel}` : `${localizedFloorLabel} plan`,
    },
  ];

  const detailRows: UnitPlanDetailRow[] = [
    { label: locale === "bg" ? "Етаж" : "Floor", value: String(floorNumber) },
    { label: locale === "bg" ? "Стаи" : "Rooms", value: String(rooms) },
    { label: locale === "bg" ? "Спални" : "Bedrooms", value: String(bedrooms ?? Math.max(rooms - 1, 0)) },
    { label: locale === "bg" ? "Бани" : "Bathrooms", value: String(bathrooms) },
    {
      label: getOutdoorLabel(locale, outdoorType),
      value: terraceSqm > 0 ? formatMeasure(terraceSqm, areaUnitLabel) : "\u2014",
    },
    { label: locale === "bg" ? "Площ" : "Area", value: formatMeasure(areaInternalSqm, areaUnitLabel) },
    { label: locale === "bg" ? "Обща площ" : "Total area", value: formatMeasure(areaTotalSqm, areaUnitLabel) },
    { label: locale === "bg" ? "Цена" : "Price", value: priceLabel },
  ];

  return { galleryItems, detailRows };
}
