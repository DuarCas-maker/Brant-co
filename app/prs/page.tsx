import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { getPrsContent } from "@/content/prs";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: "PRS",
    description: locale === "es" ? "PRS en BRANT·CO. El contenido comercial definitivo está pendiente de definición." : "PRS at BRANT·CO. Final commercial content is pending definition.",
    alternates: { canonical: "/prs" },
  };
}

export default async function PrsPage() {
  const locale = await getLocale();
  const prsContent = getPrsContent(locale);
  return (
    <main id="main-content" className="min-h-screen pt-[var(--header-height)]">
      <section className="section-shell">
        <div className="container-shell">
          <p className="eyebrow">{prsContent.eyebrow}</p>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <h1 className="page-title">{prsContent.title}</h1>
            <div className="border border-white/10 bg-[#121212] p-7 sm:p-10">
              <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-5">
                <span className="text-xs font-medium tracking-[0.15em] text-white/45">{locale === "es" ? "MÓDULO / PENDIENTE" : "MODULE / PENDING"}</span>
                <span className="border border-white/12 px-3 py-1.5 text-xs text-white/50">{prsContent.status}</span>
              </div>
              <p className="max-w-2xl text-xl leading-9 text-white/80">{prsContent.body}</p>
              <div className="mt-10"><ButtonLink href="/forms" variant="brand">{locale === "es" ? "Comenzar el diagnóstico" : "Start with discovery"} <span aria-hidden="true">→</span></ButtonLink></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
