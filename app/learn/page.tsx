"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, TrendingUp, Database, Cpu, BarChart2, Zap, FlaskConical } from "lucide-react";
import { useLang } from "@/lib/useLang";
import MobileNav from "@/components/MobileNav";

// ─────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────

const BOOKS = [
  {
    tier: 0,
    title: "The Man Who Solved the Market",
    author: "Gregory Zuckerman",
    year: 2019,
    desc_en: "The inside story of Jim Simons and Renaissance Technologies. No math required. Reads like a thriller, hits like a blueprint.",
    desc_es: "La historia de Jim Simons y Renaissance Technologies. Sin matemáticas. Se lee como un thriller y golpea como un plano.",
  },
  {
    tier: 0,
    title: "The Quants",
    author: "Scott Patterson",
    year: 2010,
    desc_en: "How a small group of mathematicians took over Wall Street and nearly caused a collapse. A gripping account of modern quantitative finance.",
    desc_es: "Cómo un grupo de matemáticos tomó Wall Street y casi causó un colapso. Un relato absorbente del surgimiento de las finanzas cuantitativas.",
  },
  {
    tier: 0,
    title: "A Man for All Markets",
    author: "Edward O. Thorp",
    year: 2017,
    desc_en: "Memoir of the mathematician who beat casinos, then markets. Thorp invented card counting and founded the first market-neutral hedge fund.",
    desc_es: "Memorias del matemático que venció a los casinos y al mercado. Thorp inventó el conteo de cartas y fundó el primer hedge fund market-neutral.",
  },
  {
    tier: 1,
    title: "Quantitative Trading",
    author: "Ernest P. Chan",
    year: 2008,
    desc_en: "Hands-on guide to building systematic trading strategies from scratch in Python. Where the narrative books end, this one begins.",
    desc_es: "Guía práctica para construir estrategias de trading sistemático desde cero en Python. Donde terminan los libros narrativos, este empieza.",
  },
  {
    tier: 1,
    title: "Inside the Black Box",
    author: "Rishi K. Narang",
    year: 2013,
    desc_en: "How quant hedge funds actually work: research, risk management, and execution. No advanced math required.",
    desc_es: "Cómo funcionan realmente los fondos cuantitativos: investigación, riesgo y ejecución. Sin matemáticas avanzadas.",
  },
  {
    tier: 1,
    title: "Python for Finance",
    author: "Yves Hilpisch",
    year: 2018,
    desc_en: "The definitive Python reference for financial data analysis, derivatives pricing, and portfolio optimization. Practical and comprehensive.",
    desc_es: "La referencia definitiva en Python para análisis financiero, valuación de derivados y optimización de portafolios. Práctica y exhaustiva.",
  },
  {
    tier: 2,
    title: "Advances in Financial Machine Learning",
    author: "Marcos López de Prado",
    year: 2018,
    desc_en: "State-of-the-art ML techniques for finance from a former quant at Millennium. Dense, essential, graduate-level. Not a casual read.",
    desc_es: "Técnicas de ML de vanguardia para finanzas de un ex-quant de Millennium. Denso, esencial, nivel posgrado. No es lectura casual.",
  },
  {
    tier: 2,
    title: "Options, Futures, and Other Derivatives",
    author: "John C. Hull",
    year: 2022,
    desc_en: "The foundational text. Every quant finance professional has read this. Covers derivatives pricing from first principles, rigorously.",
    desc_es: "El texto fundamental. Todo profesional de finanzas cuantitativas lo ha leído. Cubre valuación de derivados desde primeros principios.",
  },
  {
    tier: 2,
    title: "Active Portfolio Management",
    author: "Grinold & Kahn",
    year: 2000,
    desc_en: "The definitive framework for quantitative equity portfolio management. Introduces the Fundamental Law of Active Management and the full alpha-to-portfolio pipeline.",
    desc_es: "El marco definitivo para la gestión cuantitativa de portafolios de renta variable. Introduce la Ley Fundamental de la Gestión Activa y el pipeline completo de alpha a portafolio.",
  },
];

const CONCEPTS = [
  { Icon: TrendingUp,   id: "arb", en: "Statistical Arbitrage", es: "Arbitraje Estadístico",  en_s: "Find and exploit pricing gaps between related assets using math.",       es_s: "Encontrar y explotar diferencias de precio entre activos relacionados."   },
  { Icon: BarChart2,    id: "fac", en: "Factor Investing",      es: "Inversión por Factores",  en_s: "Identify systematic risk premia: value, momentum, quality, size.",       es_s: "Identificar primas de riesgo sistemáticas: valor, momentum, calidad."   },
  { Icon: FlaskConical, id: "der", en: "Derivatives Pricing",   es: "Valuación de Derivados",  en_s: "Price options and other instruments using mathematical models.",           es_s: "Valuar opciones y otros instrumentos con modelos matemáticos."           },
  { Icon: Zap,          id: "hft", en: "High-Freq. Trading",    es: "Trading de Alta Freq.",   en_s: "Exploit microsecond inefficiencies through speed and systems.",           es_s: "Explotar ineficiencias en microsegundos mediante velocidad y sistemas."  },
  { Icon: Database,     id: "alt", en: "Alternative Data",      es: "Datos Alternativos",      en_s: "Satellite images, transaction data, NLP: signals beyond price history.", es_s: "Imágenes satelitales, transacciones, NLP: señales más allá del precio." },
  { Icon: Cpu,          id: "ml",  en: "ML & Forecasting",      es: "ML y Pronóstico",         en_s: "Machine learning applied to return prediction and risk estimation.",       es_s: "Machine learning aplicado a predicción de retornos y estimación de riesgo."},
];

const T = {
  en: {
    nav:    { home: "Home", about: "About", team: "Team", events: "Events", contact: "Contact", apply: "Apply" },
    hero: {
      eyebrow: "Quant Finance 101",
      heading: "Understanding Quantitative Finance.",
      sub:     "Quant finance is the application of mathematics, statistics, and computing to financial markets. Not gut feel. Not charts. Signal.",
    },
    what: {
      heading: "What is it, really?",
      body1:   "Most people think about finance in terms of news cycles, earnings calls, and gut instinct. Quantitative finance takes a different approach: find persistent, measurable patterns in data and bet on them systematically, the same way a physicist studies a physical system.",
      body2:   "The core idea is that markets, like other complex systems, have hidden structure. You can't always explain why a pattern exists. But if it appears consistently in clean data and survives out-of-sample testing, you trade it.",
      principle: "No forecasts. No opinions. Just signal.",
    },
    simons: {
      eyebrow:  "Case Study",
      name:     "James Harris Simons",
      dates:    "1938-2024",
      role:     "Mathematician, Cryptographer, Investor",
      quote:    "“We search through historical data looking for anomalous patterns that we would not expect to occur by chance.”",
      quoteCtx: "From a 2015 TED talk on mathematics and markets",
      bio1:     "Before he was one of the most successful investors in history, Simons was a mathematician. He earned his PhD from UC Berkeley at 23, broke codes for the NSA during the Cold War, and chaired the math department at Stony Brook, where he co-developed Chern-Simons theory, a foundational result in modern geometry.",
      bio2:     "He founded Renaissance Technologies in 1982 with a different hypothesis: that financial markets, like other complex systems, contain hidden mathematical structure. He hired physicists, mathematicians, and computer scientists, not economists, not traders, and gave them complete freedom to follow the data.",
      bio3:     "The result was the Medallion Fund. Closed to outside investors since 1993, it has returned an average of 66% gross annually from 1988 to 2018, the best risk-adjusted performance of any investment fund in recorded history, by most accounts.",
      stats: [
        { val: "1982",  lbl: "Founded Renaissance Technologies" },
        { val: "~66%",  lbl: "Avg. annual gross return, Medallion (1988-2018)" },
        { val: "+80%",  lbl: "Return in 2008, when S&P fell 38%" },
        { val: "PhD",   lbl: "Mathematics, UC Berkeley, age 23" },
      ],
      principlesHeading: "What he got right",
      principles: [
        { title: "Hire scientists, not economists", body: "Renaissance didn't look for people who understood finance. They looked for people who understood pattern recognition, signal processing, and rigorous testing. Domain knowledge was considered a liability. It brought bias." },
        { title: "Follow the signal, not the story", body: "Simons never cared why a pattern existed. If the data showed it worked out-of-sample, they traded it. This was radical in the 1980s. It's still hard to follow in practice. Humans want narratives." },
        { title: "Never override the model", body: "The hardest rule in quant finance. When your gut says one thing and the model says another, you listen to the model. Renaissance made this a culture, not just a policy." },
      ],
    },
    books: {
      heading: "Reading list.",
      sub:     "Organized by difficulty. Start at the top if you've never touched quant before.",
      tiers: [
        { label: "Start Here",           tag: "No math required" },
        { label: "Technical Foundation", tag: "Python & stats"   },
        { label: "Advanced",             tag: "Graduate level"   },
      ],
    },
    concepts: {
      heading: "Key subfields.",
      sub:     "Six areas that make up the quantitative finance landscape. We'll cover all of them inside TMQS.",
    },
    cta: {
      heading: "Ready to start?",
      sub:     "Join the founding cohort at TMQS, the first quant student group in Tec de Monterrey history.",
      btn:     "APPLY NOW",
    },
    footer: "Extracting alpha from noise.",
  },

  es: {
    nav:    { home: "Inicio", about: "Acerca", team: "Equipo", events: "Eventos", contact: "Contacto", apply: "Aplicar" },
    hero: {
      eyebrow: "Finanzas Cuantitativas 101",
      heading: "Entendiendo las Finanzas Cuantitativas.",
      sub:     "Las finanzas cuantitativas aplican matemáticas, estadística y computación a los mercados financieros. No intuición. No gráficas. Señal.",
    },
    what: {
      heading: "¿Qué son realmente?",
      body1:   "La mayoría piensa en finanzas en términos de noticias, llamadas de ganancias e instinto. Las finanzas cuantitativas toman un enfoque diferente: encontrar patrones persistentes y medibles en los datos y apostar en ellos sistemáticamente, igual que un físico estudia un sistema físico.",
      body2:   "La idea central es que los mercados, como otros sistemas complejos, tienen estructura oculta. No siempre puedes explicar por qué existe un patrón. Pero si aparece consistentemente en datos limpios y sobrevive pruebas fuera de muestra, lo operas.",
      principle: "Sin pronósticos. Sin opiniones. Solo señal.",
    },
    simons: {
      eyebrow:  "Caso de Estudio",
      name:     "James Harris Simons",
      dates:    "1938-2024",
      role:     "Matemático, Criptógrafo, Inversionista",
      quote:    "“Buscamos en datos históricos patrones anómalos que no esperaríamos que ocurrieran por azar.”",
      quoteCtx: "De una charla TED 2015 sobre matemáticas y mercados",
      bio1:     "Antes de ser uno de los inversionistas más exitosos de la historia, Simons era matemático. Obtuvo su doctorado de UC Berkeley a los 23 años, desifró códigos para la NSA durante la Guerra Fría, y dirigió el departamento de matemáticas de Stony Brook, donde co-desarrolló la teoría de Chern-Simons, un resultado fundamental en geometría moderna.",
      bio2:     "Fundó Renaissance Technologies en 1982 con una hipótesis diferente: que los mercados financieros, como otros sistemas complejos, contienen estructura matemática oculta. Contrató físicos, matemáticos y científicos computacionales, no economistas, no traders, y les dio libertad total para seguir los datos.",
      bio3:     "El resultado fue el Medallion Fund. Cerrado a inversionistas externos desde 1993, ha retornado un promedio de 66% bruto anual de 1988 a 2018, el mejor rendimiento ajustado por riesgo de cualquier fondo de inversión en la historia registrada, por la mayoría de los cálculos.",
      stats: [
        { val: "1982",  lbl: "Fundó Renaissance Technologies" },
        { val: "~66%",  lbl: "Retorno bruto promedio anual, Medallion (1988-2018)" },
        { val: "+80%",  lbl: "Retorno en 2008, cuando el S&P cayó 38%" },
        { val: "PhD",   lbl: "Matemáticas, UC Berkeley, a los 23 años" },
      ],
      principlesHeading: "Lo que hizo bien",
      principles: [
        { title: "Contrata científicos, no economistas", body: "Renaissance no buscaba personas que entendieran finanzas. Buscaba personas que entendieran reconocimiento de patrones, procesamiento de señales y pruebas rigurosas. El conocimiento del dominio financiero se consideraba una desventaja. Traía sesgo." },
        { title: "Sigue la señal, no la historia", body: "Simons nunca le importó por qué existía un patrón. Si los datos mostraban que funcionaba fuera de muestra, lo operaban. Esto era radical en los 80. Sigue siendo difícil de seguir en la práctica. Los humanos queremos narrativas." },
        { title: "Nunca anules el modelo", body: "La regla más difícil de las finanzas cuantitativas. Cuando tu intuición dice una cosa y el modelo dice otra, escuchas al modelo. Renaissance hizo de esto una cultura, no solo una política." },
      ],
    },
    books: {
      heading: "Lista de lectura.",
      sub:     "Organizada por dificultad. Empieza desde arriba si nunca has tocado quant.",
      tiers: [
        { label: "Empieza Aquí",          tag: "Sin matemáticas" },
        { label: "Fundamentos Técnicos",  tag: "Python y stats"  },
        { label: "Avanzado",              tag: "Nivel posgrado"  },
      ],
    },
    concepts: {
      heading: "Subdisciplinas clave.",
      sub:     "Seis áreas que conforman el panorama de las finanzas cuantitativas. Las cubriremos todas dentro de TMQS.",
    },
    cta: {
      heading: "¿Listo para empezar?",
      sub:     "Únete a la cohorte fundadora de TMQS, el primer grupo estudiantil de quant en la historia del Tec de Monterrey.",
      btn:     "APLICAR AHORA",
    },
    footer: "Extrayendo alpha del ruido.",
  },
};

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const { lang, toggle } = useLang();
  const t = T[lang];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/tmqs-logo.png" alt="TMQS" width={1259} height={967} className="h-8 w-auto" priority />
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-7">
            <Link href="/#pillars" className="text-xs font-serif text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.about}</Link>
            <Link href="/team" className="text-xs font-serif text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.team}</Link>
            <Link href="/events" className="text-xs font-serif text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.events}</Link>
            <Link href="/contact" className="text-xs font-serif text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.contact}</Link>
          </nav>

          {/* Right */}
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
            <MobileNav links={[
              { href: "/#pillars", label: t.nav.about },
              { href: "/team", label: t.nav.team },
              { href: "/events", label: t.nav.events },
              { href: "/contact", label: t.nav.contact },
            ]} />
          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ══════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════ */}
        <section className="pt-20 pb-16 lg:pt-28 lg:pb-20 border-b border-slate-100">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-serif font-semibold tracking-widest uppercase text-slate-400 mb-5"
          >
            {t.hero.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.07 }}
            className="font-serif text-slate-900 mb-6"
            style={{ fontSize: "clamp(2.4rem,5vw,4rem)", lineHeight: 0.95 }}
          >
            {t.hero.heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-serif text-slate-500 text-lg leading-relaxed max-w-2xl"
          >
            {t.hero.sub}
          </motion.p>
        </section>

        {/* ══════════════════════════════════════════════════════════
            WHAT IS IT
        ══════════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-20 border-b border-slate-100">
          <div className="grid lg:grid-cols-[1fr,1.2fr] gap-12 lg:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs font-serif font-semibold tracking-widest uppercase text-slate-400 mb-4">// THE BASICS</p>
              <h2 className="font-serif text-slate-900 mb-0" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)" }}>
                {t.what.heading}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <p className="font-serif text-slate-600 leading-relaxed">{t.what.body1}</p>
              <p className="font-serif text-slate-600 leading-relaxed">{t.what.body2}</p>
              <div className="mt-6 pl-5 border-l-2 border-tec-400">
                <p className="font-serif text-slate-800 text-lg font-medium italic">{t.what.principle}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            KEY CONCEPTS
        ══════════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-20 border-b border-slate-100">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs font-serif font-semibold tracking-widest uppercase text-slate-400 mb-4">// SUBFIELDS</p>
            <h2 className="font-serif text-slate-900 mb-3" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)" }}>
              {t.concepts.heading}
            </h2>
            <p className="font-serif text-slate-500 max-w-xl">{t.concepts.sub}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100">
            {CONCEPTS.map((c, i) => {
              const Icon  = c.Icon;
              const label = lang === "en" ? c.en : c.es;
              const sub   = lang === "en" ? c.en_s : c.es_s;
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white p-6 hover:bg-slate-50 transition-colors duration-200"
                >
                  <Icon size={16} className="text-tec-500 mb-4" />
                  <h3 className="font-serif text-sm font-semibold text-slate-900 mb-2">{label}</h3>
                  <p className="font-serif text-xs text-slate-500 leading-relaxed">{sub}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            JIM SIMONS
        ══════════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-24 border-b border-slate-100">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-xs font-serif font-semibold tracking-widest uppercase text-slate-400 mb-4">{t.simons.eyebrow}</p>
            <h2 className="font-serif text-slate-900" style={{ fontSize: "clamp(1.8rem,4vw,3rem)" }}>
              {t.simons.name}
            </h2>
            <p className="font-mono text-xs text-slate-400 mt-1 tracking-widest">{t.simons.dates} · {t.simons.role}</p>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.07 }}
            className="mb-12 pl-6 border-l-2 border-tec-400"
          >
            <blockquote
              className="font-serif font-medium text-slate-800 leading-[1.5] mb-3"
              style={{ fontSize: "clamp(1.1rem,2.5vw,1.5rem)" }}
            >
              {t.simons.quote}
            </blockquote>
            <p className="text-xs font-mono text-slate-400 tracking-wide">{t.simons.quoteCtx}</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 mb-14"
          >
            {t.simons.stats.map(s => (
              <div key={s.val} className="bg-white px-6 py-5">
                <div className="text-2xl font-bold font-mono text-tec-600 mb-1">{s.val}</div>
                <div className="text-xs font-serif text-slate-500 leading-snug">{s.lbl}</div>
              </div>
            ))}
          </motion.div>

          {/* Bio */}
          <div className="grid lg:grid-cols-2 gap-12 mb-14">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="font-serif text-slate-600 leading-relaxed">{t.simons.bio1}</p>
              <p className="font-serif text-slate-600 leading-relaxed">{t.simons.bio2}</p>
              <p className="font-serif text-slate-600 leading-relaxed">{t.simons.bio3}</p>
            </motion.div>

            {/* Principles */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-xs font-mono tracking-[0.22em] text-tec-500 mb-6">{t.simons.principlesHeading}</p>
              <div className="space-y-5">
                {t.simons.principles.map((p, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-px bg-tec-200 flex-shrink-0 mt-1.5" />
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-slate-900 mb-1.5">{p.title}</h4>
                      <p className="font-serif text-sm text-slate-500 leading-relaxed">{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            BOOKS
        ══════════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-20 border-b border-slate-100">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-xs font-serif font-semibold tracking-widest uppercase text-slate-400 mb-4">
              <BookOpen size={10} className="inline mr-2" />
              READING LIST
            </p>
            <h2 className="font-serif text-slate-900 mb-3" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)" }}>
              {t.books.heading}
            </h2>
            <p className="font-serif text-slate-500 max-w-xl">{t.books.sub}</p>
          </motion.div>

          <div className="space-y-8">
            {t.books.tiers.map((tier, tierIdx) => {
              const tierBooks = BOOKS.filter(b => b.tier === tierIdx);
              return (
                <div key={tierIdx}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 border border-slate-200 mb-4">
                    <span className="text-xs font-mono font-bold text-slate-700">{tier.label}</span>
                    <span className="text-xs font-mono text-slate-400">· {tier.tag}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100">
                    {tierBooks.map((book, j) => (
                      <motion.div
                        key={book.title}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.08 }}
                        className="bg-white p-6 hover:bg-slate-50 transition-colors duration-200"
                      >
                        <p className="text-xs font-mono mb-3 text-slate-400">{book.year}</p>
                        <h3 className="font-serif text-sm font-bold text-slate-900 leading-snug mb-1">
                          {book.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-400 mb-3">{book.author}</p>
                        <p className="font-serif text-xs text-slate-500 leading-relaxed">
                          {lang === "en" ? book.desc_en : book.desc_es}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            CTA
        ══════════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-20 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-slate-900 mb-4" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
              {t.cta.heading}
            </h2>
            <p className="font-serif text-slate-500 mb-8 leading-relaxed">{t.cta.sub}</p>
            <Link
              href="/apply"
              className="group font-serif inline-flex items-center gap-2.5 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold tracking-wider transition-all duration-200"
            >
              {t.cta.btn}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs font-serif text-slate-400">
            Tec de Monterrey Campus Querétaro, Est. 2026
          </span>
          <p className="text-xs font-mono text-slate-400 italic">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}
