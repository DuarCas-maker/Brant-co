"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/config";
import { budgetLabelsByLocale, budgetRanges, type BudgetRange, type PublicAssessmentResult } from "@/types/discovery";

type Interaction = "text" | "budget";
type Message = { role: "assistant" | "user"; content: string; turn: number };
type ResumeState = { leadId: string; turn: number; question: string; interaction: Interaction };

const copy = {
  en: {
    validation: { name: "Enter your name.", email: "Enter a valid email address.", phone: "Enter a valid WhatsApp number." },
    errors: { save: "We couldn't save your information. Please try again.", process: "We couldn't process that response. Please retry.", complete: "We couldn't complete the assessment. Please retry." },
    startEyebrow: "Start / 60 seconds", startTitle: "First, where should we reach you?", startBody: "Three details now. The system questions come next.",
    name: "Name", namePlaceholder: "Your name", email: "Email", phone: "WhatsApp",
    consent: "By continuing, you agree that BRANT·CO may use the information you provide to evaluate your request and contact you regarding your inquiry.",
    privacy: "Privacy Policy", saving: "Saving…", start: "Start Assessment",
    complete: "Assessment complete", qualifiedTitle: "We see a potential fit.", reviewTitle: "Thanks for sharing the details.",
    potential: "POTENTIAL FOCUS", book: "Book a Discovery Call", noCalendar: "No calendar is shown at this stage. The BRANT·CO team will review the opportunity and contact you directly.",
    step: "Step", of: "of", assistant: "BRANT·CO / DISCOVERY", you: "YOU", thinking: "Thinking…",
    answer: "Your answer", answerPlaceholder: "Describe the situation in your own words…", help: "Enter to send · Shift + Enter for a new line", continue: "Continue",
    budget: "Budget range in USD", preparing: "Preparing your result…", finish: "Complete Assessment",
    saved: "Your answers are saved as the conversation progresses. Avoid sharing passwords or credentials.",
  },
  es: {
    validation: { name: "Introduce tu nombre.", email: "Introduce una dirección de email válida.", phone: "Introduce un número de WhatsApp válido." },
    errors: { save: "No hemos podido guardar tu información. Inténtalo de nuevo.", process: "No hemos podido procesar esa respuesta. Inténtalo de nuevo.", complete: "No hemos podido completar el diagnóstico. Inténtalo de nuevo." },
    startEyebrow: "Inicio / 60 segundos", startTitle: "Primero, ¿dónde podemos contactarte?", startBody: "Tres datos ahora. Después vendrán las preguntas del sistema.",
    name: "Nombre", namePlaceholder: "Tu nombre", email: "Email", phone: "WhatsApp",
    consent: "Al continuar, aceptas que BRANT·CO utilice la información que proporcionas para evaluar tu solicitud y contactarte en relación con ella.",
    privacy: "Política de Privacidad", saving: "Guardando…", start: "Iniciar Diagnóstico",
    complete: "Diagnóstico completado", qualifiedTitle: "Vemos un encaje potencial.", reviewTitle: "Gracias por compartir los detalles.",
    potential: "ENFOQUE POTENCIAL", book: "Reservar una Llamada de Diagnóstico", noCalendar: "En esta fase no se muestra ningún calendario. El equipo de BRANT·CO revisará la oportunidad y se pondrá en contacto contigo directamente.",
    step: "Paso", of: "de", assistant: "BRANT·CO / DIAGNÓSTICO", you: "TÚ", thinking: "Analizando…",
    answer: "Tu respuesta", answerPlaceholder: "Describe la situación con tus propias palabras…", help: "Enter para enviar · Mayús + Enter para una nueva línea", continue: "Continuar",
    budget: "Rango de inversión en USD", preparing: "Preparando tu resultado…", finish: "Completar Diagnóstico",
    saved: "Tus respuestas se guardan a medida que avanza la conversación. Evita compartir contraseñas o credenciales.",
  },
} as const;

function getErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") return payload.error;
  return fallback;
}

export function DiscoveryExperience({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const storageKey = `brantco-discovery-progress-${locale}`;
  const budgetLabels = budgetLabelsByLocale[locale];
  const [stage, setStage] = useState<"capture" | "discovery" | "result">("capture");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [turn, setTurn] = useState(1);
  const [interaction, setInteraction] = useState<Interaction>("text");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange | null>(null);
  const [result, setResult] = useState<PublicAssessmentResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const idempotencyKeyRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as ResumeState;
      if (!parsed.leadId || parsed.turn < 1 || parsed.turn > 5 || !parsed.question) return;
      const timer = window.setTimeout(() => {
        setLeadId(parsed.leadId);
        setTurn(parsed.turn);
        setInteraction(parsed.interaction);
        setMessages([{ role: "assistant", content: parsed.question, turn: parsed.turn }]);
        setStage("discovery");
      }, 0);
      return () => window.clearTimeout(timer);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const progress = useMemo(() => Array.from({ length: 5 }, (_, index) => index + 1), []);

  function persist(next: ResumeState) {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  async function startAssessment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const nextErrors: Record<string, string> = {};
    if (name.length < 2) nextErrors.name = text.validation.name;
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = text.validation.email;
    if (phone.replace(/\D/g, "").length < 7) nextErrors.phone = text.validation.phone;
    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/leads/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          locale,
          idempotencyKey: (idempotencyKeyRef.current ??= crypto.randomUUID()),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(payload, text.errors.save));
      setLeadId(payload.leadId);
      setTurn(payload.turn);
      setMessages([{ role: "assistant", content: payload.question, turn: payload.turn }]);
      setInteraction("text");
      setStage("discovery");
      persist({ leadId: payload.leadId, turn: payload.turn, question: payload.question, interaction: "text" });
      trackEvent("assessment_started");
      window.setTimeout(() => textareaRef.current?.focus(), 0);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : text.errors.save);
    } finally {
      setBusy(false);
    }
  }

  async function sendAnswer() {
    if (!leadId || busy || draft.trim().length < 2) return;
    const answer = draft.trim();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/discovery/message", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ leadId, turn, message: answer, locale }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(payload, text.errors.process));
      setMessages((current) => [
        ...current,
        { role: "user", content: answer, turn },
        { role: "assistant", content: payload.question, turn: payload.nextTurn },
      ]);
      setDraft("");
      setTurn(payload.nextTurn);
      setInteraction(payload.interaction);
      persist({ leadId, turn: payload.nextTurn, question: payload.question, interaction: payload.interaction });
      trackEvent("assessment_turn_completed", { turn });
      window.setTimeout(() => textareaRef.current?.focus(), 0);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : text.errors.process);
    } finally {
      setBusy(false);
    }
  }

  async function finalizeAssessment() {
    if (!leadId || !selectedBudget || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/discovery/finalize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ leadId, budgetRange: selectedBudget, locale }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(payload, text.errors.complete));
      setResult(payload);
      setStage("result");
      window.localStorage.removeItem(storageKey);
      trackEvent("assessment_completed", { status: payload.status });
      if (payload.status === "qualified") trackEvent("lead_qualified");
      if (payload.status === "nurture") trackEvent("lead_nurture");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : text.errors.complete);
    } finally {
      setBusy(false);
    }
  }

  if (stage === "capture") {
    return (
      <div className="mx-auto max-w-3xl border border-white/10 bg-[#080808] p-5 sm:p-10">
        <div className="border-b border-white/10 pb-7">
          <p className="eyebrow">{text.startEyebrow}</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{text.startTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-white/55">{text.startBody}</p>
        </div>
        <form className="mt-8 grid gap-6" noValidate onSubmit={startAssessment}>
          <div>
            <label className="field-label" htmlFor="lead-name">{text.name}</label>
            <input aria-describedby={fieldErrors.name ? "lead-name-error" : undefined} aria-invalid={Boolean(fieldErrors.name)} autoComplete="name" className="field-control" id="lead-name" maxLength={80} name="name" placeholder={text.namePlaceholder} required />
            {fieldErrors.name ? <p className="field-error" id="lead-name-error">{fieldErrors.name}</p> : null}
          </div>
          <div>
            <label className="field-label" htmlFor="lead-email">{text.email}</label>
            <input aria-describedby={fieldErrors.email ? "lead-email-error" : undefined} aria-invalid={Boolean(fieldErrors.email)} autoComplete="email" className="field-control" id="lead-email" maxLength={254} name="email" placeholder="you@company.com" required type="email" />
            {fieldErrors.email ? <p className="field-error" id="lead-email-error">{fieldErrors.email}</p> : null}
          </div>
          <div>
            <label className="field-label" htmlFor="lead-phone">{text.phone}</label>
            <input aria-describedby={fieldErrors.phone ? "lead-phone-error" : undefined} aria-invalid={Boolean(fieldErrors.phone)} autoComplete="tel" className="field-control" id="lead-phone" inputMode="tel" maxLength={24} name="phone" placeholder="+34 600 000 000" required type="tel" />
            {fieldErrors.phone ? <p className="field-error" id="lead-phone-error">{fieldErrors.phone}</p> : null}
          </div>
          <p className="text-xs leading-6 text-white/45">
            {text.consent} <Link className="underline underline-offset-4 hover:text-white" href="/privacy">{text.privacy}</Link>.
          </p>
          {error ? <p aria-live="polite" className="border-l-2 border-[#A20000] pl-4 text-sm text-white/75">{error}</p> : null}
          <button className="button-brand" disabled={busy} type="submit">{busy ? text.saving : text.start}<span aria-hidden="true">→</span></button>
        </form>
      </div>
    );
  }

  if (stage === "result" && result) {
    const qualified = result.status === "qualified";
    return (
      <div className="mx-auto max-w-3xl border border-white/10 bg-[#121212] p-6 sm:p-10">
        <p className="eyebrow">{text.complete}</p>
        <div className="mb-8 flex items-center gap-3 text-xs font-medium tracking-[0.14em] text-white/45">
          <span className="size-2 rounded-full bg-[#A20000]" />
          {locale === "es" ? { qualified: "CALIFICADO", review: "REVISIÓN", nurture: "SEGUIMIENTO" }[result.status] : result.status.toUpperCase()}
        </div>
        <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">{qualified ? text.qualifiedTitle : text.reviewTitle}</h2>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">{result.message}</p>
        <div className="mt-9 border border-white/10 bg-black p-6">
          <p className="text-xs font-medium tracking-[0.15em] text-white/40">{text.potential}</p>
          <p className="mt-3 text-xl font-semibold">{result.potentialFocus}</p>
        </div>
        {qualified && result.bookingUrl ? (
          <a className="button-brand mt-8" href={result.bookingUrl} onClick={() => trackEvent("book_call_click")} rel="noreferrer" target="_blank">{text.book} <span aria-hidden="true">↗</span></a>
        ) : (
          <p className="mt-8 text-sm leading-7 text-white/50">{text.noCalendar}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-7 flex items-center justify-between gap-5">
        <p className="text-sm font-medium">{text.step} {turn} {text.of} 5</p>
        <div aria-label={`${text.step} ${turn} ${text.of} 5`} className="flex flex-1 justify-end gap-1.5" role="progressbar" aria-valuemax={5} aria-valuemin={1} aria-valuenow={turn}>
          {progress.map((step) => <span className={`h-1 w-8 ${step <= turn ? "bg-[#A20000]" : "bg-white/15"}`} key={step} />)}
        </div>
      </div>

      <div className="border border-white/10 bg-[#080808] p-5 sm:p-9">
        <div className="max-h-[26rem] space-y-5 overflow-y-auto pr-1" aria-live="polite">
          {messages.map((message, index) => (
            <div className={message.role === "user" ? "ml-auto max-w-[88%] border-r-2 border-white/25 bg-[#1C1C1C] p-4" : "max-w-[92%] border-l-2 border-[#A20000] bg-[#121212] p-4"} key={`${message.turn}-${message.role}-${index}`}>
              <p className="mb-2 text-xs font-medium tracking-[0.12em] text-white/35">{message.role === "assistant" ? text.assistant : text.you}</p>
              <p className="whitespace-pre-wrap text-base leading-7 text-white/80">{message.content}</p>
            </div>
          ))}
          {busy ? <p className="text-sm text-white/45">{text.thinking}</p> : null}
        </div>

        {interaction === "text" ? (
          <div className="mt-7 border-t border-white/10 pt-7">
            <label className="sr-only" htmlFor="discovery-answer">{text.answer}</label>
            <textarea
              aria-describedby="discovery-help"
              className="field-control min-h-36 resize-y"
              disabled={busy}
              id="discovery-answer"
              maxLength={3000}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendAnswer();
                }
              }}
              placeholder={text.answerPlaceholder}
              ref={textareaRef}
              value={draft}
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/35" id="discovery-help">{text.help}</p>
              <button className="button-brand sm:w-auto" disabled={busy || draft.trim().length < 2} onClick={() => void sendAnswer()} type="button">{busy ? text.thinking : text.continue}<span aria-hidden="true">→</span></button>
            </div>
          </div>
        ) : (
          <fieldset className="mt-7 border-t border-white/10 pt-7">
            <legend className="sr-only">{text.budget}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {budgetRanges.map((range) => (
                <label className={`cursor-pointer border p-4 text-sm transition-colors ${selectedBudget === range ? "border-[#A20000] bg-[#1C1C1C] text-white" : "border-white/10 bg-black text-white/65 hover:border-white/25"}`} key={range}>
                  <input className="sr-only" name="budget" onChange={() => setSelectedBudget(range)} type="radio" value={range} />
                  <span className="flex items-center justify-between gap-4">{budgetLabels[range]}<span aria-hidden="true" className={`size-2 rounded-full ${selectedBudget === range ? "bg-[#A20000]" : "border border-white/30"}`} /></span>
                </label>
              ))}
            </div>
            <button className="button-brand mt-6" disabled={!selectedBudget || busy} onClick={() => void finalizeAssessment()} type="button">{busy ? text.preparing : text.finish}<span aria-hidden="true">→</span></button>
          </fieldset>
        )}

        {error ? <p aria-live="assertive" className="mt-5 border-l-2 border-[#A20000] pl-4 text-sm leading-6 text-white/75">{error}</p> : null}
      </div>
      <p className="mt-5 text-center text-xs leading-6 text-white/35">{text.saved}</p>
    </div>
  );
}
