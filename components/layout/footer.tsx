import Image from "next/image";
import Link from "next/link";
import { getPublicContactEmail, getSiteConfig } from "@/content/site";
import { getServices } from "@/content/services";
import type { Locale } from "@/lib/i18n/config";

export function Footer({ locale }: { locale: Locale }) {
  const contactEmail = getPublicContactEmail();
  const site = getSiteConfig(locale);
  const services = getServices(locale);
  return (
    <footer className="border-t border-white/10 bg-black py-12 sm:py-16">
      <div className="container-shell grid gap-12 lg:grid-cols-[1.35fr_.75fr_.9fr]">
        <div><Image alt="BRANT·CO" className="h-auto w-56" height={146} src="/brand/brantco-logo-dark.png" width={465} /><p className="mt-6 max-w-sm text-sm leading-7 text-white/55">{site.tagline}</p>{contactEmail ? <a className="mt-5 inline-block text-sm underline underline-offset-4" href={`mailto:${contactEmail}`}>{contactEmail}</a> : null}</div>
        <div><h2 className="mb-4 text-sm font-semibold">{locale === "es" ? "Navegar" : "Navigate"}</h2><nav className="grid gap-3">{site.navigation.map((item) => <Link className="text-sm text-white/60 hover:text-white" href={item.href} key={item.href}>{item.label}</Link>)}</nav></div>
        <div><h2 className="mb-4 text-sm font-semibold">{locale === "es" ? "Cómo ayudamos" : "How we help"}</h2><div className="grid gap-3">{services.map((service) => <Link className="text-sm leading-6 text-white/60 hover:text-white" href={`/servicios#${service.id}`} key={service.id}>{service.title}</Link>)}</div></div>
      </div>
      <div className="container-shell mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} BRANT·CO.</p><div className="flex gap-5"><Link href="/privacy">{locale === "es" ? "Privacidad" : "Privacy"}</Link><Link href="/terms">{locale === "es" ? "Términos" : "Terms"}</Link></div></div>
    </footer>
  );
}
