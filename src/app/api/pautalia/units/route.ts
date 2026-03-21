import { jsonError, jsonOk, getRequestId } from "@/lib/http";
import { getRequestLocale } from "@/lib/i18n/server";
import { listPublicUnits } from "@/lib/pautalia-data";

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

export async function GET(request: Request) {
  try {
    const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
    return jsonOk({
      ...(await listPublicUnits(getRequestLocale(request), searchParams)),
      requestId: getRequestId(request),
    }, { headers: cacheHeaders });
  } catch (error) {
    return jsonError(error, request);
  }
}
