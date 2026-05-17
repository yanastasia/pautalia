import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api";
import { analyticsRangeSchema, getTrafficSources } from "@/lib/admin-analytics";
import { jsonError } from "@/lib/http";

export async function GET(request: Request) {
  try {
    await requireAdminSession();
    const filters = analyticsRangeSchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    return NextResponse.json({ ok: true, items: await getTrafficSources(filters) });
  } catch (error) {
    return jsonError(error, request);
  }
}
