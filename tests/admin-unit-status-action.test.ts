import { beforeEach, describe, expect, it, vi } from "vitest";
import { unauthorizedError } from "@/lib/errors";

const mocks = vi.hoisted(() => ({
  requireAdminSession: vi.fn(), updateAdminUnitStatus: vi.fn(), revalidateAdminCrm: vi.fn(),
}));
vi.mock("@/lib/admin-api", () => ({ requireAdminSession: mocks.requireAdminSession }));
vi.mock("@/lib/admin-data", () => ({
  adminUnitStatuses: ["available", "reserved", "sold"],
  updateAdminUnitStatus: mocks.updateAdminUnitStatus, revalidateAdminCrm: mocks.revalidateAdminCrm,
}));
import { saveAdminUnitStatus } from "@/lib/admin-unit-status-action";

function submission(status = "reserved") {
  const data = new FormData();
  data.set("id", "a-204");
  data.set("status", status);
  return data;
}

describe("admin availability form action", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it.each(["available", "reserved", "sold"])("returns the persisted %s selection after saving", async (status) => {
    const result = await saveAdminUnitStatus({ result: "idle" }, submission(status));
    expect(mocks.updateAdminUnitStatus).toHaveBeenCalledWith("a-204", status);
    expect(result).toEqual({ result: "saved", status });
    expect(mocks.revalidateAdminCrm).toHaveBeenCalledOnce();
  });

  it("reports failed writes without claiming success", async () => {
    mocks.updateAdminUnitStatus.mockRejectedValueOnce(new Error("Database unavailable"));
    expect(await saveAdminUnitStatus({ result: "idle" }, submission())).toEqual({ result: "error" });
    expect(mocks.revalidateAdminCrm).not.toHaveBeenCalled();
  });

  it("rejects invalid statuses", async () => {
    expect(await saveAdminUnitStatus({ result: "idle" }, submission("invalid"))).toEqual({ result: "error" });
    expect(mocks.updateAdminUnitStatus).not.toHaveBeenCalled();
  });

  it("requires an authenticated admin before saving", async () => {
    mocks.requireAdminSession.mockRejectedValueOnce(unauthorizedError());
    await expect(saveAdminUnitStatus({ result: "idle" }, submission())).rejects.toMatchObject({ status: 401 });
    expect(mocks.updateAdminUnitStatus).not.toHaveBeenCalled();
  });
});
