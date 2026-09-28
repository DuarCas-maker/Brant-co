import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: locale === "es" ? "Privacidad" : "Privacy", description: locale === "es" ? "Cómo gestiona BRANT·CO la información del formulario y del diagnóstico guiado." : "How BRANT·CO handles information from the form and guided assessment.", alternates: { canonical: "/privacy" } };
}
const copy = {
  en: {
    title: "Privacy policy",
    sections: [
      ["Information we collect", "The form collects your name, email, WhatsApp number and answers about your business needs, priority, decision stage, investment range and current situation."],
      ["How we use it", "We use this information to understand your request, recommend a starting point and contact you about useful next steps. Do not include passwords, payment information or confidential credentials."],
      ["How the recommendation works", "The first recommendation uses fixed rules. If you choose the guided assessment, only your five business answers and the messages you write there are sent to OpenAI to prepare follow-up questions and a summary. Your name, email and WhatsApp number are not sent to OpenAI."],
      ["Storage and access", "Submitted information and the guided conversation are stored in the configured Supabase project. Access should be limited to authorized BRANT·CO team members."],
      ["Your choices", "You may request access, correction or deletion through the contact address published on this website. Final contact and retention details must be completed before public launch."],
    ],
    note: "Operational policy draft. Obtain legal review for the countries where the service will operate before launch.",
  },
  es: {
    title: "Política de privacidad",
    sections: [
      ["Información que recopilamos", "El formulario recopila tu nombre, correo, número de WhatsApp y respuestas sobre las necesidades de la empresa, la prioridad, el estado de la decisión, el rango de inversión y la situación actual."],
      ["Cómo la utilizamos", "Usamos esta información para entender tu solicitud, recomendar un punto de partida y contactarte sobre los siguientes pasos. No incluyas contraseñas, datos de pago ni credenciales confidenciales."],
      ["Cómo funciona la recomendación", "La primera recomendación usa reglas fijas. Si eliges el diagnóstico guiado, solo enviamos a OpenAI las cinco respuestas sobre la empresa y los mensajes que escribas allí para preparar preguntas de seguimiento y un resumen. Tu nombre, correo y WhatsApp no se envían a OpenAI."],
      ["Almacenamiento y acceso", "La información enviada y la conversación guiada se guardan en el proyecto de Supabase configurado. El acceso debe limitarse a integrantes autorizados del equipo de BRANT·CO."],
      ["Tus opciones", "Puedes solicitar acceso, corrección o eliminación mediante la dirección de contacto publicada en este sitio. Los datos definitivos de contacto y conservación deben completarse antes del lanzamiento público."],
    ],
    note: "Borrador de política operativa. Antes del lanzamiento, debe revisarse legalmente para los países donde operará el servicio.",
  },
} as const;

export default async function PrivacyPage() {
  const text = copy[await getLocale()];
  return <main id="main-content" className="pt-[var(--header-height)]"><article className="container-shell section-shell max-w-4xl"><h1 className="page-title">{text.title}</h1><div className="mt-12 grid gap-9 text-base leading-8 text-white/65">{text.sections.map(([title, body]) => <section key={title}><h2 className="text-xl font-semibold text-white">{title}</h2><p className="mt-3">{body}</p></section>)}<p className="border-l-2 border-[#a20000] pl-4 text-sm text-white/45">{text.note}</p></div></article></main>;
}
