import { rateLimitError } from "@/lib/errors";

type Entry = {
  count: number;
  resetAt: number;
};

const globalStore = globalThis as unknown as {
  __pautaliaRateLimitStore?: Map<string, Entry>;
};

const store = globalStore.__pautaliaRateLimitStore ?? new Map<string, Entry>();

if (!globalStore.__pautaliaRateLimitStore) {
  globalStore.__pautaliaRateLimitStore = store;
}

export function enforceRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return;
  }

  if (current.count >= limit) {
    throw rateLimitError();
  }

  current.count += 1;
  store.set(key, current);
}
