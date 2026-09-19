import { NextResponse } from "next/server";
import { apiError, handleApiFailure } from "@/lib/api-response";
import { runDiscoveryTurn } from "@/lib/openai/discovery";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  getAssistantMessage,
  getLatestUserTurn,
  loadProfile,
  requireLead,
  saveMessage,
  saveProfile,
} from "@/lib/supabase/leads";
import { discoveryMessageSchema } from "@/lib/validation/schemas";
import { normalizeLocale, type Locale } from "@/lib/i18n/config";

const budgetQuestion = (locale: Locale) => locale === "es"
  ? "¿Qué rango de inversión has reservado para este proyecto?"
  : "What investment range have you set aside for this project?";

export async function POST(request: Request) {
  let locale: Locale = "en";
  try {
    if (!(await enforceRateLimit(request, "discovery-message", 12))) return apiError("Too many attempts. Please wait a moment.", 429);
    if (Number(request.headers.get("content-length") || 0) > 12_000) return apiError("Request is too large.", 413);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError("Invalid request.", 400);
    }
    if (body && typeof body === "object" && "locale" in body) locale = normalizeLocale(body.locale);
    const parsed = discoveryMessageSchema.safeParse(body);
    if (!parsed.success) return apiError(locale === "es" ? "Proporciona una respuesta válida." : "Please provide a valid response.", 400);

    const { leadId, turn, message } = parsed.data;
    const lead = await requireLead(leadId);
    if (!lead) return apiError(locale === "es" ? "No se ha encontrado el diagnóstico." : "Assessment not found.", 404);
    if (["qualified", "review", "nurture"].includes(lead.status)) return apiError(locale === "es" ? "Este diagnóstico ya está completado." : "This assessment is already complete.", 409);

    const latestUserTurn = await getLatestUserTurn(leadId);
    if (turn > latestUserTurn + 1) return apiError(locale === "es" ? "Completa primero el paso actual." : "Please complete the current step first.", 409);

    if (turn <= latestUserTurn) {
      const cached = await getAssistantMessage(leadId, turn + 1);
      if (cached) {
        return NextResponse.json({
          nextTurn: turn + 1,
          interaction: turn === 4 ? "budget" : "text",
          question: cached,
        });
      }
    }

    await saveMessage(leadId, turn, "user", message);
    const profile = await loadProfile(leadId);
    const result = await runDiscoveryTurn({ turn, profile, latestAnswer: message, locale });
    await saveProfile(result.profile);

    const question = turn === 4 ? budgetQuestion(locale) : result.next_question!;
    await saveMessage(leadId, turn + 1, "assistant", question);

    return NextResponse.json({
      nextTurn: turn + 1,
      interaction: turn === 4 ? "budget" : "text",
      question,
    });
  } catch (error) {
    return handleApiFailure(error, locale);
  }
}
