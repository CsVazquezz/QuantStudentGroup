"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Brain, Users, GitBranch, Linkedin } from "lucide-react";
import { useLang } from "@/lib/useLang";
import type { Lang } from "@/lib/useLang";

const TICKER: Record<Lang, string[]> = {
  en: [
    "QUANT FINANCE", "OPEN TO ALL MAJORS", "PYTHON & R",
    "FINANCIAL MODELING", "FIRST IN TEC HISTORY", "MACHINE LEARNING",
    "BUILD REAL MODELS", "MARKETS & DATA", "CAMPUS QUERÉTARO",
    "LEARN TOGETHER", "SYSTEMATIC TRADING", "FOUNDING COHORT 2026",
    "MATHEMATICS", "DATA SCIENCE", "FINANCIAL MARKETS",
  ],
  es: [
    "FINANZAS CUANTITATIVAS", "TODAS LAS CARRERAS", "PYTHON & R",
    "MODELADO FINANCIERO", "PRIMERO EN TEC", "MACHINE LEARNING",
    "MODELOS REALES", "MERCADOS Y DATOS", "CAMPUS QUERÉTARO",
    "APRENDER JUNTOS", "TRADING SISTEMÁTICO", "COHORTE FUNDADORA 2026",
    "MATEMÁTICAS", "CIENCIA DE DATOS", "MERCADOS FINANCIEROS",
  ],
};

const PILLAR_STYLES = [
  { iconClr: "text-tec-600",    Icon: GitBranch },
  { iconClr: "text-violet-600", Icon: Brain     },
  { iconClr: "text-amber-600",  Icon: Users     },
];

const T = {
  en: {
    nav: { status: "Fall 2026 — Open", about: "About", team: "Team", learn: "Learn", apply: "Apply" },
    hero: {
      eyebrow:      "Tec de Monterrey · Campus Querétaro · Founding Cohort 2026",
      line1:        "CRACK THE",
      accent:       "MARKET",
      line3:        "NOISE.",
      descPre:      "The ",
      descAccent:   "first quant student club",
      descPost:     " in Tec de Monterrey history. A community for students curious about where markets, data, and mathematics meet — no prior experience required.",
      ctaPrimary:   "JOIN THE FOUNDING COHORT",
      ctaSecondary: "HOW IT WORKS",
      stats: [
        { val: "Cohort 01",  lbl: "Be a founding member"  },
        { val: "First ever", lbl: "At Tec de Monterrey"   },
        { val: "All majors", lbl: "ITC · LCD · LAF · LEC" },
      ],
    },
    pillars: {
      heading: "What we do together.",
      sub:     "Three areas of focus — all taught from scratch, all open to any major. You don't need to arrive knowing any of this. That's the point.",
      items: [
        {
          title: "Algorithmic Strategy",
          desc:  "From your first backtest to a live paper-trading strategy. We teach systematic thinking from the ground up — no prior finance knowledge required. You build real models, step by step.",
          tags:  ["Start From Zero", "Backtesting", "Risk Mgmt", "Python"],
        },
        {
          title: "High-Dimensional Data",
          desc:  "Curious about AI and markets but unsure where to begin? We explore ML, NLP, and alternative data as a team — applied to real financial problems. Curiosity is the only prerequisite.",
          tags:  ["Beginners Welcome", "Machine Learning", "NLP", "Alt Data"],
        },
        {
          title: "Shared Ecosystem",
          desc:  "LAF, ITC, IDM, LEC — all welcome. Your background in finance, code, or data is a strength, not a requirement. The best research happens when different disciplines work on the same problem.",
          tags:  ["All Majors", "Hackathons", "Network", "Industry"],
        },
      ],
    },
    founder: {
      section:    "Leadership",
      role:       "President & Founder",
      badge:      "Quantitative Researcher",
      quote:      "“Quant finance barely registers as a path for students in Mexico. The people who get in usually stumble onto it — I did. This club exists to make that less random.”",
      para:       "I’m a Quantitative Researcher, aspiring MSc/PhD in applied mathematics, and the president of QuantTec — but this isn’t a lecture series. We’re all figuring this out together. The idea is to learn by doing: real projects, real competitions, real mistakes.",
      activities: ["Research projects", "Hackathons", "Trading competitions", "Poker & game theory", "Industry workshops"],
    },
    cta: {
      heading: "Ready to be part of this?",
      para:    "Applications take about 10 minutes. No quant experience required — just tell us who you are and what excites you.",
      btn:     "JOIN THE FOUNDING COHORT",
    },
    footer: "Extracting alpha from noise.",
  },

  es: {
    nav: { status: "Otoño 2026 — Abierto", about: "Acerca", team: "Equipo", learn: "Aprender", apply: "Aplicar" },
    hero: {
      eyebrow:      "Tec de Monterrey · Campus Querétaro · Cohorte Fundadora 2026",
      line1:        "DESCIFRA EL",
      accent:       "RUIDO",
      line3:        "DEL MERCADO.",
      descPre:      "El ",
      descAccent:   "primer club de quant",
      descPost:     " en la historia del Tec de Monterrey. Una comunidad para estudiantes curiosos sobre la intersección de mercados, datos y matemáticas — sin experiencia previa requerida.",
      ctaPrimary:   "ÚNETE A LA COHORTE FUNDADORA",
      ctaSecondary: "CÓMO FUNCIONA",
      stats: [
        { val: "Cohorte 01",      lbl: "Sé miembro fundador"   },
        { val: "El primero",      lbl: "En Tec de Monterrey"   },
        { val: "Todas las carr.", lbl: "ITC · LCD · LAF · LEC" },
      ],
    },
    pillars: {
      heading: "Lo que hacemos juntos.",
      sub:     "Tres áreas de enfoque — todas desde cero, todas abiertas a cualquier carrera. No necesitas llegar sabiendo nada de esto. Ese es el punto.",
      items: [
        {
          title: "Estrategia Algorítmica",
          desc:  "Desde tu primer backtest hasta una estrategia activa en papel. Enseñamos pensamiento sistemático desde cero — sin conocimientos previos de finanzas. Construyes modelos reales, paso a paso.",
          tags:  ["Desde Cero", "Backtesting", "Gestión de Riesgo", "Python"],
        },
        {
          title: "Datos de Alta Dimensión",
          desc:  "¿Curioso sobre IA y mercados pero sin saber por dónde empezar? Exploramos ML, NLP y datos alternativos en equipo — aplicados a problemas financieros reales. La curiosidad es el único requisito.",
          tags:  ["Principiantes", "Machine Learning", "NLP", "Datos Alt."],
        },
        {
          title: "Ecosistema Compartido",
          desc:  "LAF, ITC, IDM, LEC — todos bienvenidos. Tu carrera en finanzas, código o datos es una fortaleza, no un requisito. La mejor investigación surge cuando distintas disciplinas trabajan en el mismo problema.",
          tags:  ["Todas las Carreras", "Hackathones", "Red", "Industria"],
        },
      ],
    },
    founder: {
      section:    "Liderazgo",
      role:       "Presidente y Fundador",
      badge:      "Investigador Cuantitativo",
      quote:      "“Las finanzas cuantitativas apenas existen como opción de carrera para estudiantes en México. Los que llegan ahí suelen tropezar con ello — yo lo hice. Este club existe para que eso sea menos aleatorio.”",
      para:       "Soy Investigador Cuantitativo, aspirante a MSc/PhD en matemáticas aplicadas y presidente de QuantTec — pero esto no es una clase magistral. Todos lo estamos descubriendo juntos. La idea es aprender haciendo: proyectos reales, competencias reales, errores reales.",
      activities: ["Proyectos de investigación", "Hackathones", "Competencias de trading", "Póker y teoría de juegos", "Talleres de industria"],
    },
    cta: {
      heading: "¿Listo para ser parte de esto?",
      para:    "La solicitud toma unos 10 minutos. No se requiere experiencia en quant — solo cuéntanos quién eres y qué te emociona.",
      btn:     "ÚNETE A LA COHORTE FUNDADORA",
    },
    footer: "Extrayendo alpha del ruido.",
  },
};

// ─────────────────────────────────────────────────────────────────
// 3D Particle Logo — samples the Tec flame from tec-logo.png
// ─────────────────────────────────────────────────────────────────

type TiltRef = { current: { nx: number; ny: number; active: boolean } };

function ParticleLogo({
  className = "",
  tiltRef,
}: {
  className?: string;
  tiltRef?: TiltRef;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;
    let pts: [number, number, number][] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      if (!w || !h) return;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    const rotY3 = (x: number, y: number, z: number, a: number): [number, number, number] => {
      const c = Math.cos(a), s = Math.sin(a);
      return [x * c + z * s, y, -x * s + z * c];
    };
    const rotX3 = (x: number, y: number, z: number, a: number): [number, number, number] => {
      const c = Math.cos(a), s = Math.sin(a);
      return [x, y * c - z * s, y * s + z * c];
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let cleanupListeners: (() => void) | null = null;
    if (!tiltRef) {
      const tiltFromPoint = (clientX: number, clientY: number) => {
        const rect = canvas.getBoundingClientRect();
        targetRotY = ((clientX - rect.left) / rect.width  - 0.5) * 1.5;
        targetRotX = ((clientY - rect.top)  / rect.height - 0.5) * 1.0;
      };
      const onMove      = (e: MouseEvent) => tiltFromPoint(e.clientX, e.clientY);
      const onLeave     = () => { targetRotX = 0; targetRotY = 0; };
      const onTouchMove = (e: TouchEvent) => {
        if (!e.touches.length) return;
        e.preventDefault();
        tiltFromPoint(e.touches[0].clientX, e.touches[0].clientY);
      };
      const onTouchEnd  = () => { targetRotX = 0; targetRotY = 0; };
      canvas.addEventListener("mousemove",  onMove);
      canvas.addEventListener("mouseleave", onLeave);
      canvas.addEventListener("touchmove",  onTouchMove, { passive: false });
      canvas.addEventListener("touchend",   onTouchEnd);
      cleanupListeners = () => {
        canvas.removeEventListener("mousemove",  onMove);
        canvas.removeEventListener("mouseleave", onLeave);
        canvas.removeEventListener("touchmove",  onTouchMove);
        canvas.removeEventListener("touchend",   onTouchEnd);
      };
    }

    const img = new window.Image();
    img.src = "/tec-logo.png";
    img.onload = () => {
      // Crop to just the flame symbol (cols 0-63 out of 200).
      // The gap at cols 60-64 marks the split between flame and text.
      const srcW = Math.round(img.width * 0.32);
      const srcH = img.height;
      const scale = 6;
      const iW = srcW * scale;
      const iH = srcH * scale;

      const off = document.createElement("canvas");
      off.width = iW; off.height = iH;
      const oc = off.getContext("2d");
      if (!oc) return;
      // Draw only the flame slice, scaled up
      oc.drawImage(img, 0, 0, srcW, srcH, 0, 0, iW, iH);

      const { data } = oc.getImageData(0, 0, iW, iH);
      const collected: [number, number, number][] = [];

      const small  = window.innerWidth < 1024;
      const step   = 3;
      const accept = small ? 0.26 : 0.47;

      for (let y = 0; y < iH; y += step) {
        for (let x = 0; x < iW; x += step) {
          if (data[(y * iW + x) * 4 + 3] < 30) continue;
          if (Math.random() > accept) continue;
          const nx = (x / iW - 0.5) * 2;
          const ny = (y / iH - 0.5) * 2;
          const nz = (Math.sin(x * 0.28 + y * 0.51) * 0.5 + (Math.random() - 0.5)) * 0.45;
          collected.push([nx, ny, nz]);
        }
      }
      if (collected.length > 0) {
        const mx = collected.reduce((s, [x]) => s + x, 0) / collected.length;
        const my = collected.reduce((s, [, y]) => s + y, 0) / collected.length;
        pts = collected.map(([x, y, z]) => [x - mx, y - my, z]);
      } else {
        pts = collected;
      }
    };

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (tiltRef?.current) {
        const t = tiltRef.current;
        const isMobile = window.innerWidth < 1024;
        if (t.active) {
          targetRotY = (t.nx - 0.5) * 1.5;
          targetRotX = (t.ny - 0.5) * 1.0;
        } else if (isMobile) {
          const s = Date.now() * 0.00035;
          targetRotY = Math.sin(s) * 0.035;
          targetRotX = Math.sin(s * 0.55 + 1.2) * 0.018;
        } else {
          targetRotY = 0;
          targetRotX = 0;
        }
      }

      currentRotY += (targetRotY - currentRotY) * 0.055;
      currentRotX += (targetRotX - currentRotX) * 0.055;

      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      if (!W || !H || pts.length === 0) return;
      ctx.clearRect(0, 0, W, H);

      const cx  = W / 2;
      const cy  = H / 2;
      const rad = Math.min(W, H) * (W < 500 ? 0.52 : 0.44);
      const fov = Math.max(W, H) * 4.0;

      const proj = pts.map(([px, py, pz]) => {
        let [x, y, z] = rotY3(px, py, pz, currentRotY);
        [x, y, z]     = rotX3(x, y, z, currentRotX);
        const sc = Math.min(fov / (fov + z * rad), 1.2);
        return {
          sx:    cx + x * rad * sc,
          sy:    cy + y * rad * sc,
          z,
          sc,
          depth: (z + 1.1) / 2.2,
        };
      });

      proj.sort((a, b) => a.z - b.z);

      const dotBase = W < 500 ? 2.0 : 2.8;
      proj.forEach(({ sx, sy, sc, depth }) => {
        const size = Math.max(0.5, dotBase * sc);
        const opacity = 0.08 + depth * 0.84;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,57,166,${opacity.toFixed(2)})`;
        ctx.fill();
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      cleanupListeners?.();
      ro.disconnect();
    };
  }, [tiltRef]);

  return <canvas ref={ref} className={className} style={{ display: "block" }} />;
}

// ─────────────────────────────────────────────────────────────────
// Ticker
// ─────────────────────────────────────────────────────────────────

function TickerBar({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden bg-slate-100 py-3 select-none">
      <motion.div
        animate={{ x: "-50%" }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {items.map((term, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6">
            <span className="text-xs font-display text-slate-500 tracking-widest">{term}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Shared
// ─────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-display font-semibold tracking-widest uppercase text-slate-400 mb-4">
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────

export default function Page() {
  const { lang, toggle } = useLang();
  const t = T[lang];
  const tickerItems = [...TICKER[lang], ...TICKER[lang]];
  const heroTilt = useRef({ nx: 0.5, ny: 0.5, active: false });

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-display font-semibold text-slate-900">
              Quant<span className="text-tec-600">Tec</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7">
            <a href="#pillars" className="text-xs font-display text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.about}</a>
            <a href="#team"    className="text-xs font-display text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.team}</a>
            <Link href="/learn" className="text-xs font-display text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.learn}</Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-display text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t.nav.status}
            </div>
            <button
              onClick={toggle}
              className="text-xs font-display text-slate-400 hover:text-slate-600 transition-colors px-1.5 py-1"
            >
              {lang === "en" ? "ES" : "EN"}
            </button>
            <Link
              href="/learn"
              className="md:hidden text-xs font-display text-slate-500 hover:text-slate-900 transition-colors"
            >
              {t.nav.learn}
            </Link>
            <Link
              href="/apply"
              className="px-4 py-2 text-xs font-display font-semibold bg-tec-600 text-white hover:bg-tec-700 rounded-full transition-colors duration-200"
            >
              {t.nav.apply}
            </Link>
          </div>

        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section
        className="flex flex-col items-center justify-center gap-6
                   min-h-[calc(100vh-3.5rem)] overflow-hidden
                   lg:block lg:relative"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          heroTilt.current.nx = (e.clientX - r.left) / r.width;
          heroTilt.current.ny = (e.clientY - r.top)  / r.height;
          heroTilt.current.active = true;
        }}
        onMouseLeave={() => { heroTilt.current.active = false; }}
      >
        {/* Particle:
            · Mobile  — square container, centred in viewport
            · Desktop — absolute, fills the right 55% */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.3, ease: "easeOut" }}
          className="w-[88vw] max-w-[420px] aspect-square flex-shrink-0 pointer-events-none
                     lg:max-w-none lg:aspect-auto
                     lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[55%]"
        >
          <ParticleLogo className="w-full h-full" tiltRef={heroTilt} />
        </motion.div>

        {/* Mobile only — slogan below the particle */}
        <div className="lg:hidden w-full flex-shrink-0 px-4 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="text-xs font-display text-slate-400 mb-4 tracking-wide"
          >
            {t.hero.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.38 }}
            className="font-display font-extrabold leading-[0.88] tracking-[-0.04em] text-slate-900 text-[2.6rem]"
          >
            {t.hero.line1}<br />
            <span className="text-tec-600">{t.hero.accent}</span><br />
            {t.hero.line3}
          </motion.h1>
        </div>

        {/* Desktop only — full text centred in left column */}
        <div className="hidden lg:flex items-center min-h-[calc(100vh-3.5rem)] relative z-10
                        max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-[46%]">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="text-xs font-display text-slate-400 mb-8 tracking-wide"
            >
              {t.hero.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.38 }}
              className="font-display font-extrabold leading-[0.88] tracking-[-0.04em] text-slate-900"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)" }}
            >
              {t.hero.line1}<br />
              <span className="text-tec-600">{t.hero.accent}</span><br />
              {t.hero.line3}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.48 }}
              className="font-display text-slate-500 text-base sm:text-lg leading-relaxed mt-8 mb-8"
            >
              {t.hero.descPre}
              <span className="text-slate-900 font-semibold">{t.hero.descAccent}</span>
              {t.hero.descPost}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.56 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <Link
                href="/apply"
                className="group font-display inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold tracking-wider transition-all duration-200"
              >
                {t.hero.ctaPrimary}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <a
                href="#pillars"
                className="font-display inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-900 text-sm tracking-wider transition-all duration-200"
              >
                {t.hero.ctaSecondary}
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-8 pt-6 border-t border-slate-100"
            >
              {t.hero.stats.map(s => (
                <div key={s.lbl}>
                  <div className="text-sm font-bold font-mono text-slate-900 leading-tight">{s.val}</div>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">{s.lbl}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile only — description / CTAs / stats below the fold */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="font-display text-slate-500 text-base leading-relaxed mb-8"
        >
          {t.hero.descPre}
          <span className="text-slate-900 font-semibold">{t.hero.descAccent}</span>
          {t.hero.descPost}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="flex flex-col gap-3 mb-10"
        >
          <Link
            href="/apply"
            className="group font-display inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-slate-900 text-white text-sm font-bold tracking-wider"
          >
            {t.hero.ctaPrimary}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <a
            href="#pillars"
            className="font-display inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-slate-300 text-slate-600 text-sm tracking-wider"
          >
            {t.hero.ctaSecondary}
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex gap-8 pt-6 border-t border-slate-100"
        >
          {t.hero.stats.map(s => (
            <div key={s.lbl}>
              <div className="text-sm font-bold font-mono text-slate-900 leading-tight">{s.val}</div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">{s.lbl}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Ticker */}
      <TickerBar key={lang} items={tickerItems} />

      {/* ══════════════════════════════════════════════════════════
          PILLARS
      ══════════════════════════════════════════════════════════ */}
      <section id="pillars" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="font-serif text-slate-900" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            {t.pillars.heading}
          </h2>
          <p className="font-display text-slate-500 mt-4 max-w-xl text-base leading-relaxed">
            {t.pillars.sub}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-slate-100">
          {t.pillars.items.map((p, i) => {
            const style = PILLAR_STYLES[i];
            const Icon  = style.Icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white p-8 cursor-default"
              >
                <Icon size={22} className={`${style.iconClr} mb-5`} />
                <h3 className="font-display text-base font-semibold text-slate-900 mb-3">{p.title}</h3>
                <p className="font-display text-slate-500 text-sm leading-relaxed mb-5">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-xs font-display px-2.5 py-1 rounded-full border border-slate-200 text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOUNDER / TEAM
      ══════════════════════════════════════════════════════════ */}
      <section id="team" className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border border-slate-200 bg-white overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr,1.35fr]">

            <div className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-slate-100">
              <SectionLabel>{t.founder.section}</SectionLabel>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-1">
                Carlos Martínez Vázquez
              </h3>
              <p className="text-sm font-display text-tec-600 mb-1">{t.founder.role}</p>
              <p className="text-sm font-display text-slate-400 mb-6">{t.founder.badge}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                <span className="text-xs font-mono px-2 py-0.5 border border-tec-200 text-tec-600 bg-tec-50">ITC</span>
                <span className="text-xs font-mono px-2 py-0.5 border border-slate-200 text-slate-500">Tec de Monterrey · QRO</span>
              </div>
              <a
                href="https://linkedin.com/in/c-vzqz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-tec-600 transition-colors duration-200"
              >
                <Linkedin size={12} />
                linkedin.com/in/c-vzqz
              </a>
            </div>

            <div className="p-8 sm:p-10 flex flex-col justify-center">
              <blockquote className="font-display text-lg sm:text-xl font-medium text-slate-800 leading-[1.55] mb-5">
                {t.founder.quote}
              </blockquote>
              <p className="font-display text-slate-500 text-sm leading-relaxed mb-6">
                {t.founder.para}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.founder.activities.map(act => (
                  <span
                    key={act}
                    className="text-xs font-mono px-2.5 py-1 border border-slate-200 text-slate-500 bg-slate-50"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="font-serif text-slate-900 mb-4"
            style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)" }}
          >
            {t.cta.heading}
          </h2>
          <p className="font-display text-slate-500 mb-8 leading-relaxed max-w-md mx-auto">
            {t.cta.para}
          </p>
          <Link
            href="/apply"
            className="group font-display inline-flex items-center gap-2.5 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold tracking-wider transition-all duration-200"
          >
            {t.cta.btn}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs font-display text-slate-400">
            <span className="font-semibold text-slate-900">Quant<span className="text-tec-600">Tec</span></span>
            {" · Tec de Monterrey · QRO · Est. 2026"}
          </span>
          <p className="text-xs font-mono text-slate-400 italic">{t.footer}</p>
        </div>
      </footer>

    </div>
  );
}
