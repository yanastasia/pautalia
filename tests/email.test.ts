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
        RESEND_API_KEY: "test-resend-key",
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
      "https://api.resend.com/emails",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-resend-key",
        }),
      }),
    );
    expect(payloads.map((payload) => payload.to)).toEqual([
      "buyer@example.com",
      "sales@pautalia.com",
    ]);
    expect(payloads.map((payload) => payload.subject)).toEqual([
      "Your Pautalia enquiry was received",
      "[ADMIN][INQUIRY] B-AP.03 - New lead from Test Buyer",
    ]);
    expect(payloads.map((payload) => payload.tags[0])).toEqual([
      { name: "category", value: "inquiry" },
      { name: "category", value: "admin-inquiry" },
    ]);
  });
});
