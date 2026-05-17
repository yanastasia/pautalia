import { Prisma, PrismaClient } from "@prisma/client";
import { buildingBParkingUnits } from "../src/data/building-b";
import { buildings, floors, units } from "../src/data/site";
import { getOfficialParkingValue } from "../src/data/official-unit-values";

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
        kind: "apartment",
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
      const code = `${buildingId.toUpperCase()}-P${String(index).padStart(2, "0")}`;
      const official = getOfficialParkingValue(code);

      await prisma.unit.create({
        data: {
          id: `${buildingId}-parking-${index}`,
          kind: "parking",
          externalCode: code,
          slug: code.toLowerCase(),
          buildingId,
          floorId: null,
          typologyId: null,
          unitNumber: `P${String(index).padStart(2, "0")}`,
          rooms: 0,
          bedrooms: null,
          bathrooms: 0,
          areaLivingSqm: 0,
          areaSharedSqm: 0,
          areaInternalSqm: 0,
          areaTotalSqm: 0,
          terraceSqm: 0,
          commonPartsPercent: 0,
          landPercent: official?.landPercent ?? 0,
          landAreaSqm: official?.landArea ?? 0,
          orientation: "parking",
          exposure: "parking",
          price: null,
          currency: "EUR",
          status: "available",
          isPublished: true,
          isPriceVisible: false,
          description: "Sellable parking space.",
          highlight: "Parking space.",
          floorplan: "/assets/buildings/residence/floors/floor-01.png",
          gallery: [],
          features: ["parking"],
        },
      });
    }
  }

  for (const parking of buildingBParkingUnits) {
    await prisma.unit.create({
      data: {
        id: parking.id,
        kind: "parking",
        externalCode: parking.code,
        slug: parking.code.toLowerCase(),
        buildingId: "b",
        floorId: null,
        typologyId: null,
        unitNumber: parking.code.replace("B-PM-", "PM-"),
        rooms: 0,
        bedrooms: null,
        bathrooms: 0,
        areaLivingSqm: 0,
        areaSharedSqm: 0,
        areaInternalSqm: 0,
        areaTotalSqm: parking.areaSqm,
        terraceSqm: 0,
        commonPartsPercent: 0,
        landPercent: 0,
        landAreaSqm: 0,
        orientation: "parking",
        exposure: "parking",
        price: null,
        currency: "EUR",
        status: "available",
        isPublished: true,
        isPriceVisible: false,
        description: "Sellable parking space for Park.",
        highlight: "Park parking space.",
        floorplan: "/assets/buildings/park/floors/floor-01.png",
        gallery: [],
        features: ["parking"],
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
