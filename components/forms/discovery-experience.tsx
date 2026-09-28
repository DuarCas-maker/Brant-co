"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getQuestionnaire } from "@/content/questionnaire";
import { getServices, getSpecialProject } from "@/content/services";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/config";
import { calculateOpportunityScore, determineQualification, getServiceRecommendation, isBookingAllowed } from "@/lib/qualification/scoring";
import type { ChallengeOption, PublicAssessmentResult, QuestionnaireAnswers } from "@/types/discovery";
import formStyles from "./discovery-experience.module.css";

type ResumeState = { leadId: string; questionIndex: number; answers: Partial<QuestionnaireAnswers>; previewMode?: boolean };
type Props = { locale: Locale; embedded?: boolean; nextPath?: "/diagnostico" };

export const ASSESSMENT_SESSION_KEY = "brantco-assessment-session-v2";

function createClientId() {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

const copy = {
  en: {
    validation: { name: "Enter your name.", email: "Enter a valid email address.", phone: "Enter a valid WhatsApp number.", answer: "Add an answer before continuing.", context: "Please add a little more context (at least 30 characters).", other: "Tell us a little more about your other answer." },
    errors: { save: "We couldn't save your information. Please try again.", complete: "We couldn't complete the form. Please try again." },
    captureTitle: "Where can we contact you?", captureBody: "We ask for this first so your answers are not lost if you stop before finishing.",
    name: "Name", namePlaceholder: "Your name", email: "Email", phone: "WhatsApp",
    consent: "By continuing, you agree that BRANT·CO may use this information to review your request and contact you.",
    privacy: "Privacy policy", saving: "Saving…", start: "Continue to the questions",
    question: "Question", of: "of", chooseMany: "Choose all that apply.", chooseOne: "Choose one option.", other: "Other", otherPlaceholder: "Add a short explanation",
    back: "Back", next: "Continue", finish: "See my recommendation", preparing: "Preparing…", saved: "Your progress is saved on this device.",
    resultTitle: "A clear place to start.", resultBody: "Your answers point to the option highlighted below. You can still review all three services.",
    recommended: "Recommended", secondary: "Also useful", allServices: "Your options", booking: "Schedule a conversation", bookingPending: "You meet the initial conditions for a conversation. The booking link will appear here as soon as it is available.",
    contactSoon: "We will review your answers and contact you with a practical next step.",
    unsure: "Still not sure which path fits?", unsureBody: "Continue with our guided assessment. It will use these five answers and ask only what is needed to understand the situation better.", diagnosis: "Continue with the guided assessment",
    redirecting: "Opening the guided assessment…", special: "Special project",
    preview: "Local preview: Supabase is not connected, so this submission is not being saved.",
  },
  es: {
    validation: { name: "Escribe tu nombre.", email: "Escribe un correo válido.", phone: "Escribe un número de WhatsApp válido.", answer: "Agrega una respuesta antes de continuar.", context: "Cuéntanos un poco más (al menos 30 caracteres).", other: "Cuéntanos un poco más sobre tu otra respuesta." },
    errors: { save: "No pudimos guardar tu información. Inténtalo de nuevo.", complete: "No pudimos completar el formulario. Inténtalo de nuevo." },
    captureTitle: "¿Dónde podemos contactarte?", captureBody: "Te pedimos estos datos al principio para no perder tus respuestas si no alcanzas a terminar.",
    name: "Nombre", namePlaceholder: "Tu nombre", email: "Correo", phone: "WhatsApp",
    consent: "Al continuar, aceptas que BRANT·CO use esta información para revisar tu solicitud y contactarte.",
    privacy: "Política de privacidad", saving: "Guardando…", start: "Continuar a las preguntas",
    question: "Pregunta", of: "de", chooseMany: "Elige todas las opciones que correspondan.", chooseOne: "Elige una opción.", other: "Otra", otherPlaceholder: "Agrega una breve explicación",
    back: "Atrás", next: "Continuar", finish: "Ver mi recomendación", preparing: "Preparando…", saved: "Tu avance queda guardado en este dispositivo.",
    resultTitle: "Un punto claro para empezar.", resultBody: "Tus respuestas señalan la opción destacada. También puedes revisar los tres servicios.",
    recommended: "Recomendado", secondary: "También puede ayudarte", allServices: "Tus opciones", booking: "Agendar una conversación", bookingPending: "Cumples las condiciones iniciales para una conversación. El enlace de agenda aparecerá aquí tan pronto esté disponible.",
    contactSoon: "Revisaremos tus respuestas y te contactaremos con un siguiente paso práctico.",
    unsure: "¿Todavía no sabes cuál elegir?", unsureBody: "Continúa con nuestro diagnóstico guiado. Usará estas cinco respuestas y solo preguntará lo necesario para entender mejor la situación.", diagnosis: "Continuar con el diagnóstico guiado",
    redirecting: "Abriendo el diagnóstico guiado…", special: "Proyecto especial",
    preview: "Vista previa local: Supabase no está conectado, por lo que esta solicitud no se está guardando.",
  },
} as const;

function getErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") return payload.error;
  return fallback;
}

function ContactIcon({ type }: { type: "name" | "email" | "phone" }) {
  if (type === "name") return <svg aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.55" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20c.4-4 2.6-6 6.5-6s6.1 2 6.5 6" /></svg>;
  if (type === "email") return <svg aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.55" viewBox="0 0 24 24"><rect height="14" rx="2" width="18" x="3" y="5" /><path d="m4.5 7 7.5 6 7.5-6" /></svg>;
  return <svg aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.55" viewBox="0 0 24 24"><path d="M8.2 4.5 10 8.2 7.9 10c1 2.5 3 4.5 5.6 5.6l1.9-2.1 3.7 1.8c.2.1.4.4.3.7-.5 2.3-2.1 3.5-4.5 3.5-5.8 0-10.5-4.7-10.5-10.5 0-2.4 1.2-4 3.5-4.5.1-.1.2-.1.3 0Z" /><path d="M6.2 19.2 4 20l.8-2.2" /></svg>;
}

export function DiscoveryExperience({ locale, embedded = false, nextPath }: Props) {
  const router = useRouter();
  const text = copy[locale];
  const questions = useMemo(() => getQuestionnaire(locale), [locale]);
  const services = useMemo(() => getServices(locale), [locale]);
  const special = useMemo(() => getSpecialProject(locale), [locale]);
  const storageKey = "brantco-questionnaire-progress-v2";
  const [stage, setStage] = useState<"capture" | "questionnaire" | "result">("capture");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({ challenges: [] });
  const [result, setResult] = useState<PublicAssessmentResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const idempotencyKeyRef = useRef<string | null>(null);
  const currentQuestion = questions[questionIndex]!;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as ResumeState;
      if (!parsed.leadId || !Number.isInteger(parsed.questionIndex) || parsed.questionIndex < 0 || parsed.questionIndex >= questions.length) return;
      const timer = window.setTimeout(() => {
        setLeadId(parsed.leadId);
        setQuestionIndex(parsed.questionIndex);
        setAnswers(parsed.answers || { challenges: [] });
        setPreviewMode(Boolean(parsed.previewMode));
        setStage("questionnaire");
      }, 0);
      return () => window.clearTimeout(timer);
    } catch { window.localStorage.removeItem(storageKey); }
  }, [questions.length]);

  function persist(next: ResumeState) { window.localStorage.setItem(storageKey, JSON.stringify(next)); }

  function beginQuestionnaire(nextLeadId: string, isPreview: boolean) {
    const freshAnswers: Partial<QuestionnaireAnswers> = { challenges: [] };
    setLeadId(nextLeadId);
    setAnswers(freshAnswers);
    setQuestionIndex(0);
    setPreviewMode(isPreview);
    setStage("questionnaire");
    persist({ leadId: nextLeadId, questionIndex: 0, answers: freshAnswers, previewMode: isPreview });
    trackEvent("assessment_started", { preview: isPreview });
  }

  function localResult(completeAnswers: QuestionnaireAnswers): PublicAssessmentResult {
    const score = calculateOpportunityScore(completeAnswers);
    const status = determineQualification(completeAnswers, score.total);
    const recommendation = getServiceRecommendation(completeAnswers);
    const bookingEligible = isBookingAllowed(completeAnswers, status);
    return {
      status,
      primaryService: recommendation.primary,
      secondaryServices: recommendation.secondary,
      message: locale === "es" ? "Esta vista previa calculó un punto de partida con tus respuestas. Conecta Supabase para guardar la solicitud y activar el seguimiento." : "This preview calculated a starting point from your answers. Connect Supabase to save the request and enable follow-up.",
      bookingEligible,
      bookingUrl: null,
      shouldStartDiagnosis: recommendation.primary === "unclear",
    };
  }

  function completeAssessment(finalResult: PublicAssessmentResult, completeAnswers: QuestionnaireAnswers, isPreview: boolean) {
    setResult(finalResult);
    setPreviewMode(isPreview);
    setStage("result");
    window.localStorage.removeItem(storageKey);
    window.localStorage.setItem(ASSESSMENT_SESSION_KEY, JSON.stringify({ leadId, answers: completeAnswers, result: finalResult, locale, previewMode: isPreview, completedAt: new Date().toISOString() }));
    trackEvent("assessment_completed", { status: finalResult.status, preview: isPreview });
    const autoDiagnosis = nextPath === "/diagnostico" || finalResult.shouldStartDiagnosis;
    if (autoDiagnosis) window.setTimeout(() => router.push("/diagnostico"), 1400);
  }

  async function startAssessment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const nextErrors: Record<string, string> = {};
    if (name.length < 2) nextErrors.name = text.validation.name;
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = text.validation.email;
    if (phone.replace(/\D/g, "").length < 7) nextErrors.phone = text.validation.phone;
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    try {
      const response = await fetch("/api/leads/start", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, email, phone, locale, idempotencyKey: (idempotencyKeyRef.current ??= createClientId()) }) });
      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 503 && process.env.NODE_ENV === "development") {
          beginQuestionnaire(createClientId(), true);
          return;
        }
        throw new Error(getErrorMessage(payload, text.errors.save));
      }
      beginQuestionnaire(payload.leadId, false);
    } catch (caught) { setError(caught instanceof Error ? caught.message : text.errors.save); }
    finally { setBusy(false); }
  }

  function setAnswer(patch: Partial<QuestionnaireAnswers>) {
    if (!leadId) return;
    const next = { ...answers, ...patch };
    setAnswers(next);
    persist({ leadId, questionIndex, answers: next, previewMode });
    setError("");
  }

  function toggleChallenge(value: ChallengeOption) {
    const current = answers.challenges || [];
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    setAnswer({ challenges: next });
  }

  function isCurrentValid() {
    if (currentQuestion.id === "challenges") {
      const selected = answers.challenges || [];
      if (!selected.length) return false;
      return !selected.includes("other") || Boolean(answers.challengeOther?.trim());
    }
    if (currentQuestion.id === "priority") return Boolean(answers.priority) && (answers.priority !== "other" || Boolean(answers.priorityOther?.trim()));
    if (currentQuestion.id === "decisionStage") return Boolean(answers.decisionStage);
    if (currentQuestion.id === "budgetRange") return Boolean(answers.budgetRange);
    return (answers.businessContext?.trim().length || 0) >= 30;
  }

  function validationMessage() {
    if (currentQuestion.id === "businessContext") return text.validation.context;
    if (currentQuestion.id === "challenges" && answers.challenges?.includes("other") && !answers.challengeOther?.trim()) return text.validation.other;
    if (currentQuestion.id === "priority" && answers.priority === "other" && !answers.priorityOther?.trim()) return text.validation.other;
    return text.validation.answer;
  }

  async function finalizeAssessment() {
    if (!leadId || busy) return;
    setBusy(true);
    setError("");
    const completeAnswers = answers as QuestionnaireAnswers;
    try {
      if (previewMode) {
        completeAssessment(localResult(completeAnswers), completeAnswers, true);
        return;
      }
      const response = await fetch("/api/discovery/finalize", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ leadId, answers, locale }) });
      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 503 && process.env.NODE_ENV === "development") {
          completeAssessment(localResult(completeAnswers), completeAnswers, true);
          return;
        }
        throw new Error(getErrorMessage(payload, text.errors.complete));
      }
      const finalResult = payload as PublicAssessmentResult;
      completeAssessment(finalResult, completeAnswers, false);
    } catch (caught) { setError(caught instanceof Error ? caught.message : text.errors.complete); }
    finally { setBusy(false); }
  }

  function continueAssessment() {
    if (!isCurrentValid()) { setError(validationMessage()); return; }
    trackEvent("assessment_turn_completed", { turn: questionIndex + 1 });
    if (questionIndex === questions.length - 1) { void finalizeAssessment(); return; }
    if (!leadId) return;
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    persist({ leadId, questionIndex: nextIndex, answers, previewMode });
    setError("");
  }

  function goBack() {
    if (!leadId || questionIndex === 0 || busy) return;
    const previous = questionIndex - 1;
    setQuestionIndex(previous);
    persist({ leadId, questionIndex: previous, answers, previewMode });
    setError("");
  }

  const shell = embedded ? formStyles.embeddedShell : "mx-auto max-w-4xl";

  if (stage === "capture") {
    return (
      <div className={`${shell} ${formStyles.captureCard}`}>
        <div className={formStyles.captureHeader}><h2>{text.captureTitle}</h2><p>{text.captureBody}</p></div>
        <form className={formStyles.captureForm} noValidate onSubmit={startAssessment}>
          <div className={formStyles.captureGrid}>
            <div className={formStyles.captureField}><label htmlFor="lead-name">{text.name}</label><div className={formStyles.inputWrap}><ContactIcon type="name" /><input aria-invalid={Boolean(fieldErrors.name)} autoComplete="name" id="lead-name" maxLength={80} name="name" placeholder={text.namePlaceholder} /></div>{fieldErrors.name ? <p className={formStyles.captureFieldError}>{fieldErrors.name}</p> : null}</div>
            <div className={formStyles.captureField}><label htmlFor="lead-email">{text.email}</label><div className={formStyles.inputWrap}><ContactIcon type="email" /><input aria-invalid={Boolean(fieldErrors.email)} autoComplete="email" id="lead-email" maxLength={254} name="email" placeholder="you@company.com" type="email" /></div>{fieldErrors.email ? <p className={formStyles.captureFieldError}>{fieldErrors.email}</p> : null}</div>
          </div>
          <div className={formStyles.captureField}><label htmlFor="lead-phone">{text.phone}</label><div className={formStyles.inputWrap}><ContactIcon type="phone" /><input aria-invalid={Boolean(fieldErrors.phone)} autoComplete="tel" id="lead-phone" inputMode="tel" maxLength={24} name="phone" placeholder="+34 600 000 000" type="tel" /></div>{fieldErrors.phone ? <p className={formStyles.captureFieldError}>{fieldErrors.phone}</p> : null}</div>
          <p className={formStyles.consent}>{text.consent} <Link href="/privacy">{text.privacy}</Link>.</p>
          {error ? <p aria-live="polite" className={formStyles.captureError}>{error}</p> : null}
          <button className={`button-brand ${formStyles.captureSubmit}`} disabled={busy} type="submit">{busy ? text.saving : text.start}<span aria-hidden="true">→</span></button>
        </form>
      </div>
    );
  }

  if (stage === "result" && result) {
    return (
      <div className={`${shell} border border-white/10 bg-[#0c0c0c] p-6 text-white shadow-2xl sm:p-10`}>
        {previewMode ? <p className="mb-7 border border-[#d85c5c]/40 bg-[#a20000]/15 p-4 text-xs leading-6 text-white/70">{text.preview}</p> : null}
        <h2 className="text-3xl font-semibold tracking-[-.045em] sm:text-5xl">{text.resultTitle}</h2><p className="mt-5 max-w-2xl text-base leading-8 text-white/60">{result.message || text.resultBody}</p>
        <h3 className="mt-10 text-sm font-semibold">{text.allServices}</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {services.map((service) => {
            const primary = result.primaryService === service.id;
            const secondary = result.secondaryServices.includes(service.id);
            return <article className={`border p-5 ${primary ? "border-[#a20000] bg-[#a20000]/15" : "border-white/10 bg-black"}`} key={service.id}>{primary ? <span className="text-xs font-semibold text-[#d85c5c]">{text.recommended}</span> : secondary ? <span className="text-xs text-white/45">{text.secondary}</span> : null}<h4 className="mt-4 text-lg font-semibold">{service.title}</h4><p className="mt-3 text-sm leading-6 text-white/50">{service.summary}</p></article>;
          })}
        </div>
        {result.primaryService === "special" ? <div className="mt-3 border border-[#a20000] bg-[#a20000]/15 p-5"><span className="text-xs text-[#d85c5c]">{text.recommended}</span><h3 className="mt-3 text-xl font-semibold">{special.title}</h3><p className="mt-2 text-sm text-white/55">{special.description}</p></div> : null}
        <div className="mt-8 border-t border-white/10 pt-7">
          {result.bookingEligible && result.bookingUrl ? <a className="button-brand" href={result.bookingUrl} rel="noreferrer" target="_blank">{text.booking} <span aria-hidden="true">↗</span></a> : <p className="text-sm leading-7 text-white/55">{result.bookingEligible ? text.bookingPending : text.contactSoon}</p>}
        </div>
        <div className="mt-8 border border-white/10 bg-black p-6"><h3 className="text-xl font-semibold">{text.unsure}</h3><p className="mt-3 text-sm leading-7 text-white/55">{text.unsureBody}</p><Link className="button-secondary mt-5" href="/diagnostico">{text.diagnosis} <span aria-hidden="true">→</span></Link>{(nextPath === "/diagnostico" || result.shouldStartDiagnosis) ? <p aria-live="polite" className="mt-4 text-xs text-white/40">{text.redirecting}</p> : null}</div>
      </div>
    );
  }

  const renderOptions = () => {
    if (currentQuestion.kind === "text") return <textarea className="min-h-52 w-full resize-y border border-black/15 bg-[#f5f3ef] p-4 text-sm leading-7 outline-none focus:border-[#a20000]" maxLength={2000} onChange={(event) => setAnswer({ businessContext: event.target.value })} placeholder={currentQuestion.help} value={answers.businessContext || ""} />;
    const options = [...(currentQuestion.options || []), ...(currentQuestion.allowOther ? [{ value: "other", label: text.other }] : [])];
    return <div className="grid gap-3">{options.map((option) => {
      const isChallenges = currentQuestion.id === "challenges";
      const selected = isChallenges ? answers.challenges?.includes(option.value as ChallengeOption) : answers[currentQuestion.id as "priority" | "decisionStage" | "budgetRange"] === option.value;
      return <div key={option.value}><label className={`block cursor-pointer border p-4 text-sm leading-6 transition-colors ${selected ? "border-[#a20000] bg-[#a20000]/5 text-black" : "border-black/10 bg-white text-black/65 hover:border-black/30"}`}><input checked={Boolean(selected)} className="sr-only" name={currentQuestion.id} onChange={() => {
        if (isChallenges) toggleChallenge(option.value as ChallengeOption);
        else if (currentQuestion.id === "priority") setAnswer({ priority: option.value as QuestionnaireAnswers["priority"] });
        else if (currentQuestion.id === "decisionStage") setAnswer({ decisionStage: option.value as QuestionnaireAnswers["decisionStage"] });
        else setAnswer({ budgetRange: option.value as QuestionnaireAnswers["budgetRange"] });
      }} type={isChallenges ? "checkbox" : "radio"} value={option.value} /><span className="flex items-center justify-between gap-4">{option.label}<span aria-hidden="true" className={`size-3 shrink-0 ${isChallenges ? "rounded-sm" : "rounded-full"} ${selected ? "bg-[#a20000]" : "border border-black/30"}`} /></span></label>
      {selected && option.value === "other" ? <input aria-label={text.other} className="mt-2 w-full border border-black/15 bg-white p-3 text-sm outline-none focus:border-[#a20000]" maxLength={300} onChange={(event) => {
        if (currentQuestion.id === "challenges") setAnswer({ challengeOther: event.target.value });
        if (currentQuestion.id === "priority") setAnswer({ priorityOther: event.target.value });
      }} placeholder={text.otherPlaceholder} value={currentQuestion.id === "challenges" ? answers.challengeOther || "" : answers.priorityOther || ""} /> : null}</div>;
    })}</div>;
  };

  return (
    <div className={shell}>
      <div className="mb-6 flex items-center justify-between gap-5 text-black"><p className="text-sm font-semibold">{text.question} {questionIndex + 1} {text.of} {questions.length}</p><div aria-label={`${text.question} ${questionIndex + 1} ${text.of} ${questions.length}`} className="flex flex-1 justify-end gap-1.5" role="progressbar" aria-valuemax={questions.length} aria-valuemin={1} aria-valuenow={questionIndex + 1}>{questions.map((question, index) => <span className={`h-1 w-9 ${index <= questionIndex ? "bg-[#a20000]" : "bg-black/15"}`} key={question.id} />)}</div></div>
      <div className="border border-black/10 bg-white p-5 text-black shadow-[0_2rem_6rem_rgba(0,0,0,.1)] sm:p-9"><fieldset disabled={busy}><legend className="text-2xl font-semibold leading-tight tracking-[-.035em] sm:text-3xl">{currentQuestion.title}</legend>{currentQuestion.kind !== "text" ? <p className="mt-3 text-sm leading-7 text-black/50">{currentQuestion.help || (currentQuestion.kind === "multi" ? text.chooseMany : text.chooseOne)}</p> : null}<div className="mt-7">{renderOptions()}</div></fieldset>
        {previewMode ? <p className="mt-6 border border-[#a20000]/25 bg-[#a20000]/5 p-4 text-xs leading-6 text-black/60">{text.preview}</p> : null}
        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:justify-between">{questionIndex > 0 ? <button className="button-secondary !border-black/15 !text-black hover:!bg-black hover:!text-white" disabled={busy} onClick={goBack} type="button">← {text.back}</button> : <span />}<button className="button-brand" disabled={busy} onClick={continueAssessment} type="button">{busy ? text.preparing : questionIndex === questions.length - 1 ? text.finish : text.next}<span aria-hidden="true">→</span></button></div>
        {error ? <p aria-live="assertive" className="mt-5 border-l-2 border-[#a20000] pl-4 text-sm">{error}</p> : null}
      </div><p className="mt-5 text-center text-xs text-black/40">{text.saved}</p>
    </div>
  );
}
