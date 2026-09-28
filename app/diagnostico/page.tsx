import type { Metadata } from "next";
import { GuidedAssessment } from "@/components/forms/guided-assessment";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: locale === "es" ? "Diagnóstico" : "Assessment", description: locale === "es" ? "Un diagnóstico guiado que parte de las respuestas de tu formulario." : "A guided assessment based on your form answers.", alternates: { canonical: "/diagnostico" } };
}

export default async function DiagnosisPage() {
  const locale = await getLocale();
  return <main id="main-content" className="min-h-screen pt-[var(--header-height)]"><section className="section-shell"><div className="container-shell"><GuidedAssessment locale={locale} /></div></section></main>;
}
