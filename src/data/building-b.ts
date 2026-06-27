import type { Building, Floor, Typology } from "@/types/domain";

const nowIso = "2026-03-18T09:00:00.000Z";

export const buildingBSeed: Omit<Building, "totalUnits" | "availableUnits" | "createdAt" | "updatedAt"> = {
  id: "b",
  slug: "park",
  name: "Park",
  tagline: "Six apartments across three floors with private yards on the ground level and open balconies above.",
  shortDescription: "Six apartments across three floors with private yards on the ground level and open balconies above.",
  description:
    "Park offers six apartments across three floors, each with a clear and practical layout. Ground-floor apartments have private yards, while upper-floor apartments feature two balconies and a dedicated dressing room.",
  heroImage: "/assets/buildings/park/hero/park_exterior-front.png",
  heroImageId: "media-exterior-front",
  coverRenderId: "media-exterior-front",
  status: "published",
  displayOrder: 2,
  modelColor: "#7f988a",
  sequence: 2,
  floorsCount: 3,
  completionPercent: 0,
  deliveryQuarter: "",
  floorplanImage: "/assets/buildings/park/floors/floor-01.png",
  panoramaImage: "",
  amenities: [
    "6 apartments across 3 floors",
    "Private yards on the ground floor",
    "Two balconies on upper-floor homes",
    "6 integrated parking spaces",
  ],
  coordinates: [3.8, 0, 0],
};

export const buildingBTypologies: Typology[] = [
  {
    id: "b-type-a1",
    name: "Ground Left",
    rooms: 3,
    description: "Two-bedroom ground-floor apartment with private yard.",
    defaultFloorplanImageId: "media-floorplan-b-type-a1",
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: "b-type-a2",
    name: "Ground Right",
    rooms: 3,
    description: "Mirror two-bedroom ground-floor apartment with private yard.",
    defaultFloorplanImageId: "media-floorplan-b-type-a2",
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: "b-type-b1",
    name: "Upper Left",
    rooms: 3,
    description: "Upper-floor apartment with dressing room and two balconies.",
    defaultFloorplanImageId: "media-floorplan-b-type-b1",
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: "b-type-b2",
    name: "Upper Right",
    rooms: 3,
    description: "Mirror upper-floor apartment with dressing room and two balconies.",
    defaultFloorplanImageId: "media-floorplan-b-type-b2",
    createdAt: nowIso,
    updatedAt: nowIso,
  },
];

export const buildingBFloors: Floor[] = [
  {
    id: "b-1",
    buildingId: "b",
    number: 1,
    label: "Garden Residences",
    description: "Ground-floor homes with private yards and direct outdoor access.",
    floorplanImage: "/assets/buildings/park/floors/floor-01.png",
    floorplanImageId: "media-floorplan-b-1",
    mapAspectRatio: "1 / 1",
    svgOverlayData: { viewBox: "0 0 100 100" },
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: "b-2",
    buildingId: "b",
    number: 2,
    label: "Mid-Level Collection",
    description: "Second-floor homes with practical layouts, dressing rooms, and two balconies.",
    floorplanImage: "/assets/buildings/park/floors/floor-02.png",
    floorplanImageId: "media-floorplan-b-2",
    mapAspectRatio: "1 / 1",
    svgOverlayData: { viewBox: "0 0 100 60" },
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: "b-3",
    buildingId: "b",
    number: 3,
    label: "Upper-Level Collection",
    description: "Top-floor homes with generous space and panoramic views.",
    floorplanImage: "/assets/buildings/park/floors/floor-03.png",
    floorplanImageId: "media-floorplan-b-3",
    mapAspectRatio: "1 / 1",
    svgOverlayData: { viewBox: "0 0 100 60" },
    createdAt: nowIso,
    updatedAt: nowIso,
  },
];

export const buildingBParkingUnits = [
  { id: "b-parking-1", code: "B-PM.01", areaSqm: 12.48 },
  { id: "b-parking-2", code: "B-PM.02", areaSqm: 13.46 },
  { id: "b-parking-3", code: "B-PM.03", areaSqm: 12.5 },
  { id: "b-parking-4", code: "B-PM.04", areaSqm: 12.5 },
  { id: "b-parking-5", code: "B-PM.05", areaSqm: 12.5 },
  { id: "b-parking-6", code: "B-PM.06", areaSqm: 11.95 },
] as const;
