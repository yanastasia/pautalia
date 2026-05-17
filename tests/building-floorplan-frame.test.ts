import { describe, expect, it } from "vitest";
import { resolveFloorplanFrame } from "@/components/buildings/building-floorplan-frame";
import { buildingSelectorVisuals } from "@/data/building-selector-visuals";

describe("resolveFloorplanFrame", () => {
  it("keeps the building floor plans fully visible in their native 1000 / 634 frame", () => {
    const floorImages = [
      "/assets/buildings/residence/floors/floor-01.png",
      "/assets/buildings/residence/floors/floor-02.png",
      "/assets/buildings/residence/floors/floor-03.png",
      "/assets/buildings/residence/floors/floor-04.png",
    ];

    for (const imagePath of floorImages) {
      expect(resolveFloorplanFrame(imagePath)).toMatchObject({
        aspectRatio: "1000 / 634",
        imageWrapperClassName: "",
        imageClassName: "object-center",
      });
    }
  });

  it("preserves the fallback framing for non-canonical overview assets", () => {
    expect(resolveFloorplanFrame("/assets/buildings/residence/exterior/exterior-front.jpg", "1 / 1")).toMatchObject({
      aspectRatio: "1000 / 640",
      imageWrapperClassName: "origin-top scale-[1.42] -translate-y-[35%]",
      imageClassName: "object-top",
      hotspotScale: 1,
      hotspotOffsetX: 0,
      hotspotOffsetY: 0,
    });
  });

  it("normalizes legacy Residence floorplan paths before resolving frames", () => {
    expect(resolveFloorplanFrame("/assets/floorplans/second_floor.png")).toMatchObject({
      aspectRatio: "1000 / 634",
      imageWrapperClassName: "",
      imageClassName: "object-center",
      hotspotScale: 0.96,
      hotspotOffsetX: 2.4,
      hotspotOffsetY: -6.6,
    });
  });

  it("uses Park floorplan dimensions and selector floor bands", () => {
    expect(resolveFloorplanFrame("/assets/buildings/park/floors/floor-01.png")).toMatchObject({
      aspectRatio: "18140 / 11336",
      imageWrapperClassName: "",
      imageClassName: "object-center",
    });
    expect(resolveFloorplanFrame("/assets/buildings/park/floors/floor-02.png")).toMatchObject({
      aspectRatio: "13856 / 10667",
      imageWrapperClassName: "",
      imageClassName: "object-center",
    });
    expect(resolveFloorplanFrame("/assets/buildings/park/floors/floor-03.png")).toMatchObject({
      aspectRatio: "13701 / 10616",
      imageWrapperClassName: "",
      imageClassName: "object-center",
    });
    expect(Object.keys(buildingSelectorVisuals.b.floorBands ?? {})).toEqual(["1", "2", "3"]);
  });
});
