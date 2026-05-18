import { Prisma } from "@prisma/client";
import { buildings, floors, units } from "@/data/site";
import { seedParkingInventory } from "@/lib/admin-inventory-seed-parking";
import { isProduction } from "@/lib/env";
import { prisma } from "@/lib/prisma";

let hasCheckedInventorySeed = false;
let inventorySeedPromise: Promise<void> | null = null;

async function ensureBuildingsAndFloors() {
  for (const building of buildings) {
    await prisma.building.upsert({
      where: { id: building.id },
      update: {
        slug: building.slug,
        name: building.name.replace(/^Building\s+/i, ""),
        shortDescription: building.shortDescription,
        fullDescription: building.description,
        status: building.status,
        displayOrder: building.displayOrder,
      },
      create: {
        id: building.id,
        slug: building.slug,
        name: building.name.replace(/^Building\s+/i, ""),
        shortDescription: building.shortDescription,
        fullDescription: building.description,
        status: building.status,
        displayOrder: building.displayOrder,
      },
    });
  }

  for (const floor of floors) {
    await prisma.floor.upsert({
      where: { buildingId_number: { buildingId: floor.buildingId, number: floor.number } },
      update: {
        label: floor.label,
        description: floor.description,
        floorplanImage: floor.floorplanImage,
        mapAspectRatio: floor.mapAspectRatio ?? null,
      },
      create: {
        id: floor.id,
        buildingId: floor.buildingId,
        number: floor.number,
        label: floor.label,
        description: floor.description,
        floorplanImage: floor.floorplanImage,
        mapAspectRatio: floor.mapAspectRatio ?? null,
      },
    });
  }
}

async function seedApartments() {
  for (const unit of units) {
    const data = {
      externalCode: unit.externalCode,
      slug: unit.slug,
      buildingId: unit.buildingId,
      floorId: unit.floorId,
      typologyId: unit.typologyId,
      unitNumber: unit.unitNumber,
      rooms: unit.rooms,
      bedrooms: unit.bedrooms ?? null,
      bathrooms: unit.bathrooms,
      areaLivingSqm: unit.area.living,
      areaSharedSqm: unit.area.shared,
      areaInternalSqm: unit.areaInternalSqm,
      areaTotalSqm: unit.area.total,
      terraceSqm: unit.area.terrace ?? 0,
      commonPartsPercent: unit.ownership.commonPartsPercent,
      landPercent: unit.ownership.landPercent,
      landAreaSqm: unit.ownership.landArea,
      hasYard: unit.hasYard ?? false,
      outdoorType: unit.outdoorType ?? null,
      orientation: unit.orientation,
      exposure: unit.exposure,
      price: unit.price,
      currency: unit.currency,
      isPublished: true,
      isPriceVisible: unit.isPriceVisible,
      description: unit.description,
      highlight: unit.highlight,
      floorplan: unit.floorplan,
      gallery: unit.gallery,
      panoramaImage: unit.panoramaImage,
      features: unit.features,
      planArea: unit.planArea as unknown as Prisma.InputJsonValue,
      planRegions: (unit.planRegions ?? null) as unknown as Prisma.InputJsonValue,
      seoTitle: unit.seoTitle,
      seoDescription: unit.seoDescription,
    };

    await prisma.unit.upsert({
      where: { id: unit.id },
      update: data,
      create: {
        ...data,
        id: unit.id,
        kind: "apartment",
        status: "available",
      },
    });
  }
}

async function seedParking() {
  await seedParkingInventory();
}

export async function ensureAdminInventorySeed() {
  if (isProduction || hasCheckedInventorySeed) return;

  if (inventorySeedPromise) {
    await inventorySeedPromise;
    return;
  }

  inventorySeedPromise = seedMissingInventory().finally(() => {
    inventorySeedPromise = null;
  });

  await inventorySeedPromise;
}

async function seedMissingInventory() {
  const [apartmentCount, parkingCount] = await Promise.all([
    prisma.unit.count({ where: { kind: "apartment" } }),
    prisma.unit.count({ where: { kind: "parking" } }),
  ]);

  if (apartmentCount >= units.length && parkingCount >= 14 + 6) {
    await ensureBuildingsAndFloors();
    await seedApartments();
    await seedParking();
    hasCheckedInventorySeed = true;
    return;
  }

  await ensureBuildingsAndFloors();
  await seedApartments();
  await seedParking();
  hasCheckedInventorySeed = true;
}
