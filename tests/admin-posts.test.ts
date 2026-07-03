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
      coverMedia: { id: "media-cover", url: "https://cms.pautalia.com/media/cover.webp", alt: "Test cover", mimeType: "image/webp" },
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
      coverMedia: "media-cover",
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
      coverImage: "https://cms.pautalia.com/media/cover.webp",
      translation: {
        title: "Test news",
      },
    });
  });

  it("uploads a required hero image before parsing custom admin form data", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        PAYLOAD_INTERNAL_URL: "http://payload.local",
        REVALIDATE_SECRET: "test-secret",
      },
    }));
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "uploaded-cover",
        url: "http://payload.local/media/uploaded-cover.webp",
        alt: "Uploaded cover",
        mimeType: "image/webp",
      }),
    });

    const { parseAdminPostFormWithUploads } = await import("@/lib/admin-posts");
    const formData = new FormData();
    formData.set("slug", "uploaded-cover-news");
    formData.set("status", "published");
    formData.set("category", "news");
    formData.set("coverMedia", new File(["image"], "cover.webp", { type: "image/webp" }));
    formData.set("bgTitle", "Новина със снимка");
    formData.set("bgExcerpt", "Описание");
    formData.set("bgBody", "Текст");
    formData.set("enTitle", "News with image");
    formData.set("enExcerpt", "Excerpt");
    formData.set("enBody", "Body");

    const input = await parseAdminPostFormWithUploads(formData);

    expect(input.coverMedia).toBe("uploaded-cover");
    expect(input.videoMedia).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      "http://payload.local/api/media",
      expect.objectContaining({
        method: "POST",
        headers: {
          "x-pautalia-internal-secret": "test-secret",
        },
        body: expect.any(FormData),
      }),
    );
  });
});
