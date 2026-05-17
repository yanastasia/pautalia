import { jsonError, jsonOk, getRequestId } from "@/lib/http";
import { getRequestLocale } from "@/lib/i18n/server";
import { getPostRequestLocale } from "@/lib/post-api-locale";
import { getPublicPost } from "@/lib/posts";

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    return jsonOk({
      item: await getPublicPost(getPostRequestLocale(request, getRequestLocale(request)), slug),
      requestId: getRequestId(request),
    }, { headers: cacheHeaders });
  } catch (error) {
    return jsonError(error, request);
  }
}
