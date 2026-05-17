import { describe, expect, it, vi } from "vitest";
import { unauthorizedError } from "@/lib/errors";

const { requireAdminSession, getAnalyticsOverview } = vi.hoisted(() => ({
  requireAdminSession: vi.fn(),
  getAnalyticsOverview: vi.fn(),
}));

vi.mock("@/lib/admin-api", () => ({
  requireAdminSession,
}));

vi.mock("@/lib/admin-analytics", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/admin-analytics")>(),
  getAnalyticsOverview,
}));

import { GET as overviewRoute } from "@/app/api/admin/analytics/overview/route";

describe("admin analytics api routes", () => {
  it("returns 401 without an admin session", async () => {
    requireAdminSession.mockRejectedValueOnce(unauthorizedError("Admin session required"));

    const response = await overviewRoute(new Request("http://localhost:3000/api/admin/analytics/overview"));

    expect(response.status).toBe(401);
  });

  it("returns overview metrics with an admin session", async () => {
    requireAdminSession.mockResolvedValueOnce({ role: "super_admin" });
    getAnalyticsOverview.mockResolvedValueOnce({ pageViews: 1, leads: 1, conversionRate: 100 });

    const response = await overviewRoute(new Request("http://localhost:3000/api/admin/analytics/overview"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.item).toMatchObject({ pageViews: 1, leads: 1 });
  });
});
