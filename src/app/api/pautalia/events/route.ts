import { Prisma } from "@prisma/client";
import { z } from "zod";
import { isAnalyticsExcludedRequest } from "@/lib/analytics-exclusions";
import { analyticsDeviceSchema, analyticsEventNameSchema } from "@/lib/analytics-events";
import { getAnalyticsLocation } from "@/lib/analytics-location";
import { isInternalAnalyticsPath } from "@/lib/analytics-paths";
import { jsonError, jsonOk, getRequestMeta, getRequestId, parseJson } from "@/lib/http";
import { validationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { hashSensitive } from "@/lib/security";

const consentCookieName = "pautalia_cookie_consent";

function hasAnalyticsConsent(request: Request) {
  return request.headers.get("cookie")?.includes(`${consentCookieName}=analytics`) ?? false;
}

const eventSchema = z.object({
  eventType: analyticsEventNameSchema,
  sourcePageUrl: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .refine((value) => value.startsWith("/"), {
      message: "Must be a relative path",
    }),
  buildingId: z.string().trim().min(1).max(64).optional(),
  unitId: z.string().trim().min(1).max(64).optional(),
  referrer: z.string().trim().max(500).optional(),
  source: z.string().trim().max(120).optional(),
  medium: z.string().trim().max(120).optional(),
  campaign: z.string().trim().max(160).optional(),
  term: z.string().trim().max(160).optional(),
  content: z.string().trim().max(160).optional(),
  deviceType: analyticsDeviceSchema.optional(),
  durationMs: z.number().int().nonnegative().max(24 * 60 * 60 * 1000).optional(),
  visitorId: z.string().trim().min(8).max(160).optional(),
  sessionId: z.string().trim().min(8).max(160).optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = eventSchema.parse(await parseJson(request));
    const meta = getRequestMeta(request);

    enforceRateLimit(`event:${meta.ipHash ?? meta.requestId}`, 40, 15 * 60 * 1000);

    if (isInternalAnalyticsPath(body.sourcePageUrl) || isAnalyticsExcludedRequest(request)) {
      return jsonOk(
        {
          ok: true,
          skipped: true,
          requestId: getRequestId(request),
        },
        { status: 202 },
      );
    }

    let derivedBuildingId = body.buildingId;

    if (body.unitId) {
      const unit = await prisma.unit.findUnique({
        where: { id: body.unitId },
        select: { buildingId: true },
      });

      if (!unit) {
        throw validationError("Unit not found", {
          unitId: "Unknown unit",
        });
      }

      derivedBuildingId ??= unit.buildingId;
    }

    if (derivedBuildingId) {
      const buildingExists = await prisma.building.findUnique({
        where: { id: derivedBuildingId },
        select: { id: true },
      });

      if (!buildingExists) {
        throw validationError("Building not found", {
          buildingId: "Unknown building",
        });
      }
    }

    const canStoreAnalyticsIds = hasAnalyticsConsent(request);
    const visitorIdHash = canStoreAnalyticsIds ? hashSensitive(body.visitorId) : null;
    const sessionIdHash = canStoreAnalyticsIds ? hashSensitive(body.sessionId) : null;
    const location = canStoreAnalyticsIds
      ? getAnalyticsLocation(request)
      : { country: null, region: null, city: null };

    const event = await prisma.event.create({
      data: {
        eventType: body.eventType,
        sourcePageUrl: body.sourcePageUrl,
        referrer: body.referrer ?? null,
        source: body.source ?? null,
        medium: body.medium ?? null,
        campaign: body.campaign ?? null,
        term: body.term ?? null,
        content: body.content ?? null,
        deviceType: body.deviceType ?? null,
        country: location.country,
        region: location.region,
        city: location.city,
        durationMs: body.durationMs ?? null,
        visitorIdHash,
        sessionIdHash,
        buildingId: derivedBuildingId ?? null,
        unitId: body.unitId ?? null,
        payload: (body.payload ?? {}) as Prisma.InputJsonValue,
        userAgentHash: meta.userAgentHash ?? null,
        ipHash: meta.ipHash ?? null,
      },
    });

    return jsonOk(
      {
        ok: true,
        eventId: event.id,
        requestId: getRequestId(request),
      },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(error, request);
  }
}
