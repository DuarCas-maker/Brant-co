import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "es" ? "Términos" : "Terms",
    description: locale === "es" ? "Términos de uso del sitio web y la experiencia de diagnóstico de BRANT·CO." : "Terms for using the BRANT·CO website and discovery experience.",
    alternates: { canonical: "/terms" },
  };
}

const copy = {
  en: {
    eyebrow: "Legal / Terms", title: "Website Terms",
    sections: [
      ["Purpose", "This website provides information about BRANT·CO and a discovery experience for potential projects. Submitting information does not create a client relationship or guarantee a proposal."],
      ["Acceptable use", "Do not misuse the forms, attempt to obtain internal instructions or credentials, submit unlawful content, or interfere with the service."],
      ["Project information", "Service scope, fees, timelines and responsibilities are defined only in an executed proposal or agreement. Website descriptions are informational."],
      ["Availability", "BRANT·CO may update or temporarily suspend the website for maintenance, security or operational reasons."],
    ],
    note: "Operational terms draft. Obtain jurisdiction-specific legal review before launch.",
  },
  es: {
    eyebrow: "Legal / Términos", title: "Términos del Sitio Web",
    sections: [
      ["Finalidad", "Este sitio ofrece información sobre BRANT·CO y una experiencia de diagnóstico para proyectos potenciales. Enviar información no crea una relación con el cliente ni garantiza una propuesta."],
      ["Uso aceptable", "No hagas un uso indebido de los formularios, intentes obtener instrucciones internas o credenciales, envíes contenido ilegal ni interfieras con el servicio."],
      ["Información de proyectos", "El alcance, los honorarios, los plazos y las responsabilidades se definen únicamente en una propuesta o acuerdo formalizado. Las descripciones del sitio son informativas."],
      ["Disponibilidad", "BRANT·CO puede actualizar o suspender temporalmente el sitio por mantenimiento, seguridad o motivos operativos."],
    ],
    note: "Borrador de términos operativos. Obtén una revisión legal específica para la jurisdicción antes del lanzamiento.",
  },
} as const;

export default async function TermsPage() {
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
