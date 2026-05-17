import { jsonError, jsonOk, getRequestId } from "@/lib/http";
import { getRequestLocale } from "@/lib/i18n/server";
import { getPostRequestLocale } from "@/lib/post-api-locale";
import { listPublicPosts } from "@/lib/posts";

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

export async function GET(request: Request) {
  try {
    const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
    return jsonOk({
      ...(await listPublicPosts(getPostRequestLocale(request, getRequestLocale(request)), searchParams)),
      requestId: getRequestId(request),
    }, { headers: cacheHeaders });
  } catch (error) {
    return jsonError(error, request);
  }
}
