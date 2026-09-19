import type { Metadata } from "next";
import { DiscoveryExperience } from "@/components/forms/discovery-experience";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "es" ? "Diagnóstico con IA" : "AI Discovery",
    description: locale === "es" ? "Explica tu problema empresarial actual en una conversación de diagnóstico de cinco pasos con BRANT·CO." : "Explain your current business problem in a concise five-step discovery conversation with BRANT·CO.",
    alternates: { canonical: "/forms" },
  };
}

export default async function FormsPage() {
  const locale = await getLocale();
  return (
    <main id="main-content" className="min-h-screen pt-[var(--header-height)]">
      <section className="section-shell relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="container-shell relative">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="eyebrow">{locale === "es" ? "Diagnóstico con IA / Máximo cinco turnos" : "AI Discovery / Five turns maximum"}</p>
            <h1 className="page-title mx-auto">{locale === "es" ? "Empieza por lo que ocurre ahora." : "Start with what is happening now."}</h1>
            <p className="body-large mx-auto mt-6">{locale === "es" ? "No necesitas elegir un servicio. Describe el problema operativo y el sistema identificará la dirección más relevante." : "You do not need to choose a service. Describe the operating problem and the system will identify the most relevant direction."}</p>
          </div>
          <DiscoveryExperience locale={locale} />
        </div>
      </section>
    </main>
  );
}
