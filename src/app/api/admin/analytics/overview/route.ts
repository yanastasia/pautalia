import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-api";
import { analyticsRangeSchema, getAnalyticsOverview } from "@/lib/admin-analytics";
import { jsonError } from "@/lib/http";

export async function GET(request: Request) {
  try {
    await requireAdminSession();
    const filters = analyticsRangeSchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    return NextResponse.json({ ok: true, item: await getAnalyticsOverview(filters) });
  } catch (error) {
    return jsonError(error, request);
  }
}
