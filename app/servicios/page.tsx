import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { getServices, getSpecialProject } from "@/content/services";
import { getLocale } from "@/lib/i18n/server";
import styles from "./services.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "es" ? "Servicios" : "Services",
    description: locale === "es"
      ? "Tres formas claras de atraer oportunidades, mejorar el seguimiento y reducir el trabajo manual."
      : "Three clear ways to attract opportunities, improve follow-up and reduce manual work.",
    alternates: { canonical: "/servicios" },
  };
}

const copy = {
  en: {
    title: "Choose the change your business needs.",
    intro: "Start with the result you want. Each service is shaped around your current situation, team and priorities.",
    fit: "A good fit when",
    helps: "What this can change",
    price: "Reference range",
    priceNote: "Final scope and price are confirmed after reviewing your form.",
    start: "Tell us what you need",
    specialPrice: "Reference starting point",
    unsure: "Not sure which one fits?",
    unsureBody: "Answer five short questions. We will highlight the best starting point and keep the other options visible.",
    assess: "Start the form",
  },
  es: {
    title: "Elige el cambio que necesita tu empresa.",
    intro: "Empieza por el resultado que buscas. Cada servicio se adapta a tu situación actual, tu equipo y tus prioridades.",
    fit: "Puede ayudarte cuando",
    helps: "Lo que puede cambiar",
    price: "Rango orientativo",
    priceNote: "El alcance y el precio final se confirman después de revisar tu formulario.",
    start: "Cuéntanos qué necesitas",
    specialPrice: "Punto de partida orientativo",
    unsure: "¿No sabes cuál elegir?",
    unsureBody: "Responde cinco preguntas breves. Destacaremos el mejor punto de partida y mantendremos visibles las demás opciones.",
    assess: "Empezar el formulario",
  },
} as const;

export default async function ServicesPage() {
  const locale = await getLocale();
  const text = copy[locale];
  const services = getServices(locale);
  const special = getSpecialProject(locale);

  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero}>
        <div className={"container-shell " + styles.heroInner}>
          <h1>{text.title}</h1>
          <p>{text.intro}</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container-shell">
          <div className={styles.cards}>
            {services.map((service, index) => (
              <article className={styles.card} id={service.id} key={service.id}>
                <div aria-hidden="true" className={styles.cardVisual}><span /><i>0{index + 1}</i></div>
                <div className={styles.priceBlock}><span>{text.price}</span><strong>{service.price}</strong></div>
                <h2>{service.title}</h2>
                <p className={styles.summary}>{service.summary}</p>
                <div className={styles.detail}>
                  <h3>{text.fit}</h3>
                  <p>{service.idealFor}</p>
                </div>
                <div className={styles.outcomes}>
                  <h3>{text.helps}</h3>
                  <ul>{service.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
                </div>
                <div className={styles.cardAction}><ButtonLink href="/forms">{text.start} <span aria-hidden="true">→</span></ButtonLink></div>
              </article>
            ))}
          </div>

          <p className={styles.priceNote}>{text.priceNote}</p>

          <aside className={styles.special}>
            <div className={styles.specialPrice}><span>{text.specialPrice}</span><strong>{special.price}</strong></div>
            <div><h2>{special.title}</h2><p>{special.description}</p></div>
            <ButtonLink href="/forms?interest=special" variant="secondary">{special.action} <span aria-hidden="true">→</span></ButtonLink>
          </aside>

          <aside className={styles.unsure}>
            <h2>{text.unsure}</h2>
            <p>{text.unsureBody}</p>
            <ButtonLink href="/forms?next=/diagnostico">{text.assess} <span aria-hidden="true">→</span></ButtonLink>
          </aside>
        </div>
      </section>
    </main>
  );
}
