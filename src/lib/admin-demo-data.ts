import { buildingBParkingUnits } from "@/data/building-b";
import { units } from "@/data/site";
import type { AdminLead, AdminLeadStatus, AdminUnit, AdminUnitStatus } from "@/lib/admin-data";


let demoLeadStatus: AdminLeadStatus = "new";
let demoLeadNotes = "";
const demoUnitStatuses = new Map<string, AdminUnitStatus>();
const demoUnitPrices = new Map<string, number | null>();

export function getDemoLead(): AdminLead {
  return {
    id: "demo-lead",
    fullName: "Тестов клиент",
    email: "demo@pautalia.bg",
    phone: "+359 877 909 010",
    message: "Интересувам се от апартамент A-AP.08 и възможност за оглед.",
    status: demoLeadStatus,
    adminNotes: demoLeadNotes,
    sourcePageUrl: "/units/unit-a208",
    createdAt: new Date(),
    unit: { id: "a-204", externalCode: "A-AP.08", kind: "apartment" },
    building: { id: "a", name: "Building A", slug: "building-a" },
  };
}

export function setDemoLead(status: AdminLeadStatus, adminNotes: string | null) {
  demoLeadStatus = status;
  demoLeadNotes = adminNotes ?? "";
}

export function getDemoUnits(): AdminUnit[] {
  return [
    ...units.filter((unit) => unit.kind === "apartment").map(makeDemoApartment),
    ...Array.from({ length: 14 }, (_, index) => makeDemoParking("a", `A-PM.${String(index + 1).padStart(2, "0")}`, `a-parking-${index + 1}`, 0)),
    ...buildingBParkingUnits.map((parking) => makeDemoParking("b", parking.code, parking.id, parking.areaSqm)),
  ];
}

export function getDemoUnit(id: string) {
  return getDemoUnits().find((unit) => unit.id === id) ?? null;
}

export function setDemoUnitStatus(id: string, status: AdminUnitStatus) {
  demoUnitStatuses.set(id, status);
}

export function setDemoUnitPrice(id: string, price: number | null) {
  demoUnitPrices.set(id, price);
}

function makeDemoApartment(unit: (typeof units)[number]): AdminUnit {
  return {
    id: unit.id,
    kind: "apartment",
    externalCode: unit.externalCode,
    status: demoUnitStatuses.get(unit.id) ?? "available",
    price: demoUnitPrices.has(unit.id) ? (demoUnitPrices.get(unit.id) ?? null) : unit.price,
    currency: unit.currency,
    rooms: unit.rooms,
    areaLivingSqm: unit.area.living,
    areaSharedSqm: unit.area.shared,
    areaTotalSqm: unit.area.total,
    updatedAt: new Date(),
    building: {
      id: unit.buildingId,
      name: unit.buildingId === "b" ? "Building B" : "Building A",
      slug: unit.buildingId === "b" ? "building-b" : "building-a",
    },
    _count: { leads: unit.id === "a-204" ? 1 : 0 },
  };
}

function makeDemoParking(buildingId: "a" | "b", code: string, id: string, areaSqm: number): AdminUnit {
  return {
    id,
    kind: "parking",
    externalCode: code,
    status: demoUnitStatuses.get(id) ?? "available",
    price: demoUnitPrices.has(id) ? (demoUnitPrices.get(id) ?? null) : null,
    currency: "EUR",
    rooms: 0,
    areaLivingSqm: 0,
    areaSharedSqm: 0,
    areaTotalSqm: areaSqm,
    updatedAt: new Date(),
    building: {
      id: buildingId,
      name: buildingId === "b" ? "Building B" : "Building A",
      slug: buildingId === "b" ? "building-b" : "building-a",
    },
    _count: { leads: 0 },
  };
}
