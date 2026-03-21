import { createHmac, randomBytes } from "node:crypto";
import { env } from "@/lib/env";

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function stripControlCharacters(value: string) {
  return value.replace(CONTROL_CHARACTERS, "");
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone?: string | null) {
  if (!phone) return "";
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized.trim();
}

export function hashSensitive(value?: string | null) {
  if (!value) return null;

  return createHmac("sha256", env.AUTH_HASH_SECRET).update(value).digest("hex");
}

export function hashToken(token: string) {
  return hashSensitive(token) ?? "";
}

export function randomToken(size = 32) {
  return randomBytes(size).toString("base64url");
}

export function sanitizeSingleLineText(value?: string | null) {
  if (!value) return "";
  return stripControlCharacters(value).replace(/\s+/g, " ").trim();
}

export function sanitizeMultilineText(value?: string | null) {
  if (!value) return "";

  return stripControlCharacters(value)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "";
  }

  return request.headers.get("x-real-ip") ?? "";
}

export function getUserAgent(request: Request) {
  return request.headers.get("user-agent") ?? "";
}
