"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);

  async function changeLocale(nextLocale: Locale) {
    if (nextLocale === locale || pendingLocale) return;
    setPendingLocale(nextLocale);
    try {
      const response = await fetch("/api/locale", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });
      if (response.ok) {
        window.location.reload();
      }
    } finally {
      setPendingLocale(null);
    }
  }

  const label = locale === "es" ? "Seleccionar idioma" : "Select language";

  return (
    <div aria-label={label} className="language-toggle" role="group">
      {(["en", "es"] as const).map((option) => (
        <button
          aria-pressed={locale === option}
          className="language-toggle__option"
          disabled={Boolean(pendingLocale)}
          key={option}
          onClick={() => void changeLocale(option)}
          type="button"
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
