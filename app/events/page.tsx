"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Instagram, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/useLang";
import MobileNav from "@/components/MobileNav";

const T = {
  en: {
    nav: { home: "Home", team: "Team", learn: "Learn", contact: "Contact", apply: "Apply" },
    eyebrow: "What's On",
    heading: "Events.",
    sub: "Workshops, talks, and socials, starting with our founding semester.",
    section: {
      heading: "Fall 2026.",
      sub: "Our first calendar starts next semester. This is where it will live.",
      empty: "Our first semester hasn't started yet. Check back in Fall 2026 for our founding calendar.",
      follow: "Follow @tmqs_qro for announcements",
    },
    cta: {
      heading: "Want to be there from day one?",
      para: "Membership for the founding cohort is open now. Apply and you'll be first to hear when events go live.",
      btn: "Join the founding cohort",
    },
    footer: "Extracting alpha from noise.",
  },
  es: {
    nav: { home: "Inicio", team: "Equipo", learn: "Aprender", contact: "Contacto", apply: "Aplicar" },
    eyebrow: "Agenda",
    heading: "Eventos.",
    sub: "Talleres, charlas y convivencias, a partir de nuestro semestre fundador.",
    section: {
      heading: "Otoño 2026.",
      sub: "Nuestro primer calendario comienza el próximo semestre. Aquí vivirá.",
      empty: "Nuestro primer semestre aún no ha comenzado. Vuelve en Otoño 2026 para ver nuestro calendario fundador.",
      follow: "Sigue a @tmqs_qro para anuncios",
    },
    cta: {
      heading: "¿Quieres estar desde el primer día?",
      para: "La membresía para la cohorte fundadora ya está abierta. Aplica y serás el primero en enterarte cuando los eventos comiencen.",
      btn: "Únete a la cohorte fundadora",
    },
    footer: "Extrayendo alpha del ruido.",
  },
};

export default function EventsPage() {
  const { lang, toggle } = useLang();
  const t = T[lang];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            <Image src="/tmqs-logo.png" alt="TMQS" width={1259} height={967} className="h-8 w-auto" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link href="/"        className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.home}</Link>
            <Link href="/team"    className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.team}</Link>
            <Link href="/learn"   className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.learn}</Link>
            <Link href="/contact" className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.contact}</Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggle}
              className="text-xs font-sans text-slate-400 hover:text-slate-600 transition-colors px-1.5 py-1"
            >
              {lang === "en" ? "ES" : "EN"}
            </button>
            <Link
              href="/apply"
              className="px-4 py-2 text-xs font-sans font-semibold bg-tec-600 text-white hover:bg-tec-700 rounded-full transition-colors duration-200"
            >
              {t.nav.apply}
            </Link>
            <MobileNav links={[
              { href: "/", label: t.nav.home },
              { href: "/team", label: t.nav.team },
              { href: "/learn", label: t.nav.learn },
              { href: "/contact", label: t.nav.contact },
            ]} />
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
          <p className="font-sans text-slate-500 text-lg max-w-lg leading-relaxed">
            {t.sub}
          </p>
        </motion.div>
      </section>

      {/* ── FALL 2026 ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-24 border-t border-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="font-sans text-slate-900 mb-3" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}>
            {t.section.heading}
          </h2>
          <p className="font-sans text-slate-500 max-w-lg leading-relaxed">
            {t.section.sub}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border border-dashed border-slate-200 rounded-sm py-16 flex flex-col items-center gap-4 text-center px-6"
        >
          <p className="font-sans text-slate-400 text-sm max-w-md">{t.section.empty}</p>
          <a
            href="https://www.instagram.com/tmqs_qro/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-tec-600 hover:text-tec-700 transition-colors"
          >
            <Instagram size={12} />
            {t.section.follow}
          </a>
        </motion.div>
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
            className="font-sans tracking-tight text-slate-900 mb-4"
            style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)" }}
          >
            {t.cta.heading}
          </h2>
          <p className="font-sans text-slate-500 mb-8 leading-relaxed max-w-md mx-auto">
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
            Tec de Monterrey Campus Querétaro, Est. 2026
          </span>
          <p className="text-xs font-mono text-slate-400 italic">{t.footer}</p>
        </div>
      </footer>

    </div>
  );
}
