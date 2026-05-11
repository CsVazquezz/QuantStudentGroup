import { useState, useEffect } from "react";

export type Lang = "en" | "es";

export function useLang() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("qt-lang");
      if (stored === "en" || stored === "es") setLang(stored as Lang);
    } catch { /* localStorage unavailable */ }
  }, []);

  const toggle = () =>
    setLang(prev => {
      const next: Lang = prev === "en" ? "es" : "en";
      try { localStorage.setItem("qt-lang", next); } catch { /* noop */ }
      return next;
    });

  return { lang, toggle };
}
