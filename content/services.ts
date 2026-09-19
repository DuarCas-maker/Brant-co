import type { Locale } from "@/lib/i18n/config";

export type Service = {
  id: "attract" | "convert" | "automate";
  number: string;
  stage: string;
  title: string;
  definition: string;
  problems: string[];
  capabilities: string[];
  flow?: string[];
};

export const servicesByLocale: Record<Locale, Service[]> = {
  en: [
    {
      id: "attract", number: "01", stage: "ATTRACT", title: "Growth & Content Systems",
      definition: "Build a consistent content and marketing system that creates demand and strengthens positioning.",
      problems: ["Inconsistent communication", "Improvised content", "Slow approvals", "Scattered assets", "Content disconnected from sales"],
      capabilities: ["Brand DNA", "Audience definition", "Content pillars", "Tone of voice", "Messaging", "Content calendar", "Short-form production", "Repurposing", "Approval workflows", "Asset organization", "SOPs", "Reporting"],
    },
    {
      id: "convert", number: "02", stage: "CONVERT", title: "Marketing & Sales Operations",
      definition: "Turn incoming leads into a structured commercial process with clear stages, follow-up and visibility.",
      problems: ["Leads fall through the cracks", "Slow response times", "Inconsistent follow-up", "No central pipeline", "Limited reporting"],
      capabilities: ["Funnel design", "CRM architecture", "Pipelines", "Lead capture", "Lead routing", "Calendars", "Email sequences", "WhatsApp workflows", "Lead scoring", "Dashboards", "SOPs", "Onboarding"],
      flow: ["Lead", "Capture", "Register", "Qualify", "Assign", "Follow up", "Meeting", "Proposal", "Contract", "Payment", "Onboarding"],
    },
    {
      id: "automate", number: "03", stage: "AUTOMATE", title: "Automation & Integrations",
      definition: "Connect your tools, eliminate repetitive work and make operations faster and more reliable.",
      problems: ["Manual data entry", "Disconnected tools", "Forgotten follow-up", "Repeated admin tasks", "Manually assembled reports"],
      capabilities: ["Lead automation", "Customer onboarding", "Payment workflows", "Email automation", "Operations workflows", "Reporting pipelines", "API integrations", "Webhooks", "Error handling", "Documentation"],
    },
  ],
  es: [
    {
      id: "attract", number: "01", stage: "ATRAER", title: "Sistemas de Crecimiento y Contenido",
      definition: "Construye un sistema consistente de contenido y marketing que genere demanda y fortalezca el posicionamiento.",
      problems: ["Comunicación inconsistente", "Contenido improvisado", "Aprobaciones lentas", "Recursos dispersos", "Contenido desconectado de ventas"],
      capabilities: ["ADN de marca", "Definición de audiencia", "Pilares de contenido", "Tono de voz", "Mensajes", "Calendario de contenido", "Producción de formato corto", "Reutilización de contenido", "Flujos de aprobación", "Organización de recursos", "Procedimientos operativos", "Informes"],
    },
    {
      id: "convert", number: "02", stage: "CONVERTIR", title: "Operaciones de Marketing y Ventas",
      definition: "Convierte los leads entrantes en un proceso comercial estructurado, con etapas claras, seguimiento y visibilidad.",
      problems: ["Leads que se pierden", "Tiempos de respuesta lentos", "Seguimiento inconsistente", "Ausencia de un pipeline central", "Informes limitados"],
      capabilities: ["Diseño de embudos", "Arquitectura CRM", "Pipelines", "Captura de leads", "Asignación de leads", "Calendarios", "Secuencias de email", "Flujos de WhatsApp", "Calificación de leads", "Dashboards", "Procedimientos operativos", "Onboarding"],
      flow: ["Lead", "Captura", "Registro", "Calificación", "Asignación", "Seguimiento", "Reunión", "Propuesta", "Contrato", "Pago", "Onboarding"],
    },
    {
      id: "automate", number: "03", stage: "AUTOMATIZAR", title: "Automatización e Integraciones",
      definition: "Conecta tus herramientas, elimina el trabajo repetitivo y consigue operaciones más rápidas y fiables.",
      problems: ["Entrada manual de datos", "Herramientas desconectadas", "Seguimientos olvidados", "Tareas administrativas repetidas", "Informes montados manualmente"],
      capabilities: ["Automatización de leads", "Onboarding de clientes", "Flujos de pago", "Automatización de email", "Flujos operativos", "Pipelines de informes", "Integraciones API", "Webhooks", "Gestión de errores", "Documentación"],
    },
  ],
};

export const integratedServiceByLocale = {
  en: {
    title: "Growth Operating System",
    description: "A connected operating layer across marketing, sales operations, automation and reporting.",
    architecture: [
      { stage: "ATTRACT", system: "Content System" },
      { stage: "CONVERT", system: "CRM + Pipeline + Follow-up" },
      { stage: "AUTOMATE", system: "Integrations + Workflows" },
    ],
  },
  es: {
    title: "Sistema Operativo de Crecimiento",
    description: "Una capa operativa conectada que une marketing, operaciones comerciales, automatización e informes.",
    architecture: [
      { stage: "ATRAER", system: "Sistema de Contenido" },
      { stage: "CONVERTIR", system: "CRM + Pipeline + Seguimiento" },
      { stage: "AUTOMATIZAR", system: "Integraciones + Flujos" },
    ],
  },
} as const;

export function getServices(locale: Locale) {
  return servicesByLocale[locale];
}

export function getIntegratedService(locale: Locale) {
  return integratedServiceByLocale[locale];
}
