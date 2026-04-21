import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { unitApartmentSeeds } from "@/data/unit-apartment-seed";
import {
  inventoryTablesWithBuildingScope,
  unitApartmentSeedArraySchema,
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
      areaTotalSqm: 80.86,
      priceCents: 15321200,
      availabilityStatus: "available",
      floorplanImage: "/assets/building-a/three-room/floor-plan.webp",
      description: expect.stringContaining("Second-floor"),
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
    expect(seedSql).toContain("/assets/building-a/three-room/floor-plan.webp");
  });
});
