import Image from "next/image";
import Link from "next/link";
import type { PortfolioProject } from "@/content/portfolio";
import styles from "./portfolio.module.css";

export function PortfolioReel({ projects, viewLabel }: { projects: PortfolioProject[]; viewLabel: string }) {
  const repeated = [...projects, ...projects];
  return (
    <div className={styles.reelViewport}>
      <div className={styles.reel}>
        {repeated.map((project, index) => (
          <Link aria-label={`${viewLabel}: ${project.title}`} className={styles.reelCard} href={`/portafolio#${project.slug}`} key={`${project.slug}-${index}`}>
            <Image alt={project.alt} className={styles.reelImage} fill sizes="(max-width: 768px) 82vw, 28rem" src={project.image} />
            <span className={styles.reelShade}>
              <span className="text-xs font-medium text-white/60">{project.category}</span>
              <span className="mt-2 text-xl font-semibold tracking-[-0.035em]">{project.title}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
