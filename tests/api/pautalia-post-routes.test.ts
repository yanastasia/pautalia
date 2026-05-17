import { describe, expect, it } from "vitest";
import { GET as postRoute } from "@/app/api/pautalia/posts/[slug]/route";
import { GET as postsRoute } from "@/app/api/pautalia/posts/route";

describe("pautalia post api routes", () => {
  it("lists published posts", async () => {
    const response = await postsRoute(new Request("http://localhost:3000/api/pautalia/posts?locale=en"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0].slug).toBe("construction-update-residence-may-2026");
  });

  it("returns one published post", async () => {
    const response = await postRoute(
      new Request("http://localhost:3000/api/pautalia/posts/construction-update-residence-may-2026?locale=en"),
      { params: Promise.resolve({ slug: "construction-update-residence-may-2026" }) },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.item.translation.title).toBe("Residence Progress Update");
  });

  it("returns 404 for draft posts", async () => {
    const response = await postRoute(
      new Request("http://localhost:3000/api/pautalia/posts/draft-park-launch-note"),
      { params: Promise.resolve({ slug: "draft-park-launch-note" }) },
    );

    expect(response.status).toBe(404);
  });
});
