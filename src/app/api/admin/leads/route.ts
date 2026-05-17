import { NextResponse } from "next/server";
import { buildLeadWhere, adminLeadFilterSchema } from "@/lib/admin-crm";
import { requireAdminSession } from "@/lib/admin-api";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    await requireAdminSession();
    const filters = adminLeadFilterSchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    const where = buildLeadWhere(filters);

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        include: {
          building: { select: { id: true, name: true, slug: true } },
          unit: { select: { id: true, kind: true, externalCode: true, slug: true } },
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      items: leads,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / filters.limit)),
      },
    });
  } catch (error) {
    return jsonError(error, request);
  }
}

