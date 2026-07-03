import { NextRequest } from "next/server";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { resolveFloorplanFrame } from "@/components/buildings/building-floorplan-frame";
import { sendLeadEmails } from "@/lib/email";
import { middleware } from "@/middleware";

const fetchMock = vi.fn();
const revalidatePathMock = vi.fn();
const revalidateTagMock = vi.fn();
(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
  revalidateTag: revalidateTagMock,
}));

describe("cross-module integration suite", () => {
  beforeEach(() => {
    vi.resetModules();
    fetchMock.mockReset();
    revalidatePathMock.mockReset();
    revalidateTagMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    process.env.PAYLOAD_INTERNAL_URL = "http://payload.local";
  });

  it("publishes admin news through Payload and revalidates the public news surface", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        PAYLOAD_INTERNAL_URL: "http://payload.local",
        REVALIDATE_SECRET: "shared-test-secret",
      },
    }));
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "post-1",
        slug: "integration-news",
        status: "published",
        category: "announcement",
        translations: {
          bg: { title: "Интеграционна новина", excerpt: "Кратко описание", body: "Текст" },
          en: { title: "Integration news", excerpt: "Short excerpt", body: "Body" },
        },
      }),
    });

    const { createAdminPost, parseAdminPostForm } = await import("@/lib/admin-posts");
    const formData = new FormData();
    formData.set("slug", "integration-news");
    formData.set("status", "published");
    formData.set("category", "announcement");
    formData.set("bgTitle", "Интеграционна новина");
    formData.set("bgExcerpt", "Кратко описание");
    formData.set("bgBody", "Текст");
    formData.set("enTitle", "Integration news");
    formData.set("enExcerpt", "Short excerpt");
    formData.set("enBody", "Body");

    const post = await createAdminPost(parseAdminPostForm(formData));

    expect(post.slug).toBe("integration-news");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://payload.local/api/posts",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-pautalia-internal-secret": "shared-test-secret",
        }),
      }),
    );
    expect(revalidateTagMock).toHaveBeenCalledWith("pautalia:posts");
    expect(revalidatePathMock).toHaveBeenCalledWith("/news");
    expect(revalidatePathMock).toHaveBeenCalledWith("/sitemap.xml");
  });

  it("keeps the public post API on published content only", async () => {
    delete process.env.PAYLOAD_INTERNAL_URL;
    const { listPublicPosts, getPublicPost } = await import("@/lib/posts");

    const posts = await listPublicPosts("en", {});
    const published = await getPublicPost("en", "construction-update-residence-may-2026");

    expect(posts.items.every((post) => post.status === "published")).toBe(true);
    expect(published.translation.title).toBe("Residence Progress Update");
    await expect(getPublicPost("en", "draft-park-launch-note")).rejects.toMatchObject({
      status: 404,
    });
  });

  it("sends buyer and admin lead emails with the expected bilingual/admin split", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        RESEND_API_KEY: "test-resend-key",
        EMAIL_FROM: "Pautalia Residence <sales@pautalia.com>",
      },
    }));
    fetchMock.mockResolvedValue({ ok: true });

    const { sendLeadEmails: sendEmails } = await import("@/lib/email");
    await sendEmails({
      leadId: "lead-integration",
      fullName: "Integration Buyer",
      email: "buyer@example.com",
      phone: "+359888000123",
      unitCode: "B-AP.03",
      sourcePageUrl: "/units/b-ap.03",
      message: "Please contact me.",
    });

    const payloads = fetchMock.mock.calls.map(([, init]) => JSON.parse(String((init as RequestInit).body)));

    expect(payloads).toHaveLength(2);
    expect(payloads[0]).toMatchObject({
      to: "buyer@example.com",
      subject: "Получихме Вашето запитване за Pautalia | Your Pautalia enquiry was received",
    });
    expect(payloads[0].html).toContain("----- English -----");
    expect(payloads[1]).toMatchObject({
      to: "sales@pautalia.com",
      subject: "[ADMIN][INQUIRY] B-AP.03 - New lead from Integration Buyer",
    });
  });

  it("applies security headers consistently to admin and mutation routes", () => {
    const adminResponse = middleware(new NextRequest("http://localhost:3000/admin/news"));
    const leadResponse = middleware(new NextRequest("http://localhost:3000/api/pautalia/leads", { method: "POST" }));

    expect(adminResponse.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(adminResponse.headers.get("cache-control")).toBe("no-store");
    expect(leadResponse.headers.get("cache-control")).toBe("no-store");
    expect(leadResponse.headers.get("x-frame-options")).toBe("DENY");
    expect(leadResponse.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("keeps interactive floorplan component framing aligned with current assets", () => {
    expect(resolveFloorplanFrame("/assets/buildings/residence/floors/floor-02.png")).toMatchObject({
      aspectRatio: "1 / 1",
      imageClassName: "object-center",
      imageWrapperClassName: "",
    });
    expect(resolveFloorplanFrame("/assets/buildings/residence/exterior/exterior-front.jpg", "1 / 1")).toMatchObject({
      aspectRatio: "1000 / 640",
      imageClassName: "object-top",
    });
  });

  it("renders a top-level admin dashboard action for managing news", () => {
    const html = renderToStaticMarkup(React.createElement(AdminDashboard, {
      counts: { leads: 0, units: 0, availableUnits: 0 },
      leads: [],
      units: [],
      locale: "en",
    }));

    expect(html).toContain('href="/admin/news"');
    expect(html).toContain("News");
    expect(html).toContain("Manage news");
    expect(html).toContain("bg-[color:var(--accent)]");
    expect(html).toContain("text-[color:var(--surface-dark)]");
  });
});

describe("lead email import smoke", () => {
  it("exposes the lead email sender module", () => {
    expect(sendLeadEmails).toBeTypeOf("function");
  });
});
