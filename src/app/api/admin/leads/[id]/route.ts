import { NextResponse } from "next/server";
import { leadPatchSchema, leadStatus } from "@/lib/admin-crm";
import { requireAdminSession } from "@/lib/admin-api";
import { jsonError, parseJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        building: { select: { id: true, name: true, slug: true } },
        unit: { select: { id: true, kind: true, externalCode: true, slug: true } },
      },
    });

    if (!lead) {
      return NextResponse.json({ ok: false, error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item: lead });
  } catch (error) {
    return jsonError(error, request);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const body = leadPatchSchema.parse(await parseJson(request));

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(body.status ? { status: leadStatus(body.status) } : {}),
        ...(body.adminNotes !== undefined ? { adminNotes: body.adminNotes } : {}),
      },
    });

    return NextResponse.json({ ok: true, item: lead });
  } catch (error) {
    return jsonError(error, request);
  }
}

