import { Prisma, PrismaClient } from "@prisma/client";
import { buildings, floors, units } from "../src/data/site";

const prisma = new PrismaClient();

async function main() {
  await prisma.event.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.parkingSpot.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.floor.deleteMany();
  await prisma.building.deleteMany();

  for (const building of buildings) {
    await prisma.building.create({
      data: {
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
    await prisma.floor.create({
      data: {
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

  for (const unit of units) {
    await prisma.unit.create({
      data: {
        id: unit.id,
        externalCode: unit.externalCode,
        slug: unit.slug,
        buildingId: unit.buildingId,
        floorId: unit.floorId,
        typologyId: unit.typologyId,
        unitNumber: unit.unitNumber,
        rooms: unit.rooms,
        bedrooms: unit.bedrooms ?? null,
        bathrooms: unit.bathrooms,
        areaInternalSqm: unit.areaInternalSqm,
        areaTotalSqm: unit.areaTotalSqm,
        terraceSqm: unit.terraceSqm,
        hasYard: unit.hasYard ?? false,
        outdoorType: unit.outdoorType ?? null,
        orientation: unit.orientation,
        exposure: unit.exposure,
        price: unit.price,
        currency: unit.currency,
        status: unit.status,
        isPublished: unit.isPublished,
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
      },
    });
  }

  const parkingByBuilding = [{ buildingId: "a", count: 14 }];

  for (const { buildingId, count } of parkingByBuilding) {
    for (let index = 1; index <= count; index += 1) {
      await prisma.parkingSpot.create({
        data: {
          id: `${buildingId}-parking-${index}`,
          buildingId,
          code: `${buildingId.toUpperCase()}-P${String(index).padStart(2, "0")}`,
          levelLabel: "Ground",
          status: "available",
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
