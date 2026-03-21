import { Prisma } from "@prisma/client";
import { z } from "zod";
import { jsonError, jsonOk, getRequestMeta, getRequestId, parseJson } from "@/lib/http";
import { validationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";

const eventSchema = z.object({
  eventType: z.string().trim().min(1).max(64),
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
  payload: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = eventSchema.parse(await parseJson(request));
    const meta = getRequestMeta(request);

    enforceRateLimit(`event:${meta.ipHash ?? meta.requestId}`, 40, 15 * 60 * 1000);

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

    const event = await prisma.event.create({
      data: {
        eventType: body.eventType,
        sourcePageUrl: body.sourcePageUrl,
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
