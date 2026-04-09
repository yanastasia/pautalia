import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { z } from "zod";
import { buildingPresentation } from "@/content/building-presentation";
import {
  buildings as staticBuildings,
  floors as staticFloors,
  getPublicBuildings as getStaticPublicBuildings,
  getPublicUnits as getStaticPublicUnits,
  getTypology as getStaticTypology,
} from "@/data/site";
import type { Locale } from "@/lib/i18n/config";
import { getBuildingLabel, getFloorLabel, getResidenceLabel } from "@/lib/i18n/messages";
import { getFeatureLabel, getOutdoorTypeLabel } from "@/lib/i18n/property";
import { notFoundError, validationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import type { Building as StaticBuilding, Floor as StaticFloor, Unit as StaticUnit, UnitPlanArea } from "@/types/domain";
import type { PublicBuilding, PublicFloor, PublicUnit } from "@/types/public-api";

const unitSortValues = [
  "price_asc",
  "price_desc",
  "floor_asc",
  "floor_desc",
  "rooms_asc",
  "rooms_desc",
] as const;

const preferStaticInventory = process.env.PAUTALIA_INVENTORY_SOURCE?.toLowerCase() !== "database";
const PUBLIC_DATA_REVALIDATE_SECONDS = 300;

export const pautaliaUnitsQuerySchema = z.object({
  building: z.string().trim().min(1).max(80).optional(),
  rooms: z.coerce.number().int().min(1).max(10).optional(),
  floor: z.coerce.number().int().min(1).max(100).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  maxArea: z.coerce.number().min(0).optional(),
  orientation: z.string().trim().min(1).max(64).optional(),
  status: z.enum(["available", "reserved", "sold"]).optional(),
  page: z.coerce.number().int().min(1).max(200).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sort: z.enum(unitSortValues).default("price_asc"),
});

type BuildingRecord = Prisma.BuildingGetPayload<{
  include: {
    floors: true;
    units: {
      select: {
        id: true;
        status: true;
        isPublished: true;
      };
    };
  };
}>;

type FloorRecord = Prisma.FloorGetPayload<{
  include: {
    building: true;
  };
}>;

type UnitRecord = Prisma.UnitGetPayload<{
  include: {
    building: true;
    floor: true;
  };
}>;

type UnitFeatureRecord = {
  features: string[];
  bedrooms?: number | null;
  rooms: number;
  bathrooms: number;
  hasYard?: boolean;
  outdoorType?: string | null;
};

function localizeBuildingName(locale: Locale, building: { id: string; name: string }) {
  if (/^building\s+/i.test(building.name)) {
    return locale === "bg"
      ? building.name.replace(/^building/i, "Сграда")
      : building.name;
  }

  return locale === "bg"
    ? `Сграда ${building.id.toUpperCase()}`
    : `Building ${building.id.toUpperCase()}`;
}

function getBuildingPresentation(slug: string) {
  return (
    buildingPresentation[slug] ?? {
      heroImage: "/assets/exterior/exterior-front.jpg",
      modelColor: "#8c8f92",
      sequence: 1,
      completionPercent: 0,
      deliveryQuarter: { en: "TBC", bg: "Предстои" },
      floorplanImage: "/assets/floorplans/first_floor.png",
      panoramaImage: "/assets/gallery/exterior-front.jpg",
      amenities: { en: [], bg: [] },
      coordinates: [0, 0, 0] as [number, number, number],
      tagline: { en: "", bg: "" },
      shortDescription: { en: "", bg: "" },
      description: { en: "", bg: "" },
    }
  );
}

function parsePlanArea(value: Prisma.JsonValue | null): UnitPlanArea {
  const parsed = z
    .object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .safeParse(value);

  return parsed.success ? parsed.data : { x: 0, y: 0, width: 0, height: 0 };
}

function parsePlanRegions(value: Prisma.JsonValue | null): UnitPlanArea[] | null {
  const parsed = z
    .array(
      z.object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
      }),
    )
    .safeParse(value);

  return parsed.success ? parsed.data : null;
}

function buildUnitFeatures(locale: Locale, unit: UnitFeatureRecord) {
  if (unit.features.length > 0) {
    return unit.features.map((feature) => getFeatureLabel(locale, feature));
  }

  const features = [
    unit.bedrooms
      ? locale === "bg"
        ? `${unit.bedrooms} спални`
        : `${unit.bedrooms} bedrooms`
      : null,
    locale === "bg" ? `${unit.bathrooms} баня` : `${unit.bathrooms} bathrooms`,
    unit.hasYard
      ? locale === "bg"
        ? "Частен двор"
        : "Private yard"
      : unit.outdoorType === "balcony"
        ? locale === "bg"
          ? "Балкон"
          : "Balcony"
        : unit.outdoorType === "terrace"
          ? locale === "bg"
            ? "Тераса"
            : "Terrace"
          : null,
  ].filter(Boolean);

  return features as string[];
}

function buildUnitDescription(
  locale: Locale,
  unit: Pick<StaticUnit, "rooms" | "floor" | "outdoorType" | "description"> | Pick<UnitRecord, "rooms" | "outdoorType" | "description"> & { floor: { number: number } | number },
) {
  if (locale === "en" && unit.description) {
    return unit.description;
  }

  const floorNumber = typeof unit.floor === "number" ? unit.floor : unit.floor.number;
  const outdoorCopy = getOutdoorTypeLabel(locale, unit.outdoorType);
  const fragments = [
    getResidenceLabel(locale, unit.rooms),
    locale === "bg" ? `на ${getFloorLabel(locale, floorNumber).toLowerCase()}` : `on ${getFloorLabel(locale, floorNumber).toLowerCase()}`,
    outdoorCopy ? locale === "bg" ? `с ${outdoorCopy.toLowerCase()}` : `with ${outdoorCopy.toLowerCase()}` : null,
  ].filter(Boolean);

  return `${fragments.join(" ")}.`;
}

function buildUnitHighlight(
  locale: Locale,
  unit: Pick<StaticUnit, "rooms" | "bedrooms" | "bathrooms" | "outdoorType" | "highlight"> | Pick<UnitRecord, "rooms" | "bedrooms" | "bathrooms" | "outdoorType" | "highlight">,
) {
  if (locale === "en" && unit.highlight) {
    return unit.highlight;
  }

  const parts = [
    getResidenceLabel(locale, unit.rooms),
    unit.bedrooms
      ? locale === "bg"
        ? `с ${unit.bedrooms} ${unit.bedrooms === 1 ? "спалня" : "спални"}`
        : `with ${unit.bedrooms} ${unit.bedrooms === 1 ? "bedroom" : "bedrooms"}`
      : null,
    locale === "bg"
      ? `и ${unit.bathrooms} ${unit.bathrooms === 1 ? "баня" : "бани"}`
      : `and ${unit.bathrooms} ${unit.bathrooms === 1 ? "bathroom" : "bathrooms"}`,
  ].filter(Boolean);
  const outdoorCopy = getOutdoorTypeLabel(locale, unit.outdoorType);

  if (outdoorCopy) {
    parts.push(locale === "bg" ? `и ${outdoorCopy.toLowerCase()}` : `and ${outdoorCopy.toLowerCase()}`);
  }

  return `${parts.join(" ")}.`;
}

function mapStaticPublicBuilding(locale: Locale, building: StaticBuilding): PublicBuilding {
  const presentation = getBuildingPresentation(building.slug);
  const publicUnits = getStaticPublicUnits().filter((unit) => unit.buildingId === building.id);

  return {
    id: building.id,
    slug: building.slug,
    name: localizeBuildingName(locale, building),
    tagline: presentation.tagline[locale] || building.tagline,
    shortDescription: presentation.shortDescription[locale] || building.shortDescription,
    description: presentation.description[locale] || building.description,
    fullDescription: presentation.description[locale] || building.description,
    heroImage: presentation.heroImage || building.heroImage,
    status: building.status,
    displayOrder: building.displayOrder,
    modelColor: presentation.modelColor || building.modelColor,
    sequence: presentation.sequence || building.sequence,
    floorsCount: building.floorsCount,
    totalUnits: publicUnits.length,
    availableUnits: publicUnits.filter((unit) => unit.status === "available").length,
    completionPercent: presentation.completionPercent || building.completionPercent,
    deliveryQuarter: presentation.deliveryQuarter[locale] || building.deliveryQuarter,
    floorplanImage: presentation.floorplanImage || building.floorplanImage,
    panoramaImage: presentation.panoramaImage || building.panoramaImage,
    amenities: presentation.amenities[locale]?.length ? presentation.amenities[locale] : building.amenities,
    coordinates: presentation.coordinates || building.coordinates,
  };
}

function mapStaticPublicFloor(locale: Locale, floor: StaticFloor): PublicFloor {
  return {
    id: floor.id,
    buildingId: floor.buildingId,
    number: floor.number,
    label: floor.label || getFloorLabel(locale, floor.number),
    description: floor.description,
    floorplanImage: floor.floorplanImage,
    mapAspectRatio: floor.mapAspectRatio ?? undefined,
    svgOverlayData: floor.svgOverlayData ?? null,
  };
}

function mapStaticPublicUnit(locale: Locale, unit: StaticUnit): PublicUnit {
  const building = staticBuildings.find((candidate) => candidate.id === unit.buildingId) ?? null;
  const floor = staticFloors.find((candidate) => candidate.id === unit.floorId) ?? null;
  const typology = getStaticTypology(unit.typologyId);
  return {
    id: unit.id,
    slug: unit.slug,
    externalCode: unit.externalCode,
    code: unit.code,
    buildingId: unit.buildingId,
    floorId: unit.floorId,
    typologyId: unit.typologyId,
    unitNumber: unit.unitNumber,
    building: building
      ? {
          id: building.id,
          slug: building.slug,
          name: localizeBuildingName(locale, building),
        }
      : null,
    floor: unit.floor,
    floorMeta: floor
      ? {
          id: floor.id,
          number: floor.number,
          label: floor.label || getFloorLabel(locale, floor.number),
        }
      : null,
    typology: {
      id: unit.typologyId,
      name: getResidenceLabel(locale, typology?.rooms ?? unit.rooms),
      rooms: typology?.rooms ?? unit.rooms,
    },
    bedrooms: unit.bedrooms ?? Math.max(unit.rooms - 1, 1),
    rooms: unit.rooms,
    bathrooms: unit.bathrooms,
    areaInternalSqm: unit.areaInternalSqm,
    areaTotalSqm: unit.areaTotalSqm,
    terraceSqm: unit.terraceSqm,
    hasYard: unit.hasYard ?? false,
    outdoorType: unit.outdoorType ?? null,
    size: unit.size,
    orientation: unit.orientation,
    exposure: unit.exposure,
    price: unit.isPriceVisible ? unit.price : null,
    currency: unit.isPriceVisible ? unit.currency : null,
    status: unit.status,
    isPublished: unit.isPublished,
    isPriceVisible: unit.isPriceVisible,
    description: buildUnitDescription(locale, unit),
    highlight: buildUnitHighlight(locale, unit),
    floorplan: unit.floorplan,
    gallery: unit.gallery,
    panoramaImage: unit.panoramaImage ?? unit.gallery[0] ?? unit.floorplan,
    features: buildUnitFeatures(locale, unit),
    planArea: unit.planArea,
    planRegions: unit.planRegions ?? null,
    planPolygonPoints: unit.planPolygonPoints ?? null,
    digitalTwinId: unit.digitalTwinId ?? null,
    seoTitle: unit.seoTitle,
    seoDescription: unit.seoDescription,
  };
}

function compareStaticUnits(a: StaticUnit, b: StaticUnit, sort: (typeof unitSortValues)[number]) {
  switch (sort) {
    case "price_desc":
      return b.price - a.price || a.unitNumber.localeCompare(b.unitNumber);
    case "floor_asc":
      return a.floor - b.floor || a.unitNumber.localeCompare(b.unitNumber);
    case "floor_desc":
      return b.floor - a.floor || a.unitNumber.localeCompare(b.unitNumber);
    case "rooms_asc":
      return a.rooms - b.rooms || a.price - b.price;
    case "rooms_desc":
      return b.rooms - a.rooms || a.price - b.price;
    case "price_asc":
    default:
      return a.price - b.price || a.unitNumber.localeCompare(b.unitNumber);
  }
}

function listStaticPublicBuildings(locale: Locale) {
  return getStaticPublicBuildings()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((building) => mapStaticPublicBuilding(locale, building));
}

function getStaticPublicBuilding(locale: Locale, slugOrId: string) {
  const building = getStaticPublicBuildings().find((candidate) => candidate.slug === slugOrId || candidate.id === slugOrId);

  if (!building) {
    throw notFoundError("Building not found");
  }

  return {
    item: mapStaticPublicBuilding(locale, building),
    floors: staticFloors
      .filter((floor) => floor.buildingId === building.id)
      .sort((a, b) => a.number - b.number)
      .map((floor) => mapStaticPublicFloor(locale, floor)),
  };
}

function listStaticPublicUnits(
  locale: Locale,
  parsed: z.infer<typeof pautaliaUnitsQuerySchema>,
) {
  const staticBuilding = parsed.building
    ? getStaticPublicBuildings().find((candidate) => candidate.slug === parsed.building || candidate.id === parsed.building)
    : null;

  if (parsed.building && !staticBuilding) {
    return {
      items: [],
      pagination: {
        page: parsed.page,
        limit: parsed.limit,
        total: 0,
        totalPages: 1,
      },
    };
  }

  const filtered = getStaticPublicUnits()
    .filter((unit) => (staticBuilding ? unit.buildingId === staticBuilding.id : true))
    .filter((unit) => (parsed.rooms ? unit.rooms === parsed.rooms : true))
    .filter((unit) => (parsed.floor ? unit.floor === parsed.floor : true))
    .filter((unit) => (parsed.orientation ? unit.orientation === parsed.orientation : true))
    .filter((unit) => (parsed.status ? unit.status === parsed.status : true))
    .filter((unit) => (parsed.maxArea !== undefined ? unit.areaTotalSqm <= parsed.maxArea : true))
    .filter((unit) => {
      if (parsed.minPrice === undefined && parsed.maxPrice === undefined) {
        return true;
      }

      if (!unit.isPriceVisible) {
        return false;
      }

      if (parsed.minPrice !== undefined && unit.price < parsed.minPrice) {
        return false;
      }

      if (parsed.maxPrice !== undefined && unit.price > parsed.maxPrice) {
        return false;
      }

      return true;
    })
    .sort((a, b) => compareStaticUnits(a, b, parsed.sort));

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / parsed.limit));
  const paginated = filtered.slice((parsed.page - 1) * parsed.limit, parsed.page * parsed.limit);

  return {
    items: paginated.map((unit) => mapStaticPublicUnit(locale, unit)),
    pagination: {
      page: parsed.page,
      limit: parsed.limit,
      total,
      totalPages,
    },
  };
}

function getStaticPublicUnit(locale: Locale, slugOrId: string) {
  const unit = getStaticPublicUnits().find((candidate) => candidate.slug === slugOrId || candidate.id === slugOrId);

  if (!unit) {
    throw notFoundError("Unit not found");
  }

  return {
    item: mapStaticPublicUnit(locale, unit),
  };
}

function mapPublicBuilding(locale: Locale, building: BuildingRecord): PublicBuilding {
  const presentation = getBuildingPresentation(building.slug);
  const publicUnits = building.units.filter((unit) => unit.isPublished && unit.status !== "hidden");

  return {
    id: building.id,
    slug: building.slug,
    name: localizeBuildingName(locale, building),
    tagline: presentation.tagline[locale],
    shortDescription: presentation.shortDescription[locale] || building.shortDescription,
    description: presentation.description[locale] || building.fullDescription,
    fullDescription: presentation.description[locale] || building.fullDescription,
    heroImage: presentation.heroImage,
    status: building.status,
    displayOrder: building.displayOrder,
    modelColor: presentation.modelColor,
    sequence: presentation.sequence,
    floorsCount: building.floors.length,
    totalUnits: publicUnits.length,
    availableUnits: publicUnits.filter((unit) => unit.status === "available").length,
    completionPercent: presentation.completionPercent,
    deliveryQuarter: presentation.deliveryQuarter[locale],
    floorplanImage: presentation.floorplanImage,
    panoramaImage: presentation.panoramaImage,
    amenities: presentation.amenities[locale],
    coordinates: presentation.coordinates,
  };
}

function mapPublicFloor(locale: Locale, floor: FloorRecord): PublicFloor {
  return {
    id: floor.id,
    buildingId: floor.buildingId,
    number: floor.number,
    label: getFloorLabel(locale, floor.number),
    description: floor.description,
    floorplanImage: floor.floorplanImage,
    mapAspectRatio: floor.mapAspectRatio ?? undefined,
    svgOverlayData: null,
  };
}

function mapPublicUnit(locale: Locale, unit: UnitRecord): PublicUnit {
  return {
    id: unit.id,
    slug: unit.slug,
    externalCode: unit.externalCode,
    code: unit.externalCode,
    buildingId: unit.buildingId,
    floorId: unit.floorId,
    typologyId: unit.typologyId,
    unitNumber: unit.unitNumber,
    building: {
      id: unit.building.id,
      slug: unit.building.slug,
      name: localizeBuildingName(locale, unit.building),
    },
    floor: unit.floor.number,
    floorMeta: {
      id: unit.floor.id,
      number: unit.floor.number,
      label: getFloorLabel(locale, unit.floor.number),
    },
    typology: {
      id: unit.typologyId,
      name: getResidenceLabel(locale, unit.rooms),
      rooms: unit.rooms,
    },
    bedrooms: unit.bedrooms ?? Math.max(unit.rooms - 1, 1),
    rooms: unit.rooms,
    bathrooms: unit.bathrooms,
    areaInternalSqm: unit.areaInternalSqm,
    areaTotalSqm: unit.areaTotalSqm,
    terraceSqm: unit.terraceSqm,
    hasYard: unit.hasYard,
    outdoorType: (unit.outdoorType as PublicUnit["outdoorType"]) ?? null,
    size: unit.areaTotalSqm,
    orientation: unit.orientation,
    exposure: unit.exposure,
    price: unit.isPriceVisible ? unit.price ?? null : null,
    currency: unit.isPriceVisible ? unit.currency : null,
    status: unit.status,
    isPublished: unit.isPublished,
    isPriceVisible: unit.isPriceVisible,
    description: buildUnitDescription(locale, unit),
    highlight: buildUnitHighlight(locale, unit),
    floorplan: unit.floorplan,
    gallery: unit.gallery,
    panoramaImage: unit.panoramaImage ?? unit.gallery[0] ?? unit.floorplan,
    features: buildUnitFeatures(locale, unit),
    planArea: parsePlanArea(unit.planArea),
    planRegions: parsePlanRegions(unit.planRegions),
    planPolygonPoints: null,
    digitalTwinId: null,
    seoTitle: unit.seoTitle ?? `${getResidenceLabel(locale, unit.rooms)} | ${localizeBuildingName(locale, unit.building)}`,
    seoDescription: unit.seoDescription ?? unit.description,
  };
}

function buildUnitSort(sort: (typeof unitSortValues)[number]): Prisma.UnitOrderByWithRelationInput[] {
  switch (sort) {
    case "price_desc":
      return [{ price: "desc" }, { unitNumber: "asc" }];
    case "floor_asc":
      return [{ floor: { number: "asc" } }, { unitNumber: "asc" }];
    case "floor_desc":
      return [{ floor: { number: "desc" } }, { unitNumber: "asc" }];
    case "rooms_asc":
      return [{ rooms: "asc" }, { price: "asc" }];
    case "rooms_desc":
      return [{ rooms: "desc" }, { price: "asc" }];
    case "price_asc":
    default:
      return [{ price: "asc" }, { unitNumber: "asc" }];
  }
}

function buildingSlugOrIdFilter(slugOrId: string): Prisma.BuildingWhereInput {
  return {
    OR: [{ slug: slugOrId }, { id: slugOrId }],
  };
}

function getCachedBuildingsFromDb() {
  return unstable_cache(
    async () =>
      prisma.building.findMany({
        where: {
          status: "published",
        },
        include: {
          floors: {
            orderBy: {
              number: "asc",
            },
          },
          units: {
            select: {
              id: true,
              status: true,
              isPublished: true,
            },
          },
        },
        orderBy: {
          displayOrder: "asc",
        },
      }),
    ["pautalia-buildings"],
    {
      revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
      tags: ["pautalia:inventory", "pautalia:buildings"],
    },
  )();
}

function getCachedBuildingFromDb(slugOrId: string) {
  return unstable_cache(
    async () =>
      prisma.building.findFirst({
        where: {
          status: "published",
          ...buildingSlugOrIdFilter(slugOrId),
        },
        include: {
          floors: {
            include: {
              building: true,
            },
            orderBy: {
              number: "asc",
            },
          },
          units: {
            select: {
              id: true,
              status: true,
              isPublished: true,
            },
          },
        },
      }),
    ["pautalia-building", slugOrId],
    {
      revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
      tags: ["pautalia:inventory", "pautalia:buildings"],
    },
  )();
}

function getCachedBuildingIdFromDb(slugOrId: string) {
  return unstable_cache(
    async () =>
      prisma.building.findFirst({
        where: buildingSlugOrIdFilter(slugOrId),
        select: {
          id: true,
        },
      }),
    ["pautalia-building-id", slugOrId],
    {
      revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
      tags: ["pautalia:inventory", "pautalia:buildings"],
    },
  )();
}

function getUnitsCacheKey(parsed: z.infer<typeof pautaliaUnitsQuerySchema>) {
  return [
    parsed.building ?? "",
    parsed.rooms ?? "",
    parsed.floor ?? "",
    parsed.minPrice ?? "",
    parsed.maxPrice ?? "",
    parsed.maxArea ?? "",
    parsed.orientation ?? "",
    parsed.status ?? "",
    parsed.page,
    parsed.limit,
    parsed.sort,
  ].join("|");
}

function getCachedUnitsFromDb(
  parsed: z.infer<typeof pautaliaUnitsQuerySchema>,
  buildingId?: string,
) {
  const cacheKey = getUnitsCacheKey(parsed);

  return unstable_cache(
    async () => {
      const where: Prisma.UnitWhereInput = {
        isPublished: true,
        status: parsed.status ? parsed.status : { not: "hidden" },
        ...(buildingId ? { buildingId } : {}),
        ...(parsed.rooms ? { rooms: parsed.rooms } : {}),
        ...(parsed.floor ? { floor: { number: parsed.floor } } : {}),
        ...(parsed.orientation ? { orientation: parsed.orientation } : {}),
        ...(parsed.maxArea !== undefined ? { areaTotalSqm: { lte: parsed.maxArea } } : {}),
        ...((parsed.minPrice !== undefined || parsed.maxPrice !== undefined)
          ? {
              isPriceVisible: true,
              price: {
                ...(parsed.minPrice !== undefined ? { gte: parsed.minPrice } : {}),
                ...(parsed.maxPrice !== undefined ? { lte: parsed.maxPrice } : {}),
              },
            }
          : {}),
      };

      const [total, items] = await Promise.all([
        prisma.unit.count({ where }),
        prisma.unit.findMany({
          where,
          include: {
            building: true,
            floor: true,
          },
          orderBy: buildUnitSort(parsed.sort),
          skip: (parsed.page - 1) * parsed.limit,
          take: parsed.limit,
        }),
      ]);

      return { total, items };
    },
    ["pautalia-units", cacheKey],
    {
      revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
      tags: ["pautalia:inventory", "pautalia:units"],
    },
  )();
}

function getCachedUnitFromDb(slugOrId: string) {
  return unstable_cache(
    async () =>
      prisma.unit.findFirst({
        where: {
          isPublished: true,
          status: {
            not: "hidden",
          },
          OR: [{ slug: slugOrId }, { id: slugOrId }],
        },
        include: {
          building: true,
          floor: true,
        },
      }),
    ["pautalia-unit", slugOrId],
    {
      revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
      tags: ["pautalia:inventory", "pautalia:units"],
    },
  )();
}

export async function listPublicBuildings(locale: Locale) {
  if (preferStaticInventory) {
    return listStaticPublicBuildings(locale);
  }

  try {
    const buildings = await getCachedBuildingsFromDb();

    if (buildings.length === 0 && getStaticPublicBuildings().length > 0) {
      return listStaticPublicBuildings(locale);
    }

    return buildings.map((building) => mapPublicBuilding(locale, building));
  } catch {
    return listStaticPublicBuildings(locale);
  }
}

export async function getPublicBuilding(locale: Locale, slugOrId: string) {
  if (preferStaticInventory) {
    return getStaticPublicBuilding(locale, slugOrId);
  }

  try {
    const building = await getCachedBuildingFromDb(slugOrId);

    if (!building) {
      return getStaticPublicBuilding(locale, slugOrId);
    }

    return {
      item: mapPublicBuilding(locale, building),
      floors: building.floors.map((floor) => mapPublicFloor(locale, floor)),
    };
  } catch {
    return getStaticPublicBuilding(locale, slugOrId);
  }
}

export async function listPublicUnits(locale: Locale, rawQuery: Record<string, string | string[] | undefined>) {
  const parsed = pautaliaUnitsQuerySchema.parse(rawQuery);

  if (parsed.minPrice !== undefined && parsed.maxPrice !== undefined && parsed.minPrice > parsed.maxPrice) {
    throw validationError("minPrice cannot exceed maxPrice", {
      minPrice: "Must be less than or equal to maxPrice",
    });
  }

  if (preferStaticInventory) {
    return listStaticPublicUnits(locale, parsed);
  }

  let buildingId: string | undefined;

  try {
    if (parsed.building) {
      const building = await getCachedBuildingIdFromDb(parsed.building);

      if (!building) {
        return listStaticPublicUnits(locale, parsed);
      }

      buildingId = building.id;
    }

    const { total, items } = await getCachedUnitsFromDb(parsed, buildingId);

    if (total === 0) {
      const staticResponse = listStaticPublicUnits(locale, parsed);
      if (staticResponse.items.length > 0) {
        return staticResponse;
      }
    }

    return {
      items: items.map((unit) => mapPublicUnit(locale, unit)),
      pagination: {
        page: parsed.page,
        limit: parsed.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / parsed.limit)),
      },
    };
  } catch {
    return listStaticPublicUnits(locale, parsed);
  }
}

export async function getPublicUnit(locale: Locale, slugOrId: string) {
  if (preferStaticInventory) {
    return getStaticPublicUnit(locale, slugOrId);
  }

  try {
    const unit = await getCachedUnitFromDb(slugOrId);

    if (!unit) {
      return getStaticPublicUnit(locale, slugOrId);
    }

    return {
      item: mapPublicUnit(locale, unit),
    };
  } catch {
    return getStaticPublicUnit(locale, slugOrId);
  }
}
