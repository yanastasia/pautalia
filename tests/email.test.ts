import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

describe("lead email notifications", () => {
  beforeEach(() => {
    vi.resetModules();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
  });

  it("always sends lead notifications to the sales inbox", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        POSTMARK_SERVER_TOKEN: "test-postmark-token",
        EMAIL_FROM: "Pautalia Residence <sales@pautalia.com>",
      },
    }));

    const { sendLeadEmails } = await import("@/lib/email");

    await sendLeadEmails({
      leadId: "lead-1",
      fullName: "Test Buyer",
      email: "buyer@example.com",
      phone: "+359888000123",
      unitCode: "B-AP.03",
      sourcePageUrl: "/units/b-ap.03",
      message: "I would like more details.",
    });

    const payloads = fetchMock.mock.calls.map(([, init]) => JSON.parse(String((init as RequestInit).body)));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.postmarkapp.com/email",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Postmark-Server-Token": "test-postmark-token",
        }),
      }),
    );
    expect(payloads.map((payload) => payload.To)).toEqual([
      "buyer@example.com",
      "sales@pautalia.com",
    ]);
    expect(payloads.map((payload) => payload.Subject)).toEqual([
      "[INQUIRY] Your Pautalia enquiry was received",
      "[ADMIN][INQUIRY] B-AP.03 - New lead from Test Buyer",
    ]);
    expect(payloads.map((payload) => payload.Tag)).toEqual(["inquiry", "admin-inquiry"]);
  });
});
