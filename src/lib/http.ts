import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, isAppError, validationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { normalizeRequestId } from "@/lib/request-id";
import { getClientIp, getUserAgent, hashSensitive } from "@/lib/security";

export function getRequestId(request: Request) {
  return normalizeRequestId(request.headers.get("x-request-id") ?? randomUUID());
}

export function getRequestMeta(request: Request) {
  return {
    requestId: getRequestId(request),
    ipHash: hashSensitive(getClientIp(request)) ?? undefined,
    userAgentHash: hashSensitive(getUserAgent(request)) ?? undefined,
  };
}

export function jsonOk(data: Record<string, unknown>, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(error: unknown, request: Request) {
  const requestId = getRequestId(request);

  if (error instanceof ZodError) {
    const fields = Object.fromEntries(
      error.issues.map((issue) => [issue.path.join(".") || "root", issue.message]),
    );

    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request",
          fields,
        },
        requestId,
      },
      { status: 400 },
    );
  }

  if (isAppError(error)) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.fields ? { fields: error.fields } : {}),
        },
        requestId,
      },
      { status: error.status },
    );
  }

  logger.error("api.unhandled_error", {
    requestId,
    error: error instanceof Error ? error.message : "unknown",
  });

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Unexpected server error",
      },
      requestId,
    },
    { status: 500 },
  );
}

export async function parseJson<T>(request: Request): Promise<T> {
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    throw validationError("Expected application/json request body", {
      contentType: "Unsupported content type",
    });
  }

  try {
    return (await request.json()) as T;
  } catch {
    throw validationError("Invalid JSON request body", {
      body: "Malformed JSON",
    });
  }
}
