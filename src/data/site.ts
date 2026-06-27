import type {
  Building,
  Floor,
  GalleryAsset,
  MediaAsset,
  PublicProjectOverview,
  Typology,
  Unit,
  UnitStatus,
} from "@/types/domain";
import { buildingAFloorOverrides, buildingAParsedUnits } from "@/data/building-a-floorplans";
import { buildingAParkingUnits } from "@/data/building-a-parking";
import { buildingBFloorOverrides, buildingBParsedUnits } from "@/data/building-b-floorplans";
import { buildingBParkingUnits, buildingBSeed, buildingBTypologies } from "@/data/building-b";
import { getOfficialApartmentValue } from "@/data/official-unit-values";
import { getResidenceUnitGallery, parkGeneralGalleryImages, parkUnitGalleriesByCode } from "@/data/unit-gallery-assets";

const nowIso = "2026-03-18T09:00:00.000Z";

const buildingSeeds = [
  {
    id: "a",
    slug: "residence",
    name: "Residence",
    tagline: "Larger homes with open views and private outdoor space on the ground floor.",
    shortDescription: "Spacious homes with broad outlooks, practical layouts, and private yards on floor one.",
    description:
      "Residence offers larger homes, private outdoor space on the ground floor, and broad views from the upper levels.",
    heroImage: "/assets/buildings/residence/hero/exterior-front.jpg",
    heroImageId: "media-exterior-front",
    coverRenderId: "media-exterior-front",
    status: "published" as const,
    displayOrder: 1,
    modelColor: "#c77d4f",
    sequence: 1,
    floorsCount: 4,
    completionPercent: 5,
    deliveryQuarter: "",
    floorplanImage: "/assets/buildings/residence/floors/floor-01.png",
    panoramaImage: "/assets/buildings/residence/panoramas/living-panorama.jpg",
    amenities: [
      "Premium insulated facade",
      "Controlled access and CCTV",
      "Dedicated parking access",
      "Shared landscaped court",
    ],
    coordinates: [-3.8, 0, 0] as [number, number, number],
  },
  buildingBSeed,
] as const;

const typologySeeds = [
  {
    id: "typology-2a",
    name: "Two-room corner",
    rooms: 2,
    description: "Two-room type with corner living area and larger terrace edge.",
    defaultFloorplanImageId: "media-floorplan-typical",
  },
  {
    id: "typology-3a",
    name: "Three-room family",
    rooms: 3,
    description: "Family-oriented layout with separated day and night zones.",
    defaultFloorplanImageId: "media-floorplan-typical",
  },
  {
    id: "typology-2b",
    name: "Two-room efficient",
    rooms: 2,
    description: "Compact home tuned for first-time buyers and investors.",
    defaultFloorplanImageId: "media-floorplan-typical",
  },
  {
    id: "typology-4a",
    name: "Four-room premium",
    rooms: 4,
    description: "Largest premium unit type with broad frontage and terrace depth.",
    defaultFloorplanImageId: "media-floorplan-typical",
  },
] as const;

const floorLabels = {
  1: "Garden Residences",
  2: "Mid-Level Collection",
  3: "Upper-Level Collection",
  4: "Top Floor Collection",
} as const;

const floorDescriptions = {
  1: "Homes with easier access to shared landscaping and the arrival court.",
  2: "Well-balanced homes with open views and comfortable everyday layouts.",
  3: "Upper floor units with longer sightlines and quieter outlooks.",
  4: "Top-floor homes with generous terraces and the broadest views.",
} as const;

export const typologies: Typology[] = [
  ...typologySeeds.map((typology) => ({
    ...typology,
    createdAt: nowIso,
    updatedAt: nowIso,
  })),
  ...buildingBTypologies,
];

const buildingAFloors: Floor[] = buildingSeeds
  .filter((building) => building.id === "a")
  .flatMap((building) =>
    Array.from({ length: building.floorsCount }, (_, index) => {
    const number = index + 1;
    const floorKey = `${building.id}-${number}`;
    const floorOverride = buildingAFloorOverrides[floorKey];
    return {
      id: `${building.id}-${number}`,
      buildingId: building.id,
      number,
      label: floorLabels[number as keyof typeof floorLabels],
      description: floorDescriptions[number as keyof typeof floorDescriptions],
      floorplanImage: floorOverride?.floorplanImage ?? building.floorplanImage,
      floorplanImageId: floorOverride?.floorplanImageId ?? "media-floorplan-typical",
      mapAspectRatio: floorOverride?.mapAspectRatio ?? "16 / 9",
      svgOverlayData: {
        viewBox: "0 0 100 100",
      },
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    }),
  );

const buildingBFloorsParsed: Floor[] = buildingSeeds
  .filter((building) => building.id === "b")
  .flatMap((building) =>
    Array.from({ length: building.floorsCount }, (_, index) => {
      const number = index + 1;
      const floorKey = `${building.id}-${number}`;
      const floorOverride = buildingBFloorOverrides[floorKey];
      return {
        id: `${building.id}-${number}`,
        buildingId: building.id,
        number,
        label: floorOverride?.label || floorLabels[number as keyof typeof floorLabels],
        description: floorOverride?.description || floorDescriptions[number as keyof typeof floorDescriptions],
        floorplanImage: floorOverride?.floorplanImage ?? building.floorplanImage,
        floorplanImageId: floorOverride?.floorplanImageId ?? "media-floorplan-typical",
        mapAspectRatio: floorOverride?.mapAspectRatio ?? "1 / 1",
        svgOverlayData: {
          viewBox: "0 0 100 100",
        },
        createdAt: nowIso,
        updatedAt: nowIso,
      };
    }),
  );

export const floors: Floor[] = [...buildingAFloors, ...buildingBFloorsParsed];

const buildingASeed = buildingSeeds.find((building) => building.id === "a");

function getBuildingAInternalPrice(areaTotalSqm: number, floor: number, outdoorType?: Unit["outdoorType"]) {
  const terracePremium = outdoorType === "terrace" ? 18000 : outdoorType === "yard" ? 9000 : outdoorType === "balcony" ? 3500 : 0;
  return Math.round(areaTotalSqm * 1680 + floor * 4200 + terracePremium);
}

const buildingAUnits: Unit[] = buildingASeed
  ? buildingAParsedUnits.map((unit) => {
      const official = getOfficialApartmentValue(unit.externalCode);
      const living = official?.living ?? unit.areaInternalSqm;
      const shared = official?.shared ?? Math.max(0, Number((unit.areaTotalSqm - unit.areaInternalSqm).toFixed(2)));
      const terrace = official?.terrace ?? unit.terraceSqm;
      const total = official?.total ?? unit.areaTotalSqm;

      return {
        ...unit,
        kind: "apartment",
        buildingId: "a",
        floorId: `a-${unit.floor}`,
        areaInternalSqm: living,
        areaTotalSqm: total,
        terraceSqm: terrace,
        area: {
          living,
          shared,
          ...(terrace > 0 ? { terrace } : {}),
          total,
        },
        ownership: {
          commonPartsPercent: official?.commonPartsPercent ?? 0,
          landPercent: official?.landPercent ?? 0,
          landArea: official?.landArea ?? 0,
        },
        size: total,
        price: getBuildingAInternalPrice(unit.areaTotalSqm, unit.floor, unit.outdoorType),
        currency: "EUR",
        status: "available",
        isPublished: true,
        isPriceVisible: false,
        gallery: getResidenceUnitGallery(unit.externalCode),
        panoramaImage: buildingASeed.panoramaImage,
        features: [...unit.features],
        digitalTwinId: `dt-${unit.typologyId}`,
        updatedByUserId: "seed-admin",
        createdAt: nowIso,
        updatedAt: nowIso,
      };
    })
  : [];

const buildingBUnits: Unit[] = buildingBParsedUnits.map((unit) => {
  return {
    ...unit,
    kind: "apartment",
    buildingId: "b",
    floorId: `b-${unit.floor}`,
    area: {
      living: unit.areaInternalSqm,
      shared: 0,
      ...(unit.terraceSqm > 0 ? { terrace: unit.terraceSqm } : {}),
      total: unit.areaTotalSqm,
    },
    ownership: {
      commonPartsPercent: 0,
      landPercent: 0,
      landArea: 0,
    },
    price: 0,
    currency: "EUR",
    status: "available",
    isPublished: true,
    isPriceVisible: false,
    gallery: [...(parkUnitGalleriesByCode[unit.externalCode] ?? [])],
    panoramaImage: "",
    updatedByUserId: "seed-admin",
    createdAt: nowIso,
    updatedAt: nowIso,
  };
});

const buildingAParking: Unit[] = buildingAParkingUnits.map((parking) => ({
  id: parking.id,
  kind: "parking",
  externalCode: parking.code,
  code: parking.code,
  slug: parking.code.toLowerCase().replace(".", "-"),
  buildingId: "a",
  floorId: "",
  typologyId: "",
  unitNumber: parking.code.split(".")[1],
  floor: 0,
  rooms: 0,
  bedrooms: 0,
  bathrooms: 0,
  areaInternalSqm: 0,
  areaTotalSqm: parking.areaSqm,
  terraceSqm: 0,
  area: {
    living: 0,
    shared: 0,
    total: parking.areaSqm,
  },
  ownership: {
    commonPartsPercent: 0,
    landPercent: 0,
    landArea: 0,
  },
  size: parking.areaSqm,
  price: 0,
  currency: "EUR",
  status: "available",
  isPublished: true,
  isPriceVisible: false,
  description: "Private parking space in Residence.",
  highlight: "Parking space.",
  floorplan: "/assets/buildings/residence/floors/floor-01.png",
  panoramaImage: "",
  gallery: [],
  features: ["parking"],
  planArea: { x: 0, y: 0, width: 0, height: 0 },
  seoTitle: `Parking ${parking.code}`,
  seoDescription: `Private parking space ${parking.code} in Residence.`,
  orientation: "parking",
  exposure: "parking",
  updatedByUserId: "seed-admin",
  createdAt: nowIso,
  updatedAt: nowIso,
}));

const buildingBParking: Unit[] = buildingBParkingUnits.map((parking) => ({
  id: parking.id,
  kind: "parking",
  externalCode: parking.code,
  code: parking.code,
  slug: parking.code.toLowerCase().replace(".", "-"),
  buildingId: "b",
  floorId: "",
  typologyId: "",
  unitNumber: parking.code.split(".")[1],
  floor: 0,
  rooms: 0,
  bedrooms: 0,
  bathrooms: 0,
  areaInternalSqm: 0,
  areaTotalSqm: parking.areaSqm,
  terraceSqm: 0,
  area: {
    living: 0,
    shared: 0,
    total: parking.areaSqm,
  },
  ownership: {
    commonPartsPercent: 0,
    landPercent: 0,
    landArea: 0,
  },
  size: parking.areaSqm,
  price: 0,
  currency: "EUR",
  status: "available",
  isPublished: true,
  isPriceVisible: false,
  description: "Private parking space in Park.",
  highlight: "Parking space.",
  floorplan: "/assets/buildings/park/floors/floor-01.png",
  panoramaImage: "",
  gallery: [],
  features: ["parking"],
  planArea: { x: 0, y: 0, width: 0, height: 0 },
  seoTitle: `Parking ${parking.code}`,
  seoDescription: `Private parking space ${parking.code} in Park.`,
  orientation: "parking",
  exposure: "parking",
  updatedByUserId: "seed-admin",
  createdAt: nowIso,
  updatedAt: nowIso,
}));

export const units: Unit[] = [...buildingAUnits, ...buildingBUnits, ...buildingAParking, ...buildingBParking];

export const buildings: Building[] = buildingSeeds.map((building) => {
  const buildingUnits = units.filter((unit) => unit.buildingId === building.id && unit.kind === "apartment");
  return {
    ...building,
    totalUnits: buildingUnits.length,
    availableUnits: buildingUnits.filter((unit) => unit.status === "available" && unit.isPublished).length,
    amenities: [...building.amenities],
    createdAt: nowIso,
    updatedAt: nowIso,
  };
});

export const mediaAssets: MediaAsset[] = [
  {
    id: "media-exterior-front",
    type: "render",
    mimeType: "image/jpeg",
    fileSize: 1200000,
    width: 4096,
    height: 2048,
    storageKey: "assets/exterior/exterior-front.jpg",
    altText: "Exterior render of the building",
    createdAt: nowIso,
  },
  {
    id: "media-floorplan-typical",
    type: "floorplan",
    mimeType: "image/png",
    fileSize: 900000,
    width: 1000,
    height: 1000,
    storageKey: "assets/buildings/residence/floors/floor-01.png",
    altText: "Residence ground floor plan",
    createdAt: nowIso,
  },
  {
    id: "media-floorplan-a-1",
    type: "floorplan",
    mimeType: "image/png",
    fileSize: 320000,
    width: 1000,
    height: 1000,
    storageKey: "assets/buildings/residence/floors/floor-01.png",
    altText: "Residence ground floor plan",
    createdAt: nowIso,
  },
  {
    id: "media-floorplan-a-2",
    type: "floorplan",
    mimeType: "image/png",
    fileSize: 320000,
    width: 1000,
    height: 1000,
    storageKey: "assets/buildings/residence/floors/floor-02.png",
    altText: "Residence second floor plan",
    createdAt: nowIso,
  },
  {
    id: "media-floorplan-a-3",
    type: "floorplan",
    mimeType: "image/png",
    fileSize: 320000,
    width: 1000,
    height: 1000,
    storageKey: "assets/buildings/residence/floors/floor-03.png",
    altText: "Residence third floor plan",
    createdAt: nowIso,
  },
  {
    id: "media-floorplan-a-4",
    type: "floorplan",
    mimeType: "image/png",
    fileSize: 320000,
    width: 1000,
    height: 1000,
    storageKey: "assets/buildings/residence/floors/floor-04.png",
    altText: "Residence fourth floor plan",
    createdAt: nowIso,
  },
  {
    id: "media-panorama-living",
    type: "panorama",
    mimeType: "image/jpeg",
    fileSize: 1600000,
    width: 4096,
    height: 2048,
    storageKey: "assets/panoramas/living-panorama.jpg",
    altText: "Living room panorama",
    createdAt: nowIso,
  },
];

export const galleryAssets: GalleryAsset[] = [
  {
    id: "g1",
    title: "Street elevation",
    category: "exterior",
    categoryLabel: "exterior",
    image: "/assets/buildings/residence/gallery/exterior-front.jpg",
    caption: "Main facade direction and arrival sequence from the primary street edge.",
  },
  {
    id: "g2",
    title: "Living room concept",
    category: "interior",
    categoryLabel: "interior",
    image: "/assets/buildings/residence/gallery/living-entry.jpg",
    caption: "Warm neutral material palette used across representative interiors.",
  },
  {
    id: "g3",
    title: "Entrance hall concept",
    category: "interior",
    categoryLabel: "interior",
    image: "/assets/buildings/residence/gallery/hall-entry.jpg",
    caption: "Clean circulation, warm timber tones, and a calm neutral palette at entry.",
  },
  {
    id: "g4",
    title: "Bedroom concept",
    category: "interior",
    categoryLabel: "interior",
    image: "/assets/buildings/residence/gallery/bedroom-entry.jpg",
    caption: "A bright bedroom with soft materials and a restrained palette.",
  },
  {
    id: "g5",
    title: "Bathroom concept",
    category: "interior",
    categoryLabel: "interior",
    image: "/assets/buildings/residence/gallery/bathroom-entry.jpg",
    caption: "Bathroom detail with a restrained palette and clean built-in lines.",
  },
  {
    id: "g6",
    title: "Walkthrough panorama",
    category: "panorama",
    categoryLabel: "panorama",
    image: "/assets/buildings/residence/panoramas/living-panorama.jpg",
    caption: "Panoramic view from a representative living space.",
  },
  {
    id: "g7",
    title: "Park exterior",
    category: "exterior",
    categoryLabel: "exterior",
    image: parkGeneralGalleryImages.exterior,
    caption: "Exterior render selected from the Park building media set.",
  },
  {
    id: "g8",
    title: "Park living room",
    category: "interior",
    categoryLabel: "interior",
    image: parkGeneralGalleryImages.living,
    caption: "Representative Park apartment living area from the unit render set.",
  },
  {
    id: "g9",
    title: "Park private yard",
    category: "interior",
    categoryLabel: "interior",
    image: parkGeneralGalleryImages.yard,
    caption: "Ground-floor Park apartment render showing private outdoor space.",
  },
  {
    id: "g10",
    title: "Park balcony",
    category: "interior",
    categoryLabel: "interior",
    image: parkGeneralGalleryImages.balcony,
    caption: "Upper-floor Park apartment balcony render.",
  },
];

export const projectHighlights = [
  {
    title: "One active building",
    copy: "The current launch is focused on one building with a clear set of homes, layouts, and delivery timing.",
  },
  {
    title: "Homes with clear choice points",
    copy: "Browse available homes by rooms, floor, orientation, and price without losing your place.",
  },
  {
    title: "Direct contact when needed",
    copy: "Move from browsing into a personal conversation with the sales team whenever you are ready.",
  },
];

export const nearbyPlaces = [
  { name: "City center", value: "4 min drive" },
  { name: "Regional hospital", value: "6 min drive" },
  { name: "Primary school", value: "8 min walk" },
  { name: "Hisarlaka Park", value: "10 min drive" },
];

export const projectStats = [
  { label: "Buildings", value: "2" },
  { label: "Homes", value: String(units.filter((unit) => unit.isPublished && unit.status !== "hidden").length) },
  { label: "Layouts", value: String(typologies.length) },
  { label: "Parking bays", value: String(14 + buildingBParkingUnits.length) },
];

export const siteCopy = {
  name: "Pautalia Residence",
  tagline: "Contemporary homes in Kyustendil, designed for light, calm, and everyday comfort.",
  heroTitle: "Contemporary homes in Kyustendil.",
  heroText: "View the buildings, browse the available homes, and contact us for current availability.",
  contactEmail: "sales@pautalia.com",
  contactPhone: "+359 877 909 010",
  locationLabel: "Kyustendil, Bulgaria",
};

export const publicProjectOverview: PublicProjectOverview = {
  name: siteCopy.name,
  tagline: siteCopy.tagline,
  heroTitle: siteCopy.heroTitle,
  heroText: siteCopy.heroText,
  highlights: projectHighlights,
  stats: projectStats,
  buildingPreviews: buildings,
};

export function getBuilding(id: string) {
  return buildings.find((building) => building.id === id);
}

export function getBuildingBySlug(slug: string) {
  return buildings.find((building) => building.slug === slug);
}

export function getFloor(buildingId: string, floorNumber: number) {
  return floors.find((floor) => floor.buildingId === buildingId && floor.number === floorNumber);
}

export function getUnitsByBuilding(buildingId: string) {
  return units.filter((unit) => unit.buildingId === buildingId && unit.isPublished && unit.status !== "hidden");
}

export function getUnitsByFloor(buildingId: string, floorNumber: number) {
  return units.filter(
    (unit) => unit.buildingId === buildingId && unit.floor === floorNumber && unit.isPublished && unit.status !== "hidden",
  );
}

export function getUnit(id: string) {
  return units.find((unit) => unit.id === id && unit.isPublished && unit.status !== "hidden");
}

export function getUnitBySlug(slug: string) {
  return units.find((unit) => unit.slug === slug);
}

export function getTypology(id: string) {
  return typologies.find((typology) => typology.id === id);
}

export function getPublicBuildings() {
  return buildings.filter((building) => building.status === "published");
}

export function getPublicUnits() {
  return units.filter((unit) => unit.kind === "apartment" && unit.isPublished && unit.status !== "hidden");
}

export function getPublicParkingUnits() {
  return units.filter((unit) => unit.kind === "parking" && unit.isPublished && unit.status !== "hidden");
}

export function formatStatus(status: UnitStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
