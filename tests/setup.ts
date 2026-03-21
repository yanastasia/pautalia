import { afterEach, vi } from "vitest";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL ||= "postgresql://postgres:postgres@localhost:5432/pautalia_test";
process.env.AUTH_HASH_SECRET ||= "test-auth-secret";
process.env.NEXT_PUBLIC_SITE_URL ||= "http://localhost:3000";

afterEach(() => {
  vi.restoreAllMocks();
  const store = (globalThis as { __pautaliaRateLimitStore?: Map<string, unknown> }).__pautaliaRateLimitStore;
  store?.clear();
});
