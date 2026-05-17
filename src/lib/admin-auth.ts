import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { Prisma } from "@prisma/client";
import { env, isProduction } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const adminSessionCookieName = "pautalia_admin_session";

const sessionTtlMs = 8 * 60 * 60 * 1000;
const totpStepSeconds = 30;
const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const localAdminCredentials = {
  username: "admin",
  password: "Pautalia2026!",
} as const;
let hasAdminUserTableCache: boolean | null = null;

type AdminCookieStore = {
  get: (name: string) => { value: string } | undefined;
};

function signSession(payload: string) {
  return createHmac("sha256", env.AUTH_HASH_SECRET).update(payload).digest("base64url");
}

export function secureCompare(left: string, right: string) {
  const leftHash = createHmac("sha256", env.AUTH_HASH_SECRET).update(left).digest();
  const rightHash = createHmac("sha256", env.AUTH_HASH_SECRET).update(right).digest();

  return timingSafeEqual(leftHash, rightHash);
}

function base32Encode(buffer: Buffer) {
  let bits = "";
  let output = "";

  for (const byte of buffer) {
    bits += byte.toString(2).padStart(8, "0");
  }

  for (let index = 0; index < bits.length; index += 5) {
    const chunk = bits.slice(index, index + 5).padEnd(5, "0");
    output += base32Alphabet[Number.parseInt(chunk, 2)];
  }

  return output;
}

function base32Decode(secret: string) {
  const normalized = secret.replace(/=+$/g, "").replace(/\s+/g, "").toUpperCase();
  let bits = "";

  for (const character of normalized) {
    const value = base32Alphabet.indexOf(character);
    if (value === -1) return null;
    bits += value.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  }

  return Buffer.from(bytes);
}

function generateTotp(secret: string, counter: number) {
  const key = base32Decode(secret);
  if (!key) return "";

  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  const hmac = createHmac("sha1", key).update(counterBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary = ((hmac[offset] & 0x7f) << 24) | ((hmac[offset + 1] & 0xff) << 16) | ((hmac[offset + 2] & 0xff) << 8) | (hmac[offset + 3] & 0xff);

  return String(binary % 1_000_000).padStart(6, "0");
}

export function createTotpSecret() {
  return base32Encode(randomBytes(20));
}

export function createTotpUri(username: string, secret: string) {
  const issuer = "Pautalia";
  const label = `${issuer}:${username}`;
  return `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=${totpStepSeconds}`;
}

export function verifyTotp(secret: string, token: string) {
  const sanitized = token.trim().replace(/\s+/g, "");
  if (!/^\d{6}$/.test(sanitized)) return false;

  const counter = Math.floor(Date.now() / 1000 / totpStepSeconds);
  return [-1, 0, 1].some((offset) => secureCompare(generateTotp(secret, counter + offset), sanitized));
}

function getAdminCredentials() {
  if (env.ADMIN_USERNAME && env.ADMIN_PASSWORD) {
    return {
      username: env.ADMIN_USERNAME,
      password: env.ADMIN_PASSWORD,
    };
  }

  if (!isProduction) {
    return localAdminCredentials;
  }

  return null;
}

export function getAdminUsername() {
  return getAdminCredentials()?.username ?? null;
}

export function isAdminLoginConfigured() {
  return getAdminCredentials() !== null;
}

export function verifyAdminCredentials(username: string, password: string) {
  const credentials = getAdminCredentials();
  if (!credentials) return false;

  return secureCompare(username, credentials.username) && secureCompare(password, credentials.password);
}

function isMissingAdminUserTableError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";
}

async function hasAdminUserTable() {
  if (hasAdminUserTableCache !== null) return hasAdminUserTableCache;

  const [schema] = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'AdminUser'
    ) AS "exists"
  `;

  hasAdminUserTableCache = Boolean(schema?.exists);
  return hasAdminUserTableCache;
}

export async function getAdminUser(username: string) {
  try {
    if (!(await hasAdminUserTable())) return null;

    return await prisma.adminUser.findUnique({
      where: { username },
    });
  } catch (error) {
    if (isMissingAdminUserTableError(error)) return null;
    throw error;
  }
}

export async function ensureAdminUser(username: string) {
  try {
    if (!(await hasAdminUserTable())) return null;

    return await prisma.adminUser.upsert({
      where: { username },
      update: {},
      create: {
        username,
        passwordHash: "env-managed",
        role: "super_admin",
      },
    });
  } catch (error) {
    if (isMissingAdminUserTableError(error)) return null;
    throw error;
  }
}

export function createAdminSessionCookie() {
  const expiresAt = Date.now() + sessionTtlMs;
  const sessionId = randomBytes(32).toString("base64url");
  const payload = `${sessionId}.${expiresAt}`;
  const signature = signSession(payload);

  return {
    name: adminSessionCookieName,
    value: `${payload}.${signature}`,
    options: {
      expires: new Date(expiresAt),
      httpOnly: true,
      sameSite: "lax" as const,
      secure: isProduction,
      path: "/",
    },
  };
}

export function verifyAdminSessionCookie(value?: string) {
  if (!value) return false;

  const parts = value.split(".");
  if (parts.length !== 3) return false;

  const [sessionId, expiresAtRaw, signature] = parts;
  if (!sessionId || !expiresAtRaw || !signature) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isSafeInteger(expiresAt) || expiresAt < Date.now()) return false;

  const expectedSignature = signSession(`${sessionId}.${expiresAtRaw}`);
  return secureCompare(signature, expectedSignature);
}

export function hasAdminSession(cookies: AdminCookieStore) {
  return verifyAdminSessionCookie(cookies.get(adminSessionCookieName)?.value);
}
