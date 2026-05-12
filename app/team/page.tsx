"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Linkedin, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/useLang";

const T = {
  en: {
    nav: { home: "Home", learn: "Learn", apply: "Apply" },
    eyebrow: "Leadership",
    heading: "The team.",
    sub: "Six seats. One filled. The rest are yours to earn.",
    roles: [
      {
        id: "presidencia",
        title: "Presidency",
        filled: true,
        name: "Carlos Martínez Vázquez",
        major: "ITC",
        badge: "Quantitative Researcher",
        linkedin: "https://linkedin.com/in/c-vzqz",
        linkedinLabel: "linkedin.com/in/c-vzqz",
        quote: '“Quant finance barely registers as a path for students in Mexico. The people who get in usually stumble onto it. I did. This club exists to make that less random.”',
        para: "Founder and President of TMQS. Quantitative Researcher and aspiring MSc/PhD in applied mathematics. Believes the best research happens when different disciplines work on the same problem.",
        activities: ["Research projects", "Hackathons", "Trading competitions", "Poker & game theory", "Industry workshops"],
      },
      {
        id: "vicepresidencia",
        title: "Vice-Presidency",
        filled: false,
      },
      {
        id: "finanzas",
        title: "Finance",
        filled: false,
      },
      {
        id: "proyectos",
        title: "Projects",
        filled: false,
      },
      {
        id: "comunicacion",
        title: "Communications",
        filled: false,
      },
      {
        id: "responsabilidad",
        title: "Social Responsibility",
        filled: false,
      },
    ],
    open: "Open position",
    openSub: "Applications open · Fall 2026",
    cta: {
      heading: "Want to lead?",
      para: "Leadership seats open alongside general membership. Apply and tell us what role excites you.",
      btn: "Apply now",
    },
    footer: "Extracting alpha from noise.",
  },

  es: {
    nav: { home: "Inicio", learn: "Aprender", apply: "Aplicar" },
    eyebrow: "Liderazgo",
    heading: "El equipo.",
    sub: "Seis puestos. Uno ocupado. El resto está por ganarse.",
    roles: [
      {
        id: "presidencia",
        title: "Presidencia",
        filled: true,
        name: "Carlos Martínez Vázquez",
        major: "ITC",
        badge: "Investigador Cuantitativo",
        linkedin: "https://linkedin.com/in/c-vzqz",
        linkedinLabel: "linkedin.com/in/c-vzqz",
        quote: '"Las finanzas cuantitativas apenas existen como opción de carrera para estudiantes en México. Los que llegan ahí suelen tropezar con ello. Yo lo hice. Este club existe para que eso sea menos aleatorio."',
        para: "Fundador y Presidente de TMQS. Investigador Cuantitativo y aspirante a MSc/PhD en matemáticas aplicadas. Cree que la mejor investigación surge cuando distintas disciplinas trabajan en el mismo problema.",
        activities: ["Proyectos de investigación", "Hackathones", "Competencias de trading", "Póker y teoría de juegos", "Talleres de industria"],
      },
      {
        id: "vicepresidencia",
        title: "Vicepresidencia",
        filled: false,
      },
      {
        id: "finanzas",
        title: "Finanzas",
        filled: false,
      },
      {
        id: "proyectos",
        title: "Proyectos",
        filled: false,
      },
      {
        id: "comunicacion",
        title: "Comunicación",
        filled: false,
      },
      {
        id: "responsabilidad",
        title: "Responsabilidad Social",
        filled: false,
      },
    ],
    open: "Puesto abierto",
    openSub: "Aplicaciones abiertas · Otoño 2026",
    cta: {
      heading: "¿Quieres liderar?",
      para: "Los puestos de liderazgo abren junto con la membresía general. Aplica y cuéntanos qué rol te interesa.",
      btn: "Aplicar ahora",
    },
    footer: "Extrayendo alpha del ruido.",
  },
};

export default function TeamPage() {
  const { lang, toggle } = useLang();
  const t = T[lang];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            <span className="text-lg font-serif tracking-tight text-slate-900">
              <span className="text-tec-600">TM</span>QS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link href="/"      className="text-xs font-serif text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.home}</Link>
            <Link href="/learn" className="text-xs font-serif text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.learn}</Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggle}
              className="text-xs font-serif text-slate-400 hover:text-slate-600 transition-colors px-1.5 py-1"
            >
              {lang === "en" ? "ES" : "EN"}
            </button>
            <Link
              href="/apply"
              className="px-4 py-2 text-xs font-serif font-semibold bg-tec-600 text-white hover:bg-tec-700 rounded-full transition-colors duration-200"
            >
              {t.nav.apply}
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-14 lg:pt-24 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-sans text-slate-400 tracking-[0.18em] uppercase mb-4">
            {t.eyebrow}
          </p>
          <h1
            className="font-serif tracking-tight text-slate-900 mb-4"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            {t.heading}
          </h1>
          <p className="font-serif text-slate-500 text-lg max-w-lg leading-relaxed">
            {t.sub}
          </p>
        </motion.div>
      </section>

      {/* ── PRESIDENT CARD ── */}
      {t.roles.filter(r => r.filled).map((r, i) => (
        <section key={r.id} className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border border-slate-200 bg-white overflow-hidden"
          >
            <div className="grid md:grid-cols-[1fr,1.4fr]">
              <div className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-slate-100">
                <p className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-slate-400 mb-4">
                  {r.title}
                </p>
                <h2 className="font-serif text-2xl text-slate-900 mb-1">{r.name}</h2>
                <p className="text-sm font-serif text-tec-600 mb-1">Founder &amp; President</p>
                <p className="text-sm font-serif text-slate-400 mb-6">{r.badge}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="text-xs font-mono px-2 py-0.5 border border-tec-200 text-tec-600 bg-tec-50">{r.major}</span>
                  <span className="text-xs font-mono px-2 py-0.5 border border-slate-200 text-slate-500">Tec de Monterrey · QRO</span>
                </div>
                <a
                  href={r.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-tec-600 transition-colors duration-200"
                >
                  <Linkedin size={12} />
                  {r.linkedinLabel}
                </a>
              </div>

              <div className="p-8 sm:p-10 flex flex-col justify-center">
                <blockquote className="font-serif text-lg sm:text-xl text-slate-800 leading-[1.55] mb-5">
                  {r.quote}
                </blockquote>
                <p className="font-serif text-slate-500 text-sm leading-relaxed mb-6">
                  {r.para}
                </p>
                <div className="flex flex-wrap gap-2">
                  {r.activities!.map(act => (
                    <span key={act} className="text-xs font-mono px-2.5 py-1 border border-slate-200 text-slate-500 bg-slate-50">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      ))}

      {/* ── OPEN SEATS GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 lg:pb-28">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100">
          {t.roles.filter(r => !r.filled).map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="bg-white p-8 border-l-2 border-tec-600 flex flex-col gap-3"
            >
              <p className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-slate-400">
                {r.title}
              </p>
              <p className="font-serif text-slate-300 text-lg">{t.open}</p>
              <p className="text-xs font-mono text-slate-300">{t.openSub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="font-serif tracking-tight text-slate-900 mb-4"
            style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)" }}
          >
            {t.cta.heading}
          </h2>
          <p className="font-serif text-slate-500 mb-8 leading-relaxed max-w-md mx-auto">
            {t.cta.para}
          </p>
          <Link
            href="/apply"
            className="group font-sans inline-flex items-center gap-2.5 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold tracking-wider transition-all duration-200"
          >
            {t.cta.btn}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs font-sans text-slate-400">
            <span className="font-serif text-slate-900"><span className="text-tec-600">TM</span>QS</span>
            {" · Tec de Monterrey · QRO · Est. 2026"}
          </span>
          <p className="text-xs font-mono text-slate-400 italic">{t.footer}</p>
        </div>
      </footer>

    </div>
  );
}
