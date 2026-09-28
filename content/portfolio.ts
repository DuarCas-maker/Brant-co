import type { Locale } from "@/lib/i18n/config";

export type PortfolioProject = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  problem: string;
  solution: string;
  image: string;
  alt: string;
  placeholder: true;
};

export const portfolioProjectsByLocale: Record<Locale, PortfolioProject[]> = {
  en: [
    { slug: "content-flow", title: "A clearer content rhythm", category: "Attract", shortDescription: "A visual example of how ideas can move from planning to publication.", problem: "Content often depends on scattered notes, last-minute decisions and unclear approvals.", solution: "A simple shared view can make the next step visible to everyone.", image: "/portfolio/content-flow.png", alt: "Abstract red and black composition representing an organized content flow", placeholder: true },
    { slug: "sales-path", title: "A sales path that stays visible", category: "Convert", shortDescription: "A visual example of a clearer path from first conversation to decision.", problem: "Potential customers can be forgotten when follow-up lives across messages and personal notes.", solution: "One clear path helps the team see what happened and what comes next.", image: "/portfolio/sales-path.png", alt: "Abstract red pathway representing a visible sales journey", placeholder: true },
    { slug: "simple-automation", title: "Less repeated work", category: "Automate", shortDescription: "A visual example of repeated steps happening in a simpler way.", problem: "Copying the same information and sending the same updates uses valuable time.", solution: "Routine steps can move automatically while people stay in control.", image: "/portfolio/simple-automation.png", alt: "Abstract connected forms representing simpler repeated work", placeholder: true },
    { slug: "clear-information", title: "Information you can understand", category: "Visibility", shortDescription: "A visual example of the most useful information gathered in one place.", problem: "Teams lose time when important information is hard to find or interpret.", solution: "A focused view makes decisions faster and conversations clearer.", image: "/portfolio/clear-information.png", alt: "Abstract editorial dashboard in red black and white", placeholder: true },
    { slug: "custom-workspace", title: "A workspace built around the team", category: "Special project", shortDescription: "A visual example of a portal shaped around a real way of working.", problem: "Standard tools do not always fit a specialized process.", solution: "A custom workspace can simplify the exact steps the team needs.", image: "/portfolio/custom-workspace.png", alt: "Abstract premium interface for a custom team workspace", placeholder: true },
    { slug: "connected-business", title: "One connected way of working", category: "Connected work", shortDescription: "A visual example of information moving clearly between people and tasks.", problem: "Work slows down when every area keeps its own version of the information.", solution: "A shared flow reduces handoffs, doubts and repeated updates.", image: "/portfolio/connected-business.png", alt: "Abstract connected system with a central red glow", placeholder: true },
  ],
  es: [
    { slug: "content-flow", title: "Un ritmo de contenido más claro", category: "Atraer", shortDescription: "Un ejemplo visual de cómo las ideas pueden pasar de la planificación a la publicación.", problem: "El contenido suele depender de notas dispersas, decisiones de último momento y aprobaciones poco claras.", solution: "Una vista sencilla y compartida puede mostrarle a todos cuál es el siguiente paso.", image: "/portfolio/content-flow.png", alt: "Composición abstracta roja y negra que representa un flujo de contenido organizado", placeholder: true },
    { slug: "sales-path", title: "Un camino de ventas siempre visible", category: "Convertir", shortDescription: "Un ejemplo visual de un recorrido más claro desde la primera conversación hasta la decisión.", problem: "Los clientes potenciales pueden quedar olvidados cuando el seguimiento está repartido entre mensajes y notas personales.", solution: "Un solo recorrido ayuda al equipo a ver qué pasó y qué sigue.", image: "/portfolio/sales-path.png", alt: "Camino abstracto rojo que representa un recorrido de ventas visible", placeholder: true },
    { slug: "simple-automation", title: "Menos trabajo repetitivo", category: "Automatizar", shortDescription: "Un ejemplo visual de tareas repetidas que ocurren de una forma más sencilla.", problem: "Copiar la misma información y enviar las mismas actualizaciones consume tiempo valioso.", solution: "Los pasos rutinarios pueden avanzar automáticamente mientras las personas conservan el control.", image: "/portfolio/simple-automation.png", alt: "Formas abstractas conectadas que representan tareas repetitivas más simples", placeholder: true },
    { slug: "clear-information", title: "Información fácil de entender", category: "Visibilidad", shortDescription: "Un ejemplo visual de la información más útil reunida en un solo lugar.", problem: "Los equipos pierden tiempo cuando la información importante es difícil de encontrar o entender.", solution: "Una vista enfocada agiliza las decisiones y hace más claras las conversaciones.", image: "/portfolio/clear-information.png", alt: "Panel editorial abstracto en rojo negro y blanco", placeholder: true },
    { slug: "custom-workspace", title: "Un espacio creado para el equipo", category: "Proyecto especial", shortDescription: "Un ejemplo visual de un portal adaptado a una forma real de trabajar.", problem: "Las herramientas estándar no siempre se ajustan a un proceso especializado.", solution: "Un espacio a medida puede simplificar los pasos exactos que necesita el equipo.", image: "/portfolio/custom-workspace.png", alt: "Interfaz abstracta y elegante para un espacio de trabajo personalizado", placeholder: true },
    { slug: "connected-business", title: "Una forma conectada de trabajar", category: "Trabajo conectado", shortDescription: "Un ejemplo visual de información que se mueve con claridad entre personas y tareas.", problem: "El trabajo se frena cuando cada área conserva su propia versión de la información.", solution: "Un flujo compartido reduce traspasos, dudas y actualizaciones repetidas.", image: "/portfolio/connected-business.png", alt: "Sistema abstracto conectado con un centro rojo brillante", placeholder: true },
  ],
};

export function getPortfolioProjects(locale: Locale) {
  return portfolioProjectsByLocale[locale];
}
