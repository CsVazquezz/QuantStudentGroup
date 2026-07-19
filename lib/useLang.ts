import { useEffect, useState } from "react";

export type Lang = "en" | "es";

export function useLang() {
  const [lang, setLang] = useState<Lang>("en");

  // Read the stored preference after mount, not during initial render —
  // the server always renders "en" (no localStorage access), so applying
  // a stored "es" during the client's first render would mismatch the SSR
  // output and trigger a hydration error.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("qt-lang");
      if (stored === "en" || stored === "es") setLang(stored);
    } catch { /* noop */ }
  }, []);

  const toggle = () =>
    setLang(prev => {
      const next: Lang = prev === "en" ? "es" : "en";
      try { localStorage.setItem("qt-lang", next); } catch { /* noop */ }
      return next;
    });

  return { lang, toggle };
}
