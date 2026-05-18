import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const analyticsRangeSchema = z.object({
  range: z.enum(["all", "7d", "30d", "90d", "custom"]).optional().default("all"),
  from: z.string().optional(),
  to: z.string().optional(),
  buildingId: z.string().trim().min(1).optional(),
});

type AnalyticsRange = z.infer<typeof analyticsRangeSchema>;
type DateBounds = { gte?: Date; lte?: Date };

function getDateBounds(filters: AnalyticsRange): DateBounds {
  const now = new Date();
  const createdAt: DateBounds = {};

  if (filters.range === "7d") createdAt.gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (filters.range === "30d") createdAt.gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  if (filters.range === "90d") createdAt.gte = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  if (filters.range === "custom") {
    if (filters.from) createdAt.gte = new Date(filters.from);
    if (filters.to) createdAt.lte = new Date(filters.to);
  }

  return createdAt;
}

function getDateRange(filters: AnalyticsRange): Prisma.EventWhereInput {
  const createdAt = getDateBounds(filters);
  return {
    ...(Object.keys(createdAt).length ? { createdAt } : {}),
    ...(filters.buildingId ? { buildingId: filters.buildingId } : {}),
  };
}

function getLeadDateRange(filters: AnalyticsRange): Prisma.LeadWhereInput {
  const createdAt = getDateBounds(filters);
  return {
    ...(Object.keys(createdAt).length ? { createdAt } : {}),
    ...(filters.buildingId ? { buildingId: filters.buildingId } : {}),
  };
}

function safePercent(numerator: number, denominator: number) {
  if (denominator === 0) return 0;
  return Number(((numerator / denominator) * 100).toFixed(1));
}

export async function getAnalyticsOverview(filters: AnalyticsRange) {
  const where = getDateRange(filters);
  const [events, leads, visitors, sessions] = await Promise.all([
    prisma.event.groupBy({ by: ["eventType"], where, _count: { _all: true } }),
    prisma.lead.count({ where: getLeadDateRange(filters) }),
    prisma.event.findMany({ where: { ...where, visitorIdHash: { not: null } }, distinct: ["visitorIdHash"], select: { visitorIdHash: true } }),
    prisma.event.findMany({ where: { ...where, sessionIdHash: { not: null } }, distinct: ["sessionIdHash"], select: { sessionIdHash: true } }),
  ]);

  const count = (eventType: string) => events.find((event) => event.eventType === eventType)?._count._all ?? 0;
  const pageViews = count("page_view");
  const apartmentViews = count("apartment_detail_view");
  const apartmentClicks = count("apartment_card_click");

  return {
    pageViews,
    apartmentViews,
    apartmentClicks,
    leads,
    visitors: visitors.length,
    sessions: sessions.length,
    conversionRate: safePercent(leads, visitors.length || pageViews),
  };
}

export async function getTopUnits(filters: AnalyticsRange) {
  const where = getDateRange(filters);
  const [events, leads] = await Promise.all([
    prisma.event.findMany({
      where: { ...where, unitId: { not: null } },
      select: { eventType: true, unitId: true, unit: { select: { id: true, externalCode: true, status: true } } },
    }),
    prisma.lead.groupBy({ by: ["unitId"], where: { ...getLeadDateRange(filters), unitId: { not: null } }, _count: { _all: true } }),
  ]);

  const rows = new Map<string, { unitId: string; code: string; status: string; views: number; clicks: number; leads: number }>();
  events.forEach((event) => {
    if (!event.unitId || !event.unit) return;
    const row = rows.get(event.unitId) ?? { unitId: event.unitId, code: event.unit.externalCode, status: event.unit.status, views: 0, clicks: 0, leads: 0 };
    if (event.eventType === "apartment_detail_view") row.views += 1;
    if (event.eventType === "apartment_card_click") row.clicks += 1;
    rows.set(event.unitId, row);
  });

  leads.forEach((lead) => {
    if (!lead.unitId) return;
    const row = rows.get(lead.unitId);
    if (row) row.leads = lead._count._all;
  });

  return [...rows.values()].sort((left, right) => right.views + right.clicks + right.leads - (left.views + left.clicks + left.leads)).slice(0, 10);
}

export async function getTrafficSources(filters: AnalyticsRange) {
  const rows = await prisma.event.groupBy({
    by: ["source", "medium"],
    where: getDateRange(filters),
    _count: { _all: true },
    orderBy: { _count: { source: "desc" } },
    take: 10,
  });

  return rows.map((row) => ({
    source: row.source ?? "direct",
    medium: row.medium ?? "none",
    events: row._count._all,
  }));
}

export async function getFunnel(filters: AnalyticsRange) {
  const overview = await getAnalyticsOverview(filters);
  const apartmentPageViews = await prisma.event.count({
    where: { ...getDateRange(filters), eventType: "page_view", sourcePageUrl: { startsWith: "/units" } },
  });

  return [
    { step: "Homepage", count: await prisma.event.count({ where: { ...getDateRange(filters), eventType: "page_view", sourcePageUrl: "/" } }) },
    { step: "Units", count: apartmentPageViews },
    { step: "Unit detail", count: overview.apartmentViews },
    { step: "Lead", count: overview.leads },
  ];
}

export async function getDeviceBreakdown(filters: AnalyticsRange) {
  const rows = await prisma.event.groupBy({
    by: ["deviceType"],
    where: getDateRange(filters),
    _count: { _all: true },
  });

  return rows.map((row) => ({ device: row.deviceType ?? "unknown", events: row._count._all }));
}

export async function getLocationBreakdown(filters: AnalyticsRange) {
  const rows = await prisma.event.groupBy({
    by: ["country", "region", "city"],
    where: { ...getDateRange(filters), city: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { city: "desc" } },
    take: 10,
  });

  return rows.map((row) => ({
    country: row.country ?? "unknown",
    region: row.region ?? "",
    city: row.city ?? "unknown",
    events: row._count._all,
  }));
}

export async function getUnitAnalytics(unitId: string) {
  const [events, leads] = await Promise.all([
    prisma.event.groupBy({
      by: ["eventType"],
      where: { unitId },
      _count: { _all: true },
    }),
    prisma.lead.count({ where: { unitId } }),
  ]);

  const count = (eventType: string) => events.find((event) => event.eventType === eventType)?._count._all ?? 0;

  return {
    views: count("apartment_detail_view"),
    clicks: count("apartment_card_click"),
    gallery: count("apartment_gallery_click"),
    floorPlan: count("floor_plan_view") + count("floor_plan_download"),
    leads,
    conversionRate: safePercent(leads, count("apartment_detail_view")),
  };
}
