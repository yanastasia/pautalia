import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PostVideo } from "@/components/news/post-video";
import { getPublicPost, listPublicPosts } from "@/lib/posts";

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.PAYLOAD_INTERNAL_URL;
});

describe("public posts", () => {
  it("lists published posts only", async () => {
    const response = await listPublicPosts("bg", {});

    expect(response.items).toHaveLength(1);
    expect(response.items[0].slug).toBe("construction-update-residence-may-2026");
    expect(response.items[0].status).toBe("published");
  });

  it("localizes published posts", async () => {
    const bg = await getPublicPost("bg", "construction-update-residence-may-2026");
    const en = await getPublicPost("en", "construction-update-residence-may-2026");

    expect(bg.translation.title).toBe("Напредък по Резиденс");
    expect(en.translation.title).toBe("Residence Progress Update");
  });

  it("does not expose draft posts", async () => {
    await expect(getPublicPost("bg", "draft-park-launch-note")).rejects.toThrow("Post not found");
  });

  it("filters posts by category and building", async () => {
    const response = await listPublicPosts("en", {
      category: "construction_update",
      building: "residence",
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].building?.name).toBe("Residence");
  });

  it("maps connected translations, uploaded images, and uploaded video from Payload", async () => {
    process.env.PAYLOAD_INTERNAL_URL = "https://cms.pautalia.com";
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({
      docs: [{
        id: "post-1",
        slug: "bilingual-media-update",
        status: "published",
        category: "news",
        publishedAt: "2026-06-11T09:00:00.000Z",
        coverMedia: { url: "https://cms.pautalia.com/media/cover.webp", alt: "Construction site", mimeType: "image/webp" },
        galleryMedia: [{ url: "https://cms.pautalia.com/media/gallery.webp", alt: "Building progress", mimeType: "image/webp" }],
        videoMedia: { url: "https://cms.pautalia.com/media/progress.mp4", alt: "Progress video", mimeType: "video/mp4" },
        translations: {
          bg: {
            title: "Двуезична актуализация",
            excerpt: "Българско резюме",
            body: "Българско съдържание",
          },
          en: {
            title: "Bilingual update",
            excerpt: "English summary",
            body: "English content",
          },
        },
      }],
      totalDocs: 1,
      totalPages: 1,
    })));

    const bg = await listPublicPosts("bg", {});
    const en = await listPublicPosts("en", {});

    expect(bg.items[0].slug).toBe(en.items[0].slug);
    expect(bg.items[0].translation.title).toBe("Двуезична актуализация");
    expect(en.items[0].translation.title).toBe("Bilingual update");
    expect(en.items[0].coverImage).toBe("https://cms.pautalia.com/media/cover.webp");
    expect(en.items[0].gallery).toEqual([{ src: "https://cms.pautalia.com/media/gallery.webp", alt: "Building progress" }]);
    expect(en.items[0].videoMedia).toEqual({ src: "https://cms.pautalia.com/media/progress.mp4", mimeType: "video/mp4" });
  });

  it("renders uploaded video with native playback controls", () => {
    vi.stubGlobal("React", React);
    const html = renderToStaticMarkup(React.createElement(PostVideo, {
      uploadedVideo: { src: "https://cms.pautalia.com/media/progress.mp4", mimeType: "video/mp4" },
      title: "Progress video",
    }));

    expect(html).toContain("<video");
    expect(html).toContain("controls");
    expect(html).toContain('src="https://cms.pautalia.com/media/progress.mp4"');
    expect(html).toContain('type="video/mp4"');
  });
});
