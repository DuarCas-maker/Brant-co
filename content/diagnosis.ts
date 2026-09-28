import type { Locale } from "@/lib/i18n/config";
import type { QuestionnaireAnswers } from "@/types/discovery";

export function getInitialDiagnosisQuestion(locale: Locale, answers: QuestionnaireAnswers) {
  const challenges = answers.challenges;
  if (challenges.length > 1) {
    return locale === "es" ? "De las necesidades que elegiste, ¿cuál está causando más dificultades hoy?" : "Of the needs you selected, which is causing the most difficulty today?";
  }
  if (challenges.includes("more_demand")) return locale === "es" ? "¿Qué está dificultando que más personas conozcan y elijan la empresa?" : "What is making it difficult for more people to discover and choose the business?";
  if (challenges.includes("sales_followup")) return locale === "es" ? "¿En qué parte del seguimiento suelen perderse las oportunidades?" : "At what point in follow-up are opportunities usually lost?";
  if (challenges.includes("repetitive_work")) return locale === "es" ? "¿Qué tarea repetitiva le quita más tiempo al equipo?" : "Which repeated task takes the most time from the team?";
  if (challenges.includes("connected_business")) return locale === "es" ? "¿Dónde se pierde o se repite la información entre personas y tareas?" : "Where is information lost or repeated between people and tasks?";
  if (challenges.includes("custom_solution")) return locale === "es" ? "¿Qué debería permitir hacer ese espacio o aplicación que hoy resulta difícil?" : "What should that workspace or application make easier than it is today?";
  return locale === "es" ? "¿Cuál es el principal cambio que te gustaría conseguir?" : "What is the main change you would like to achieve?";
}

const followUps = {
  en: [
    "How does this work today, from the first step to the last?",
    "Who is involved, and where does the work usually slow down?",
    "What would a useful improvement look like in the first three months?",
    "Is there any important limitation or detail we have not covered?",
  ],
  es: [
    "¿Cómo funciona esto hoy, desde el primer paso hasta el último?",
    "¿Quiénes participan y en qué punto suele frenarse el trabajo?",
    "¿Cómo se vería una mejora útil durante los primeros tres meses?",
    "¿Hay alguna limitación o detalle importante que todavía no hayamos mencionado?",
  ],
} as const;

export function getPreviewDiagnosisQuestion(locale: Locale, turn: number) {
  return followUps[locale][Math.max(0, Math.min(turn - 2, followUps[locale].length - 1))];
}
