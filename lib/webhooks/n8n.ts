import type { LeadCaptureInput } from "@/lib/validation/schemas";

const defaultWebhookUrl = "https://n8n.srv939555.hstgr.cloud/webhook/Recepcion-info-brant";

export class LeadWebhookError extends Error {
  constructor() {
    super("Lead webhook delivery failed.");
    this.name = "LeadWebhookError";
  }
}

export async function sendLeadToN8n(input: LeadCaptureInput, leadId: string) {
  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL?.trim() || defaultWebhookUrl;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event: "assessment_started",
        source: "brantco_website",
        leadId,
        idempotencyKey: input.idempotencyKey,
        locale: input.locale,
        name: input.name,
        email: input.email,
        whatsapp: input.phone,
        receivedAt: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      console.error("Lead webhook request failed", { status: response.status });
      throw new LeadWebhookError();
    }
  } catch (error) {
    if (error instanceof LeadWebhookError) throw error;
    console.error("Lead webhook request failed", { errorType: error instanceof Error ? error.name : "unknown" });
    throw new LeadWebhookError();
  }
}
