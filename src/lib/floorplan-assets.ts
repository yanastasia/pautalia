const LEGACY_FLOORPLAN_PATHS: Record<string, string> = {
  "/assets/floorplans/first_floor.png": "/assets/buildings/residence/floors/floor-01.png",
  "/assets/floorplans/second_floor.png": "/assets/buildings/residence/floors/floor-02.png",
  "/assets/floorplans/third_floor.png": "/assets/buildings/residence/floors/floor-03.png",
  "/assets/floorplans/fourth_floor.png": "/assets/buildings/residence/floors/floor-04.png",
};

export function normalizeFloorplanImagePath(imagePath: string, fallback?: string) {
  const trimmedPath = imagePath.trim();

  if (!trimmedPath) {
    return fallback ?? trimmedPath;
  }

  if (LEGACY_FLOORPLAN_PATHS[trimmedPath]) {
    return LEGACY_FLOORPLAN_PATHS[trimmedPath];
  }

  if (trimmedPath.startsWith("/assets/") || trimmedPath.startsWith("http")) {
    return trimmedPath;
  }

  return fallback ?? trimmedPath;
}
