import { NextResponse } from "next/server";
import { ConfigurationError } from "@/lib/env";
import { DiscoveryProviderError } from "@/lib/openai/discovery";
import type { Locale } from "@/lib/i18n/config";
import { LeadWebhookError } from "@/lib/webhooks/n8n";

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiFailure(error: unknown, locale: Locale = "en") {
  if (error instanceof ConfigurationError) {
    return apiError(locale === "es" ? "El diagnóstico todavía no está configurado. Contacta con BRANT·CO." : "The assessment is not configured yet. Please contact BRANT·CO.", 503);
  }
  if (error instanceof DiscoveryProviderError) {
    return apiError(locale === "es" ? "No hemos podido procesar esa respuesta ahora. Tu respuesta está guardada; inténtalo de nuevo." : "We couldn't process that response right now. Your answer is safe—please retry.", 503);
  }
  if (error instanceof LeadWebhookError) {
    return apiError(locale === "es" ? "No hemos podido enviar tu información. Inténtalo de nuevo." : "We couldn't send your information. Please try again.", 503);
  }
  console.error("API request failed", { errorType: error instanceof Error ? error.name : "unknown" });
  return apiError(locale === "es" ? "No hemos podido completar la solicitud. Inténtalo de nuevo." : "We couldn't complete that request. Please try again.", 500);
}
