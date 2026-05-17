import type { Unit } from "@/types/domain";
import { getParkUnitGallery } from "@/data/unit-gallery-assets";

const nowIso = "2026-03-18T09:00:00.000Z";

type BuildingBUnitInput = {
  code: string;
  floor: 1 | 2 | 3;
  rooms: 3 | 4;
  total: number;
  terrace: number;
  hasYard: boolean;
  typologyId: "b-type-a1" | "b-type-a2" | "b-type-b1" | "b-type-b2";
  description: string;
  highlight: string;
  orientation: "south-east" | "south-west";
};

function floorplanPath(code: string) {
  return `/assets/buildings/park/apartments/${code.replace("-AP-", "-A-AP.")}.png`;
}

function makeBuildingBUnit(input: BuildingBUnitInput): Unit {
  const unitNumber = input.code.replace("B-AP.", "");
  return {
    id: `b-ap-${unitNumber}`,
    kind: "apartment",
    slug: input.code.toLowerCase(),
    externalCode: input.code,
    code: input.code,
    buildingId: "b",
    floorId: `b-${input.floor}`,
    typologyId: input.typologyId,
    unitNumber,
    floor: input.floor,
    rooms: input.rooms,
    bedrooms: 2,
    bathrooms: 1,
    area: { living: input.total, shared: 0, terrace: input.terrace, total: input.total },
    ownership: { commonPartsPercent: 0, landPercent: 0, landArea: 0 },
    areaInternalSqm: input.total,
    areaTotalSqm: input.total,
    terraceSqm: input.terrace,
    hasYard: input.hasYard,
    outdoorType: input.hasYard ? "yard" : "balcony",
    size: input.total,
    orientation: input.orientation,
    exposure: input.orientation,
    price: 0,
    currency: "EUR",
    status: "available",
    isPublished: true,
    isPriceVisible: false,
    description: input.description,
    highlight: input.highlight,
    floorplan: floorplanPath(input.code),
    floorplanImageId: `media-floorplan-${input.typologyId}`,
    gallery: getParkUnitGallery(input.code),
    panoramaImage: "",
    features: input.hasYard ? ["Two bedrooms", "One bathroom", "Private yard"] : ["Two bedrooms", "One bathroom", "Balcony"],
    planArea: { x: 0, y: 0, width: 0, height: 0 },
    seoTitle: `${input.code} | Park | Pautalia Residence Kyustendil`,
    seoDescription: `${input.code} in Park at Pautalia Residence, Kyustendil. Contact the sales team for price and availability.`,
    updatedByUserId: "seed-admin",
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export const buildingBUnits: Unit[] = [
  makeBuildingBUnit({
    code: "B-AP.01",
    floor: 1,
    rooms: 3,
    total: 67.37,
    terrace: 37.11,
    hasYard: true,
    typologyId: "b-type-a1",
    orientation: "south-east",
    description: "Two-bedroom ground-floor apartment with a 37 sq m private yard.",
    highlight: "Ground-floor home with private yard and direct outdoor access.",
  }),
  makeBuildingBUnit({
    code: "B-AP.02",
    floor: 1,
    rooms: 3,
    total: 67.37,
    terrace: 33.32,
    hasYard: true,
    typologyId: "b-type-a2",
    orientation: "south-west",
    description: "Two-bedroom ground-floor apartment with a 33 sq m private yard.",
    highlight: "Mirror ground-floor home with a private yard and practical layout.",
  }),
  makeBuildingBUnit({
    code: "B-AP.03",
    floor: 2,
    rooms: 4,
    total: 83.75,
    terrace: 7.03,
    hasYard: false,
    typologyId: "b-type-b1",
    orientation: "south-east",
    description: "Four-room apartment with dressing room and two balconies.",
    highlight: "Upper-floor home with dressing room, open living area, and two balconies.",
  }),
  makeBuildingBUnit({
    code: "B-AP.04",
    floor: 2,
    rooms: 4,
    total: 83.75,
    terrace: 7.03,
    hasYard: false,
    typologyId: "b-type-b2",
    orientation: "south-west",
    description: "Mirror four-room apartment with dressing room and two balconies.",
    highlight: "Mirror upper-floor home with dressing room and two balconies.",
  }),
  makeBuildingBUnit({
    code: "B-AP.05",
    floor: 3,
    rooms: 4,
    total: 83.75,
    terrace: 7.03,
    hasYard: false,
    typologyId: "b-type-b1",
    orientation: "south-east",
    description: "Third-floor four-room apartment with dressing room and two balconies.",
    highlight: "Upper-level home with two balconies and a practical day-night layout.",
  }),
  makeBuildingBUnit({
    code: "B-AP.06",
    floor: 3,
    rooms: 4,
    total: 83.75,
    terrace: 7.03,
    hasYard: false,
    typologyId: "b-type-b2",
    orientation: "south-west",
    description: "Mirror third-floor four-room apartment with dressing room and two balconies.",
    highlight: "Mirror upper-level home with two balconies and a practical plan.",
  }),
];
