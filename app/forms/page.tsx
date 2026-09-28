import type { Metadata } from "next";
import { DiscoveryExperience } from "@/components/forms/discovery-experience";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: locale === "es" ? "Formulario" : "Forms", description: locale === "es" ? "Cuéntanos qué necesitas en cinco preguntas breves." : "Tell us what you need in five short questions.", alternates: { canonical: "/forms" } };
}
export default async function FormsPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [locale, params] = await Promise.all([getLocale(), searchParams]);
  const nextPath = params.next === "/diagnostico" ? "/diagnostico" : undefined;
  return (
    <main id="main-content" className="min-h-screen bg-[#f4f2ee] pt-[var(--header-height)] text-black">
      <section className="section-shell"><div className="container-shell"><div className="mx-auto mb-12 max-w-3xl text-center"><h1 className="page-title mx-auto">{locale === "es" ? "Entendamos qué necesitas." : "Let's understand what you need."}</h1><p className="body-large muted-on-light mx-auto mt-6">{locale === "es" ? "Primero guardamos tus datos de contacto. Después, cinco preguntas breves nos dan el contexto necesario." : "First we save your contact details. Then five short questions give us the context we need."}</p></div><DiscoveryExperience locale={locale} nextPath={nextPath} /></div></section>
    </main>
  );
}
