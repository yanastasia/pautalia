import { describe, expect, it } from "vitest";
import { buildUnitPlanGalleryContent } from "@/components/units/unit-plan-gallery-content";

describe("buildUnitPlanGalleryContent", () => {
  it("builds the two plan gallery items in display order", () => {
    const result = buildUnitPlanGalleryContent({
      locale: "en",
      unitCode: "AP.08",
      unitFloorplan: "/assets/buildings/residence/apartments/A-AP.08.png",
      floorPlanImage: "/assets/buildings/residence/floors/floor-02.png",
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
        src: "/assets/buildings/residence/apartments/A-AP.08.png",
        title: "Apartment AP.08",
        alt: "Apartment AP.08 plan",
      },
      {
        id: "floor-plan",
        src: "/assets/buildings/residence/floors/floor-02.png",
        title: "Floor 2",
        alt: "Floor 2 plan",
      },
    ]);
  });

  it("localizes the summary card rows for Bulgarian", () => {
    const result = buildUnitPlanGalleryContent({
      locale: "bg",
      unitCode: "AP.14",
      unitFloorplan: "/assets/buildings/residence/apartments/A-AP.14.png",
      floorPlanImage: "/assets/buildings/residence/floors/floor-04.png",
      floorNumber: 4,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      areaInternalSqm: 125.39,
      areaTotalSqm: 157.65,
      outdoorType: "terrace",
      terraceSqm: 32.26,
      ownership: {
        commonPartsPercent: 9.57,
        landPercent: 7.105,
        landArea: 72.96,
      },
      areaUnitLabel: "кв.м",
      priceLabel: "Цена при запитване",
    });

    expect(result.detailRows).toEqual([
      { label: "Етаж", value: "4" },
      { label: "Стаи", value: "3" },
      { label: "Спални", value: "2" },
      { label: "Бани", value: "1" },
      { label: "Тераса", value: "32.26 кв.м" },
      { label: "Жилищна площ", value: "125.39 кв.м" },
      { label: "Общи части", value: "32.26 кв.м" },
      { label: "Обща площ", value: "157.65 кв.м" },
      { label: "Идеални части", value: "9.57%" },
      { label: "Земя", value: "7.11% / 72.96 кв.м" },
      { label: "Цена", value: "Цена при запитване" },
    ]);
    expect(result.galleryItems[1]).toEqual({
      id: "floor-plan",
      src: "/assets/buildings/residence/floors/floor-04.png",
      title: "Етаж 4",
      alt: "План на Етаж 4",
    });
  });

  it("hides ownership rows when official ownership values are not available", () => {
    const result = buildUnitPlanGalleryContent({
      locale: "en",
      unitCode: "B-AP-01",
      unitFloorplan: "/assets/buildings/park/apartments/B-AP.01.png",
      floorPlanImage: "/assets/buildings/park/floors/floor-01.png",
      floorNumber: 1,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      area: {
        living: 67.37,
        shared: 0,
        terrace: 37.11,
        total: 67.37,
      },
      ownership: {
        commonPartsPercent: 0,
        landPercent: 0,
        landArea: 0,
      },
      outdoorType: "yard",
      areaUnitLabel: "sq m",
      priceLabel: "Price on request",
    });

    expect(result.detailRows.map((row) => row.label)).not.toContain("Common parts");
    expect(result.detailRows.map((row) => row.label)).not.toContain("Land share");
    expect(result.detailRows.map((row) => row.label)).not.toContain("Shared parts");
  });
});
