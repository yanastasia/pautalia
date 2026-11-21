import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  schema: vi.fn(), findUnique: vi.fn(), update: vi.fn(),
  revalidatePath: vi.fn(), revalidateTag: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({ prisma: {
  $queryRaw: mocks.schema, unit: { findUnique: mocks.findUnique, update: mocks.update },
} }));
vi.mock("@/lib/admin-inventory-seed", () => ({ ensureAdminInventorySeed: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath, revalidateTag: mocks.revalidateTag }));

describe("admin unit availability persistence", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.schema.mockResolvedValue([{ ready: true }]);
    mocks.findUnique.mockResolvedValue({ id: "a-204", status: "available" });
    mocks.update.mockResolvedValue({ id: "a-204", status: "reserved" });
  });

  it.each(["available", "reserved", "sold"] as const)("writes %s to the database", async (status) => {
    const { updateAdminUnitStatus } = await import("@/lib/admin-data");
    await updateAdminUnitStatus("a-204", status);
    expect(mocks.update).toHaveBeenCalledWith({ where: { id: "a-204" }, data: { status } });
  });

  it("rejects a save when only demo inventory is available", async () => {
    mocks.schema.mockResolvedValue([{ ready: false }]);
    const { updateAdminUnitStatus } = await import("@/lib/admin-data");
    await expect(updateAdminUnitStatus("a-204", "sold")).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it("refreshes unit details and public inventory after an update", async () => {
    const { revalidateAdminCrm } = await import("@/lib/admin-data");
    revalidateAdminCrm();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/units/[id]", "page");
    expect(mocks.revalidateTag).toHaveBeenCalledWith("pautalia:inventory");
  });

  it("propagates database failures", async () => {
    mocks.update.mockRejectedValueOnce(new Error("Database unavailable"));
    const { updateAdminUnitStatus } = await import("@/lib/admin-data");
    await expect(updateAdminUnitStatus("a-204", "reserved")).rejects.toThrow("Database unavailable");
  });
});
