import { buildingBParkingUnits } from "@/data/building-b";
import { units } from "@/data/site";
import type { AdminLead, AdminLeadStatus, AdminUnit, AdminUnitStatus } from "@/lib/admin-data";
import { getBuildingLabel } from "@/lib/i18n/messages";

let demoLeadStatus: AdminLeadStatus = "new";
let demoLeadNotes = "";
const demoUnitStatuses = new Map<string, AdminUnitStatus>();

export function getDemoLead(): AdminLead {
  return {
    id: "demo-lead",
    fullName: "Тестов клиент",
    email: "demo@pautalia.bg",
    phone: "+359 877 909 010",
    message: "Интересувам се от апартамент AP.08 и възможност за оглед.",
    status: demoLeadStatus,
    adminNotes: demoLeadNotes,
    sourcePageUrl: "/unit/unit-a208",
    createdAt: new Date(),
    unit: { id: "a-204", externalCode: "AP.08", kind: "apartment" },
    building: { id: "a", name: "A", slug: "building-a" },
  };
}

export function setDemoLead(status: AdminLeadStatus, adminNotes: string | null) {
  demoLeadStatus = status;
  demoLeadNotes = adminNotes ?? "";
}

export function getDemoUnits(): AdminUnit[] {
  return [
    ...units.map(makeDemoApartment),
    ...Array.from({ length: 14 }, (_, index) => makeDemoParking("a", `A-P${String(index + 1).padStart(2, "0")}`, `a-parking-${index + 1}`, 0)),
    ...buildingBParkingUnits.map((parking) => makeDemoParking("b", parking.code, parking.id, parking.areaSqm)),
  ];
}

export function getDemoUnit(id: string) {
  return getDemoUnits().find((unit) => unit.id === id) ?? null;
}

export function setDemoUnitStatus(id: string, status: AdminUnitStatus) {
  demoUnitStatuses.set(id, status);
}

function makeDemoApartment(unit: (typeof units)[number]): AdminUnit {
  return {
    id: unit.id,
    kind: "apartment",
    externalCode: unit.externalCode,
    status: demoUnitStatuses.get(unit.id) ?? "available",
    price: unit.price,
    currency: unit.currency,
    rooms: unit.rooms,
    areaLivingSqm: unit.area.living,
    areaSharedSqm: unit.area.shared,
    areaTotalSqm: unit.area.total,
    updatedAt: new Date(),
    building: {
      id: unit.buildingId,
      name: getBuildingLabel("bg", unit.buildingId).replace(/^Сграда\s/, ""),
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
    price: null,
    currency: "EUR",
    rooms: 0,
    areaLivingSqm: 0,
    areaSharedSqm: 0,
    areaTotalSqm: areaSqm,
    updatedAt: new Date(),
    building: {
      id: buildingId,
      name: getBuildingLabel("bg", buildingId).replace(/^Сграда\s/, ""),
      slug: buildingId === "b" ? "building-b" : "building-a",
    },
    _count: { leads: 0 },
  };
}
