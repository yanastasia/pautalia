import type { Floor, Unit, UnitPlanArea } from "@/types/domain";

export const buildingBFacadePhoto = "/assets/buildings/park/selector/main.png";

export const buildingBFloorPlanImages = {
  1: "/assets/buildings/park/floors/floor-01.png",
  2: "/assets/buildings/park/floors/floor-02.png",
  3: "/assets/buildings/park/floors/floor-03.png",
} as const;

const buildingBUnitFloorplanImages = {
  "B-AP.01": "/assets/buildings/park/apartments/B-AP.01.png",
  "B-AP.02": "/assets/buildings/park/apartments/B-AP.02.png",
  "B-AP.03": "/assets/buildings/park/apartments/B-AP.03.png",
  "B-AP.04": "/assets/buildings/park/apartments/B-AP.04.png",
  "B-AP.05": "/assets/buildings/park/apartments/B-AP.05.png",
  "B-AP.06": "/assets/buildings/park/apartments/B-AP.06.png",
} as const;

/**
 * Placeholder polygon points for Building B hotspots.
 * Format: "x,y x,y x,y" (0-100 scale).
 * Since the user is still resizing images to 1000x1000, these are approximate halves of the floor.
 */
const buildingBUnitPolygonPoints = {
  "B-AP.01": ["5,5 48,5 48,95 5,95"], // Left half (approx)
  "B-AP.02": ["52,5 95,5 95,95 52,95"], // Right half (approx)
  "B-AP.03": ["5,5 48,5 48,95 5,95"],
  "B-AP.04": ["52,5 95,5 95,95 52,95"],
  "B-AP.05": ["5,5 48,5 48,95 5,95"],
  "B-AP.06": ["52,5 95,5 95,95 52,95"],
} as const;

export const buildingBFloorPlanMediaIds = {
  1: "media-floorplan-b-1",
  2: "media-floorplan-b-2",
  3: "media-floorplan-b-3",
} as const;

type BuildingBFloorNumber = keyof typeof buildingBFloorPlanImages;

export const buildingBFloorOverrides: Record<string, Partial<Floor>> = Object.fromEntries(
  Object.entries(buildingBFloorPlanImages).map(([floor, image]) => [
    `b-${floor}`,
    {
      floorplanImage: image,
      floorplanImageId: buildingBFloorPlanMediaIds[Number(floor) as keyof typeof buildingBFloorPlanMediaIds],
      mapAspectRatio: "1 / 1",
    },
  ]),
);

export type BuildingBParsedUnit = Pick<
  Unit,
  | "id"
  | "slug"
  | "externalCode"
  | "code"
  | "unitNumber"
  | "floor"
  | "typologyId"
  | "rooms"
  | "bedrooms"
  | "bathrooms"
  | "areaInternalSqm"
  | "areaTotalSqm"
  | "terraceSqm"
  | "hasYard"
  | "outdoorType"
  | "size"
  | "orientation"
  | "exposure"
  | "highlight"
  | "description"
  | "floorplan"
  | "floorplanImageId"
  | "features"
  | "planArea"
  | "planRegions"
  | "planPolygonPoints"
  | "seoTitle"
  | "seoDescription"
>;

function createParsedUnit({
  floor,
  planArea,
  ...unit
}: Omit<BuildingBParsedUnit, "floorplan" | "floorplanImageId" | "planArea" | "floor"> & {
  floor: BuildingBFloorNumber;
  planArea: UnitPlanArea;
}): BuildingBParsedUnit {
  return {
    ...unit,
    floor,
    floorplan: buildingBUnitFloorplanImages[unit.code as keyof typeof buildingBUnitFloorplanImages] ?? buildingBFloorPlanImages[floor],
    floorplanImageId: buildingBFloorPlanMediaIds[floor],
    planArea,
    planPolygonPoints: buildingBUnitPolygonPoints[unit.code as keyof typeof buildingBUnitPolygonPoints],
  };
}

export const buildingBParsedUnits: BuildingBParsedUnit[] = [
  createParsedUnit({
    id: "b-101",
    slug: "unit-b101",
    externalCode: "B-AP.01",
    code: "B-AP.01",
    unitNumber: "01",
    floor: 1,
    typologyId: "b-type-a1",
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    areaInternalSqm: 67.37,
    areaTotalSqm: 67.37,
    terraceSqm: 37.11,
    hasYard: true,
    outdoorType: "yard",
    size: 67.37,
    orientation: "south-east",
    exposure: "south-east",
    highlight: "Ground-floor home with private yard and direct outdoor access.",
    description: "Two-bedroom ground-floor apartment with a 37 sq m private yard.",
    features: ["Two bedrooms", "One bathroom", "Private yard"],
    planArea: { x: 5, y: 5, width: 43, height: 90 },
    seoTitle: "B-AP.01 | Park | Pautalia Residence Kyustendil",
    seoDescription: "B-AP.01 in Park at Pautalia Residence, Kyustendil. Contact the sales team for price and availability.",
  }),
  createParsedUnit({
    id: "b-102",
    slug: "unit-b102",
    externalCode: "B-AP.02",
    code: "B-AP.02",
    unitNumber: "02",
    floor: 1,
    typologyId: "b-type-a2",
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    areaInternalSqm: 67.37,
    areaTotalSqm: 67.37,
    terraceSqm: 33.32,
    hasYard: true,
    outdoorType: "yard",
    size: 67.37,
    orientation: "south-west",
    exposure: "south-west",
    highlight: "Mirror ground-floor home with a private yard and practical layout.",
    description: "Two-bedroom ground-floor apartment with a 33 sq m private yard.",
    features: ["Two bedrooms", "One bathroom", "Private yard"],
    planArea: { x: 52, y: 5, width: 43, height: 90 },
    seoTitle: "B-AP.02 | Park | Pautalia Residence Kyustendil",
    seoDescription: "B-AP.02 in Park at Pautalia Residence, Kyustendil. Contact the sales team for price and availability.",
  }),
  createParsedUnit({
    id: "b-201",
    slug: "unit-b201",
    externalCode: "B-AP.03",
    code: "B-AP.03",
    unitNumber: "03",
    floor: 2,
    typologyId: "b-type-b1",
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    areaInternalSqm: 83.75,
    areaTotalSqm: 83.75,
    terraceSqm: 7.03,
    hasYard: false,
    outdoorType: "balcony",
    size: 83.75,
    orientation: "south-east",
    exposure: "south-east",
    highlight: "Upper-floor home with dressing room, open living area, and two balconies.",
    description: "Three-room apartment with dressing room and two balconies.",
    features: ["Two bedrooms", "One bathroom", "Balcony"],
    planArea: { x: 5, y: 5, width: 43, height: 90 },
    seoTitle: "B-AP.03 | Park | Pautalia Residence Kyustendil",
    seoDescription: "B-AP.03 in Park at Pautalia Residence, Kyustendil. Contact the sales team for price and availability.",
  }),
  createParsedUnit({
    id: "b-202",
    slug: "unit-b202",
    externalCode: "B-AP.04",
    code: "B-AP.04",
    unitNumber: "04",
    floor: 2,
    typologyId: "b-type-b2",
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    areaInternalSqm: 83.75,
    areaTotalSqm: 83.75,
    terraceSqm: 7.03,
    hasYard: false,
    outdoorType: "balcony",
    size: 83.75,
    orientation: "south-west",
    exposure: "south-west",
    highlight: "Mirror upper-floor home with dressing room and two balconies.",
    description: "Mirror three-room apartment with dressing room and two balconies.",
    features: ["Two bedrooms", "One bathroom", "Balcony"],
    planArea: { x: 52, y: 5, width: 43, height: 90 },
    seoTitle: "B-AP.04 | Park | Pautalia Residence Kyustendil",
    seoDescription: "B-AP.04 in Park at Pautalia Residence, Kyustendil. Contact the sales team for price and availability.",
  }),
  createParsedUnit({
    id: "b-301",
    slug: "unit-b301",
    externalCode: "B-AP.05",
    code: "B-AP.05",
    unitNumber: "05",
    floor: 3,
    typologyId: "b-type-b1",
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    areaInternalSqm: 83.75,
    areaTotalSqm: 83.75,
    terraceSqm: 7.03,
    hasYard: false,
    outdoorType: "balcony",
    size: 83.75,
    orientation: "south-east",
    exposure: "south-east",
    highlight: "Upper-level home with two balconies and a practical day-night layout.",
    description: "Third-floor three-room apartment with dressing room and two balconies.",
    features: ["Two bedrooms", "One bathroom", "Balcony"],
    planArea: { x: 5, y: 5, width: 43, height: 90 },
    seoTitle: "B-AP.05 | Park | Pautalia Residence Kyustendil",
    seoDescription: "B-AP.05 in Park at Pautalia Residence, Kyustendil. Contact the sales team for price and availability.",
  }),
  createParsedUnit({
    id: "b-302",
    slug: "unit-b302",
    externalCode: "B-AP.06",
    code: "B-AP.06",
    unitNumber: "06",
    floor: 3,
    typologyId: "b-type-b2",
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    areaInternalSqm: 83.75,
    areaTotalSqm: 83.75,
    terraceSqm: 7.03,
    hasYard: false,
    outdoorType: "balcony",
    size: 83.75,
    orientation: "south-west",
    exposure: "south-west",
    highlight: "Mirror upper-level home with two balconies and a practical plan.",
    description: "Mirror third-floor three-room apartment with dressing room and two balconies.",
    features: ["Two bedrooms", "One bathroom", "Balcony"],
    planArea: { x: 52, y: 5, width: 43, height: 90 },
    seoTitle: "B-AP.06 | Park | Pautalia Residence Kyustendil",
    seoDescription: "B-AP.06 in Park at Pautalia Residence, Kyustendil. Contact the sales team for price and availability.",
  }),
];
