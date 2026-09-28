import type { Locale } from "@/lib/i18n/config";
import type { ServiceId } from "@/types/discovery";

export type Service = {
  id: Exclude<ServiceId, "special" | "unclear">;
  title: string;
  summary: string;
  price: string;
  idealFor: string;
  outcomes: string[];
};

export const servicesByLocale: Record<Locale, Service[]> = {
  en: [
    {
      id: "attract",
      title: "Attract more opportunities",
      summary: "Build a clear, consistent way to reach the right people.",
      price: "USD 800–1,999",
      idealFor: "For businesses that need more visibility, useful content and a steadier flow of potential customers.",
      outcomes: ["A clearer message", "A practical content plan", "An easier way to publish and improve"],
    },
    {
      id: "convert",
      title: "Turn more opportunities into customers",
      summary: "Organize every conversation so fewer opportunities are forgotten.",
      price: "USD 1,000–2,999",
      idealFor: "For teams that need better follow-up, clearer priorities and a shared view of every opportunity.",
      outcomes: ["Faster follow-up", "Clear next steps", "More visibility for the team"],
    },
    {
      id: "automate",
      title: "Reduce manual work",
      summary: "Make repeated tasks happen with less effort and fewer errors.",
      price: "USD 1,500–4,999",
      idealFor: "For teams that copy information, send the same messages or prepare reports by hand.",
      outcomes: ["Less repeated work", "Information in the right place", "More time for important work"],
    },
  ],
  es: [
    {
      id: "attract",
      title: "Atrae más oportunidades",
      summary: "Crea una forma clara y constante de llegar a las personas adecuadas.",
      price: "USD 800–1.999",
      idealFor: "Para empresas que necesitan más visibilidad, contenido útil y un flujo más constante de clientes potenciales.",
      outcomes: ["Un mensaje más claro", "Un plan de contenido práctico", "Una forma más fácil de publicar y mejorar"],
    },
    {
      id: "convert",
      title: "Convierte más oportunidades en clientes",
      summary: "Organiza cada conversación para que menos oportunidades se queden sin seguimiento.",
      price: "USD 1.000–2.999",
      idealFor: "Para equipos que necesitan un mejor seguimiento, prioridades claras y una visión compartida de cada oportunidad.",
      outcomes: ["Seguimiento más rápido", "Próximos pasos claros", "Más visibilidad para el equipo"],
    },
    {
      id: "automate",
      title: "Reduce el trabajo manual",
      summary: "Haz que las tareas repetitivas ocurran con menos esfuerzo y menos errores.",
      price: "USD 1.500–4.999",
      idealFor: "Para equipos que copian información, envían los mismos mensajes o preparan informes a mano.",
      outcomes: ["Menos trabajo repetitivo", "Información en el lugar correcto", "Más tiempo para lo importante"],
    },
  ],
};

export const specialProjectByLocale = {
  en: {
    title: "Special projects",
    description: "Need a portal, shared view or application built around the way your team works? We can assess it separately.",
    action: "Tell us what you have in mind",
    price: "From USD 3,000",
  },
  es: {
    title: "Proyectos especiales",
    description: "¿Necesitas un portal, panel o aplicación creada alrededor de la forma en que trabaja tu equipo? Podemos evaluarlo por separado.",
    action: "Cuéntanos qué tienes en mente",
    price: "Desde USD 3.000",
  },
} as const;

export function getServices(locale: Locale) {
  return servicesByLocale[locale];
}

export function getSpecialProject(locale: Locale) {
  return specialProjectByLocale[locale];
}
