import { afterEach, describe, expect, it, vi } from "vitest";
import { sendLeadToN8n } from "@/lib/webhooks/n8n";

const uuid = "550e8400-e29b-41d4-a716-446655440000";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("n8n lead webhook", () => {
  it("posts validated assessment contact data from the server", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await sendLeadToN8n(
      { name: "Alex Rivera", email: "alex@example.com", phone: "+34 600 000 000", idempotencyKey: uuid, locale: "es" },
      uuid,
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://n8n.srv939555.hstgr.cloud/webhook/Recepcion-info-brant");
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toMatchObject({
      event: "assessment_started",
      leadId: uuid,
      idempotencyKey: uuid,
      locale: "es",
      name: "Alex Rivera",
      email: "alex@example.com",
      whatsapp: "+34 600 000 000",
    });
  });
});
