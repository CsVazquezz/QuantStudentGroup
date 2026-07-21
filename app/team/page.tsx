"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Linkedin, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/useLang";
import MobileNav from "@/components/MobileNav";

const MAJOR_NAMES: Record<string, { en: string; es: string }> = {
  ITC: { en: "Computer Science", es: "Ciencias de la Computación" },
  IDM: { en: "Data Science and Maths", es: "Ciencia de Datos y Matemáticas" },
  LAF: { en: "Finance", es: "Finanzas" },
  IC:  { en: "Civil Engineering", es: "Ingeniería Civil" },
};

const T = {
  en: {
    nav: { home: "Home", learn: "Learn", events: "Events", contact: "Contact", apply: "Apply" },
    eyebrow: "Leadership",
    heading: "The team.",
    roles: [
      {
        id: "presidencia",
        title: "Presidency",
        filled: true,
        name: "Carlos Martínez Vázquez",
        major: "ITC",
        linkedin: "https://linkedin.com/in/c-vzqz",
        linkedinLabel: "linkedin/carlos",
      },
      {
        id: "vicepresidencia",
        title: "Vice-Presidency",
        filled: true,
        name: "Alexis Berthou Haas",
        major: "ITC",
        linkedin: "https://www.linkedin.com/in/alexis-berthou-67ab6a223/",
        linkedinLabel: "linkedin/alexis",
      },
      {
        id: "finanzas",
        title: "Finance",
        filled: true,
        name: "María Vilchis López",
        major: "IC",
        linkedin: "https://www.linkedin.com/in/mfvilchisl/",
        linkedinLabel: "linkedin/fernanda",
      },
      {
        id: "proyectos",
        title: "Projects",
        filled: true,
        name: "Jesús Higuera Alanís",
        major: "IDM",
        linkedin: "https://www.linkedin.com/in/jesus-higuera/",
        linkedinLabel: "linkedin/jesus",
      },
      {
        id: "comunicacion",
        title: "Communications",
        filled: true,
        name: "Patricio Lugo Albor",
        major: "IDM",
        linkedin: "https://www.linkedin.com/in/patricio-lugo-albor-381977329/",
        linkedinLabel: "linkedin/patricio",
      },
      {
        id: "responsabilidad",
        title: "Social Responsibility",
        filled: true,
        name: "Roberto Hernández Amezola",
        major: "LAF",
        linkedin: "https://www.linkedin.com/in/roberto-hernandez-amezola/",
        linkedinLabel: "linkedin/roberto",
      },
    ],
    open: "Open position",
    openSub: "Applications open · Fall 2026",
    cta: {
      heading: "Want to be in?",
      para: "Apply and tell us why you're a fit.",
      btn: "Apply now",
    },
    footer: "Extracting alpha from noise.",
  },

  es: {
    nav: { home: "Inicio", learn: "Aprender", events: "Eventos", contact: "Contacto", apply: "Aplicar" },
    eyebrow: "Liderazgo",
    heading: "El equipo.",
    roles: [
      {
        id: "presidencia",
        title: "Presidencia",
        filled: true,
        name: "Carlos Martínez Vázquez",
        major: "ITC",
        linkedin: "https://linkedin.com/in/c-vzqz",
        linkedinLabel: "linkedin/carlos",
      },
      {
        id: "vicepresidencia",
        title: "Vicepresidencia",
        filled: true,
        name: "Alexis Berthou Haas",
        major: "ITC",
        linkedin: "https://www.linkedin.com/in/alexis-berthou-67ab6a223/",
        linkedinLabel: "linkedin/alexis",
      },
      {
        id: "finanzas",
        title: "Finanzas",
        filled: true,
        name: "María Vilchis López",
        major: "IC",
        linkedin: "https://www.linkedin.com/in/mfvilchisl/",
        linkedinLabel: "linkedin/fernanda",
      },
      {
        id: "proyectos",
        title: "Proyectos",
        filled: true,
        name: "Jesús Higuera Alanís",
        major: "IDM",
        linkedin: "https://www.linkedin.com/in/jesus-higuera/",
        linkedinLabel: "linkedin/jesus",
      },
      {
        id: "comunicacion",
        title: "Comunicación",
        filled: true,
        name: "Patricio Lugo Albor",
        major: "IDM",
        linkedin: "https://www.linkedin.com/in/patricio-lugo-albor-381977329/",
        linkedinLabel: "linkedin/patricio",
      },
      {
        id: "responsabilidad",
        title: "Responsabilidad Social",
        filled: true,
        name: "Roberto Hernández Amezola",
        major: "LAF",
        linkedin: "https://www.linkedin.com/in/roberto-hernandez-amezola/",
        linkedinLabel: "linkedin/roberto",
      },
    ],
    open: "Puesto abierto",
    openSub: "Aplicaciones abiertas · Otoño 2026",
    cta: {
      heading: "¿Quieres unirte?",
      para: "Aplica y cuéntanos por qué eres un buen candidato.",
      btn: "Aplicar ahora",
    },
    footer: "Extrayendo alpha del ruido.",
  },
};

function photoSlug(name: string): string {
  return name
    .split(" ")[0]
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function MemberPhoto({
  name,
  photo,
  zoom = 1,
  focus = "center",
}: {
  name: string;
  photo?: string;
  zoom?: number;
  focus?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (failed) {
    return (
      <div className="aspect-[4/5] w-full flex items-center justify-center bg-tec-50 border border-slate-200 rounded-lg select-none">
        <span className="font-sans text-4xl sm:text-5xl text-tec-600/70 tracking-tight">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className="aspect-[4/5] w-full relative border border-slate-200 rounded-lg overflow-hidden bg-tec-50">
      <Image
        src={`/team/${photo ?? photoSlug(name)}.jpg`}
        alt={name}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
        style={{ objectPosition: focus, transform: zoom !== 1 ? `scale(${zoom})` : undefined, transformOrigin: focus }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function TeamPage() {
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
            <Link href="/"      className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.home}</Link>
            <Link href="/learn" className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.learn}</Link>
            <Link href="/events" className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.events}</Link>
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
              { href: "/learn", label: t.nav.learn },
              { href: "/events", label: t.nav.events },
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
        </motion.div>
      </section>

      {/* ── TEAM CARDS ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.roles.filter((r) => r.filled).map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="border border-slate-200 bg-white flex flex-col rounded-xl overflow-hidden"
            >
              <div className="p-3">
                <MemberPhoto
                  name={r.name!}
                  photo={r.id === "finanzas" ? "fernanda" : undefined}
                  zoom={r.id === "presidencia" ? 1.3 : r.id === "finanzas" ? 1.24 : 1}
                  focus={r.id === "presidencia" ? "50% 10%" : "center"}
                />
              </div>

              <div className="p-5 flex flex-col gap-1">
                <p className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-slate-400 mb-1">
                  {r.title}
                </p>
                <h2 className="font-sans text-xl text-slate-900 leading-snug">{r.name}</h2>

                <p className="text-xs font-mono text-tec-600 mt-2">
                  {r.major}
                  {MAJOR_NAMES[r.major!] && ` · ${MAJOR_NAMES[r.major!][lang]}`}
                </p>

                <a
                  href={r.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-tec-600 transition-colors duration-200 mt-4"
                >
                  <Linkedin size={12} />
                  {r.linkedinLabel}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── OPEN SEATS GRID ── */}
      {t.roles.some(r => !r.filled) && (
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
                <p className="font-sans text-slate-300 text-lg">{t.open}</p>
                <p className="text-xs font-mono text-slate-300">{t.openSub}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

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
