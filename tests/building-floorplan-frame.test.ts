import { describe, expect, it } from "vitest";
import { resolveFloorplanFrame } from "@/components/buildings/building-floorplan-frame";

describe("resolveFloorplanFrame", () => {
  it("keeps the building floor plans fully visible in their native 1000 / 634 frame", () => {
    const floorImages = [
      "/assets/floorplans/first_floor.png",
      "/assets/floorplans/second_floor.png",
      "/assets/floorplans/third_floor.png",
      "/assets/floorplans/fourth_floor.png",
    ];

    for (const imagePath of floorImages) {
      expect(resolveFloorplanFrame(imagePath)).toMatchObject({
        aspectRatio: "1000 / 634",
        imageWrapperClassName: "",
        imageClassName: "object-center",
      });
    }
  });

  it("preserves the legacy fallback framing for non-floor overview assets", () => {
    expect(resolveFloorplanFrame("/assets/floorplans/custom.png", "1 / 1")).toMatchObject({
      aspectRatio: "1000 / 640",
      imageWrapperClassName: "origin-top scale-[1.42] -translate-y-[35%]",
      imageClassName: "object-top",
      hotspotScale: 1,
      hotspotOffsetX: 0,
    });
  });
});
