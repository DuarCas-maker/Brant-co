import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { getIntegratedService, getServices } from "@/content/services";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "es" ? "Servicios" : "Services",
    description: locale === "es"
      ? "Sistemas conectados de crecimiento, operaciones comerciales y automatización de BRANT·CO."
      : "Growth & Content Systems, Marketing & Sales Operations, and Automation & Integrations—connected by BRANT·CO.",
    alternates: { canonical: "/servicios" },
  };
}

const copy = {
  en: {
    eyebrow: "Services / Systems",
    title: "Three connected systems. One operating logic.",
    intro: "We design the infrastructure behind demand, conversion and operations—then connect the handoffs that usually break.",
    breaks: "Where the system breaks",
    includes: "What the system can include",
    flow: "Commercial flow",
    flowLabel: "Sales operations flow",
    integrated: "Integrated service",
    question: "Have a more complex system in mind?",
    special: "Special software projects are assessed separately when the operating problem requires a custom platform, portal, dashboard or internal tool.",
    tell: "Tell us about it",
  },
  es: {
    eyebrow: "Servicios / Sistemas",
    title: "Tres sistemas conectados. Una única lógica operativa.",
    intro: "Diseñamos la infraestructura que sostiene la demanda, la conversión y las operaciones, y conectamos los traspasos que normalmente fallan.",
    breaks: "Dónde falla el sistema",
    includes: "Qué puede incluir el sistema",
    flow: "Flujo comercial",
    flowLabel: "Flujo de operaciones comerciales",
    integrated: "Servicio integrado",
    question: "¿Tienes en mente un sistema más complejo?",
    special: "Los proyectos de software especial se evalúan por separado cuando el problema operativo requiere una plataforma, portal, dashboard o herramienta interna a medida.",
    tell: "Cuéntanoslo",
  },
} as const;

export default async function ServicesPage() {
  const locale = await getLocale();
  const text = copy[locale];
  const services = getServices(locale);
  const integratedService = getIntegratedService(locale);

  return (
    <main id="main-content" className="pt-[var(--header-height)]">
      <section className="section-shell border-b border-white/10">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div><p className="eyebrow">{text.eyebrow}</p><h1 className="page-title">{text.title}</h1></div>
          <p className="body-large">{text.intro}</p>
        </div>
      </section>

      {services.map((service, serviceIndex) => (
        <section className={`section-shell ${serviceIndex % 2 === 1 ? "bg-[#080808]" : "bg-black"}`} id={service.id} key={service.id}>
          <div className="container-shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="eyebrow">{service.number} / {service.stage}</p>
              <h2 className="section-title">{service.title}</h2>
              <p className="body-large mt-6">{service.definition}</p>
            </div>
            <div className="grid gap-4">
              <article className="border border-white/10 bg-[#121212] p-6 sm:p-9">
                <h3 className="text-xl font-semibold">{text.breaks}</h3>
                <ul className="mt-7 grid gap-0 sm:grid-cols-2">
                  {service.problems.map((problem) => (
                    <li className="border-b border-white/10 py-4 text-sm leading-6 text-white/65 sm:odd:pr-5 sm:even:pl-5" key={problem}>
                      <span aria-hidden="true" className="mr-3 text-[#A20000]">—</span>{problem}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="border border-white/10 bg-[#121212] p-6 sm:p-9">
                <h3 className="text-xl font-semibold">{text.includes}</h3>
                <div className="mt-7 flex flex-wrap gap-2">
                  {service.capabilities.map((capability) => <span className="border border-white/12 px-3 py-2 text-sm text-white/65" key={capability}>{capability}</span>)}
                </div>
              </article>
              {service.flow ? (
                <article className="border border-white/10 bg-black p-6 sm:p-9">
                  <h3 className="text-xl font-semibold">{text.flow}</h3>
                  <ol className="mt-7 flex flex-wrap gap-2" aria-label={text.flowLabel}>
                    {service.flow.map((item, index) => (
                      <li className="flex items-center gap-2 text-sm text-white/60" key={item}>
                        <span className="border border-white/12 px-3 py-2">{item}</span>
                        {index < service.flow!.length - 1 ? <span aria-hidden="true" className="text-[#A20000]">→</span> : null}
                      </li>
                    ))}
                  </ol>
                </article>
              ) : null}
            </div>
          </div>
        </section>
      ))}

      <section className="inverted section-shell">
        <div className="container-shell">
          <p className="eyebrow !text-[#A20000]">{text.integrated}</p>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div><h2 className="section-title">{integratedService.title}</h2><p className="body-large muted-on-light mt-6">{integratedService.description}</p></div>
            <div className="border border-black/15">
              {integratedService.architecture.map((item, index) => (
                <div className="grid gap-2 border-b border-black/15 p-6 last:border-b-0 sm:grid-cols-[8rem_1fr] sm:items-center sm:p-8" key={item.stage}>
                  <p className="text-xs font-semibold tracking-[0.16em] text-[#A20000]">0{index + 1} {item.stage}</p>
                  <p className="text-lg font-semibold">{item.system}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 flex flex-col gap-6 border-t border-black/15 pt-9 sm:flex-row sm:items-center sm:justify-between">
            <div><h3 className="text-xl font-semibold">{text.question}</h3><p className="mt-2 max-w-2xl text-sm leading-7 text-black/60">{text.special}</p></div>
            <ButtonLink href="/forms" variant="brand">{text.tell} <span aria-hidden="true">→</span></ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
