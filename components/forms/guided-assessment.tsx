"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ASSESSMENT_SESSION_KEY } from "@/components/forms/discovery-experience";
import { getInitialDiagnosisQuestion, getPreviewDiagnosisQuestion } from "@/content/diagnosis";
import { getServices, getSpecialProject } from "@/content/services";
import { getServiceRecommendation } from "@/lib/qualification/scoring";
import type { Locale } from "@/lib/i18n/config";
import type { PublicAssessmentResult, QuestionnaireAnswers, ServiceId } from "@/types/discovery";

type Message = { role: "assistant" | "user"; content: string };
type Session = {
  leadId: string;
  answers: QuestionnaireAnswers;
  result?: PublicAssessmentResult;
  previewMode?: boolean;
};
type Result = { summary: string; primaryService: ServiceId; secondaryServices: ServiceId[] };

const copy = {
  en: {
    title: "Let's make the situation clearer.",
    intro: "We already have your five answers. This conversation starts immediately, asks only what is missing and stops after five questions.",
    placeholder: "Write your answer",
    send: "Send answer",
    sending: "Thinking…",
    error: "We couldn't continue the guided assessment. Please try again.",
    complete: "Your assessment is ready.",
    next: "What happens next",
    nextBody: "Our team can use this summary to prepare a more focused recommendation for your business.",
    form: "Return to the form",
    privacy: "Do not share passwords, payment details or confidential credentials.",
    preview: "Local preview: the conversation works here, but it will not be saved until Supabase and OpenAI are connected.",
    recommended: "Recommended starting point",
  },
  es: {
    title: "Aclaremos mejor la situación.",
    intro: "Ya tenemos tus cinco respuestas. Esta conversación empieza de inmediato, solo pregunta lo que falta y termina después de un máximo de cinco preguntas.",
    placeholder: "Escribe tu respuesta",
    send: "Enviar respuesta",
    sending: "Analizando…",
    error: "No pudimos continuar el diagnóstico guiado. Inténtalo de nuevo.",
    complete: "Tu diagnóstico está listo.",
    next: "Qué sigue",
    nextBody: "Nuestro equipo puede usar este resumen para preparar una recomendación más enfocada para tu empresa.",
    form: "Volver al formulario",
    privacy: "No compartas contraseñas, datos de pago ni credenciales confidenciales.",
    preview: "Vista previa local: la conversación funciona aquí, pero no se guardará hasta conectar Supabase y OpenAI.",
    recommended: "Punto de partida recomendado",
  },
} as const;

export function GuidedAssessment({ locale }: { locale: Locale }) {
  const router = useRouter();
  const text = copy[locale];
  const services = useMemo(() => getServices(locale), [locale]);
  const special = useMemo(() => getSpecialProject(locale), [locale]);
  const [session, setSession] = useState<Session | null>(null);
  const [turn, setTurn] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let saved: Session | null = null;
    try { saved = JSON.parse(window.localStorage.getItem(ASSESSMENT_SESSION_KEY) || "null") as Session | null; } catch { saved = null; }
    if (!saved?.leadId || !saved.answers) { router.replace("/forms?next=/diagnostico"); return; }
    const initialSession = saved;
    const timer = window.setTimeout(() => {
      setSession(initialSession);
      setPreviewMode(Boolean(initialSession.previewMode));
      setMessages([{ role: "assistant", content: getInitialDiagnosisQuestion(locale, initialSession.answers) }]);
      setBusy(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [locale, router]);

  function finishPreview(nextMessages: Message[]) {
    if (!session) return;
    const recommendation = session.result
      ? { primary: session.result.primaryService, secondary: session.result.secondaryServices }
      : getServiceRecommendation(session.answers);
    const service = services.find((item) => item.id === recommendation.primary);
    const serviceTitle = recommendation.primary === "unclear"
      ? (locale === "es" ? "Diagnóstico adicional" : "Further assessment")
      : service?.title || special.title;
    const context = session.answers.businessContext.trim();
    const lastAnswers = nextMessages.filter((message) => message.role === "user").map((message) => message.content).slice(-3).join(" ");
    const summary = locale === "es"
      ? "El punto de partida recomendado es " + serviceTitle + ". La empresa explicó este contexto: " + context + " Información adicional del diagnóstico: " + lastAnswers
      : "The recommended starting point is " + serviceTitle + ". The business shared this context: " + context + " Additional assessment details: " + lastAnswers;
    setResult({ summary, primaryService: recommendation.primary, secondaryServices: recommendation.secondary });
  }

  function continuePreview(currentMessages: Message[]) {
    setPreviewMode(true);
    if (turn >= 5) {
      finishPreview(currentMessages);
      return;
    }
    const nextTurn = turn + 1;
    setTurn(nextTurn);
    setMessages([...currentMessages, { role: "assistant", content: getPreviewDiagnosisQuestion(locale, nextTurn) }]);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = answer.trim();
    if (!value || busy || !session) return;
    const nextMessages = [...messages, { role: "user" as const, content: value }];
    setMessages(nextMessages);
    setAnswer("");
    setError("");

    if (previewMode) {
      continuePreview(nextMessages);
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/discovery/message", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ leadId: session.leadId, locale, turn, message: value }),
      });
      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 503 && process.env.NODE_ENV === "development") {
          continuePreview(nextMessages);
          return;
        }
        throw new Error(payload.error || text.error);
      }
      if (payload.complete) setResult(payload);
      else {
        setTurn(payload.turn);
        setMessages([...nextMessages, { role: "assistant", content: payload.question }]);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : text.error);
    } finally {
      setBusy(false);
    }
  }

  const recommendation = result ? services.find((service) => service.id === result.primaryService) : null;
  const recommendationTitle = result?.primaryService === "unclear"
    ? (locale === "es" ? "Diagnóstico adicional" : "Further assessment")
    : recommendation?.title || special.title;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <h1 className="page-title">{text.title}</h1>
        <p className="body-large mt-6 max-w-2xl">{text.intro}</p>
      </div>
      <div className="border border-white/10 bg-[#0b0b0b] p-5 shadow-2xl sm:p-9">
        {previewMode ? <p className="mb-6 border border-[#d85c5c]/35 bg-[#a20000]/10 p-4 text-xs leading-6 text-white/65">{text.preview}</p> : null}
        <div aria-live="polite" className="grid gap-4">
          {messages.map((message, index) => (
            <div className={"max-w-[88%] p-4 text-sm leading-7 " + (message.role === "assistant" ? "border border-white/10 bg-[#171717] text-white/75" : "ml-auto bg-[#a20000] text-white")} key={message.role + "-" + index}>
              {message.content}
            </div>
          ))}
        </div>

        {result ? (
          <div className="mt-8 border-t border-white/10 pt-8">
            <h2 className="text-3xl font-semibold tracking-[-.04em]">{text.complete}</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/70">{result.summary}</p>
            <div className="mt-7 border border-[#a20000] bg-[#a20000]/10 p-5">
              <p className="text-xs text-[#d85c5c]">{text.recommended}</p>
              <h3 className="mt-3 text-xl font-semibold">{recommendationTitle}</h3>
            </div>
            <div className="mt-7"><h3 className="font-semibold">{text.next}</h3><p className="mt-2 text-sm leading-7 text-white/55">{text.nextBody}</p></div>
          </div>
        ) : null}

        {!result && messages.length ? (
          <form className="mt-7 border-t border-white/10 pt-6" onSubmit={submit}>
            <label className="sr-only" htmlFor="guided-answer">{text.placeholder}</label>
            <textarea className="min-h-32 w-full resize-y border border-white/12 bg-black p-4 text-sm leading-7 text-white outline-none focus:border-[#a20000]" disabled={busy} id="guided-answer" maxLength={2000} onChange={(event) => setAnswer(event.target.value)} placeholder={text.placeholder} value={answer} />
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/35">{text.privacy}</p>
              <button className="button-brand shrink-0" disabled={busy || !answer.trim()} type="submit">{busy ? text.sending : text.send} <span aria-hidden="true">→</span></button>
            </div>
          </form>
        ) : null}

        {error ? <div className="mt-6 border-l-2 border-[#a20000] pl-4"><p className="text-sm text-white/70">{error}</p><Link className="mt-3 inline-block text-sm underline underline-offset-4" href="/forms?next=/diagnostico">{text.form}</Link></div> : null}
      </div>
    </div>
  );
}
