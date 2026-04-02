type FloorplanFrame = {
  aspectRatio: string;
  imageWrapperClassName: string;
  imageClassName: string;
  hotspotScale: number;
  hotspotOffsetX: number;
};

type FloorplanFrameConfig = Pick<
  FloorplanFrame,
  "aspectRatio" | "imageWrapperClassName" | "hotspotScale" | "hotspotOffsetX"
>;

const DEFAULT_FLOORPLAN_FRAME: FloorplanFrame = {
  aspectRatio: "829 / 765",
  imageWrapperClassName: "origin-top scale-[1.42] -translate-y-[35%]",
  imageClassName: "object-top",
  hotspotScale: 1,
  hotspotOffsetX: 0,
};

const FLOORPLAN_FRAME_CONFIGS: Record<string, FloorplanFrameConfig> = {
  "/assets/floorplans/first_floor.png": {
    aspectRatio: "1000 / 634",
    imageWrapperClassName: "",
    hotspotScale: 1.8,
    hotspotOffsetX: 1.2,
  },
  "/assets/floorplans/second_floor.png": {
    aspectRatio: "1000 / 634",
    imageWrapperClassName: "",
    hotspotScale: 1,
    hotspotOffsetX: 0,
  },
  "/assets/floorplans/third_floor.png": {
    aspectRatio: "1000 / 634",
    imageWrapperClassName: "",
    hotspotScale: 1,
    hotspotOffsetX: 0,
  },
  "/assets/floorplans/fourth_floor.png": {
    aspectRatio: "1000 / 634",
    imageWrapperClassName: "",
    hotspotScale: 1,
    hotspotOffsetX: 0,
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
