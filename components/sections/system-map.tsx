import { getServices } from "@/content/services";
import type { Locale } from "@/lib/i18n/config";
import styles from "./system-map.module.css";

type SystemId = "attract" | "convert" | "automate";

function SystemVisual({ id }: { id: SystemId }) {
  if (id === "attract") {
    return (
      <svg aria-hidden="true" className={styles.visualSvg} viewBox="0 0 260 220">
        <g className={styles.visualGrid}>
          <path d="M18 54H242M18 94H242M18 134H242M18 174H242" />
          <path d="M50 28V198M98 28V198M146 28V198M194 28V198" />
        </g>
        <g className={styles.panelDriftSlow}>
          <path className={styles.panelBack} d="M58 59 168 18l35 18-110 42Z" />
          <circle className={styles.pointMuted} cx="179" cy="39" r="3" />
        </g>
        <g className={styles.panelDrift}>
          <path className={styles.panelMiddle} d="M80 85 192 43v91L80 177Z" />
          <path className={styles.signalLine} d="m80 151 112-42" />
        </g>
        <g className={styles.panelFront}>
          <path d="M105 105 215 64v91l-110 42Z" />
          <g className={styles.barPulse}>
            <path className={styles.bar} d="m143 151 8-3v-19l-8 3Z" />
            <path className={styles.bar} d="m158 145 8-3v-33l-8 3Z" />
            <path className={styles.bar} d="m173 140 8-3V91l-8 3Z" />
          </g>
        </g>
        <path className={styles.signalLine} d="M23 183c44-23 73-18 112-38 24-12 43-31 86-61" />
        <circle className={styles.point} cx="221" cy="84" r="4" />
      </svg>
    );
  }

  if (id === "convert") {
    return (
      <svg aria-hidden="true" className={styles.visualSvg} viewBox="0 0 260 220">
        <g className={styles.visualGrid}>
          <path d="M18 54H242M18 94H242M18 134H242M18 174H242" />
          <path d="M50 28V198M98 28V198M146 28V198M194 28V198" />
        </g>
        <g className={styles.panelDriftSlow}>
          <path className={styles.panelBack} d="m73 40 114 28v91L73 132Z" />
          <path className={styles.signalLine} d="m87 64 80 20M87 80l54 13" />
          <circle className={styles.point} cx="172" cy="81" r="4" />
        </g>
        <g className={styles.panelDrift}>
          <path className={styles.panelMiddle} d="m46 72 116 28v91L46 163Z" />
          <path className={styles.signalLine} d="m60 98 83 20M60 114l54 13" />
        </g>
        <g className={styles.panelFront}>
          <path d="m92 84 112 27v90L92 174Z" />
          <circle className={styles.personHead} cx="150" cy="131" r="10" />
          <path className={styles.personBody} d="M132 163c4-16 12-23 20-21 9 2 16 11 18 28Z" />
        </g>
        <path className={styles.signalLine} d="M27 166c42-32 74-40 113-27 27 9 45 5 91-22" />
        <circle className={styles.pointMuted} cx="29" cy="165" r="3" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={styles.visualSvg} viewBox="0 0 260 220">
      <g className={styles.visualGrid}>
        <path d="M18 54H242M18 94H242M18 134H242M18 174H242" />
        <path d="M50 28V198M98 28V198M146 28V198M194 28V198" />
      </g>
      <g className={styles.automationOrbit}>
        <ellipse className={styles.orbitLine} cx="139" cy="127" rx="105" ry="42" />
        <ellipse className={styles.orbitLineMuted} cx="139" cy="127" rx="95" ry="35" transform="rotate(54 139 127)" />
        <circle className={styles.point} cx="237" cy="143" r="4" />
        <circle className={styles.pointMuted} cx="37" cy="111" r="3" />
      </g>
      <g className={styles.panelDriftSlow}>
        <path className={styles.nodeBlockBack} d="m142 32 57 18v73l-57-18Z" />
        <path className={styles.nodeBlockLine} d="m199 50 20-8v72l-20 9" />
      </g>
      <g className={styles.panelDrift}>
        <path className={styles.nodeBlock} d="m126 47 57 18v72l-57-18Z" />
        <ellipse className={styles.brandMark} cx="154" cy="91" rx="15" ry="7" transform="rotate(76 154 91)" />
        <ellipse className={styles.brandMark} cx="154" cy="91" rx="15" ry="7" transform="rotate(-12 154 91)" />
      </g>
      <g className={styles.panelFront}>
        <path d="m66 126 45 14v58l-45-14Z" />
        <path className={styles.nodeBlockLine} d="m111 140 18-7v58l-18 7" />
        <circle className={styles.point} cx="88" cy="165" r="4" />
      </g>
    </svg>
  );
}

export function SystemMap({ compact = false, locale }: { compact?: boolean; locale: Locale }) {
  const services = getServices(locale);

  return (
    <div className={`${styles.map} ${compact ? styles.compact : ""}`}>
      {services.map((service, index) => (
        <article className={styles.card} id={compact ? undefined : service.id} key={service.id}>
          {index < services.length - 1 ? <span aria-hidden="true" className={styles.connector}><i /></span> : null}
          <div className={styles.cardContent}>
            <span className={styles.number}>{service.number}</span>
            <div className={styles.cardCopy}>
              <p className={styles.stage}>{service.stage}</p>
              <h3 className={styles.cardTitle}>{service.cardTitle}</h3>
            </div>
          </div>
          <div className={styles.cardVisual}>
            <SystemVisual id={service.id} />
          </div>
        </article>
      ))}
    </div>
  );
}
