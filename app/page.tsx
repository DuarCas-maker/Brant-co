import Link from "next/link";
import { DiscoveryExperience } from "@/components/forms/discovery-experience";
import { PortfolioReel } from "@/components/portfolio/portfolio-reel";
import { GrowthCore } from "@/components/sections/growth-core";
import { ButtonLink } from "@/components/ui/button-link";
import { getPortfolioProjects } from "@/content/portfolio";
import { getServices, getSpecialProject } from "@/content/services";
import { getSiteConfig } from "@/content/site";
import { getLocale } from "@/lib/i18n/server";
import styles from "./home.module.css";

const copy = {
  en: {
    hero: "We make growth easier to understand and manage.",
    heroLines: ["We make growth", "easier to understand", "and manage."],
    heroBody: "We help you attract more opportunities, follow up better and spend less time on repeated work.",
    start: "Tell us what you need",
    servicesAction: "See how we can help",
    problemsEyebrow: "Common problems",
    problemsTitle: "Does any of this feel familiar?",
    problemsBody: "These are common challenges for growing businesses. We help solve them with better systems, not more manual work.",
    problemsAction: "Let's talk about your situation",
    servicesTitle: "Choose the result you need.",
    servicesBody: "Three focused ways to solve the most common barriers to growth.",
    idealFor: "You can achieve it when",
    price: "Investment range",
    exploreService: "Explore this service",
    howTitle: "A clear path from the problem to a working solution.",
    projectsQuestion: "Want to see what this could look like?",
    projectsAction: "Explore the portfolio",
    portfolioView: "View project",
    formTitle: "Tell us what is getting in the way",
    diagnosisTitle: "Not sure what needs to change?",
    diagnosisBody: "First we find the real problem. Then we shape the solution and prepare a recommendation for your business.",
    diagnosisPoints: ["Find the real problem", "Shape a practical solution", "Prepare a tailored proposal"],
    diagnosisAction: "Start your assessment",
  },
  es: {
    hero: "Hacemos que crecer sea más fácil de entender y gestionar.",
    heroLines: ["Hacemos que crecer", "sea más fácil de", "entender y gestionar."],
    heroBody: "Te ayudamos a atraer más oportunidades, darles un mejor seguimiento y dedicar menos tiempo a tareas repetitivas.",
    start: "Cuéntanos qué necesitas",
    servicesAction: "Mira cómo podemos ayudarte",
    problemsEyebrow: "Problemas",
    problemsTitle: "¿Algo de esto te resulta familiar?",
    problemsBody: "Son desafíos comunes en empresas en crecimiento. Te ayudamos a resolverlos con mejores sistemas, no con más trabajo manual.",
    problemsAction: "Hablemos de tu caso",
    servicesTitle: "Elige el resultado que necesitas.",
    servicesBody: "Tres formas concretas de resolver los obstáculos más comunes para crecer.",
    idealFor: "Puedes lograrlo si",
    price: "Rango de inversión",
    exploreService: "Explorar este servicio",
    howTitle: "Un camino claro desde el problema hasta una solución que funciona.",
    projectsQuestion: "¿Quieres ver cómo podría verse?",
    projectsAction: "Explorar el portafolio",
    portfolioView: "Ver proyecto",
    formTitle: "Cuéntanos qué está frenando el avance",
    diagnosisTitle: "¿No tienes claro qué debe cambiar?",
    diagnosisBody: "Primero encontramos el problema real. Después estructuramos la solución y preparamos una recomendación para tu empresa.",
    diagnosisPoints: ["Encontramos el problema real", "Estructuramos una solución práctica", "Preparamos una propuesta personalizada"],
    diagnosisAction: "Iniciar diagnóstico",
  },
} as const;

export default async function HomePage() {
  const locale = await getLocale();
  const text = copy[locale];
  const site = getSiteConfig(locale);
  const services = getServices(locale);
  const specialProject = getSpecialProject(locale);
  const projects = getPortfolioProjects(locale);

  return (
    <main id="main-content">
      <section className={styles.hero}>
        <div aria-hidden="true" className={styles.grid} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1 aria-label={text.hero} className={styles.title}>
              {text.heroLines.map((line) => <span aria-hidden="true" key={line}>{line}</span>)}
            </h1>
            <p className={styles.heroBody}>{text.heroBody}</p>
            <div className={styles.actions}>
              <ButtonLink href="#formulario">{text.start} <span aria-hidden="true">→</span></ButtonLink>
              <ButtonLink href="#servicios" variant="secondary">{text.servicesAction}</ButtonLink>
            </div>
          </div>
          <div className={styles.visual}><GrowthCore locale={locale} /></div>
        </div>
      </section>

      <section className={styles.problems} id="problemas">
        <div aria-hidden="true" className={styles.problemCornerOrbit}><span /><i /></div>
        <div className={`container-shell ${styles.problemShell}`}>
          <div className={styles.problemTop}>
            <div className={styles.problemIntro}>
              <span className={styles.problemEyebrow}>{text.problemsEyebrow}</span>
              <h2>{text.problemsTitle}</h2>
              <p>{text.problemsBody}</p>
            </div>
            <div aria-hidden="true" className={styles.problemVisual}>
              <div className={styles.problemGlow} />
              <span className={styles.problemOrbitOne} />
              <span className={styles.problemOrbitTwo} />
              <span className={styles.problemOrbitThree} />
              <i className={styles.problemDotOne} />
              <i className={styles.problemDotTwo} />
              <i className={styles.problemDotThree} />
              <i className={styles.problemDotFour} />
            </div>
          </div>
          <div className={styles.problemGrid}>
            {site.problems.map((problem, index) => (
              <article key={problem}>
                <span className={styles.problemNumber}>{String(index + 1).padStart(2, "0")}</span>
                <div aria-hidden="true" className={styles.problemIcon} data-variant={index + 1}><span /><b /><i /></div>
                <h3>{problem}</h3>
                <Link aria-label={`${text.problemsAction}: ${problem}`} className={styles.problemArrow} href="#formulario"><span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
          <div className={styles.problemFooter}><Link href="#formulario"><span aria-hidden="true" />{text.problemsAction}<b aria-hidden="true">→</b></Link></div>
        </div>
      </section>

      <section className={styles.services} id="servicios">
        <div aria-hidden="true" className={styles.serviceBackdrop}><span /><b /><i /><div className={styles.servicePlanetOne} /><div className={styles.servicePlanetTwo} /></div>
        <div className={`container-shell ${styles.serviceShell}`}>
          <div className={styles.sectionIntro}>
            <h2>{text.servicesTitle}</h2>
            <p>{text.servicesBody}</p>
          </div>
          <div className={styles.serviceGrid}>
            {services.map((service, index) => (
              <article className={styles.serviceCard} key={service.id}>
                <div className={styles.cardTop}><span className={styles.cardNumber}>0{index + 1}</span><span className={styles.price}><small>{text.price}</small>{service.price}</span></div>
                <div aria-hidden="true" className={styles.serviceOrbit} data-variant={index + 1}><span /><b /><i /></div>
                <div><h3>{service.title}</h3><p>{service.summary}</p></div>
                <div className={styles.fit}><strong>{text.idealFor}</strong><p>{service.idealFor}</p></div>
                <ul>{service.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
                <Link href={`/servicios#${service.id}`}>{text.exploreService} <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
          <aside className={styles.special}>
            <div><span className={styles.specialPrice}>{text.price}: {specialProject.price}</span><h3>{specialProject.title}</h3><p>{specialProject.description}</p></div>
            <ButtonLink href="/forms?interest=special" variant="secondary">{specialProject.action} <span aria-hidden="true">→</span></ButtonLink>
          </aside>
        </div>
      </section>

      <section className={styles.process} id="proceso">
        <div aria-hidden="true" className={styles.processBackdrop}><span /><b /><i /></div>
        <div className={`container-shell ${styles.processShell}`}>
          <h2>{text.howTitle}</h2>
          <ol>{site.process.map((step, index) => <li key={step.name}><span>0{index + 1}</span><div><h3>{step.name}</h3><p>{step.description}</p></div></li>)}</ol>
        </div>
      </section>

      <section className={styles.portfolioPreview}>
        <div className="container-shell">
          <div className={styles.portfolioHeader}>
            <h3>{text.projectsQuestion}</h3>
            <ButtonLink href="/portafolio" variant="secondary">{text.projectsAction} <span aria-hidden="true">→</span></ButtonLink>
          </div>
        </div>
        <PortfolioReel projects={projects} viewLabel={text.portfolioView} />
      </section>

      <section className={styles.formSection} id="formulario">
        <div aria-hidden="true" className={styles.formBackdrop}><span /><b /><i /><div className={styles.formOrbitOne} /><div className={styles.formOrbitTwo} /></div>
        <div className={`container-shell ${styles.formContent}`}>
          <div className={styles.formIntro}><h2>{text.formTitle}</h2></div>
          <DiscoveryExperience embedded locale={locale} />
        </div>
      </section>

      <section className={styles.diagnosis} id="diagnostico">
        <div className="container-shell">
          <div><h2>{text.diagnosisTitle}</h2><p>{text.diagnosisBody}</p></div>
          <ul>{text.diagnosisPoints.map((point) => <li key={point}><span aria-hidden="true">✓</span>{point}</li>)}</ul>
          <ButtonLink href="/diagnostico">{text.diagnosisAction} <span aria-hidden="true">→</span></ButtonLink>
        </div>
      </section>
    </main>
  );
}
