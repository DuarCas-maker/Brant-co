import type { Metadata } from "next";
import { PortfolioGallery } from "@/components/portfolio/portfolio-gallery";
import { ButtonLink } from "@/components/ui/button-link";
import { getPortfolioProjects } from "@/content/portfolio";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: locale === "es" ? "Portafolio" : "Portfolio", description: locale === "es" ? "Una muestra visual de las soluciones que BRANT·CO puede crear." : "A visual sample of the solutions BRANT·CO can create.", alternates: { canonical: "/portafolio" } };
}
export default async function PortfolioPage() {
  const locale = await getLocale();
  const projects = getPortfolioProjects(locale);
  const text = locale === "es"
    ? { title: "Ideas que se pueden ver y entender.", intro: "Estas piezas provisionales muestran la dirección visual de nuestro trabajo. Se reemplazarán por proyectos reales cuando estén aprobados para publicación.", cta: "¿Quieres construir algo así para tu empresa?", action: "Cuéntanos tu reto" }
    : { title: "Ideas you can see and understand.", intro: "These provisional pieces show the visual direction of our work. They will be replaced with real projects once they are approved for publication.", cta: "Want to build something like this for your business?", action: "Tell us your challenge" };
  return (
    <main id="main-content" className="pt-[var(--header-height)]">
      <section className="section-shell border-b border-white/10"><div className="container-shell grid gap-8 lg:grid-cols-[1.1fr_.7fr] lg:items-end"><h1 className="page-title">{text.title}</h1><p className="body-large">{text.intro}</p></div></section>
      <section className="section-shell bg-[#080808]"><div className="container-shell"><PortfolioGallery locale={locale} projects={projects} /></div></section>
      <section className="section-shell bg-[#a20000]"><div className="container-shell flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"><h2 className="section-title max-w-[18ch]">{text.cta}</h2><ButtonLink href="/forms">{text.action} <span aria-hidden="true">→</span></ButtonLink></div></section>
    </main>
  );
}
