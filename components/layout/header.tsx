"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { getSiteConfig } from "@/content/site";
import type { Locale } from "@/lib/i18n/config";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const site = getSiteConfig(locale);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>("a, button:not([disabled])");
    focusable?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-2xl">
      <div className="container-shell flex h-[var(--header-height)] items-center justify-between gap-5">
        <Link aria-label="BRANT·CO home" className="flex h-full shrink-0 items-center" href="/"><Image alt="BRANT·CO" height={146} priority src="/brand/brantco-logo-dark.png" style={{ display: "block", height: "3rem", maxWidth: "34vw", objectFit: "contain", width: "auto" }} width={465} /></Link>
        <div className="hidden min-w-0 items-center gap-4 lg:flex">
          <nav aria-label={locale === "es" ? "Navegación principal" : "Primary navigation"} className="flex items-center gap-4 whitespace-nowrap xl:gap-5">
            {site.navigation.map((item) => <Link aria-current={pathname === item.href ? "page" : undefined} className="text-[.78rem] font-medium text-white/65 transition-colors hover:text-white aria-[current=page]:text-white" href={item.href} key={item.href}>{item.label}</Link>)}
          </nav>
          <LanguageToggle locale={locale} />
          <Link className="button-brand hidden min-h-11 px-4 2xl:inline-flex" href="/forms">{locale === "es" ? "Cuéntanos tu reto" : "Tell us your challenge"} <span aria-hidden="true">→</span></Link>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle locale={locale} />
          <button aria-controls="mobile-navigation" aria-expanded={open} aria-label={open ? (locale === "es" ? "Cerrar navegación" : "Close navigation") : (locale === "es" ? "Abrir navegación" : "Open navigation")} className="relative z-10 grid size-11 place-items-center rounded-full border border-white/15" onClick={() => setOpen((value) => !value)} ref={buttonRef} type="button">
            <span aria-hidden="true" className="grid gap-1.5"><span className={`block h-px w-5 bg-white transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} /><span className={`block h-px w-5 bg-white transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} /></span>
          </button>
        </div>
      </div>
      {open ? (
        <div aria-label={locale === "es" ? "Navegación del sitio" : "Site navigation"} aria-modal="true" className="fixed inset-0 top-[var(--header-height)] z-40 min-h-[calc(100dvh-var(--header-height))] overflow-y-auto bg-black lg:hidden" id="mobile-navigation" ref={panelRef} role="dialog">
          <nav className="container-shell flex min-h-[calc(100dvh-var(--header-height))] flex-col justify-between py-8">
            <div className="grid">{site.navigation.map((item) => <Link aria-current={pathname === item.href ? "page" : undefined} className="border-b border-white/10 py-4 text-2xl font-semibold tracking-[-0.03em]" href={item.href} key={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}</div>
            <Link className="button-brand mt-8" href="/forms" onClick={() => setOpen(false)}>{locale === "es" ? "Cuéntanos tu reto" : "Tell us your challenge"} <span aria-hidden="true">→</span></Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
