import { describe, expect, it } from "vitest";
import { getPublicPost, listPublicPosts } from "@/lib/posts";

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
});
