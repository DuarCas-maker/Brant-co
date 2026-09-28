import { NextResponse } from "next/server";
import { apiError, handleApiFailure } from "@/lib/api-response";
import { getInitialDiagnosisQuestion } from "@/content/diagnosis";
import { createDiagnosis } from "@/lib/openai/diagnosis";
import { enforceRateLimit } from "@/lib/rate-limit";
import { loadCompletedAssessment, loadDiagnosisResult, loadMessages, requireLead, saveDiagnosisResult, saveMessage } from "@/lib/supabase/leads";
import { diagnosisMessageSchema } from "@/lib/validation/schemas";
import { normalizeLocale, type Locale } from "@/lib/i18n/config";

export async function POST(request: Request) {
  let locale: Locale = "en";
  try {
    if (!(await enforceRateLimit(request, "diagnosis-message", 14))) return apiError("Too many attempts. Please wait a moment.", 429);
    if (Number(request.headers.get("content-length") || 0) > 5_000) return apiError("Request is too large.", 413);
    let body: unknown;
    try { body = await request.json(); } catch { return apiError("Invalid request.", 400); }
    if (body && typeof body === "object" && "locale" in body) locale = normalizeLocale(body.locale);
    const parsed = diagnosisMessageSchema.safeParse(body);
    if (!parsed.success) return apiError(locale === "es" ? "Revisa el mensaje." : "Please check the message.", 400);
    const { leadId, turn, start, message } = parsed.data;
    if (!(await requireLead(leadId))) return apiError(locale === "es" ? "No encontramos el formulario." : "Form not found.", 404);
    const assessment = await loadCompletedAssessment(leadId);
    if (!assessment) return apiError(locale === "es" ? "Completa primero las cinco preguntas." : "Complete the five questions first.", 409);

    const completedDiagnosis = await loadDiagnosisResult(leadId);
    if (completedDiagnosis) return NextResponse.json({ complete: true, ...completedDiagnosis });

    let messages = await loadMessages(leadId);
    if (start) {
      const existing = messages.find((item) => item.role === "assistant" && item.turn_number === 1);
      if (existing) return NextResponse.json({ complete: false, question: existing.content, turn: 1 });
      const question = getInitialDiagnosisQuestion(locale, assessment.answers);
      await saveMessage(leadId, 1, "assistant", question);
      return NextResponse.json({ complete: false, question, turn: 1 });
    } else if (message) {
      if (turn === 1 && !messages.some((item) => item.role === "assistant" && item.turn_number === 1)) {
        await saveMessage(leadId, 1, "assistant", getInitialDiagnosisQuestion(locale, assessment.answers));
      }
      await saveMessage(leadId, turn, "user", message);
      messages = await loadMessages(leadId);
    }

    const result = await createDiagnosis(assessment.answers, messages, locale, start ? 0 : turn);
    if (result.complete && result.summary) {
      await saveDiagnosisResult(leadId, result.summary, result.primaryRecommendation, result.secondaryRecommendations);
      return NextResponse.json({ complete: true, summary: result.summary, primaryService: result.primaryRecommendation, secondaryServices: result.secondaryRecommendations });
    }

    const nextTurn = start ? 1 : turn + 1;
    await saveMessage(leadId, nextTurn, "assistant", result.nextQuestion!);
    return NextResponse.json({ complete: false, question: result.nextQuestion, turn: nextTurn });
  } catch (error) { return handleApiFailure(error, locale); }
}
