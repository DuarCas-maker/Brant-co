import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { GrowthCore } from "@/components/sections/growth-core";
import { SystemMap } from "@/components/sections/system-map";
import { getPortfolioProjects } from "@/content/portfolio";
import { getSiteConfig } from "@/content/site";
import { getLocale } from "@/lib/i18n/server";
import styles from "./home.module.css";

const copy = {
  en: {
    hero: "We build the systems behind business growth.",
    heroLines: ["We build the", "systems behind", "business", "growth."],
    heroBody: "We connect marketing, sales operations and automation so your business can grow with less manual work.",
    need: "Tell us what you need",
    explore: "Explore our services",
    growthTitle: "One connected path from attention to operation.",
    growthTitleLines: ["One connected", "path from", "attention to", "operation."],
    growthStatement: "Three areas. One system.",
    allServices: "See all services",
    breaksEyebrow: "Where growth breaks",
    breaksTitle: "Growth breaks when your systems don't connect.",
    breaksBody: "Friction rarely lives in one tool. It appears in the handoffs between channels, people, data and decisions.",
    workEyebrow: "How we work",
    workTitle: "Structured from diagnosis to optimization.",
    selected: "Selected systems",
    proof: "Proof needs context, not inflated claims.",
    portfolio: "View portfolio",
    pending: "CASE STRUCTURE / CONTENT PENDING",
    start: "START WITH THE PROBLEM",
    cta: "Tell us what's happening. We'll help determine what system needs to change.",
    assessment: "Start the assessment",
  },
  es: {
    hero: "Construimos los sistemas que impulsan el crecimiento empresarial.",
    heroLines: ["Construimos", "los sistemas", "que impulsan", "el crecimiento", "empresarial."],
    heroBody: "Conectamos marketing, operaciones comerciales y automatización para que tu empresa crezca con menos trabajo manual.",
    need: "Cuéntanos qué necesitas",
    explore: "Explora nuestros servicios",
    growthTitle: "Un recorrido conectado desde la atención hasta la operación.",
    growthTitleLines: ["Un recorrido", "conectado", "desde la", "atención hasta", "la operación."],
    growthStatement: "Tres áreas. Un sistema.",
    allServices: "Ver todos los servicios",
    breaksEyebrow: "Dónde se frena el crecimiento",
    breaksTitle: "El crecimiento se rompe cuando tus sistemas no están conectados.",
    breaksBody: "La fricción rara vez vive en una sola herramienta. Aparece en los traspasos entre canales, personas, datos y decisiones.",
    workEyebrow: "Cómo trabajamos",
    workTitle: "Estructurados desde el diagnóstico hasta la optimización.",
    selected: "Sistemas seleccionados",
    proof: "La evidencia necesita contexto, no promesas infladas.",
    portfolio: "Ver portafolio",
    pending: "ESTRUCTURA DE CASO / CONTENIDO PENDIENTE",
    start: "EMPIEZA POR EL PROBLEMA",
    cta: "Cuéntanos qué está pasando. Te ayudaremos a determinar qué sistema necesita cambiar.",
    assessment: "Iniciar diagnóstico",
  },
} as const;

export default async function HomePage() {
  const locale = await getLocale();
  const text = copy[locale];
  const siteConfig = getSiteConfig(locale);
  const portfolioProjects = getPortfolioProjects(locale);

  return (
    <main id="main-content">
      <section className={styles.hero}>
        <div aria-hidden="true" className={styles.fineGrid} />
        <div aria-hidden="true" className={styles.largeGrid} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={`eyebrow ${styles.eyebrow}`}>Digital Growth Systems</p>
            <h1 aria-label={text.hero} className={`display-title ${styles.title}`} data-locale={locale}>
              {text.heroLines.map((line) => <span aria-hidden="true" className={styles.titleLine} key={line}>{line}</span>)}
            </h1>
            <p className={`body-large mt-7 ${styles.body}`}>{text.heroBody}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/forms">{text.need} <span aria-hidden="true">→</span></ButtonLink>
              <ButtonLink href="/servicios" variant="secondary">{text.explore}</ButtonLink>
            </div>
            <div aria-hidden="true" className={styles.trustLine}>
              <span>MARKETING</span><span>SALES</span><span>OPERATIONS</span>
            </div>
          </div>

          <div className={styles.visual}>
            <GrowthCore locale={locale} />
          </div>
        </div>
      </section>

      <section className={`section-shell ${styles.growthSection}`} id="growth-system">
        <div aria-hidden="true" className={styles.growthSectionGrid} />
        <div className={`container-shell ${styles.growthSectionInner}`}>
          <div className={styles.growthIntro}>
            <h2 aria-label={text.growthTitle} className={styles.growthHeading}>
              {text.growthTitleLines.map((line) => <span aria-hidden="true" key={line}>{line}</span>)}
            </h2>
            <p className={styles.growthStatement}>{text.growthStatement}</p>
            <div aria-hidden="true" className={styles.growthOrbital}>
              <span className={styles.growthGlow} />
              <span className={`${styles.growthOrbit} ${styles.growthOrbitOuter}`} />
              <span className={`${styles.growthOrbit} ${styles.growthOrbitMiddle}`} />
              <span className={`${styles.growthOrbit} ${styles.growthOrbitInner}`} />
              <span className={styles.growthOrbitalPoint} />
            </div>
          </div>
          <SystemMap locale={locale} />
          <Link className={styles.growthCta} href="/servicios">
            {text.allServices} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="inverted section-shell">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">
            <div><p className="eyebrow !text-[#A20000]">{text.breaksEyebrow}</p><h2 className="section-title">{text.breaksTitle}</h2></div>
            <p className="body-large muted-on-light lg:pt-3">{text.breaksBody}</p>
          </div>
          <div className="mt-14 grid border-l border-t border-black/15 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.problems.map((problem, index) => (
              <article className="min-h-36 border-b border-r border-black/15 p-6 sm:p-8" key={problem}>
                <p className="text-xs font-medium text-[#A20000]">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-7 max-w-[18rem] text-lg font-semibold leading-snug tracking-[-0.025em]">{problem}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-[#080808]">
        <div className="container-shell">
          <p className="eyebrow">{text.workEyebrow}</p>
          <h2 className="section-title">{text.workTitle}</h2>
          <ol className="mt-14 grid border-t border-white/12 lg:grid-cols-5">
            {siteConfig.process.map((step, index) => (
              <li className="border-b border-white/12 py-7 first:lg:pl-0 last:lg:border-r-0 lg:border-b-0 lg:border-r lg:px-6" key={step.name}>
                <p className="text-xs font-medium text-[#D85C5C]">0{index + 1}</p>
                <h3 className="mt-6 text-lg font-semibold">{step.name}</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-shell border-y border-white/10 bg-black">
        <div className="container-shell">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="eyebrow">{text.selected}</p><h2 className="section-title">{text.proof}</h2></div>
            <ButtonLink href="/portafolio" variant="secondary">{text.portfolio}</ButtonLink>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {portfolioProjects.map((project) => (
              <article className="group flex min-h-80 flex-col justify-between border border-white/10 bg-[#121212] p-7 transition-colors hover:border-white/20 hover:bg-[#1C1C1C]" key={project.slug}>
                <div>
                  <div className="flex flex-wrap gap-2 text-xs font-medium tracking-[0.1em] text-[#D85C5C]">{project.category.map((category) => <span key={category}>{category.toUpperCase()}</span>)}</div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-[-0.035em]">{project.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/55">{project.shortDescription}</p>
                </div>
                <p className="mt-10 text-xs font-medium text-white/40">{text.pending}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell bg-[#A20000]">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="mb-5 text-xs font-medium tracking-[0.18em] text-white/70">{text.start}</p><h2 className="section-title max-w-[22ch]">{text.cta}</h2></div>
          <ButtonLink href="/forms">{text.assessment} <span aria-hidden="true">→</span></ButtonLink>
        </div>
      </section>
    </main>
  );
}
