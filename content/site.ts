import type { Locale } from "@/lib/i18n/config";

const shared = { name: "BRANT·CO" } as const;

export const siteConfigByLocale = {
  en: {
    ...shared,
    tagline: "Clearer growth. Simpler work.",
    description: "BRANT·CO helps businesses attract more opportunities, improve follow-up and reduce repeated work.",
    navigation: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/servicios" },
      { label: "Portfolio", href: "/portafolio" },
      { label: "Forms", href: "/forms" },
      { label: "Assessment", href: "/diagnostico" },
      { label: "PQRS", href: "/pqrs" },
    ],
    process: [
      { name: "Listen", description: "We understand what is happening and what it is costing you." },
      { name: "Find the cause", description: "We separate the visible symptoms from the real problem." },
      { name: "Plan", description: "We define a practical solution and the order of work." },
      { name: "Build", description: "We create, connect and test the agreed solution." },
      { name: "Improve", description: "We review what works and make it better over time." },
    ],
    problems: [
      "Potential customers are lost because follow-up arrives late.",
      "Important information lives in too many places.",
      "Your team repeats tasks that could happen automatically.",
      "It is hard to know which opportunity needs attention.",
      "Content depends on last-minute effort.",
      "Reports take too long to prepare.",
    ],
  },
  es: {
    ...shared,
    tagline: "Crecimiento más claro. Trabajo más simple.",
    description: "BRANT·CO ayuda a las empresas a atraer más oportunidades, mejorar el seguimiento y reducir el trabajo repetitivo.",
    navigation: [
      { label: "Inicio", href: "/" },
      { label: "Servicios", href: "/servicios" },
      { label: "Portafolio", href: "/portafolio" },
      { label: "Formulario", href: "/forms" },
      { label: "Diagnóstico", href: "/diagnostico" },
      { label: "PQRS", href: "/pqrs" },
    ],
    process: [
      { name: "Escuchamos", description: "Entendemos qué está pasando y cuánto te está costando." },
      { name: "Encontramos la causa", description: "Separamos los síntomas visibles del problema real." },
      { name: "Trazamos el plan", description: "Definimos una solución práctica y el orden del trabajo." },
      { name: "Construimos", description: "Creamos, conectamos y probamos la solución acordada." },
      { name: "Mejoramos", description: "Revisamos qué funciona y lo hacemos mejor con el tiempo." },
    ],
    problems: [
      "Pierdes clientes potenciales porque el seguimiento llega tarde.",
      "La información importante está repartida en demasiados lugares.",
      "Tu equipo repite tareas que podrían ocurrir automáticamente.",
      "Es difícil saber qué oportunidad necesita atención.",
      "El contenido depende del esfuerzo de último momento.",
      "Preparar informes toma demasiado tiempo.",
    ],
  },
} as const;

export function getSiteConfig(locale: Locale) { return siteConfigByLocale[locale]; }
export function getPublicContactEmail() { return process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null; }
export function getBookingUrl() { return process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || null; }
