import { NextResponse } from "next/server";
import { apiError, handleApiFailure } from "@/lib/api-response";
import { createEmptyProfile } from "@/lib/openai/discovery-schema";
import { getInitialDiscoveryQuestion } from "@/lib/openai/discovery-prompt";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createLead, saveMessage, saveProfile } from "@/lib/supabase/leads";
import { leadCaptureSchema } from "@/lib/validation/schemas";
import { sendLeadToN8n } from "@/lib/webhooks/n8n";
import { normalizeLocale, type Locale } from "@/lib/i18n/config";

export async function POST(request: Request) {
  let locale: Locale = "en";
  try {
    if (!(await enforceRateLimit(request, "lead-start", 5))) return apiError("Too many attempts. Please wait a moment.", 429);
    if (Number(request.headers.get("content-length") || 0) > 10_000) return apiError("Request is too large.", 413);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError("Invalid request.", 400);
    }
    if (body && typeof body === "object" && "locale" in body) locale = normalizeLocale(body.locale);
    const parsed = leadCaptureSchema.safeParse(body);
    if (!parsed.success) return apiError(locale === "es" ? "Revisa tu nombre, email y número de WhatsApp." : "Please check your name, email and WhatsApp number.", 400);

    const leadId = await createLead(parsed.data);
    await sendLeadToN8n(parsed.data, leadId);
    const initialDiscoveryQuestion = getInitialDiscoveryQuestion(parsed.data.locale);
    await saveProfile(createEmptyProfile(leadId));
    await saveMessage(leadId, 1, "assistant", initialDiscoveryQuestion);

    return NextResponse.json({ leadId, turn: 1, question: initialDiscoveryQuestion });
  } catch (error) {
    return handleApiFailure(error, locale);
  }
}
