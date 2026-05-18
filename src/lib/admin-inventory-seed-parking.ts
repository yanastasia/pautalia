import { buildingAParkingUnits } from "@/data/building-a-parking";
import { buildingBParkingUnits } from "@/data/building-b";
import { getOfficialParkingValue } from "@/data/official-unit-values";
import { prisma } from "@/lib/prisma";

export async function seedParkingInventory() {
  for (const parking of buildingAParkingUnits) {
    const official = getOfficialParkingValue(parking.code);
    const data = {
      areaLivingSqm: 0,
      areaSharedSqm: 0,
      areaInternalSqm: 0,
      areaTotalSqm: parking.areaSqm,
      landPercent: official?.landPercent ?? 0,
      landAreaSqm: official?.landArea ?? 0,
    };

    await prisma.unit.upsert({
      where: { id: parking.id },
      update: data,
      create: {
        ...data,
        id: parking.id,
        kind: "parking",
        externalCode: parking.code,
        slug: parking.code.toLowerCase(),
        buildingId: "a",
        unitNumber: parking.code.split(".")[1] ?? parking.code,
        rooms: 0,
        bedrooms: null,
        bathrooms: 0,
        terraceSqm: 0,
        commonPartsPercent: 0,
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

    await prisma.parkingSpot.upsert({
      where: { code: parking.code },
      update: {
        buildingId: "a",
        areaSqm: parking.areaSqm,
        price: null,
        currency: "EUR",
        status: "available",
        levelLabel: parking.code,
      },
      create: {
        id: parking.id,
        buildingId: "a",
        code: parking.code,
        areaSqm: parking.areaSqm,
        price: null,
        currency: "EUR",
        status: "available",
        levelLabel: parking.code,
      },
    });
  }

  for (const parking of buildingBParkingUnits) {
    const data = {
      areaLivingSqm: 0,
      areaSharedSqm: 0,
      areaInternalSqm: 0,
      areaTotalSqm: parking.areaSqm,
      landPercent: 0,
      landAreaSqm: 0,
    };

    await prisma.unit.upsert({
      where: { id: parking.id },
      update: data,
      create: {
        ...data,
        id: parking.id,
        kind: "parking",
        externalCode: parking.code,
        slug: parking.code.toLowerCase(),
        buildingId: "b",
        unitNumber: parking.code.split(".")[1] ?? parking.code,
        rooms: 0,
        bedrooms: null,
        bathrooms: 0,
        terraceSqm: 0,
        commonPartsPercent: 0,
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

    await prisma.parkingSpot.upsert({
      where: { code: parking.code },
      update: {
        buildingId: "b",
        areaSqm: parking.areaSqm,
        price: null,
        currency: "EUR",
        status: "available",
        levelLabel: parking.code,
      },
      create: {
        id: parking.id,
        buildingId: "b",
        code: parking.code,
        areaSqm: parking.areaSqm,
        price: null,
        currency: "EUR",
        status: "available",
        levelLabel: parking.code,
      },
    });
  }
}
