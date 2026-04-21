import { z } from "zod";

export const unitAvailabilityStatuses = [
  "available",
  "reserved",
  "sold",
  "hidden",
] as const;

export const unitOrientations = [
  "north",
  "north-east",
  "east",
  "south-east",
  "south",
  "south-west",
  "west",
  "north-west",
] as const;

export const unitOutdoorTypes = ["yard", "terrace", "balcony", "none"] as const;

export const unitCodeSchema = z.string().regex(/^[A-Z]-[1-9][0-9]{2}$/);

export const unitAssetPathSchema = z
  .string()
  .regex(/^\/assets\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/);

export const unitApartmentSchema = z
  .object({
    id: z.string().uuid(),
    buildingId: z.string().uuid(),
    floorId: z.string().uuid(),
    typologyId: z.string().uuid(),
    slug: z.string().min(1).max(96),
    code: unitCodeSchema,
    legacyCode: z.string().min(1).max(32).optional(),
    floor: z.number().int().min(1).max(100),
    unitNumber: z.string().regex(/^[0-9]{2}$/),
    orientation: z.enum(unitOrientations),
    rooms: z.number().int().min(1).max(10),
    bedrooms: z.number().int().min(0).max(9),
    bathrooms: z.number().int().min(1).max(8),
    areaInternalSqm: z.number().positive(),
    areaTotalSqm: z.number().positive(),
    terraceSqm: z.number().min(0),
    outdoorType: z.enum(unitOutdoorTypes),
    priceCents: z.number().int().positive().nullable(),
    currency: z.literal("EUR"),
    availabilityStatus: z.enum(unitAvailabilityStatuses),
    floorplanImage: unitAssetPathSchema,
    description: z.string().min(20).max(1200),
    isPublished: z.boolean(),
    isPriceVisible: z.boolean(),
  })
  .superRefine((unit, context) => {
    if (unit.areaTotalSqm < unit.areaInternalSqm) {
      context.addIssue({
        code: "custom",
        path: ["areaTotalSqm"],
        message: "Total area must be greater than or equal to internal area.",
      });
    }

    if (unit.priceCents === null && unit.isPriceVisible) {
      context.addIssue({
        code: "custom",
        path: ["isPriceVisible"],
        message: "A visible price requires priceCents.",
      });
    }
  });

export const unitApartmentSeedArraySchema = z.array(unitApartmentSchema).superRefine((units, context) => {
  const ids = new Set<string>();
  const codesByBuilding = new Set<string>();

  units.forEach((unit, index) => {
    if (ids.has(unit.id)) {
      context.addIssue({
        code: "custom",
        path: [index, "id"],
        message: "Unit ids must be unique.",
      });
    }

    const buildingScopedCode = `${unit.buildingId}:${unit.code}`;
    if (codesByBuilding.has(buildingScopedCode)) {
      context.addIssue({
        code: "custom",
        path: [index, "code"],
        message: "Unit codes must be unique per building.",
      });
    }

    ids.add(unit.id);
    codesByBuilding.add(buildingScopedCode);
  });
});

export type UnitApartment = z.infer<typeof unitApartmentSchema>;

export const inventoryTablesWithBuildingScope = [
  "typologies",
  "floors",
  "units",
] as const;
