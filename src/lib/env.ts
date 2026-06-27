import { z } from "zod";

const emptyToUndefined = (value: unknown) => value === "" ? undefined : value;
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalNonEmptyString = z.preprocess(emptyToUndefined, z.string().min(1).optional());
const optionalAdminPassword = z.preprocess(emptyToUndefined, z.string().min(12).optional());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  AUTH_HASH_SECRET: z.string().min(1).default("replace-me"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_BOOKING_URL: optionalUrl,
  ADMIN_USERNAME: z.preprocess(emptyToUndefined, z.string().min(3).optional()),
  ADMIN_PASSWORD: optionalAdminPassword,
  PAYLOAD_SECRET: optionalNonEmptyString,
  PAYLOAD_PUBLIC_SERVER_URL: optionalUrl,
  PAYLOAD_INTERNAL_URL: optionalUrl,
  REVALIDATE_SECRET: z.preprocess(emptyToUndefined, z.string().min(16).optional()),
  POSTMARK_SERVER_TOKEN: optionalNonEmptyString,
  EMAIL_FROM: optionalNonEmptyString,
  ANALYTICS_EXCLUDED_IPS: z.string().default(""),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_HASH_SECRET: process.env.AUTH_HASH_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_BOOKING_URL: process.env.NEXT_PUBLIC_BOOKING_URL,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
  PAYLOAD_PUBLIC_SERVER_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  PAYLOAD_INTERNAL_URL: process.env.PAYLOAD_INTERNAL_URL,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
  POSTMARK_SERVER_TOKEN: process.env.POSTMARK_SERVER_TOKEN ?? process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  ANALYTICS_EXCLUDED_IPS: process.env.ANALYTICS_EXCLUDED_IPS,
});

export const isProduction = env.NODE_ENV === "production";
export const hasWeakAuthHashSecret = env.AUTH_HASH_SECRET === "replace-me";
