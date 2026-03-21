import { jsonError, jsonOk, getRequestMeta, getRequestId, parseJson } from "@/lib/http";
import { storeLead } from "@/lib/leads";
import type { LeadInput } from "@/types/domain";

export async function POST(request: Request) {
  try {
    const body = await parseJson<LeadInput>(request);
    const meta = getRequestMeta(request);
    const result = await storeLead(body, {
      ipHash: meta.ipHash,
      userAgentHash: meta.userAgentHash,
      rateLimitKey: meta.ipHash ?? meta.requestId,
    });

    return jsonOk(
      {
        ok: true,
        leadId: result.id,
        requestId: getRequestId(request),
      },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(error, request);
  }
}
