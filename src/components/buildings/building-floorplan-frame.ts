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

const RESIDENCE_FLOORPLAN_FRAME_CONFIGS: Record<string, FloorplanFrameConfig> = {
  "floor-01": {
    aspectRatio: "1000 / 634",
    imageWrapperClassName: "",
    hotspotScale: 1.88,
    hotspotOffsetX: -0.3,
    hotspotOffsetY: -1.6,
  },
  "floor-02": {
    aspectRatio: "1000 / 634",
    imageWrapperClassName: "",
    hotspotScale: 0.96,
    hotspotOffsetX: 2.4,
    hotspotOffsetY: -6.6,
  },
  "floor-03": {
    aspectRatio: "1000 / 634",
    imageWrapperClassName: "",
    hotspotScale: 1,
    hotspotOffsetX: 0,
    hotspotOffsetY: 0,
  },
  "floor-04": {
    aspectRatio: "1000 / 634",
    imageWrapperClassName: "",
    hotspotScale: 1,
    hotspotOffsetX: 0,
    hotspotOffsetY: 0,
  },
};

const FLOORPLAN_FRAME_CONFIGS: Record<string, FloorplanFrameConfig> = {
  "/assets/buildings/residence/floors/floor-01.png": RESIDENCE_FLOORPLAN_FRAME_CONFIGS["floor-01"],
  "/assets/buildings/residence/floors/floor-02.png": RESIDENCE_FLOORPLAN_FRAME_CONFIGS["floor-02"],
  "/assets/buildings/residence/floors/floor-03.png": RESIDENCE_FLOORPLAN_FRAME_CONFIGS["floor-03"],
  "/assets/buildings/residence/floors/floor-04.png": RESIDENCE_FLOORPLAN_FRAME_CONFIGS["floor-04"],
  "/assets/buildings/park/floors/floor-01.png": {
    aspectRatio: "18140 / 11336",
    imageWrapperClassName: "",
    hotspotScale: 1,
    hotspotOffsetX: 0,
    hotspotOffsetY: 0,
  },
  "/assets/buildings/park/floors/floor-02.png": {
    aspectRatio: "13856 / 10667",
    imageWrapperClassName: "",
    hotspotScale: 1,
    hotspotOffsetX: 0,
    hotspotOffsetY: 0,
  },
  "/assets/buildings/park/floors/floor-03.png": {
    aspectRatio: "13701 / 10616",
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
