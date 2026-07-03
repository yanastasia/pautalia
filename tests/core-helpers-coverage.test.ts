import { describe, expect, it, vi } from "vitest";
import { formatAdminDate, formatLeadStatus } from "@/lib/admin-format";
import { getAnalyticsLocation } from "@/lib/analytics-location";
import { isInternalAnalyticsPath } from "@/lib/analytics-paths";
import { getBuildingGeoBySlug, listBuildingGeos } from "@/lib/building-geo";
import {
  AppError,
  conflictError,
  forbiddenError,
  isAppError,
  notFoundError,
  serviceUnavailableError,
  unauthorizedError,
  validationError,
} from "@/lib/errors";
import { normalizeFloorplanImagePath } from "@/lib/floorplan-assets";
import { jsonError, parseJson } from "@/lib/http";
import { localeFromAcceptLanguage, normalizeLocale } from "@/lib/i18n/config";
import { getFeatureLabel, getOrientationLabel, getOutdoorTypeLabel } from "@/lib/i18n/property";
import { getRequestLocale } from "@/lib/i18n/server";
import { getPostRequestLocale } from "@/lib/post-api-locale";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  clamp,
  getDistance,
  getMidpoint,
  type PointerPosition,
} from "@/components/units/zoomable-plan-lightbox-helpers";
import { homeHeroImages } from "@/data/home-hero-images";
import {
  getClientIp,
  getUserAgent,
  hashSensitive,
  hashToken,
  normalizeEmail,
  normalizePhone,
  randomToken,
  sanitizeMultilineText,
  sanitizeSingleLineText,
} from "@/lib/security";
import { cn, formatArea, formatCurrency, titleCase } from "@/lib/utils";

describe("core helper coverage", () => {
  it("normalizes and sanitizes sensitive lead fields", () => {
    const request = new Request("http://localhost", {
      headers: {
        "x-forwarded-for": "203.0.113.10, 10.0.0.1",
        "user-agent": "Test Browser",
      },
    });

    expect(normalizeEmail(" Buyer@Example.COM ")).toBe("buyer@example.com");
    expect(normalizePhone(" +359 (888) 00-01 ")).toBe("+3598880001");
    expect(normalizePhone(null)).toBe("");
    expect(sanitizeSingleLineText(" hello\u0000   world ")).toBe("hello world");
    expect(sanitizeMultilineText(" one \r\n\r\n\r\n two\t\tthree ")).toBe("one\n\n two three");
    expect(getClientIp(request)).toBe("203.0.113.10");
    expect(getUserAgent(request)).toBe("Test Browser");
    expect(hashSensitive("buyer@example.com")).toMatch(/^[a-f0-9]{64}$/);
    expect(hashSensitive()).toBeNull();
    expect(hashToken("token")).toMatch(/^[a-f0-9]{64}$/);
    expect(randomToken(12).length).toBeGreaterThan(10);
  });

  it("enforces rate limits across a fixed window", () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    enforceRateLimit("test:coverage", 2, 1_000);
    enforceRateLimit("test:coverage", 2, 1_000);
    expect(() => enforceRateLimit("test:coverage", 2, 1_000)).toThrow(AppError);

    vi.setSystemTime(new Date("2026-01-01T00:00:01.001Z"));
    expect(() => enforceRateLimit("test:coverage", 2, 1_000)).not.toThrow();
    vi.useRealTimers();
  });

  it("formats admin, display, and building helper values", () => {
    expect(formatLeadStatus("viewing_booked", "en")).toBe("viewing booked");
    expect(formatLeadStatus("viewing_booked", "bg")).toBe("оглед записан");
    expect(formatAdminDate(new Date("2026-05-01T12:30:00.000Z"), "en")).toContain("2026");
    expect(formatCurrency(250000)).toContain("250,000");
    expect(formatArea(82.4)).toBe("82 sq m");
    expect(titleCase("park-building")).toBe("Park Building");
    expect(cn("base", false, ["active"])).toBe("base active");
    expect(listBuildingGeos()).toHaveLength(2);
    expect(getBuildingGeoBySlug("park")?.markerColor).toBe("#3f7d6f");
    expect(getBuildingGeoBySlug("missing")).toBeNull();
  });

  it("normalizes floorplan paths and route locales", () => {
    expect(normalizeFloorplanImagePath(" /assets/floorplans/second_floor.png ")).toBe(
      "/assets/buildings/residence/floors/floor-02.png",
    );
    expect(normalizeFloorplanImagePath("plans/floor.png", "/fallback.png")).toBe("/fallback.png");
    expect(normalizeFloorplanImagePath("https://cdn.example.com/floor.png")).toBe("https://cdn.example.com/floor.png");
    expect(normalizeLocale("bg-BG")).toBe("bg");
    expect(normalizeLocale("EN-us")).toBe("en");
    expect(normalizeLocale("de")).toBeNull();
    expect(localeFromAcceptLanguage("fr-FR, en-US;q=0.9, bg;q=0.8")).toBe("en");
    expect(localeFromAcceptLanguage(null)).toBeNull();
    expect(getRequestLocale(new Request("http://localhost/units?lang=en"))).toBe("en");
    expect(getRequestLocale(new Request("http://localhost/units", { headers: { cookie: "pautalia_locale=bg" } }))).toBe("bg");
    expect(getPostRequestLocale(new Request("http://localhost/api/posts?locale=en"), "bg")).toBe("en");
    expect(getPostRequestLocale(new Request("http://localhost/api/posts?locale=de"), "bg")).toBe("bg");
  });

  it("labels localized property attributes and image/pointer helpers", () => {
    const pointers: [PointerPosition, PointerPosition] = [{ x: 0, y: 0 }, { x: 6, y: 8 }];

    expect(getOrientationLabel("bg", "north-east")).toBe("Североизток");
    expect(getOrientationLabel("en", "north by north-west")).toBe("North-By-North-West");
    expect(getOutdoorTypeLabel("en", "yard")).toBe("Private yard");
    expect(getOutdoorTypeLabel("bg", null)).toBeNull();
    expect(getOutdoorTypeLabel("en", "roof deck")).toBe("Roof-Deck");
    expect(getFeatureLabel("bg", "Two bedrooms")).toBe("Две спални");
    expect(getFeatureLabel("en", "Custom feature")).toBe("Custom feature");
    expect(homeHeroImages.map((image) => image.src)).toEqual([
      "/assets/buildings/residence/hero/exterior-front.jpg",
      "/assets/buildings/park/exterior/park_exterior2.png",
    ]);
    expect(clamp(12, 0, 10)).toBe(10);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(getDistance(pointers)).toBe(10);
    expect(getMidpoint(pointers)).toEqual({ x: 3, y: 4 });
  });

  it("extracts analytics path and location data safely", () => {
    const request = new Request("http://localhost", {
      headers: {
        "cf-ipcountry": "BG",
        "x-geo-region": "Kyustendil%20Province",
        "x-city": "Kyustendil%00",
      },
    });

    expect(isInternalAnalyticsPath("/admin/news?tab=drafts")).toBe(true);
    expect(isInternalAnalyticsPath("/news?from=/admin")).toBe(false);
    expect(getAnalyticsLocation(request)).toEqual({
      country: "BG",
      region: "Kyustendil Province",
      city: "Kyustendil",
    });
  });

  it("maps application errors to stable JSON responses", async () => {
    const appError = validationError("Invalid lead", { email: "Required" });
    const response = jsonError(appError, new Request("http://localhost", { headers: { "x-request-id": "req-12345678" } }));
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "VALIDATION_ERROR", fields: { email: "Required" } },
      requestId: "req-12345678",
    });
    expect(response.status).toBe(400);
    expect(isAppError(unauthorizedError())).toBe(true);
    expect(forbiddenError().status).toBe(403);
    expect(notFoundError().status).toBe(404);
    expect(conflictError().status).toBe(409);
    expect(serviceUnavailableError().status).toBe(503);
  });

  it("parses JSON requests and rejects malformed bodies", async () => {
    await expect(
      parseJson<{ ok: boolean }>(
        new Request("http://localhost", {
          method: "POST",
          headers: { "content-type": "application/json; charset=utf-8" },
          body: JSON.stringify({ ok: true }),
        }),
      ),
    ).resolves.toEqual({ ok: true });

    await expect(parseJson(new Request("http://localhost", { method: "POST" }))).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
    });
  });
});
