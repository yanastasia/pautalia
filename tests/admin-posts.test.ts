import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();
const revalidatePathMock = vi.fn();
const revalidateTagMock = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
  revalidateTag: revalidateTagMock,
}));

describe("admin news publishing", () => {
  beforeEach(() => {
    vi.resetModules();
    fetchMock.mockReset();
    revalidatePathMock.mockReset();
    revalidateTagMock.mockReset();
    process.env.PAYLOAD_INTERNAL_URL = "http://payload.local";
    vi.stubGlobal("fetch", fetchMock);
  });

  it("creates a published Payload post and exposes it on the public news loader", async () => {
    const publishedPost = {
      id: "post-test",
      slug: "test-news-publish",
      status: "published",
      category: "news",
      publishedAt: "2026-06-28T10:00:00.000Z",
      translations: {
        bg: {
          title: "Тестова новина",
          excerpt: "Кратко тестово описание.",
          body: "Публикуван тестов текст.",
        },
        en: {
          title: "Test news",
          excerpt: "Short test excerpt.",
          body: "Published test body.",
        },
      },
    };

    vi.doMock("@/lib/env", () => ({
      env: {
        PAYLOAD_INTERNAL_URL: "http://payload.local",
        REVALIDATE_SECRET: "test-secret",
      },
    }));

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => publishedPost,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ docs: [publishedPost], totalDocs: 1, totalPages: 1 }),
      });

    const { createAdminPost } = await import("@/lib/admin-posts");
    const { listPublicPosts } = await import("@/lib/posts");

    const created = await createAdminPost({
      slug: "test-news-publish",
      status: "published",
      category: "news",
      publishedAt: "2026-06-28T10:00:00.000Z",
      translations: publishedPost.translations,
    });
    const publicPosts = await listPublicPosts("en", {});

    expect(created.slug).toBe("test-news-publish");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://payload.local/api/posts",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-pautalia-internal-secret": "test-secret",
        }),
      }),
    );
    expect(revalidateTagMock).toHaveBeenCalledWith("pautalia:posts");
    expect(publicPosts.items[0]).toMatchObject({
      slug: "test-news-publish",
      translation: {
        title: "Test news",
      },
    });
  });
});
