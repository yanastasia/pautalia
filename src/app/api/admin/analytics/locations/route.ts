import { analyticsRangeSchema, getLocationBreakdown } from "@/lib/admin-analytics";
import { requireAdminSession } from "@/lib/admin-api";
import { jsonError, jsonOk } from "@/lib/http";

export async function GET(request: Request) {
  try {
    await requireAdminSession();
    const filters = analyticsRangeSchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    const items = await getLocationBreakdown(filters);

    return jsonOk({ items });
  } catch (error) {
    return jsonError(error, request);
  }
}
