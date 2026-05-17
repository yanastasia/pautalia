import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildingBParkingUnits } from "@/data/building-b";
import { buildingBUnits } from "@/data/building-b-units";
import { officialApartmentValuesByCode, officialParkingValuesByCode } from "@/data/official-unit-values";
import { parkGeneralGalleryImages, parkUnitGalleriesByCode } from "@/data/unit-gallery-assets";
import { unitApartmentSeeds } from "@/data/unit-apartment-seed";
import {
  inventoryTablesWithBuildingScope,
  parkingUnitCodeSchema,
  unitApartmentSeedArraySchema,
  unitAreaSchema,
  unitAssetPathSchema,
  unitCodeSchema,
} from "@/lib/inventory/unit-schema";

const migrationSql = readFileSync(
  join(process.cwd(), "db/migrations/001_unit_apartment_schema.sql"),
  "utf8",
);

const seedSql = readFileSync(
  join(process.cwd(), "db/seeds/001_unit_apartment_seed.sql"),
  "utf8",
);

const prismaSeed = readFileSync(join(process.cwd(), "prisma/seed.ts"), "utf8");

function publicAssetExists(assetPath: string) {
  return existsSync(join(process.cwd(), "public", assetPath));
}

function tableBlock(tableName: string) {
  const match = new RegExp(
    `create table if not exists ${tableName} \\([\\s\\S]*?\\n\\);`,
    "i",
  ).exec(migrationSql);

  if (!match) {
    throw new Error(`Missing table ${tableName}`);
  }

  return match[0].toLowerCase();
}

describe("unit/apartment data model", () => {
  it("validates seeded units against the canonical schema", () => {
    const parsed = unitApartmentSeedArraySchema.parse(unitApartmentSeeds);

    expect(parsed).toHaveLength(4);
    expect(parsed.map((unit) => unit.code)).toContain("A-204");
  });

  it("covers the required apartment finder fields", () => {
    const unit = unitApartmentSeeds.find((candidate) => candidate.code === "A-204");

    expect(unit).toMatchObject({
      id: expect.any(String),
      floor: 2,
      orientation: "south-west",
      rooms: 3,
      area: { living: 80.93, shared: 12.83, total: 93.76 },
      ownership: { commonPartsPercent: 8.02, landPercent: 5.955, landArea: 61.16 },
      priceCents: 15321200,
      availabilityStatus: "available",
      floorplanImage: "/assets/buildings/residence/apartments/A-AP.08.png",
      description: expect.stringContaining("Second-floor"),
    });
  });

  it("enforces the consolidated area total rule", () => {
    expect(unitAreaSchema.parse({ living: 70, shared: 10, terrace: 8, total: 80 })).toMatchObject({
      living: 70,
      shared: 10,
      terrace: 8,
      total: 80,
    });
    expect(unitAreaSchema.safeParse({ living: 70, shared: 10, terrace: 8, total: 88 }).success).toBe(false);
  });

  it("defines sellable parking spaces in the unit inventory seed", () => {
    const parkingCodes = Array.from({ length: 14 }, (_, index) => `A-P${String(index + 1).padStart(2, "0")}`);

    parkingCodes.forEach((code) => {
      expect(parkingUnitCodeSchema.safeParse(code).success).toBe(true);
    });
    expect(buildingBParkingUnits.map((parking) => parking.code)).toEqual([
      "B-PM-01",
      "B-PM-02",
      "B-PM-03",
      "B-PM-04",
      "B-PM-05",
      "B-PM-06",
    ]);
    expect(prismaSeed).toContain("count: 14");
    expect(prismaSeed).toContain("buildingBParkingUnits");
    expect(prismaSeed).toContain('kind: "parking"');
  });

  it("stages Park units without invented official ownership values", () => {
    expect(buildingBUnits).toHaveLength(6);
    expect(buildingBUnits.map((unit) => unit.externalCode)).toEqual([
      "B-AP-01",
      "B-AP-02",
      "B-AP-03",
      "B-AP-04",
      "B-AP-05",
      "B-AP-06",
    ]);
    buildingBUnits.forEach((unit) => {
      expect(unit.buildingId).toBe("b");
      expect(unit.ownership).toEqual({ commonPartsPercent: 0, landPercent: 0, landArea: 0 });
      expect(unit.digitalTwinId).toBeUndefined();
    });
  });

  it("maps Park units to apartment-specific render galleries", () => {
    buildingBUnits.forEach((unit) => {
      const gallery = parkUnitGalleriesByCode[unit.externalCode as keyof typeof parkUnitGalleriesByCode];

      expect(gallery).toBeDefined();
      expect(unit.gallery).toEqual(gallery);
      expect(unit.gallery[0]).toContain(`/park/gallery/apartment_renders/${unit.externalCode.replace("-AP-", "-AP.")}/`);
      unit.gallery.forEach((image) => {
        expect(publicAssetExists(image)).toBe(true);
      });
    });

    Object.values(parkGeneralGalleryImages).forEach((image) => {
      expect(publicAssetExists(image)).toBe(true);
    });
  });

  it("stores official apartment and parking ownership values", () => {
    expect(Object.keys(officialApartmentValuesByCode)).toHaveLength(14);
    expect(Object.keys(officialParkingValuesByCode)).toHaveLength(14);

    Object.values(officialApartmentValuesByCode).forEach((unit) => {
      expect(Number((unit.living + unit.shared).toFixed(2))).toBe(unit.total);
      expect(unit.commonPartsPercent).toBeGreaterThan(0);
      expect(unit.landPercent).toBeGreaterThan(0);
      expect(unit.landArea).toBeGreaterThan(0);
    });

    Object.values(officialParkingValuesByCode).forEach((parking) => {
      expect(parking.landPercent).toBeGreaterThan(0);
      expect(parking.landArea).toBeGreaterThan(0);
    });
  });

  it("enforces unit code and asset path conventions in seed data", () => {
    unitApartmentSeeds.forEach((unit) => {
      expect(unitCodeSchema.safeParse(unit.code).success).toBe(true);
      expect(unitAssetPathSchema.safeParse(unit.floorplanImage).success).toBe(true);
    });
  });

  it("scopes every inventory child table by building_id UUID", () => {
    inventoryTablesWithBuildingScope.forEach((tableName) => {
      const block = tableBlock(tableName);

      expect(block).toContain("building_id uuid not null references buildings(id)");
    });
  });

  it("includes SQL seed data for the milestone sample units", () => {
    expect(seedSql).toContain("insert into units");
    expect(seedSql).toContain("A-204");
    expect(seedSql).toContain("/assets/buildings/residence/apartments/A-AP.08.png");
  });
});
