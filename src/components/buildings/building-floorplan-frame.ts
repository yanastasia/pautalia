type FloorplanFrame = {
  aspectRatio: string;
  imageWrapperClassName: string;
  imageClassName: string;
  hotspotScale: number;
  hotspotOffsetX: number;
  hotspotOffsetY: number;
};

type FloorplanFrameConfig = Pick<
  FloorplanFrame,
  "aspectRatio" | "imageWrapperClassName" | "hotspotScale" | "hotspotOffsetX" | "hotspotOffsetY"
>;

const DEFAULT_FLOORPLAN_FRAME: FloorplanFrame = {
  aspectRatio: "829 / 765",
  imageWrapperClassName: "origin-top scale-[1.42] -translate-y-[35%]",
  imageClassName: "object-top",
  hotspotScale: 1,
  hotspotOffsetX: 0,
  hotspotOffsetY: 0,
};

const FLOORPLAN_FRAME_CONFIGS: Record<string, FloorplanFrameConfig> = {
  "/assets/floorplans/first_floor.png": {
    aspectRatio: "1000 / 634",
    imageWrapperClassName: "",
    hotspotScale: 1.88,
    hotspotOffsetX: -0.3,
    hotspotOffsetY: -1.6,
  },
  "/assets/floorplans/second_floor.png": {
    aspectRatio: "1000 / 634",
    imageWrapperClassName: "",
    hotspotScale: 0.96,
    hotspotOffsetX: 2.4,
    hotspotOffsetY: -6.6,
  },
  "/assets/floorplans/third_floor.png": {
    aspectRatio: "1000 / 634",
    imageWrapperClassName: "",
    hotspotScale: 1,
    hotspotOffsetX: 0,
    hotspotOffsetY: 0,
  },
  "/assets/floorplans/fourth_floor.png": {
    aspectRatio: "1000 / 634",
    imageWrapperClassName: "",
    hotspotScale: 1,
    hotspotOffsetX: 0,
    hotspotOffsetY: 0,
  },
};

export function resolveFloorplanFrame(imagePath: string, mapAspectRatio?: string): FloorplanFrame {
  const config = FLOORPLAN_FRAME_CONFIGS[imagePath];

  if (config) {
    return {
      ...config,
      imageClassName: "object-center",
    };
  }

  return {
    ...DEFAULT_FLOORPLAN_FRAME,
    aspectRatio: mapAspectRatio === "1 / 1" ? "1000 / 640" : (mapAspectRatio ?? DEFAULT_FLOORPLAN_FRAME.aspectRatio),
  };
}
