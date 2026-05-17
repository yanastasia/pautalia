import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api";
import { adminUnitFilterSchema } from "@/lib/admin-crm";
import { getAdminUnits } from "@/lib/admin-data";
import { jsonError } from "@/lib/http";

export async function GET(request: Request) {
  try {
    await requireAdminSession();
    const url = new URL(request.url);
    const filters = adminUnitFilterSchema.parse({
      status: url.searchParams.get("status") ?? undefined,
      kind: url.searchParams.get("kind") ?? undefined,
      buildingId: url.searchParams.get("buildingId") ?? undefined,
    });
    const units = (await getAdminUnits()).filter((unit) => {
      if (filters.status && unit.status !== filters.status) return false;
      if (filters.buildingId && unit.building.id !== filters.buildingId) return false;
      return !(filters.kind && unit.kind !== filters.kind);
    });

    return NextResponse.json({ ok: true, items: units });
  } catch (error) {
    return jsonError(error, request);
  }
}
