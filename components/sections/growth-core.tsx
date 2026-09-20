"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import styles from "./growth-core.module.css";

type StageId = "attract" | "convert" | "automate";

const copy = {
  en: {
    label: "BRANT Growth Core: attract, convert and automate working as one connected system",
    connected: "Connected",
    stages: {
      attract: { number: "01", title: "ATTRACT", area: "MARKETING", details: ["CONTENT", "DEMAND", "POSITIONING"] },
      convert: { number: "02", title: "CONVERT", area: "SALES", details: ["CRM", "PIPELINE", "FOLLOW-UP"] },
      automate: { number: "03", title: "AUTOMATE", area: "OPS", details: ["WORKFLOWS", "INTEGRATIONS", "DATA"] },
    },
  },
  es: {
    label: "Núcleo de crecimiento BRANT: atraer, convertir y automatizar como un único sistema conectado",
    connected: "Conectado",
    stages: {
      attract: { number: "01", title: "ATRAER", area: "MARKETING", details: ["CONTENIDO", "DEMANDA", "POSICIONAMIENTO"] },
      convert: { number: "02", title: "CONVERTIR", area: "VENTAS", details: ["CRM", "PIPELINE", "SEGUIMIENTO"] },
      automate: { number: "03", title: "AUTOMATIZAR", area: "OPS", details: ["FLUJOS", "INTEGRACIONES", "DATOS"] },
    },
  },
} as const;

const stages: StageId[] = ["attract", "convert", "automate"];

export function GrowthCore({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<StageId | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const precisePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!precisePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    const updateParallax = (event: PointerEvent) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const bounds = root.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        root.style.setProperty("--background-x", `${x * 2}px`);
        root.style.setProperty("--background-y", `${y * 2}px`);
        root.style.setProperty("--orbits-x", `${x * 4}px`);
        root.style.setProperty("--orbits-y", `${y * 4}px`);
        root.style.setProperty("--core-x", `${x * 5.5}px`);
        root.style.setProperty("--core-y", `${y * 5.5}px`);
        root.style.setProperty("--nodes-x", `${x * 8}px`);
        root.style.setProperty("--nodes-y", `${y * 8}px`);
      });
    };

    const resetParallax = () => {
      window.cancelAnimationFrame(frame);
      root.style.setProperty("--background-x", "0px");
      root.style.setProperty("--background-y", "0px");
      root.style.setProperty("--orbits-x", "0px");
      root.style.setProperty("--orbits-y", "0px");
      root.style.setProperty("--core-x", "0px");
      root.style.setProperty("--core-y", "0px");
      root.style.setProperty("--nodes-x", "0px");
      root.style.setProperty("--nodes-y", "0px");
    };

    root.addEventListener("pointermove", updateParallax);
    root.addEventListener("pointerleave", resetParallax);
    return () => {
      window.cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", updateParallax);
      root.removeEventListener("pointerleave", resetParallax);
    };
  }, []);

  return (
    <div
      aria-label={text.label}
      className={styles.root}
      data-active={activeStage ?? "none"}
      ref={rootRef}
      role="group"
    >
      <div aria-hidden="true" className={styles.backgroundLayer}>
        <span className={`${styles.crosshair} ${styles.crosshairOne}`} />
        <span className={`${styles.crosshair} ${styles.crosshairTwo}`} />
        <span className={styles.axisLine} />
      </div>

      <div aria-hidden="true" className={styles.orbitLayer}>
        <svg className={styles.orbitSvg} viewBox="0 0 720 620">
          <defs>
            <filter id="growth-core-node-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse className={styles.outerArc} cx="360" cy="315" rx="455" ry="330" transform="rotate(-12 360 315)" />
          <ellipse className={styles.outerArcSecondary} cx="350" cy="315" rx="365" ry="270" transform="rotate(18 350 315)" />

          <g className={`${styles.orbitGroup} ${styles.orbitFar}`}>
            <ellipse className={styles.orbitFaint} cx="355" cy="315" rx="245" ry="225" transform="rotate(28 355 315)" />
          </g>

          <g className={`${styles.orbitGroup} ${styles.orbitAttract}`}>
            <ellipse className={styles.orbitPrimary} cx="355" cy="315" rx="286" ry="116" transform="rotate(12 355 315)" />
            <ellipse className={styles.flowDot} cx="355" cy="315" pathLength="100" rx="286" ry="116" transform="rotate(12 355 315)" />
          </g>

          <g className={`${styles.orbitGroup} ${styles.orbitConvert}`}>
            <ellipse className={styles.orbitSecondary} cx="355" cy="315" rx="278" ry="139" transform="rotate(37 355 315)" />
            <ellipse className={styles.flowDotSlow} cx="355" cy="315" pathLength="100" rx="278" ry="139" transform="rotate(37 355 315)" />
          </g>

          <g className={`${styles.orbitGroup} ${styles.orbitAutomate}`}>
            <ellipse className={styles.orbitDashed} cx="355" cy="315" rx="250" ry="168" transform="rotate(-15 355 315)" />
            <ellipse className={styles.flowDotReverse} cx="355" cy="315" pathLength="100" rx="250" ry="168" transform="rotate(-15 355 315)" />
          </g>

          <g className={`${styles.orbitGroup} ${styles.orbitVertical}`}>
            <ellipse className={styles.orbitWhite} cx="355" cy="315" rx="192" ry="247" transform="rotate(69 355 315)" />
          </g>

          <g className={styles.connectors}>
            <path className={`${styles.connector} ${styles.connectorAttract}`} d="M 324 145 L 385 145 L 430 88 L 456 88" />
            <path className={`${styles.connector} ${styles.connectorConvert}`} d="M 576 349 L 628 349 L 650 327" />
            <path className={`${styles.connector} ${styles.connectorAutomate}`} d="M 184 414 L 184 472 L 244 472" />
          </g>

          <g className={`${styles.nodeGlyph} ${styles.nodeAttract}`} transform="translate(324 145)">
            <circle className={styles.nodeOuterRing} r="24" />
            <circle className={styles.nodeInnerRing} r="15" />
            <circle className={styles.nodeLight} r="6" />
          </g>
          <g className={`${styles.nodeGlyph} ${styles.nodeConvert}`} transform="translate(576 349)">
            <circle className={styles.nodeOuterRing} r="24" />
            <circle className={styles.nodeInnerRing} r="15" />
            <circle className={styles.nodeLight} r="6" />
          </g>
          <g className={`${styles.nodeGlyph} ${styles.nodeAutomate}`} transform="translate(184 414)">
            <circle className={styles.nodeOuterRing} r="24" />
            <circle className={styles.nodeInnerRing} r="15" />
            <circle className={styles.nodeLight} r="6" />
          </g>

          <circle className={styles.dataPoint} cx="461" cy="450" r="4" />
          <circle className={styles.dataPointMuted} cx="276" cy="198" r="2" />
        </svg>
      </div>

      <div aria-hidden="true" className={styles.coreLayer}>
        <div className={styles.coreHalo} />
        <div className={styles.core}>
          <span className={styles.coreSheen} />
          <Image
            alt=""
            className={styles.coreSymbol}
            height={512}
            priority
            src="/brand/brantco-symbol-dark.png"
            width={512}
          />
        </div>
        <span className={styles.coreCaption}>BRANT GROWTH CORE</span>
      </div>

      <div className={styles.nodeLayer}>
        <div aria-hidden="true" className={styles.systemId}>SYSTEM / 001</div>
        <div aria-hidden="true" className={styles.telemetry}>
          <span className={styles.status}><i /> {text.connected}</span>
          <span>PEOPLE</span>
          <span>PROCESS</span>
          <span>TECHNOLOGY</span>
          <span>GROWTH</span>
        </div>

        {stages.map((stage) => {
          const stageText = text.stages[stage];
          return (
            <button
              aria-label={`${stageText.title}: ${stageText.details.join(", ")}`}
              aria-pressed={activeStage === stage}
              className={`${styles.stage} ${styles[`stage${stage[0].toUpperCase()}${stage.slice(1)}`]}`}
              key={stage}
              onBlur={() => setActiveStage(null)}
              onClick={() => setActiveStage((current) => current === stage ? null : stage)}
              onFocus={() => setActiveStage(stage)}
              onPointerEnter={() => setActiveStage(stage)}
              onPointerLeave={() => setActiveStage(null)}
              type="button"
            >
              <span className={styles.stageHeader}>
                <span className={styles.stageNumber}>{stageText.number}</span>
                <span className={styles.stageTitle}>{stageText.title}</span>
              </span>
              <span className={styles.stageArea}>{stageText.area}</span>
              <span className={styles.stageDetails}>{stageText.details.join("  /  ")}</span>
            </button>
          );
        })}

        <div aria-hidden="true" className={styles.microFooter}>
          <span><i /> A MORE EFFICIENT TOMORROW</span>
        </div>
      </div>
    </div>
  );
}
