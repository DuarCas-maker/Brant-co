import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "es" ? "Privacidad" : "Privacy",
    description: locale === "es" ? "Cómo gestiona BRANT·CO la información enviada mediante el diagnóstico." : "How BRANT·CO handles information submitted through the discovery experience.",
    alternates: { canonical: "/privacy" },
  };
}

const copy = {
  en: {
    eyebrow: "Legal / Privacy", title: "Privacy Policy",
    sections: [
      ["Information we collect", "The discovery experience collects your name, email address, WhatsApp number and the business information you choose to provide."],
      ["How we use it", "BRANT·CO uses this information to evaluate your request, understand the operating problem and contact you about relevant next steps. We do not ask you to include passwords, payment data or confidential credentials."],
      ["AI-assisted processing", "Your discovery responses may be processed through a configured AI service to structure the information and prepare an internal opportunity brief. Access keys remain server-side."],
      ["Storage and access", "Submitted data is stored in the configured Supabase project. Access should be limited to authorized BRANT·CO operators and protected with server-side credentials and database policies."],
      ["Your choices", "You may request access, correction or deletion using the contact address configured for this website. Final legal contact and retention details must be completed before public launch."],
    ],
    note: "Operational policy draft. Obtain jurisdiction-specific legal review before launch.",
  },
  es: {
    eyebrow: "Legal / Privacidad", title: "Política de Privacidad",
    sections: [
      ["Información que recopilamos", "La experiencia de diagnóstico recopila tu nombre, dirección de email, número de WhatsApp y la información empresarial que decidas proporcionar."],
      ["Cómo la utilizamos", "BRANT·CO utiliza esta información para evaluar tu solicitud, comprender el problema operativo y contactarte sobre los siguientes pasos relevantes. No te pedimos contraseñas, datos de pago ni credenciales confidenciales."],
      ["Procesamiento asistido por IA", "Tus respuestas pueden ser procesadas mediante un servicio de IA configurado para estructurar la información y preparar un informe interno de oportunidad. Las claves de acceso permanecen en el servidor."],
      ["Almacenamiento y acceso", "Los datos enviados se almacenan en el proyecto de Supabase configurado. El acceso debe limitarse a operadores autorizados de BRANT·CO y protegerse con credenciales de servidor y políticas de base de datos."],
      ["Tus opciones", "Puedes solicitar acceso, corrección o eliminación mediante la dirección de contacto configurada para este sitio. Los datos legales definitivos de contacto y conservación deben completarse antes del lanzamiento público."],
    ],
    note: "Borrador de política operativa. Obtén una revisión legal específica para la jurisdicción antes del lanzamiento.",
  },
} as const;

export default async function PrivacyPage() {
  const text = copy[await getLocale()];
  return (
    <main id="main-content" className="pt-[var(--header-height)]">
      <article className="container-shell section-shell max-w-4xl">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1 className="page-title">{text.title}</h1>
        <div className="mt-12 grid gap-9 text-base leading-8 text-white/65">
          {text.sections.map(([title, body]) => <section key={title}><h2 className="text-xl font-semibold text-white">{title}</h2><p className="mt-3">{body}</p></section>)}
          <p className="border-l-2 border-[#A20000] pl-4 text-sm text-white/45">{text.note}</p>
        </div>
      </article>
    </main>
  );
}
