import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { getPortfolioProjects } from "@/content/portfolio";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "es" ? "Portafolio" : "Portfolio",
    description: locale === "es"
      ? "Estructuras de portafolio de BRANT·CO para crecimiento, operaciones comerciales, automatización e informes."
      : "BRANT·CO portfolio structures for growth systems, sales operations, automation and reporting.",
    alternates: { canonical: "/portafolio" },
  };
}

const copy = {
  en: {
    eyebrow: "Portfolio / Systems in context", title: "Show the system. Explain the change.",
    intro: "Each case study is structured around the before-state, operating problem, implemented system and verified outcome.",
    categories: ["Growth Systems", "Sales Operations", "Automation", "Web Development", "Custom Software", "Data / Reporting"],
    categoriesLabel: "Portfolio categories", before: "BEFORE / PROBLEM", after: "SOLUTION / AFTER",
    placeholder: "Editorial placeholder: replace with an approved project, client context and verified outcomes in content/portfolio.ts.",
    current: "YOUR CURRENT STATE", cta: "The next useful case starts with a precise problem.", assessment: "Start the assessment",
  },
  es: {
    eyebrow: "Portafolio / Sistemas en contexto", title: "Muestra el sistema. Explica el cambio.",
    intro: "Cada caso se estructura alrededor del estado inicial, el problema operativo, el sistema implementado y el resultado verificado.",
    categories: ["Sistemas de Crecimiento", "Operaciones Comerciales", "Automatización", "Desarrollo Web", "Software a Medida", "Datos / Informes"],
    categoriesLabel: "Categorías del portafolio", before: "ANTES / PROBLEMA", after: "SOLUCIÓN / DESPUÉS",
    placeholder: "Contenido editorial provisional: sustituir por un proyecto aprobado, su contexto y resultados verificados en content/portfolio.ts.",
    current: "TU ESTADO ACTUAL", cta: "El próximo caso útil comienza con un problema preciso.", assessment: "Iniciar diagnóstico",
  },
} as const;

export default async function PortfolioPage() {
  const locale = await getLocale();
  const text = copy[locale];
  const portfolioProjects = getPortfolioProjects(locale);

  return (
    <main id="main-content" className="pt-[var(--header-height)]">
      <section className="section-shell border-b border-white/10">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div><p className="eyebrow">{text.eyebrow}</p><h1 className="page-title">{text.title}</h1></div>
          <p className="body-large">{text.intro}</p>
        </div>
      </section>

      <section className="section-shell bg-[#080808]">
        <div className="container-shell">
          <div className="mb-10 flex flex-wrap gap-2" aria-label={text.categoriesLabel}>
            {text.categories.map((category) => <span className="border border-white/12 px-3 py-2 text-xs font-medium text-white/55" key={category}>{category}</span>)}
          </div>

          <div className="grid gap-5">
            {portfolioProjects.map((project, index) => (
              <article className="grid overflow-hidden border border-white/10 bg-[#121212] lg:grid-cols-[0.7fr_1.3fr]" key={project.slug}>
                <div className="relative min-h-64 overflow-hidden border-b border-white/10 bg-black p-7 lg:min-h-[30rem] lg:border-r lg:border-b-0">
                  <div aria-hidden="true" className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:44px_44px]" />
                  <div className="relative flex h-full flex-col justify-between">
                    <span className="text-xs font-medium tracking-[0.16em] text-[#D85C5C]">SYSTEM / {String(index + 1).padStart(3, "0")}</span>
                    <div className="grid gap-2">
                      {project.technologies?.map((technology, techIndex) => (
                        <div className="flex items-center gap-3" key={technology}>
                          <span className={`size-2 rounded-full ${techIndex === 0 ? "bg-[#A20000]" : "border border-white/30"}`} />
                          <span className="text-xs tracking-[0.12em] text-white/55">{technology.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-7 sm:p-10 lg:p-12">
                  <div className="flex flex-wrap gap-2 text-xs font-medium tracking-[0.12em] text-[#D85C5C]">{project.category.map((category) => <span key={category}>{category.toUpperCase()}</span>)}</div>
                  <h2 className="mt-7 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{project.title}</h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">{project.shortDescription}</p>
                  <dl className="mt-9 grid gap-7 border-t border-white/10 pt-8 sm:grid-cols-2">
                    <div><dt className="text-xs font-medium tracking-[0.15em] text-white/40">{text.before}</dt><dd className="mt-3 text-sm leading-7 text-white/65">{project.problem}</dd></div>
                    <div><dt className="text-xs font-medium tracking-[0.15em] text-white/40">{text.after}</dt><dd className="mt-3 text-sm leading-7 text-white/65">{project.solution}</dd></div>
                  </dl>
                  <p className="mt-9 border-l-2 border-[#A20000] pl-4 text-xs leading-6 text-white/45">{text.placeholder}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-[#A20000]">
        <div className="container-shell flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="mb-5 text-xs font-medium tracking-[0.18em] text-white/70">{text.current}</p><h2 className="section-title">{text.cta}</h2></div>
          <ButtonLink href="/forms">{text.assessment} <span aria-hidden="true">→</span></ButtonLink>
        </div>
      </section>
    </main>
  );
}
