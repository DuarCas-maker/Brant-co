import type { Locale } from "@/lib/i18n/config";

export const prsContentByLocale = {
  en: {
    eyebrow: "BRANT·CO / PRS",
    title: "PRS",
    body: "PRS content is being prepared. If you'd like to discuss a project with BRANT·CO, start with our discovery form.",
    status: "Editorial definition pending",
  },
  es: {
    eyebrow: "BRANT·CO / PRS",
    title: "PRS",
    body: "El contenido de PRS está en preparación. Si quieres hablar de un proyecto con BRANT·CO, comienza con nuestro formulario de diagnóstico.",
    status: "Definición editorial pendiente",
  },
} as const satisfies Record<Locale, object>;

export function getPrsContent(locale: Locale) {
  return prsContentByLocale[locale];
}
