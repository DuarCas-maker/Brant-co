"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSiteConfig } from "@/content/site";
import { LanguageToggle } from "@/components/ui/language-toggle";
import type { Locale } from "@/lib/i18n/config";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const siteConfig = getSiteConfig(locale);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>('a, button:not([disabled])');
    focusable?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-2xl">
      <div className="container-shell flex h-[var(--header-height)] items-center justify-between gap-6">
        <Link aria-label="BRANT·CO home" href="/">
          <Image
            alt="BRANT·CO — Digital Growth Systems"
            className="h-auto w-[clamp(10rem,18vw,13.5rem)]"
            height={480}
            priority
            src="/brand/brantco-logo-dark.png"
            width={1510}
          />
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          <nav aria-label={locale === "es" ? "Navegación principal" : "Primary navigation"} className="flex items-center gap-6">
            {siteConfig.navigation.map((item) => (
              <Link
                aria-current={pathname === item.href ? "page" : undefined}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white aria-[current=page]:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <LanguageToggle locale={locale} />
          <Link className="button-brand min-h-11 px-4" href="/forms">
            {locale === "es" ? "Reservar llamada" : "Book a Call"} <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle locale={locale} />
          <button
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label={open ? (locale === "es" ? "Cerrar navegación" : "Close navigation") : (locale === "es" ? "Abrir navegación" : "Open navigation")}
          className="relative z-10 grid size-11 place-items-center rounded-lg border border-white/15 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          ref={buttonRef}
          type="button"
        >
          <span aria-hidden="true" className="grid gap-1.5">
            <span className={`block h-px w-5 bg-white transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-white transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          aria-label={locale === "es" ? "Navegación del sitio" : "Site navigation"}
          aria-modal="true"
          className="fixed inset-0 top-[var(--header-height)] min-h-[calc(100dvh-var(--header-height))] bg-black lg:hidden"
          id="mobile-navigation"
          ref={panelRef}
          role="dialog"
        >
          <nav aria-label={locale === "es" ? "Navegación móvil" : "Mobile navigation"} className="container-shell flex min-h-[calc(100dvh-var(--header-height))] flex-col justify-between py-10">
            <div className="grid">
              {siteConfig.navigation.map((item, index) => (
                <Link
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex items-center justify-between border-b border-white/10 py-5 text-2xl font-semibold tracking-[-0.03em]"
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <span className="text-xs font-medium tracking-normal text-white/40">0{index + 1}</span>
                </Link>
              ))}
            </div>
            <Link className="button-brand mt-10" href="/forms">
              {locale === "es" ? "Iniciar diagnóstico" : "Start the assessment"} <span aria-hidden="true">→</span>
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
