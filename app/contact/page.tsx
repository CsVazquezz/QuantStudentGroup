"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Instagram, Linkedin, Mail, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/useLang";
import MobileNav from "@/components/MobileNav";

const T = {
  en: {
    nav: { home: "Home", team: "Team", learn: "Learn", events: "Events", blog: "Blog", apply: "Apply" },
    eyebrow: "Get in touch",
    heading: "Contact.",
    sub: "Press, sponsorship, partnerships, or just curious how to get involved: reach us directly. We read everything.",
    channels: {
      instagram: { label: "Instagram", value: "@tmqs_qro", action: "Follow for updates" },
      linkedin:  { label: "LinkedIn",  value: "Tec Monterrey Quant Society", action: "Connect with us" },
      email:     { label: "Email",     value: "tecmonterreyquantsociety@gmail.com", action: "Send us a message" },
    },
    founder: {
      line: "Prefer to reach out directly? I'm Carlos, Quantitative Researcher and founder of TMQS.",
    },
    footer: "Extracting alpha from noise.",
  },
  es: {
    nav: { home: "Inicio", team: "Equipo", learn: "Aprender", events: "Eventos", blog: "Blog", apply: "Aplicar" },
    eyebrow: "Contáctanos",
    heading: "Contacto.",
    sub: "Prensa, patrocinios, alianzas, o simplemente curiosidad por participar: escríbenos directamente. Leemos todo.",
    channels: {
      instagram: { label: "Instagram", value: "@tmqs_qro", action: "Síguenos para novedades" },
      linkedin:  { label: "LinkedIn",  value: "Tec Monterrey Quant Society", action: "Conéctate con nosotros" },
      email:     { label: "Email",     value: "tecmonterreyquantsociety@gmail.com", action: "Envíanos un mensaje" },
    },
    founder: {
      line: "¿Prefieres escribir directamente? Soy Carlos, Investigador Cuantitativo y fundador de TMQS.",
    },
    footer: "Extrayendo alpha del ruido.",
  },
};

export default function ContactPage() {
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
            <Link href="/"       className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.home}</Link>
            <Link href="/team"   className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.team}</Link>
            <Link href="/learn"  className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.learn}</Link>
            <Link href="/events" className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.events}</Link>
            <Link href="/blog"   className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.blog}</Link>
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
              { href: "/events", label: t.nav.events },
              { href: "/blog", label: t.nav.blog },
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

      {/* ── CHANNELS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="grid sm:grid-cols-3 gap-6">
          <motion.a
            href="https://www.instagram.com/tmqs_qro/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="group border border-slate-200 bg-white p-5 sm:p-8 flex flex-col gap-3 hover:border-tec-300 transition-colors min-w-0"
          >
            <Instagram size={20} className="text-tec-600" />
            <p className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-slate-400">{t.channels.instagram.label}</p>
            <p className="font-sans text-base sm:text-lg text-slate-900 leading-snug break-words">{t.channels.instagram.value}</p>
            <span className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 group-hover:text-tec-600 transition-colors mt-2">
              {t.channels.instagram.action}
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/company/tec-monterrey-quant-society/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="group border border-slate-200 bg-white p-5 sm:p-8 flex flex-col gap-3 hover:border-tec-300 transition-colors min-w-0"
          >
            <Linkedin size={20} className="text-tec-600" />
            <p className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-slate-400">{t.channels.linkedin.label}</p>
            <p className="font-sans text-base sm:text-lg text-slate-900 leading-snug break-words">{t.channels.linkedin.value}</p>
            <span className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 group-hover:text-tec-600 transition-colors mt-2">
              {t.channels.linkedin.action}
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.a>

          <motion.a
            href="mailto:tecmonterreyquantsociety@gmail.com"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="group border border-slate-200 bg-white p-5 sm:p-8 flex flex-col gap-3 hover:border-tec-300 transition-colors min-w-0"
          >
            <Mail size={20} className="text-tec-600" />
            <p className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-slate-400">{t.channels.email.label}</p>
            <p className="font-sans text-base sm:text-lg text-slate-900 leading-snug break-words">{t.channels.email.value}</p>
            <span className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 group-hover:text-tec-600 transition-colors mt-2">
              {t.channels.email.action}
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.a>
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-14 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="font-sans text-slate-500 text-sm leading-relaxed break-words"
        >
          {t.founder.line}{" "}
          <a
            href="mailto:c.mtnzvzqz@gmail.com"
            className="font-mono text-tec-600 hover:text-tec-700 transition-colors break-words"
          >
            c.mtnzvzqz@gmail.com
          </a>
        </motion.p>
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
