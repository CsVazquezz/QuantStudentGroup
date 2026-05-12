import { useState } from "react";

export type Lang = "en" | "es";

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem("qt-lang");
    if (stored === "en" || stored === "es") return stored;
  } catch { /* noop */ }
  return "en";
}

export function useLang() {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  const toggle = () =>
    setLang(prev => {
      const next: Lang = prev === "en" ? "es" : "en";
      try { localStorage.setItem("qt-lang", next); } catch { /* noop */ }
      return next;
    });

  return { lang, toggle };
}
