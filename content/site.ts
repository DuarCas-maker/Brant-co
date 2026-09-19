import type { Locale } from "@/lib/i18n/config";

const shared = {
  name: "BRANT·CO",
  descriptor: "Digital Growth Systems",
} as const;

export const siteConfigByLocale = {
  en: {
    ...shared,
    tagline: "We build the systems behind business growth.",
    description:
      "BRANT·CO builds connected systems across marketing, sales operations and automation to help service businesses grow with less manual work.",
    navigation: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/servicios" },
      { label: "Portfolio", href: "/portafolio" },
      { label: "Forms", href: "/forms" },
      { label: "PRS", href: "/prs" },
    ],
    process: [
      { name: "Audit", description: "Understand the current system, bottlenecks and business impact." },
      { name: "Design", description: "Map the future state and define the right architecture." },
      { name: "Build", description: "Implement the workflows, systems and integrations." },
      { name: "Launch", description: "Test, deploy and train the team." },
      { name: "Optimize", description: "Measure, improve and expand the system over time." },
    ],
    problems: [
      "Leads lost between channels",
      "Manual follow-up",
      "Scattered tools",
      "Inconsistent content",
      "Repetitive admin work",
      "No pipeline visibility",
      "Founders acting as the system",
      "Reports built manually",
      "Missed opportunities",
    ],
  },
  es: {
    ...shared,
    tagline: "Construimos los sistemas que impulsan el crecimiento empresarial.",
    description:
      "BRANT·CO construye sistemas conectados de marketing, operaciones comerciales y automatización para ayudar a empresas de servicios a crecer con menos trabajo manual.",
    navigation: [
      { label: "Inicio", href: "/" },
      { label: "Servicios", href: "/servicios" },
      { label: "Portafolio", href: "/portafolio" },
      { label: "Formularios", href: "/forms" },
      { label: "PRS", href: "/prs" },
    ],
    process: [
      { name: "Auditoría", description: "Entendemos el sistema actual, sus cuellos de botella y el impacto en el negocio." },
      { name: "Diseño", description: "Trazamos el estado futuro y definimos la arquitectura adecuada." },
      { name: "Construcción", description: "Implementamos los flujos, sistemas e integraciones." },
      { name: "Lanzamiento", description: "Probamos, desplegamos y formamos al equipo." },
      { name: "Optimización", description: "Medimos, mejoramos y ampliamos el sistema con el tiempo." },
    ],
    problems: [
      "Leads perdidos entre canales",
      "Seguimiento manual",
      "Herramientas dispersas",
      "Contenido inconsistente",
      "Trabajo administrativo repetitivo",
      "Falta de visibilidad del pipeline",
      "Fundadores que actúan como el sistema",
      "Informes creados manualmente",
      "Oportunidades perdidas",
    ],
  },
} as const;

export function getSiteConfig(locale: Locale) {
  return siteConfigByLocale[locale];
}

export function getPublicContactEmail() {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;
}

export function getBookingUrl() {
  return process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || null;
}
