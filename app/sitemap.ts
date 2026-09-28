import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return ["", "/servicios", "/portafolio", "/forms", "/diagnostico", "/pqrs", "/privacy", "/terms"].map((path) => ({
    url: `${origin}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/forms" ? 0.9 : 0.7,
  }));
}
