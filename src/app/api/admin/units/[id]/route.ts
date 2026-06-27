import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api";
import { unitPatchSchema } from "@/lib/admin-crm";
import { getAdminUnit, updateAdminUnitPrice, updateAdminUnitStatus } from "@/lib/admin-data";
import { jsonError, parseJson } from "@/lib/http";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const body = unitPatchSchema.parse(await parseJson(request));
    if (body.status) {
      await updateAdminUnitStatus(id, body.status);
    }
    if (body.price !== undefined) {
      await updateAdminUnitPrice(id, body.price);
    }
    const unit = await getAdminUnit(id);

    return NextResponse.json({ ok: true, item: unit });
  } catch (error) {
    return jsonError(error, request);
  }
}
