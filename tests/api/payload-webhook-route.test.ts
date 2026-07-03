import { describe, expect, it, vi } from "vitest";

const revalidatePathMock = vi.hoisted(() => vi.fn());
const revalidateTagMock = vi.hoisted(() => vi.fn());

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
  revalidateTag: revalidateTagMock,
}));

describe("payload webhook route", () => {
  it("revalidates public inventory, content tags, and static pages", async () => {
    const { POST } = await import("@/app/api/webhooks/payload/route");

    const response = await POST(new Request("http://localhost/api/webhooks/payload"));

    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(response.status).toBe(200);
    expect(revalidateTagMock).toHaveBeenCalledWith("pautalia:inventory");
    expect(revalidateTagMock).toHaveBeenCalledWith("pautalia:buildings");
    expect(revalidateTagMock).toHaveBeenCalledWith("pautalia:units");
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(revalidatePathMock).toHaveBeenCalledWith("/project");
    expect(revalidatePathMock).toHaveBeenCalledWith("/terms");
  });
});
