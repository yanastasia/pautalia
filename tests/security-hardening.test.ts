import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { leadSchema } from "@/lib/leads";
import { getRequestId } from "@/lib/http";
import { middleware } from "@/middleware";

describe("security hardening", () => {
  it("sanitizes malformed request ids", () => {
    const request = new Request("http://localhost:3000/api/pautalia/buildings", {
      headers: {
        "x-request-id": "bad id with spaces",
      },
    });

    const requestId = getRequestId(request);

    expect(requestId).toMatch(/^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/);
    expect(requestId).not.toContain(" ");
  });

  it("marks lead and analytics mutation surfaces as no-store", () => {
    const leadsResponse = middleware(new NextRequest("http://localhost:3000/api/pautalia/leads", { method: "POST" }));
    const eventsResponse = middleware(new NextRequest("http://localhost:3000/api/pautalia/events", { method: "POST" }));

    expect(leadsResponse.headers.get("cache-control")).toBe("no-store");
    expect(eventsResponse.headers.get("cache-control")).toBe("no-store");
    expect(leadsResponse.headers.get("x-content-type-options")).toBe("nosniff");
    expect(leadsResponse.headers.get("cross-origin-opener-policy")).toBe("same-origin");
  });

  it("only accepts relative lead source paths", () => {
    expect(() =>
      leadSchema.parse({
        fullName: "Ivan Petrov",
        email: "ivan@example.com",
        phone: "+359888000123",
        consent: true,
        sourcePageUrl: "https://example.com/unit/a-101",
      }),
    ).toThrow();

    expect(
      leadSchema.parse({
        fullName: "Ivan Petrov",
        email: "ivan@example.com",
        phone: "+359888000123",
        consent: true,
        sourcePageUrl: "/unit/a-101",
      }).sourcePageUrl,
    ).toBe("/unit/a-101");
  });
});
