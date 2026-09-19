import type { Locale } from "@/lib/i18n/config";

export type PortfolioProject = {
  slug: string;
  title: string;
  category: string[];
  shortDescription: string;
  problem: string;
  solution: string;
  results?: string[];
  technologies?: string[];
  image?: string;
  featured?: boolean;
  placeholder: true;
};

export const portfolioProjectsByLocale: Record<Locale, PortfolioProject[]> = {
  en: [
    {
      slug: "sales-operations-system", title: "Sales Operations System", category: ["Sales Operations", "Automation"],
      shortDescription: "Case-study structure for a connected lead capture, pipeline and follow-up system.",
      problem: "Verified client context and baseline data are pending publication approval.",
      solution: "The final case study will document the workflow, architecture and implementation decisions.",
      results: ["Qualitative outcomes will be added only after verification."], technologies: ["CRM", "Automation", "Reporting"], featured: true, placeholder: true,
    },
    {
      slug: "content-growth-system", title: "Content Growth System", category: ["Growth Systems"],
      shortDescription: "Case-study structure for strategy, production, approvals and content operations.",
      problem: "Verified project details have not yet been cleared for public use.",
      solution: "This structure is ready for real project evidence, process visuals and approved outcomes.",
      results: ["No unverified metrics are presented."], technologies: ["Content Operations", "SOPs", "Analytics"], placeholder: true,
    },
    {
      slug: "integrated-workflow", title: "Integrated Workflow", category: ["Automation", "Data / Reporting"],
      shortDescription: "Case-study structure for a cross-tool workflow with monitoring and reporting.",
      problem: "A verified before-state and client identity are still required.",
      solution: "The final record will map triggers, transformations, safeguards and operating ownership.",
      results: ["Verified results will replace this editorial placeholder."], technologies: ["APIs", "Data", "Workflow Automation"], placeholder: true,
    },
  ],
  es: [
    {
      slug: "sales-operations-system", title: "Sistema de Operaciones Comerciales", category: ["Operaciones Comerciales", "Automatización"],
      shortDescription: "Estructura de caso para un sistema conectado de captura de leads, pipeline y seguimiento.",
      problem: "El contexto verificado del cliente y los datos de referencia están pendientes de aprobación para su publicación.",
      solution: "El caso final documentará el flujo, la arquitectura y las decisiones de implementación.",
      results: ["Los resultados cualitativos se añadirán únicamente después de verificarlos."], technologies: ["CRM", "Automatización", "Informes"], featured: true, placeholder: true,
    },
    {
      slug: "content-growth-system", title: "Sistema de Crecimiento de Contenido", category: ["Sistemas de Crecimiento"],
      shortDescription: "Estructura de caso para estrategia, producción, aprobaciones y operaciones de contenido.",
      problem: "Los detalles verificados del proyecto todavía no han sido autorizados para uso público.",
      solution: "Esta estructura está preparada para incorporar evidencias reales, visuales del proceso y resultados aprobados.",
      results: ["No se presentan métricas sin verificar."], technologies: ["Operaciones de Contenido", "Procedimientos", "Analítica"], placeholder: true,
    },
    {
      slug: "integrated-workflow", title: "Flujo Integrado", category: ["Automatización", "Datos / Informes"],
      shortDescription: "Estructura de caso para un flujo entre herramientas con monitorización e informes.",
      problem: "Todavía se requiere un estado inicial verificado y la identidad del cliente.",
      solution: "El registro final mostrará disparadores, transformaciones, medidas de seguridad y responsabilidad operativa.",
      results: ["Los resultados verificados sustituirán este contenido editorial provisional."], technologies: ["APIs", "Datos", "Automatización de Flujos"], placeholder: true,
    },
  ],
};

export function getPortfolioProjects(locale: Locale) {
  return portfolioProjectsByLocale[locale];
}
