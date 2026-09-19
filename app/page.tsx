import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { SystemMap } from "@/components/sections/system-map";
import { getPortfolioProjects } from "@/content/portfolio";
import { getSiteConfig } from "@/content/site";
import { getLocale } from "@/lib/i18n/server";

const copy = {
  en: {
    hero: "We build the systems behind business growth.",
    heroBody: "We connect marketing, sales operations and automation so your business can grow with less manual work.",
    need: "Tell us what you need",
    explore: "Explore our services",
    overview: "Growth system overview",
    connected: "Connected",
    labels: ["MARKETING", "SALES", "OPS"],
    growthEyebrow: "The Growth System",
    growthTitle: "One connected path from attention to operation.",
    growthBody: "The visitor does not need to diagnose the service. Start with the operating problem; we map the system that needs to change.",
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
    heroBody: "Conectamos marketing, operaciones comerciales y automatización para que tu empresa crezca con menos trabajo manual.",
    need: "Cuéntanos qué necesitas",
    explore: "Explora nuestros servicios",
    overview: "Vista general del sistema de crecimiento",
    connected: "Conectado",
    labels: ["MARKETING", "VENTAS", "OPERACIONES"],
    growthEyebrow: "El Sistema de Crecimiento",
    growthTitle: "Un recorrido conectado desde la atención hasta la operación.",
    growthBody: "El visitante no necesita diagnosticar el servicio. Empezamos por el problema operativo y trazamos el sistema que debe cambiar.",
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
      <section className="relative min-h-[min(58rem,100dvh)] overflow-hidden border-b border-white/10 pt-[var(--header-height)]">
        <div aria-hidden="true" className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div aria-hidden="true" className="absolute -right-28 top-1/4 size-[28rem] rounded-full border border-[#A20000]/45 sm:size-[38rem]" />
        <div className="container-shell relative grid min-h-[calc(min(58rem,100dvh)-var(--header-height))] items-center gap-14 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow">Digital Growth Systems</p>
            <h1 className="display-title">{text.hero}</h1>
            <p className="body-large mt-7">{text.heroBody}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/forms">{text.need} <span aria-hidden="true">→</span></ButtonLink>
              <ButtonLink href="/servicios" variant="secondary">{text.explore}</ButtonLink>
            </div>
          </div>

          <div aria-label={text.overview} className="relative border border-white/12 bg-black/80 p-5 sm:p-7">
            <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-medium tracking-[0.15em] text-white/50">SYSTEM / 001</span>
              <span className="flex items-center gap-2 text-xs text-white/55"><span className="size-2 rounded-full bg-[#A20000]" /> {text.connected}</span>
            </div>
            <div className="grid gap-2">
              {(locale === "es" ? ["ATRAER", "CONVERTIR", "AUTOMATIZAR"] : ["ATTRACT", "CONVERT", "AUTOMATE"]).map((stage, index) => (
                <div className="group grid grid-cols-[2.75rem_1fr_auto] items-center gap-4 border border-white/10 bg-[#121212] p-4" key={stage}>
                  <span className="text-xs text-[#D85C5C]">0{index + 1}</span>
                  <span className="text-sm font-semibold tracking-[0.12em]">{stage}</span>
                  <span aria-hidden="true" className="text-[#A20000]">{index === 2 ? "●" : "↓"}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2 text-center text-[0.7rem] font-medium tracking-[0.12em] text-white/35">
              {text.labels.map((label) => <span key={label}>{label}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell bg-[#080808]">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div><p className="eyebrow">{text.growthEyebrow}</p><h2 className="section-title">{text.growthTitle}</h2></div>
            <p className="body-large lg:justify-self-end">{text.growthBody}</p>
          </div>
          <SystemMap locale={locale} />
          <Link className="mt-8 inline-flex items-center gap-2 text-sm font-semibold underline decoration-[#A20000] underline-offset-8" href="/servicios">
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
