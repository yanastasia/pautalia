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
        kind: unit.kind as "apartment" | "parking",
        externalCode: unit.externalCode,
        slug: unit.slug,
        buildingId: unit.buildingId,
        floorId: unit.floorId || null,
        typologyId: unit.typologyId || null,
        unitNumber: unit.unitNumber,
        rooms: unit.rooms,
        bedrooms: unit.bedrooms ?? null,
        bathrooms: unit.bathrooms,
        areaLivingSqm: unit.area.living,
        areaSharedSqm: unit.area.shared,
        areaInternalSqm: unit.areaInternalSqm || 0,
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
