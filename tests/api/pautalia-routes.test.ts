import { describe, expect, it, vi } from "vitest";

const {
  listPublicBuildings,
  getPublicBuilding,
  listPublicUnits,
  getPublicUnit,
  storeLead,
  prisma,
} = vi.hoisted(() => ({
  listPublicBuildings: vi.fn(),
  getPublicBuilding: vi.fn(),
  listPublicUnits: vi.fn(),
  getPublicUnit: vi.fn(),
  storeLead: vi.fn(),
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

vi.mock("@/lib/pautalia-data", () => ({
  listPublicBuildings,
  getPublicBuilding,
  listPublicUnits,
  getPublicUnit,
}));

vi.mock("@/lib/leads", () => ({
  storeLead,
}));

vi.mock("@/lib/prisma", () => ({
  prisma,
}));

import { GET as buildingsRoute } from "@/app/api/pautalia/buildings/route";
import { GET as buildingRoute } from "@/app/api/pautalia/buildings/[slug]/route";
import { GET as unitsRoute } from "@/app/api/pautalia/units/route";
import { GET as unitRoute } from "@/app/api/pautalia/units/[slug]/route";
import { POST as leadsRoute } from "@/app/api/pautalia/leads/route";
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

describe("pautalia api routes", () => {
  it("lists buildings through the standardized route", async () => {
    listPublicBuildings.mockResolvedValueOnce([
      { id: "a", slug: "building-a", name: "Building A" },
    ]);

    const response = await buildingsRoute(new Request("http://localhost:3000/api/pautalia/buildings"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0]).toMatchObject({ slug: "building-a" });
  });

  it("returns one building and its floors", async () => {
    getPublicBuilding.mockResolvedValueOnce({
      item: { id: "a", slug: "building-a", name: "Building A" },
      floors: [{ id: "a-1", number: 1, label: "Floor 1" }],
    });

    const response = await buildingRoute(new Request("http://localhost:3000/api/pautalia/buildings/building-a"), {
      params: Promise.resolve({ slug: "building-a" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.item.slug).toBe("building-a");
    expect(body.floors).toHaveLength(1);
  });

  it("lists units with standardized filters", async () => {
    listPublicUnits.mockResolvedValueOnce({
      items: [{ id: "a-101", slug: "unit-a101", rooms: 2 }],
      pagination: { page: 1, limit: 12, total: 1, totalPages: 1 },
    });

    const response = await unitsRoute(
      new Request("http://localhost:3000/api/pautalia/units?building=building-a&rooms=2&maxPrice=120000"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.pagination.total).toBe(1);
  });

  it("returns one unit by slug", async () => {
    getPublicUnit.mockResolvedValueOnce({
      item: {
        id: "a-101",
        slug: "unit-a101",
        code: "AP.01",
        rooms: 3,
      },
    });

    const response = await unitRoute(new Request("http://localhost:3000/api/pautalia/units/unit-a101"), {
      params: Promise.resolve({ slug: "unit-a101" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.item.code).toBe("AP.01");
  });

  it("creates a lead through the standardized route", async () => {
    storeLead.mockResolvedValueOnce({ id: "lead-1" });

    const response = await leadsRoute(
      jsonRequest("http://localhost:3000/api/pautalia/leads", {
        fullName: "Ivan Petrov",
        email: "ivan@example.com",
        phone: "+359888000123",
        consent: true,
        sourcePageUrl: "/unit/unit-a101",
        unitId: "a-101",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toMatchObject({ ok: true, leadId: "lead-1" });
  });

  it("persists analytics events through the standardized route", async () => {
    prisma.unit.findUnique.mockResolvedValueOnce({ buildingId: "a" });
    prisma.building.findUnique.mockResolvedValueOnce({ id: "a" });
    prisma.event.create.mockResolvedValueOnce({ id: "event-1" });

    const response = await eventsRoute(
      jsonRequest("http://localhost:3000/api/pautalia/events", {
        eventType: "room_view",
        sourcePageUrl: "/building/building-a",
        unitId: "a-101",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toMatchObject({ ok: true, eventId: "event-1" });
  });
});
