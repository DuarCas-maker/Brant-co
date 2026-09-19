import { NextResponse } from "next/server";
import { apiError, handleApiFailure } from "@/lib/api-response";
import { getBookingUrl } from "@/content/site";
import { finalizeDiscoveryProfile } from "@/lib/openai/discovery";
import { calculateOpportunityScore, determineQualification, isBookingAllowed } from "@/lib/qualification/scoring";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  completeLead,
  loadCompletedAssessment,
  loadProfile,
  requireLead,
  saveProfile,
} from "@/lib/supabase/leads";
import { finalizeDiscoverySchema } from "@/lib/validation/schemas";
import type { DiscoveryProfile } from "@/lib/openai/discovery-schema";
import type { QualificationStatus, PublicAssessmentResult } from "@/types/discovery";
import { normalizeLocale, type Locale } from "@/lib/i18n/config";

const serviceLabelsEs: Record<string, string> = {
  "Growth & Content Systems": "Sistemas de Crecimiento y Contenido",
  "Marketing & Sales Operations": "Operaciones de Marketing y Ventas",
  "Automation & Integrations": "Automatización e Integraciones",
  "Integrated Growth System": "Sistema Integrado de Crecimiento",
  "Special Software Project": "Proyecto de Software Especial",
  "Unclear / Needs Discovery": "Diagnóstico adicional",
};

function publicResult(profile: DiscoveryProfile, status: QualificationStatus, locale: Locale): PublicAssessmentResult {
  const qualified = status === "qualified";
  const potentialFocusEn = profile.service_fit.primary === "Unclear / Needs Discovery"
    ? "Further discovery"
    : [profile.service_fit.primary, ...profile.service_fit.secondary.slice(0, 1)].join(" + ");
  const potentialFocus = locale === "es"
    ? (profile.service_fit.primary === "Unclear / Needs Discovery"
        ? "Diagnóstico adicional"
        : [profile.service_fit.primary, ...profile.service_fit.secondary.slice(0, 1)].map((item) => serviceLabelsEs[item] || item).join(" + "))
    : potentialFocusEn;
  const message = locale === "es"
    ? (qualified
        ? "Según lo que has compartido, parece existir una oportunidad para mejorar cómo tus sistemas actuales apoyan el crecimiento y las operaciones."
        : "Hemos recibido tu información y nuestro equipo revisará el proyecto. Nos pondremos en contacto contigo por WhatsApp o email con los siguientes pasos.")
    : (qualified
        ? "Based on what you've shared, there appears to be an opportunity to improve how your current systems support growth and operations."
        : "We've received your information and our team will review your project. We'll be in touch via WhatsApp or email with the next steps.");
  return {
    status,
    potentialFocus,
    message,
    bookingUrl: isBookingAllowed(profile, status) ? getBookingUrl() : null,
  };
}

export async function POST(request: Request) {
  let locale: Locale = "en";
  try {
    if (!(await enforceRateLimit(request, "discovery-finalize", 6))) return apiError("Too many attempts. Please wait a moment.", 429);
    if (Number(request.headers.get("content-length") || 0) > 8_000) return apiError("Request is too large.", 413);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError("Invalid request.", 400);
    }
    if (body && typeof body === "object" && "locale" in body) locale = normalizeLocale(body.locale);
    const parsed = finalizeDiscoverySchema.safeParse(body);
    if (!parsed.success) return apiError(locale === "es" ? "Elige un rango de inversión para continuar." : "Choose a budget range to continue.", 400);

    const { leadId, budgetRange } = parsed.data;
    if (!(await requireLead(leadId))) return apiError(locale === "es" ? "No se ha encontrado el diagnóstico." : "Assessment not found.", 404);

    const completed = await loadCompletedAssessment(leadId);
    if (completed) return NextResponse.json(publicResult(completed.profile, completed.status, locale));

    const currentProfile = await loadProfile(leadId);
    const profileWithBudget = {
      ...currentProfile,
      qualification: { ...currentProfile.qualification, budget_range: budgetRange },
    };
    await saveProfile(profileWithBudget);

    const finalProfile = await finalizeDiscoveryProfile(currentProfile, budgetRange, locale);
    const score = calculateOpportunityScore(finalProfile);
    const status = determineQualification(finalProfile, score.total);
    await saveProfile(finalProfile, { score, status });
    await completeLead(leadId, status, score.total);

    return NextResponse.json(publicResult(finalProfile, status, locale));
  } catch (error) {
    return handleApiFailure(error, locale);
  }
}
