import { describe, expect, it } from "vitest";
import { buildUnitPlanGalleryContent } from "@/components/units/unit-plan-gallery-content";

describe("buildUnitPlanGalleryContent", () => {
  it("builds the two plan gallery items in display order", () => {
    const result = buildUnitPlanGalleryContent({
      locale: "en",
      unitCode: "AP.08",
      unitFloorplan: "/assets/floorplans/AP.08.png",
      floorPlanImage: "/assets/floorplans/second_floor.png",
      floorNumber: 2,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      areaInternalSqm: 76.6,
      areaTotalSqm: 80.86,
      outdoorType: "balcony",
      terraceSqm: 4.26,
      areaUnitLabel: "sq m",
      priceLabel: "Price on request",
    });

    expect(result.galleryItems).toEqual([
      {
        id: "unit-plan",
        src: "/assets/floorplans/AP.08.png",
        title: "Apartment AP.08",
        alt: "Apartment AP.08 plan",
      },
      {
        id: "floor-plan",
        src: "/assets/floorplans/second_floor.png",
        title: "Floor 2",
        alt: "Floor 2 plan",
      },
    ]);
  });

  it("localizes the summary card rows for Bulgarian", () => {
    const result = buildUnitPlanGalleryContent({
      locale: "bg",
      unitCode: "AP.14",
      unitFloorplan: "/assets/floorplans/AP.14.png",
      floorPlanImage: "/assets/floorplans/fourth_floor.png",
      floorNumber: 4,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      areaInternalSqm: 125.39,
      areaTotalSqm: 157.65,
      outdoorType: "terrace",
      terraceSqm: 32.26,
      areaUnitLabel: "кв.м",
      priceLabel: "Цена при запитване",
    });

    expect(result.detailRows).toEqual([
      { label: "Етаж", value: "4" },
      { label: "Стаи", value: "3" },
      { label: "Спални", value: "2" },
      { label: "Бани", value: "1" },
      { label: "Тераса", value: "32.26 кв.м" },
      { label: "Площ", value: "125.39 кв.м" },
      { label: "Обща площ", value: "157.65 кв.м" },
      { label: "Цена", value: "Цена при запитване" },
    ]);
    expect(result.galleryItems[1]).toEqual({
      id: "floor-plan",
      src: "/assets/floorplans/fourth_floor.png",
      title: "Етаж 4",
      alt: "План на Етаж 4",
    });
  });
});
