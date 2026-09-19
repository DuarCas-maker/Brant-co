import Image from "next/image";
import Link from "next/link";
import { getPublicContactEmail, getSiteConfig } from "@/content/site";
import { getServices } from "@/content/services";
import type { Locale } from "@/lib/i18n/config";

export function Footer({ locale }: { locale: Locale }) {
  const contactEmail = getPublicContactEmail();
  const siteConfig = getSiteConfig(locale);
  const services = getServices(locale);

  return (
    <footer className="border-t border-white/10 bg-black py-12 sm:py-16">
      <div className="container-shell grid gap-12 lg:grid-cols-[1.35fr_0.75fr_0.9fr]">
        <div>
          <Image alt="BRANT·CO — Digital Growth Systems" height={480} src="/brand/brantco-logo-dark.png" width={1510} className="h-auto w-56" />
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
            {locale === "es"
              ? "Marketing, operaciones comerciales y automatización trabajando como un único sistema conectado."
              : "Marketing, sales operations and automation working as one connected system."}
          </p>
          {contactEmail ? (
            <a className="mt-5 inline-block text-sm font-medium underline decoration-white/25 underline-offset-4 hover:decoration-white" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
          ) : null}
        </div>
        <div>
          <p className="eyebrow mb-4">{locale === "es" ? "Navegar" : "Navigate"}</p>
          <nav aria-label={locale === "es" ? "Navegación del pie" : "Footer navigation"} className="grid gap-3">
            {siteConfig.navigation.map((item) => (
              <Link className="text-sm text-white/65 hover:text-white" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <p className="eyebrow mb-4">{locale === "es" ? "Sistemas" : "Systems"}</p>
          <div className="grid gap-3">
            {services.map((service) => (
              <Link className="text-sm leading-6 text-white/65 hover:text-white" href={`/servicios#${service.id}`} key={service.id}>
                {service.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="container-shell mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} BRANT·CO. {locale === "es" ? "Todos los derechos reservados." : "All rights reserved."}</p>
        <div className="flex gap-5">
          <Link href="/privacy">{locale === "es" ? "Privacidad" : "Privacy"}</Link>
          <Link href="/terms">{locale === "es" ? "Términos" : "Terms"}</Link>
        </div>
      </div>
    </footer>
  );
}
