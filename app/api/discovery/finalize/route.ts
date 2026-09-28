import { NextResponse } from "next/server";
import { apiError, handleApiFailure } from "@/lib/api-response";
import { getBookingUrl } from "@/content/site";
import { calculateOpportunityScore, determineQualification, getServiceRecommendation, isBookingAllowed } from "@/lib/qualification/scoring";
import { enforceRateLimit } from "@/lib/rate-limit";
import { completeLead, loadCompletedAssessment, requireLead, saveQuestionnaireAssessment } from "@/lib/supabase/leads";
import { finalizeDiscoverySchema } from "@/lib/validation/schemas";
import type { Locale } from "@/lib/i18n/config";
import { normalizeLocale } from "@/lib/i18n/config";
import type { QualificationStatus, QuestionnaireAnswers } from "@/types/discovery";

function publicResult(answers: QuestionnaireAnswers, status: QualificationStatus, locale: Locale) {
  const recommendation = getServiceRecommendation(answers);
  const bookingEligible = isBookingAllowed(answers, status);
  const belowMinimum = answers.budgetRange === "less_than_500" || answers.budgetRange === "500_999";
  const message = locale === "es"
    ? belowMinimum
      ? "Por el rango de inversión indicado, te recomendaremos el punto de partida más útil y nuestro equipo se pondrá en contacto contigo."
      : bookingEligible
        ? "Tus respuestas muestran un buen punto de partida. Puedes revisar la recomendación y avanzar a una conversación."
        : "Gracias por el contexto. Revisaremos tus respuestas y te contactaremos con el siguiente paso más útil."
    : belowMinimum
      ? "Based on the investment range you selected, we will recommend the most useful starting point and our team will contact you."
      : bookingEligible
        ? "Your answers show a strong starting point. Review the recommendation and continue to a conversation."
        : "Thanks for the context. We will review your answers and contact you with the most useful next step.";

  return {
    status,
    primaryService: recommendation.primary,
    secondaryServices: recommendation.secondary,
    message,
    bookingEligible,
    bookingUrl: bookingEligible ? getBookingUrl() : null,
    shouldStartDiagnosis: recommendation.primary === "unclear",
  };
}
export async function POST(request: Request) {
  let locale: Locale = "en";
  try {
    if (!(await enforceRateLimit(request, "discovery-finalize", 6))) return apiError("Too many attempts. Please wait a moment.", 429);
    if (Number(request.headers.get("content-length") || 0) > 8_000) return apiError("Request is too large.", 413);
    let body: unknown;
    try { body = await request.json(); } catch { return apiError("Invalid request.", 400); }
    if (body && typeof body === "object" && "locale" in body) locale = normalizeLocale(body.locale);
    const parsed = finalizeDiscoverySchema.safeParse(body);
    if (!parsed.success) return apiError(locale === "es" ? "Responde las cinco preguntas para continuar." : "Answer all five questions to continue.", 400);

    const { leadId, answers } = parsed.data;
    if (!(await requireLead(leadId))) return apiError(locale === "es" ? "No encontramos el formulario." : "Form not found.", 404);
    const completed = await loadCompletedAssessment(leadId);
    if (completed) return NextResponse.json(publicResult(completed.answers, completed.status, locale));

    const score = calculateOpportunityScore(answers);
    const status = determineQualification(answers, score.total);
    await saveQuestionnaireAssessment(leadId, answers, score, status);
    await completeLead(leadId, status, score.total);
    return NextResponse.json(publicResult(answers, status, locale));
  } catch (error) { return handleApiFailure(error, locale); }
}
