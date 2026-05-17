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

export const unitKinds = ["apartment", "parking"] as const;

export const unitCodeSchema = z.string().regex(/^[A-Z]-[1-9][0-9]{2}$/);

export const parkingUnitCodeSchema = z.string().regex(/^[A-Z]-P(0[1-9]|1[0-4])$/);

export const unitAssetPathSchema = z
  .string()
  .regex(/^\/assets\/buildings\/[a-z0-9-]+\/[a-z0-9-]+\/[A-Za-z0-9._-]+\.(png|jpg|jpeg|webp)$/);

export const unitAreaSchema = z
  .object({
    living: z.number().min(0),
    shared: z.number().min(0),
    terrace: z.number().min(0).optional(),
    total: z.number().min(0),
  })
  .superRefine((area, context) => {
    const expectedTotal = Number((area.living + area.shared).toFixed(2));
    const suppliedTotal = Number(area.total.toFixed(2));

    if (suppliedTotal !== expectedTotal) {
      context.addIssue({
        code: "custom",
        path: ["total"],
        message: "Total area must equal living area plus shared parts.",
      });
    }
  });

export const unitOwnershipSchema = z.object({
  commonPartsPercent: z.number().min(0),
  landPercent: z.number().min(0),
  landArea: z.number().min(0),
});

export const unitApartmentSchema = z
  .object({
    id: z.string().uuid(),
    kind: z.literal("apartment").default("apartment"),
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
    area: unitAreaSchema,
    ownership: unitOwnershipSchema,
    areaInternalSqm: z.number().positive().optional(),
    areaTotalSqm: z.number().positive().optional(),
    terraceSqm: z.number().min(0).optional(),
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
    if (unit.areaTotalSqm !== undefined && unit.areaInternalSqm !== undefined && unit.areaTotalSqm < unit.areaInternalSqm) {
      context.addIssue({
        code: "custom",
        path: ["areaTotalSqm"],
        message: "Total area must be greater than or equal to internal area.",
      });
    }

    if (unit.areaInternalSqm !== undefined && Number(unit.area.living.toFixed(2)) !== Number(unit.areaInternalSqm.toFixed(2))) {
      context.addIssue({
        code: "custom",
        path: ["area", "living"],
        message: "Living area must match the legacy internal area during migration.",
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

export const parkingUnitSchema = z.object({
  id: z.string().min(1),
  kind: z.literal("parking"),
  code: parkingUnitCodeSchema,
  buildingId: z.string().min(1),
  floor: z.number().int(),
  price: z.number().positive().nullable(),
  currency: z.literal("EUR"),
  status: z.enum(unitAvailabilityStatuses),
  isPublished: z.boolean(),
  isPriceVisible: z.boolean(),
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
export type ParkingUnit = z.infer<typeof parkingUnitSchema>;

export const inventoryTablesWithBuildingScope = [
  "typologies",
  "floors",
  "units",
] as const;
