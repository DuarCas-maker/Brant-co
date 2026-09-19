import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getSiteConfig } from "@/content/site";
import { getLocale } from "@/lib/i18n/server";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = getSiteConfig(await getLocale());
  return {
    metadataBase: new URL(siteUrl),
    title: { default: "BRANT·CO — Digital Growth Systems", template: "%s | BRANT·CO" },
    description: siteConfig.description,
    alternates: { canonical: "/" },
    openGraph: { type: "website", siteName: siteConfig.name, title: "BRANT·CO — Digital Growth Systems", description: siteConfig.description, url: "/" },
    twitter: { card: "summary", title: "BRANT·CO — Digital Growth Systems", description: siteConfig.description },
    icons: { icon: "/brand/brantco-symbol-dark.png", shortcut: "/brand/brantco-symbol-dark.png" },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#main-content">
          {locale === "es" ? "Saltar al contenido" : "Skip to content"}
        </a>
        <Header locale={locale} />
        {children}
        <Footer locale={locale} />
      </body>
    </html>
  );
}
