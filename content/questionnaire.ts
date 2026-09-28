import type { Locale } from "@/lib/i18n/config";
import type { QuestionnaireQuestionId } from "@/types/discovery";

export type QuestionnaireQuestion = {
  id: QuestionnaireQuestionId;
  title: string;
  help?: string;
  kind: "multi" | "single" | "text";
  options?: readonly { value: string; label: string }[];
  allowOther?: boolean;
};

const questions: Record<Locale, readonly QuestionnaireQuestion[]> = {
  en: [
    {
      id: "challenges",
      title: "What would you most like to improve?",
      help: "Choose everything that applies.",
      kind: "multi",
      allowOther: true,
      options: [
        { value: "more_demand", label: "Attract more potential customers" },
        { value: "sales_followup", label: "Improve sales and follow-up" },
        { value: "repetitive_work", label: "Reduce repeated manual work" },
        { value: "connected_business", label: "Bring information and teams together" },
        { value: "custom_solution", label: "Create a portal, shared view or custom application" },
      ],
    },
    {
      id: "priority",
      title: "How important is it to solve this now?",
      kind: "single",
      allowOther: true,
      options: [
        { value: "critical", label: "It is critical and is affecting income or daily work" },
        { value: "this_quarter", label: "It is important and we want to solve it this quarter" },
        { value: "important_not_urgent", label: "We want to improve it, but it is not urgent" },
        { value: "exploring", label: "We are only exploring possibilities" },
      ],
    },
    {
      id: "decisionStage",
      title: "How close are you to making a decision about this project?",
      kind: "single",
      options: [
        { value: "approved_30", label: "Approved — we want to start within 30 days" },
        { value: "comparing", label: "We are comparing options" },
        { value: "needs_approval", label: "I need internal approval" },
        { value: "exploring", label: "This is an early exploration" },
      ],
    },
    {
      id: "budgetRange",
      title: "What investment range have you set aside?",
      kind: "single",
      options: [
        { value: "less_than_500", label: "Less than USD 500" },
        { value: "500_999", label: "USD 500–999" },
        { value: "1000_1999", label: "USD 1,000–1,999" },
        { value: "2000_2999", label: "USD 2,000–2,999" },
        { value: "3000_4999", label: "USD 3,000–4,999" },
        { value: "5000_plus", label: "USD 5,000 or more" },
      ],
    },
    {
      id: "businessContext",
      title: "In a few lines, tell us what the company does, how many people are on the team, how the process you want to improve currently works, and where the main obstacle is.",
      kind: "text",
    },
  ],
  es: [
    {
      id: "challenges",
      title: "¿Qué te gustaría mejorar principalmente?",
      help: "Elige todas las opciones que correspondan.",
      kind: "multi",
      allowOther: true,
      options: [
        { value: "more_demand", label: "Atraer más clientes potenciales" },
        { value: "sales_followup", label: "Mejorar las ventas y el seguimiento" },
        { value: "repetitive_work", label: "Reducir el trabajo manual repetitivo" },
        { value: "connected_business", label: "Reunir la información y conectar al equipo" },
        { value: "custom_solution", label: "Crear un portal, panel o aplicación a medida" },
      ],
    },
    {
      id: "priority",
      title: "¿Qué tan importante es resolverlo ahora?",
      kind: "single",
      allowOther: true,
      options: [
        { value: "critical", label: "Es crítico y está afectando los ingresos o el trabajo diario" },
        { value: "this_quarter", label: "Es importante y queremos resolverlo este trimestre" },
        { value: "important_not_urgent", label: "Queremos mejorarlo, pero no es urgente" },
        { value: "exploring", label: "Solo estamos explorando posibilidades" },
      ],
    },
    {
      id: "decisionStage",
      title: "¿Qué tan cerca están de tomar una decisión sobre este proyecto?",
      kind: "single",
      options: [
        { value: "approved_30", label: "Aprobada — queremos empezar en menos de 30 días" },
        { value: "comparing", label: "Estamos comparando opciones" },
        { value: "needs_approval", label: "Necesito conseguir aprobación interna" },
        { value: "exploring", label: "Es una exploración inicial" },
      ],
    },
    {
      id: "budgetRange",
      title: "¿Qué rango de inversión han reservado?",
      kind: "single",
      options: [
        { value: "less_than_500", label: "Menos de USD 500" },
        { value: "500_999", label: "USD 500–999" },
        { value: "1000_1999", label: "USD 1.000–1.999" },
        { value: "2000_2999", label: "USD 2.000–2.999" },
        { value: "3000_4999", label: "USD 3.000–4.999" },
        { value: "5000_plus", label: "USD 5.000 o más" },
      ],
    },
    {
      id: "businessContext",
      title: "En unas pocas líneas, cuéntanos a qué se dedica la empresa, cuántas personas forman el equipo, cómo funciona actualmente el proceso que quieres mejorar y dónde está el principal bloqueo.",
      kind: "text",
    },
  ],
};

export function getQuestionnaire(locale: Locale) {
  return questions[locale];
}
