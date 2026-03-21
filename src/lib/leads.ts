import { randomUUID } from "node:crypto";
import { z } from "zod";
import { serviceUnavailableError, validationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { normalizeEmail, normalizePhone, sanitizeMultilineText, sanitizeSingleLineText } from "@/lib/security";
import type { LeadInput } from "@/types/domain";

const relativeOrAbsoluteUrlSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "Must be a relative path or absolute URL",
  });

const relativePathSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .refine((value) => value.startsWith("/"), {
    message: "Must be a relative path",
  });

export const leadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.email().max(320),
  phone: z.string().trim().min(6).max(32).optional(),
  message: z.string().trim().max(2000).optional(),
  unitId: z.string().trim().min(1).max(64).optional(),
  buildingId: z.string().trim().min(1).max(64).optional(),
  sourcePageUrl: relativePathSchema,
  referrer: relativeOrAbsoluteUrlSchema.optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(160).optional(),
  utmTerm: z.string().trim().max(160).optional(),
  utmContent: z.string().trim().max(160).optional(),
  consent: z.boolean().refine((value) => value, {
    message: "Consent is required",
  }),
  company: z.string().trim().max(0).optional(),
});

async function isDuplicateLead(email: string, unitId?: string) {
  const windowStart = new Date(Date.now() - 15 * 60 * 1000);

  const duplicate = await prisma.lead.findFirst({
    where: {
      email,
      unitId: unitId ?? null,
      createdAt: {
        gte: windowStart,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(duplicate);
}

export async function storeLead(
  input: LeadInput,
  options: {
    ipHash?: string;
    userAgentHash?: string;
    rateLimitKey: string;
  },
) {
  const parsed = leadSchema.parse(input);

  enforceRateLimit(`lead:${options.rateLimitKey}`, 5, 15 * 60 * 1000);

  const fullName = sanitizeSingleLineText(parsed.fullName);
  const email = normalizeEmail(parsed.email);
  const phone = normalizePhone(parsed.phone) || undefined;
  const message = sanitizeMultilineText(parsed.message) || undefined;
  const unitId = sanitizeSingleLineText(parsed.unitId) || undefined;
  let buildingId = sanitizeSingleLineText(parsed.buildingId) || undefined;

  if (await isDuplicateLead(email, unitId)) {
    throw validationError("A similar inquiry was submitted recently", {
      email: "Duplicate inquiry throttled",
    });
  }

  if (unitId) {
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: { id: true, buildingId: true },
    });

    if (!unit) {
      throw validationError("Unit not found", {
        unitId: "Unknown unit",
      });
    }

    buildingId ??= unit.buildingId;
  }

  if (buildingId) {
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
      select: { id: true },
    });

    if (!building) {
      throw validationError("Building not found", {
        buildingId: "Unknown building",
      });
    }
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        id: randomUUID(),
        fullName,
        email,
        phone: phone ?? null,
        message: message ?? null,
        unitId: unitId ?? null,
        buildingId: buildingId ?? null,
        sourcePageUrl: parsed.sourcePageUrl,
        referrer: sanitizeSingleLineText(parsed.referrer) || null,
        utmSource: sanitizeSingleLineText(parsed.utmSource) || null,
        utmMedium: sanitizeSingleLineText(parsed.utmMedium) || null,
        utmCampaign: sanitizeSingleLineText(parsed.utmCampaign) || null,
        utmTerm: sanitizeSingleLineText(parsed.utmTerm) || null,
        utmContent: sanitizeSingleLineText(parsed.utmContent) || null,
        userAgentHash: options.userAgentHash ?? null,
        ipHash: options.ipHash ?? null,
        consentTimestamp: new Date(),
        status: "new",
      },
      select: {
        id: true,
      },
    });

    return { id: lead.id };
  } catch (error) {
    logger.error("leads.store_failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    throw serviceUnavailableError("Lead submission is temporarily unavailable");
  }
}
