import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { getPublicContactEmail } from "@/content/site";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: "PQRS", description: locale === "es" ? "Canal de preguntas, peticiones, quejas, reclamos y sugerencias de BRANT·CO." : "BRANT·CO channel for questions, requests, complaints, claims and suggestions.", alternates: { canonical: "/pqrs" } };
}

export default async function PqrsPage() {
  const locale = await getLocale();
  const email = getPublicContactEmail();
  const text = locale === "es"
    ? { title: "Estamos aquí para escucharte.", body: "Puedes enviarnos preguntas, peticiones, quejas, reclamos o sugerencias. Describe lo ocurrido y la respuesta que esperas para que podamos ayudarte con claridad.", action: "Escribir al equipo", fallback: "El correo público se añadirá antes del lanzamiento. Mientras tanto, puedes usar el formulario general.", form: "Ir al formulario" }
    : { title: "We are here to listen.", body: "You can send questions, requests, complaints, claims or suggestions. Describe what happened and the response you expect so we can help clearly.", action: "Email the team", fallback: "The public email will be added before launch. In the meantime, you can use the general form.", form: "Go to the form" };
  return <main id="main-content" className="min-h-screen pt-[var(--header-height)]"><section className="section-shell"><div className="container-shell grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-start"><h1 className="page-title">{text.title}</h1><div className="border border-white/10 bg-[#121212] p-7 sm:p-10"><p className="text-lg leading-9 text-white/75">{text.body}</p>{email ? <a className="button-brand mt-8" href={`mailto:${email}?subject=PQRS%20BRANT.CO`}>{text.action} <span aria-hidden="true">→</span></a> : <><p className="mt-7 text-sm leading-7 text-white/50">{text.fallback}</p><ButtonLink className="mt-5" href="/forms" variant="secondary">{text.form} <span aria-hidden="true">→</span></ButtonLink></>}</div></div></section></main>;
}
