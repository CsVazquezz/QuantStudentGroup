"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Brain, Users, GitBranch, Instagram, Linkedin, Mail } from "lucide-react";
import { useLang } from "@/lib/useLang";
import type { Lang } from "@/lib/useLang";
import MobileNav from "@/components/MobileNav";

const PILLAR_STYLES = [
  { iconClr: "text-tec-600", Icon: GitBranch },
  { iconClr: "text-tec-600", Icon: Brain     },
  { iconClr: "text-tec-600", Icon: Users     },
];

const T = {
  en: {
    nav: { about: "About", team: "Team", learn: "Learn", events: "Events", contact: "Contact", apply: "Apply" },
    hero: {
      eyebrow:      "Tec de Monterrey, Campus Querétaro · Founding Cohort 2026",
      line1:        "Tec Monterrey",
      accent:       "Quant",
      line3:        "Society.",
      descPre:      "The ",
      descAccent:   "first quant student club",
      descPost:     " in Tec de Monterrey history. A community for students curious about where markets, data, and mathematics meet. No prior experience required.",
    },
    pillars: {
      heading: "What we do together.",
      sub:     "Three areas of focus, all taught from scratch, all open to any major. You don't need to arrive knowing any of this. That's the point.",
      items: [
        {
          title: "Algorithmic Strategy",
          desc:  "From your first backtest to a live paper-trading strategy. We teach systematic thinking from the ground up. No prior finance knowledge required. You build real models, step by step.",
          tags:  ["Start From Zero", "Backtesting", "Risk Mgmt", "Python"],
        },
        {
          title: "High-Dimensional Data",
          desc:  "Curious about AI and markets but unsure where to begin? We explore ML, NLP, and alternative data as a team, applied to real financial problems. Curiosity is the only prerequisite.",
          tags:  ["Beginners Welcome", "Machine Learning", "NLP", "Alt Data"],
        },
        {
          title: "Shared Ecosystem",
          desc:  "LAF, ITC, IDM, LEC: all welcome. Your background in finance, code, or data is a strength, not a requirement. The best research happens when different disciplines work on the same problem.",
          tags:  ["All Majors", "Hackathons", "Network", "Industry"],
        },
      ],
    },
    sponsors: {
      heading: "Sponsors.",
      sub:     "Organizations that believe in what we're building. Interested in supporting TMQS?",
      empty:   "Sponsorship opportunities open for Fall 2026.",
      contact: "Get in touch",
    },
    highlights: {
      heading: "Fall 2026 Highlights.",
      sub:     "Events, projects, and milestones from our founding semester.",
      empty:   "Our first semester hasn't started yet. Check back in Fall 2026.",
    },
    cta: {
      heading: "Ready to be part of this?",
      para:    "Applications take about 10 minutes. No quant experience required. Just tell us who you are and what excites you.",
      btn:     "JOIN THE FOUNDING COHORT",
    },
    footer: "Extracting alpha from noise.",
  },

  es: {
    nav: { about: "Acerca", team: "Equipo", learn: "Aprender", events: "Eventos", contact: "Contacto", apply: "Aplicar" },
    hero: {
      eyebrow:      "Tec de Monterrey, Campus Querétaro · Cohorte Fundadora 2026",
      line1:        "Tec Monterrey",
      accent:       "Quant",
      line3:        "Society.",
      descPre:      "El ",
      descAccent:   "primer club de quant",
      descPost:     " en la historia del Tec de Monterrey. Una comunidad para estudiantes curiosos sobre la intersección de mercados, datos y matemáticas. Sin experiencia previa requerida.",
    },
    pillars: {
      heading: "Lo que hacemos juntos.",
      sub:     "Tres áreas de enfoque, todas desde cero, todas abiertas a cualquier carrera. No necesitas llegar sabiendo nada de esto. Ese es el punto.",
      items: [
        {
          title: "Estrategia Algorítmica",
          desc:  "Desde tu primer backtest hasta una estrategia activa en papel. Enseñamos pensamiento sistemático desde cero. Sin conocimientos previos de finanzas. Construyes modelos reales, paso a paso.",
          tags:  ["Desde Cero", "Backtesting", "Gestión de Riesgo", "Python"],
        },
        {
          title: "Datos de Alta Dimensión",
          desc:  "¿Curioso sobre IA y mercados pero sin saber por dónde empezar? Exploramos ML, NLP y datos alternativos en equipo, aplicados a problemas financieros reales. La curiosidad es el único requisito.",
          tags:  ["Principiantes", "Machine Learning", "NLP", "Datos Alt."],
        },
        {
          title: "Ecosistema Compartido",
          desc:  "LAF, ITC, IDM, LEC: todos bienvenidos. Tu carrera en finanzas, código o datos es una fortaleza, no un requisito. La mejor investigación surge cuando distintas disciplinas trabajan en el mismo problema.",
          tags:  ["Todas las Carreras", "Hackathones", "Red", "Industria"],
        },
      ],
    },
    sponsors: {
      heading: "Patrocinadores.",
      sub:     "Organizaciones que creen en lo que estamos construyendo. ¿Interesado en apoyar a TMQS?",
      empty:   "Oportunidades de patrocinio abiertas para Otoño 2026.",
      contact: "Contáctanos",
    },
    highlights: {
      heading: "Highlights Otoño 2026.",
      sub:     "Eventos, proyectos e hitos de nuestro semestre fundador.",
      empty:   "Nuestro primer semestre aún no ha comenzado. Vuelve en Otoño 2026.",
    },
    cta: {
      heading: "¿Listo para ser parte de esto?",
      para:    "La solicitud toma unos 10 minutos. No se requiere experiencia en quant. Solo cuéntanos quién eres y qué te emociona.",
      btn:     "ÚNETE A LA COHORTE FUNDADORA",
    },
    footer: "Extrayendo alpha del ruido.",
  },
};

// ─────────────────────────────────────────────────────────────────
// 3D Particle Logo — samples the Tec flame from tec-logo.png
// Commented out 2026-07-21: removed from the hero for a more
// professional look. Needs `useEffect, useRef` back in the import
// above if restored.
// ─────────────────────────────────────────────────────────────────
/*
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
*/

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────

export default function Page() {
  const { lang, toggle } = useLang();
  const t = T[lang];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">

          <div className="flex items-center gap-3 shrink-0">
            <Image src="/tmqs-logo.png" alt="TMQS" width={1259} height={967} className="h-8 w-auto" priority />
          </div>

          <nav className="hidden md:flex items-center gap-7">
            <a href="#pillars"  className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.about}</a>
            <Link href="/team"  className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.team}</Link>
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
              { href: "#pillars", label: t.nav.about },
              { href: "/team", label: t.nav.team },
              { href: "/learn", label: t.nav.learn },
              { href: "/events", label: t.nav.events },
              { href: "/contact", label: t.nav.contact },
            ]} />
          </div>

        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="min-h-[calc(100vh-3.5rem)] flex items-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="font-serif leading-[0.92] tracking-tight text-slate-900"
            style={{ fontSize: "clamp(3.2rem, 8vw, 7.5rem)" }}
          >
            {t.hero.line1}<br />
            <span className="text-tec-600">{t.hero.accent}</span><br />
            {t.hero.line3}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32 }}
            className="font-serif italic text-slate-500 text-lg sm:text-xl leading-relaxed mt-8 max-w-lg"
          >
            {t.hero.descPre}{t.hero.descAccent}{t.hero.descPost}
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PILLARS
      ══════════════════════════════════════════════════════════ */}
      <section id="pillars" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 border-t border-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="font-serif text-slate-900" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            {t.pillars.heading}
          </h2>
          <p className="font-sans text-slate-500 mt-4 max-w-xl text-base leading-relaxed">
            {t.pillars.sub}
          </p>
        </motion.div>

        <div className="border-t border-slate-200">
          {t.pillars.items.map((p, i) => {
            const { Icon } = PILLAR_STYLES[i];
            const flip = i % 2 === 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="grid md:grid-cols-12 gap-x-8 gap-y-4 border-b border-slate-200 py-10 lg:py-14"
              >
                {/* Rail: oversized index number + icon */}
                <div
                  className={`md:col-span-4 flex items-start gap-4 ${
                    flip ? "md:order-2 md:justify-end md:text-right" : "md:order-1"
                  }`}
                >
                  <span
                    className="font-serif leading-none text-slate-200 select-none"
                    style={{ fontSize: "clamp(3.5rem,7vw,6rem)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon size={20} className="text-tec-600 mt-3 shrink-0" />
                </div>

                {/* Content: title + desc + tags */}
                <div className={`md:col-span-8 ${flip ? "md:order-1" : "md:order-2"}`}>
                  <h3
                    className="font-serif font-semibold text-slate-900"
                    style={{ fontSize: "clamp(1.25rem,2vw,1.75rem)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="font-sans text-slate-500 text-sm leading-relaxed mt-3 max-w-xl">
                    {p.desc}
                  </p>
                  <ul className="flex flex-wrap gap-x-5 gap-y-1 mt-5">
                    {p.tags.map((tag) => (
                      <li
                        key={tag}
                        className="font-sans text-xs tracking-wide text-slate-400 border-l border-tec-600 pl-2"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SPONSORS
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-24 border-t border-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="font-serif text-slate-900 mb-3" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}>
            {t.sponsors.heading}
          </h2>
          <p className="font-sans text-slate-500 max-w-lg leading-relaxed">
            {t.sponsors.sub}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border border-dashed border-slate-200 rounded-sm py-16 flex flex-col items-center gap-4 text-center"
        >
          <p className="font-sans text-slate-400 text-sm">{t.sponsors.empty}</p>
          <a
            href="mailto:c.mtnzvzqz@gmail.com"
            className="inline-flex items-center gap-2 text-xs font-mono text-tec-600 hover:text-tec-700 transition-colors"
          >
            <Mail size={12} />
            {t.sponsors.contact}
          </a>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FALL 2026 HIGHLIGHTS
      ══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-24 border-t border-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="font-serif text-slate-900 mb-3" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}>
            {t.highlights.heading}
          </h2>
          <p className="font-sans text-slate-500 max-w-lg leading-relaxed">
            {t.highlights.sub}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border border-dashed border-slate-200 rounded-sm py-16 flex items-center justify-center"
        >
          <p className="font-sans text-slate-400 text-sm">{t.highlights.empty}</p>
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

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-sans text-slate-400">
            Tec de Monterrey Campus Querétaro, Est. 2026
          </span>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/tmqs_qro/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <Instagram size={14} />
            </a>
            <a
              href="https://www.linkedin.com/company/tec-monterrey-quant-society/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <Linkedin size={14} />
            </a>
            <a
              href="mailto:tecmonterreyquantsociety@gmail.com"
              aria-label="Email"
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <Mail size={14} />
            </a>
          </div>
          <p className="text-xs font-mono text-slate-400 italic">{t.footer}</p>
        </div>
      </footer>

    </div>
  );
}
