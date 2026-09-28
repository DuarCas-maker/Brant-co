"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PortfolioProject } from "@/content/portfolio";
import type { Locale } from "@/lib/i18n/config";
import styles from "./portfolio.module.css";

export function PortfolioGallery({ projects, locale }: { projects: PortfolioProject[]; locale: Locale }) {
  const [selected, setSelected] = useState<PortfolioProject | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const slug = window.location.hash.slice(1);
    const match = projects.find((project) => project.slug === slug);
    if (!match) return;
    const timer = window.setTimeout(() => setSelected(match), 0);
    return () => window.clearTimeout(timer);
  }, [projects]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  return (
    <>
      <div className={styles.gallery}>
        {projects.map((project) => (
          <button className={styles.galleryButton} id={project.slug} key={project.slug} onClick={() => setSelected(project)} type="button">
            <Image alt={project.alt} className={styles.galleryImage} fill sizes="(max-width: 768px) 100vw, 58vw" src={project.image} />
            <span className={styles.galleryCopy}>
              <span className="text-xs text-white/60">{project.category}</span>
              <span className="mt-2 block text-2xl font-semibold tracking-[-0.04em]">{project.title}</span>
              <span className="mt-3 block max-w-lg text-sm leading-6 text-white/65">{project.shortDescription}</span>
            </span>
          </button>
        ))}
      </div>
      <dialog aria-label={selected?.title} className={styles.dialog} onClose={() => setSelected(null)} ref={dialogRef}>
        {selected ? (
          <>
            <button aria-label={locale === "es" ? "Cerrar" : "Close"} className={styles.dialogClose} onClick={() => setSelected(null)} type="button">×</button>
            <div className={styles.dialogImage}><Image alt={selected.alt} fill sizes="94vw" src={selected.image} /></div>
            <div className={styles.dialogBody}>
              <div><p className="text-sm text-[#d85c5c]">{selected.category}</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">{selected.title}</h2><p className="mt-5 max-w-2xl text-base leading-8 text-white/65">{selected.shortDescription}</p></div>
              <div className="grid gap-7 border-t border-white/10 pt-7 md:grid-cols-2">
                <div><h3 className="text-sm font-semibold">{locale === "es" ? "El problema" : "The problem"}</h3><p className="mt-3 text-sm leading-7 text-white/60">{selected.problem}</p></div>
                <div><h3 className="text-sm font-semibold">{locale === "es" ? "La idea" : "The idea"}</h3><p className="mt-3 text-sm leading-7 text-white/60">{selected.solution}</p></div>
              </div>
              <p className="text-xs leading-6 text-white/35">{locale === "es" ? "Muestra visual provisional. No representa a un cliente ni resultados reales." : "Provisional visual sample. It does not represent a real client or results."}</p>
            </div>
          </>
        ) : null}
      </dialog>
    </>
  );
}
