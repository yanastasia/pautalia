import { NextResponse } from "next/server";
import { adminLeadFilterSchema, buildLeadWhere, csvEscape } from "@/lib/admin-crm";
import { requireAdminSession } from "@/lib/admin-api";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const headers = [
  "lead_id",
  "created_at",
  "updated_at",
  "status",
  "full_name",
  "email",
  "phone",
  "unit_code",
  "unit_kind",
  "building",
  "source_page_url",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "message",
  "admin_notes",
];

export async function GET(request: Request) {
  try {
    await requireAdminSession();
    const filters = adminLeadFilterSchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    const leads = await prisma.lead.findMany({
      where: buildLeadWhere(filters),
      orderBy: { createdAt: "desc" },
      include: {
        building: { select: { name: true } },
        unit: { select: { kind: true, externalCode: true } },
      },
    });

    const rows = leads.map((lead) => [
      lead.id,
      lead.createdAt,
      lead.updatedAt,
      lead.status,
      lead.fullName,
      lead.email,
      lead.phone,
      lead.unit?.externalCode,
      lead.unit?.kind,
      lead.building?.name,
      lead.sourcePageUrl,
      lead.referrer,
      lead.utmSource,
      lead.utmMedium,
      lead.utmCampaign,
      lead.utmTerm,
      lead.utmContent,
      lead.message,
      lead.adminNotes,
    ].map(csvEscape).join(","));

    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="pautalia-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return jsonError(error, request);
  }
}

