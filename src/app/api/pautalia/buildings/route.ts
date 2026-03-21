import { jsonError, jsonOk, getRequestId } from "@/lib/http";
import { getRequestLocale } from "@/lib/i18n/server";
import { listPublicBuildings } from "@/lib/pautalia-data";

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

export async function GET(request: Request) {
  try {
    return jsonOk({
      items: await listPublicBuildings(getRequestLocale(request)),
      requestId: getRequestId(request),
    }, { headers: cacheHeaders });
  } catch (error) {
    return jsonError(error, request);
  }
}
