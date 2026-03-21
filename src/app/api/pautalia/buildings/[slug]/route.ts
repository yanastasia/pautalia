import { jsonError, jsonOk, getRequestId } from "@/lib/http";
import { getRequestLocale } from "@/lib/i18n/server";
import { getPublicBuilding } from "@/lib/pautalia-data";

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    return jsonOk({
      ...(await getPublicBuilding(getRequestLocale(request), slug)),
      requestId: getRequestId(request),
    }, { headers: cacheHeaders });
  } catch (error) {
    return jsonError(error, request);
  }
}
