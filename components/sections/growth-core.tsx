"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import styles from "./growth-core.module.css";

const labels = {
  en: "An abstract animation showing a business growing around one clear center",
  es: "Una animación abstracta que muestra un negocio creciendo alrededor de un centro claro",
} as const;

const stageLabels = {
  en: { attract: "Attract", convert: "Convert", automate: "Automate" },
  es: { attract: "Atraer", convert: "Convertir", automate: "Automatizar" },
} as const;

export function GrowthCore({ locale }: { locale: Locale }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const precisePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!precisePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    const move = (event: PointerEvent) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const bounds = root.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        root.style.setProperty("--orbit-x", `${x * 5}px`);
        root.style.setProperty("--orbit-y", `${y * 5}px`);
        root.style.setProperty("--core-x", `${x * 9}px`);
        root.style.setProperty("--core-y", `${y * 9}px`);
      });
    };

    const reset = () => {
      window.cancelAnimationFrame(frame);
      root.style.setProperty("--orbit-x", "0px");
      root.style.setProperty("--orbit-y", "0px");
      root.style.setProperty("--core-x", "0px");
      root.style.setProperty("--core-y", "0px");
    };

    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", reset);
    return () => {
      window.cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div aria-label={labels[locale]} className={styles.root} ref={rootRef} role="group">
      <div aria-hidden="true" className={styles.glow} />
      <svg aria-hidden="true" className={styles.orbits} viewBox="0 0 680 620">
        <defs>
          <filter id="soft-red-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <ellipse className={`${styles.orbit} ${styles.orbitOne}`} cx="340" cy="310" rx="276" ry="116" />
        <ellipse className={`${styles.orbit} ${styles.orbitTwo}`} cx="340" cy="310" rx="252" ry="154" />
        <ellipse className={`${styles.orbit} ${styles.orbitThree}`} cx="340" cy="310" rx="196" ry="250" />
        <ellipse className={styles.traceOne} cx="340" cy="310" pathLength="100" rx="276" ry="116" />
        <ellipse className={styles.traceTwo} cx="340" cy="310" pathLength="100" rx="252" ry="154" />
        <g className={styles.nodes}>
          <circle className={styles.nodeRing} cx="121" cy="239" r="22" />
          <circle className={styles.node} cx="121" cy="239" r="6" />
          <circle className={styles.nodeRing} cx="567" cy="382" r="22" />
          <circle className={styles.node} cx="567" cy="382" r="6" />
          <circle className={styles.nodeRing} cx="403" cy="546" r="22" />
          <circle className={styles.node} cx="403" cy="546" r="6" />
        </g>
      </svg>
      <div className={styles.hotspotLayer}>
        <button aria-label={stageLabels[locale].attract} className={`${styles.hotspot} ${styles.hotspotAttract}`} type="button"><span className={styles.hotspotLabel}>{stageLabels[locale].attract}</span></button>
        <button aria-label={stageLabels[locale].convert} className={`${styles.hotspot} ${styles.hotspotConvert}`} type="button"><span className={styles.hotspotLabel}>{stageLabels[locale].convert}</span></button>
        <button aria-label={stageLabels[locale].automate} className={`${styles.hotspot} ${styles.hotspotAutomate}`} type="button"><span className={styles.hotspotLabel}>{stageLabels[locale].automate}</span></button>
      </div>
      <div aria-hidden="true" className={styles.coreWrap}>
        <span className={styles.core}>
          <Image alt="" className={styles.symbol} height={512} priority src="/brand/brantco-symbol-dark.png" width={512} />
        </span>
      </div>
    </div>
  );
}
