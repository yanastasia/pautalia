import { Prisma, type LeadStatus, type UnitKind, type UnitStatus } from "@prisma/client";
import { z } from "zod";

export const adminLeadFilterSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "viewing_booked", "reserved", "closed", "archived", "spam"]).optional(),
  buildingId: z.string().trim().min(1).optional(),
  unitId: z.string().trim().min(1).optional(),
  unitKind: z.enum(["apartment", "parking"]).optional(),
  utmSource: z.string().trim().min(1).optional(),
  utmCampaign: z.string().trim().min(1).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export const leadPatchSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "viewing_booked", "reserved", "closed", "archived", "spam"]).optional(),
  adminNotes: z.string().trim().max(4000).nullable().optional(),
});

export const unitPatchSchema = z.object({
  status: z.enum(["available", "reserved", "sold"]),
}).strict();

export const adminUnitFilterSchema = z.object({
  status: z.enum(["available", "reserved", "sold"]).optional(),
  kind: z.enum(["apartment", "parking"]).optional(),
  buildingId: z.string().trim().min(1).optional(),
});

export function buildLeadWhere(filters: z.infer<typeof adminLeadFilterSchema>): Prisma.LeadWhereInput {
  return {
    ...(filters.status ? { status: filters.status as LeadStatus } : {}),
    ...(filters.buildingId ? { buildingId: filters.buildingId } : {}),
    ...(filters.unitId ? { unitId: filters.unitId } : {}),
    ...(filters.utmSource ? { utmSource: filters.utmSource } : {}),
    ...(filters.utmCampaign ? { utmCampaign: filters.utmCampaign } : {}),
    ...(filters.unitKind ? { unit: { kind: filters.unitKind as UnitKind } } : {}),
    ...(filters.dateFrom || filters.dateTo
      ? {
          createdAt: {
            ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
            ...(filters.dateTo ? { lte: filters.dateTo } : {}),
          },
        }
      : {}),
  };
}

export function csvEscape(value: string | number | Date | null | undefined) {
  if (value === null || value === undefined) return "";
  const text = value instanceof Date ? value.toISOString() : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function leadStatus(value: string): LeadStatus {
  return value as LeadStatus;
}

export function unitStatus(value: string): UnitStatus {
  return value as UnitStatus;
}
