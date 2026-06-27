import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getDemoLead, getDemoUnit, getDemoUnits, setDemoLead, setDemoUnitPrice, setDemoUnitStatus } from "@/lib/admin-demo-data";
import { ensureAdminInventorySeed } from "@/lib/admin-inventory-seed";
import { notFoundError } from "@/lib/errors";
import { isProduction } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const leadStatuses = ["new", "contacted", "qualified", "viewing_booked", "reserved", "closed", "archived", "spam"] as const;
export const adminUnitStatuses = ["available", "reserved", "sold"] as const;

export type AdminLeadStatus = (typeof leadStatuses)[number];
export type AdminUnitStatus = (typeof adminUnitStatuses)[number];

export type AdminLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: AdminLeadStatus;
  adminNotes: string | null;
  sourcePageUrl: string;
  createdAt: Date;
  unit: { id: string; externalCode: string; kind: string } | null;
  building: { id: string; name: string; slug: string } | null;
};

export type AdminUnit = {
  id: string;
  kind: string;
  externalCode: string;
  status: string;
  price: number | null;
  currency: string;
  rooms: number;
  areaLivingSqm: number;
  areaSharedSqm: number;
  areaTotalSqm: number;
  updatedAt: Date;
  building: { id: string; name: string; slug: string };
  _count?: { leads: number };
};

export type AdminBuildingOption = {
  id: string;
  name: string;
  slug: string;
};

let dashboardSchemaCache: boolean | null = null;

export async function hasAdminDashboardSchema() {
  if (dashboardSchemaCache !== null) return dashboardSchemaCache;

  const [schema] = await prisma.$queryRaw<Array<{ ready: boolean }>>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'Unit' AND column_name = 'kind'
    ) AND EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'Lead' AND column_name = 'updatedAt'
    ) AS "ready"
  `;

  dashboardSchemaCache = Boolean(schema?.ready);
  return dashboardSchemaCache;
}

export async function getAdminLeads(status?: AdminLeadStatus, take = 50, buildingId?: string) {
  if (!(await hasAdminDashboardSchema())) {
    const demo = getDemoLead();
    return !isProduction && (!status || demo.status === status) && (!buildingId || demo.building?.id === buildingId) ? [demo] : [];
  }

  return prisma.lead.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(buildingId ? { buildingId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take,
    select: leadSelect,
  });
}

export async function getAdminLead(id: string) {
  if (!(await hasAdminDashboardSchema())) {
    return !isProduction && id === "demo-lead" ? getDemoLead() : null;
  }

  return prisma.lead.findUnique({ where: { id }, select: leadSelect });
}

export async function updateAdminLead(id: string, status: AdminLeadStatus, adminNotes: string | null) {
  if (!(await hasAdminDashboardSchema())) {
    if (!isProduction && id === "demo-lead") {
      setDemoLead(status, adminNotes);
    }
    return;
  }

  await prisma.lead.update({ where: { id }, data: { status, adminNotes } });
}

export async function getAdminUnits() {
  if (!(await hasAdminDashboardSchema())) return isProduction ? [] : getDemoUnits();
  await ensureAdminInventorySeed();

  return prisma.unit.findMany({
    orderBy: [{ kind: "asc" }, { externalCode: "asc" }],
    select: unitSelect,
  });
}

export async function getAdminBuildings(): Promise<AdminBuildingOption[]> {
  if (!(await hasAdminDashboardSchema())) {
    return [
      { id: "a", name: "Building A", slug: "building-a" },
      { id: "b", name: "Building B", slug: "building-b" },
    ];
  }

  await ensureAdminInventorySeed();

  return prisma.building.findMany({
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

export async function getAdminUnit(id: string) {
  if (!(await hasAdminDashboardSchema())) return isProduction ? null : getDemoUnit(id);
  await ensureAdminInventorySeed();

  return prisma.unit.findUnique({ where: { id }, select: unitSelect });
}

export async function updateAdminUnitStatus(id: string, status: AdminUnitStatus) {
  if (!(await hasAdminDashboardSchema())) {
    if (!isProduction && getDemoUnit(id)) setDemoUnitStatus(id, status);
    return;
  }

  const unit = await getAdminUnit(id);
  if (!unit) throw notFoundError("Unit not found");

  await prisma.unit.update({ where: { id }, data: { status } });
}

export async function updateAdminUnitPrice(id: string, price: number | null) {
  if (!(await hasAdminDashboardSchema())) {
    if (!isProduction && getDemoUnit(id)) setDemoUnitPrice(id, price);
    return;
  }

  const unit = await getAdminUnit(id);
  if (!unit) throw notFoundError("Unit not found");

  await prisma.unit.update({ where: { id }, data: { price } });
}

export function revalidateAdminCrm() {
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/units");
}

const leadSelect = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  message: true,
  status: true,
  adminNotes: true,
  sourcePageUrl: true,
  createdAt: true,
  unit: { select: { id: true, externalCode: true, kind: true } },
  building: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.LeadSelect;

const unitSelect = {
  id: true,
  kind: true,
  externalCode: true,
  status: true,
  price: true,
  currency: true,
  rooms: true,
  areaLivingSqm: true,
  areaSharedSqm: true,
  areaTotalSqm: true,
  updatedAt: true,
  building: { select: { id: true, name: true, slug: true } },
  _count: { select: { leads: true } },
} satisfies Prisma.UnitSelect;
