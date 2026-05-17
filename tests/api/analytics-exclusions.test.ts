import { describe, expect, it, vi } from "vitest";

const { prisma } = vi.hoisted(() => ({
  prisma: {
    unit: {
      findUnique: vi.fn(),
    },
    building: {
      findUnique: vi.fn(),
    },
    event: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma,
}));

import { POST as eventsRoute } from "@/app/api/pautalia/events/route";

function jsonRequest(url: string, body: unknown, init?: RequestInit) {
  return new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
    ...init,
  });
}

describe("analytics developer exclusions", () => {
  it("accepts but does not store events from excluded local developer IPs", async () => {
    const response = await eventsRoute(
      jsonRequest(
        "http://localhost:3000/api/pautalia/events",
        {
          eventType: "page_view",
          sourcePageUrl: "/apartments",
        },
        { headers: { "content-type": "application/json", "x-forwarded-for": "127.0.0.1" } },
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(202);
    expect(body).toMatchObject({ ok: true, skipped: true });
    expect(prisma.event.create).not.toHaveBeenCalled();
  });

  it("accepts but does not store events from admin pages", async () => {
    const response = await eventsRoute(
      jsonRequest(
        "http://localhost:3000/api/pautalia/events",
        {
          eventType: "page_view",
          sourcePageUrl: "/admin/analytics",
        },
        { headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.20" } },
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(202);
    expect(body).toMatchObject({ ok: true, skipped: true });
    expect(prisma.event.create).not.toHaveBeenCalled();
  });
});
