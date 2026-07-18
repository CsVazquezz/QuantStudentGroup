"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, BarChart2, Zap, Database, Cpu,
  CheckCircle, AlertCircle, Send,
} from "lucide-react";
import { useLang } from "@/lib/useLang";

// ─────────────────────────────────────────────────────────────────
// Static (language-agnostic)
// ─────────────────────────────────────────────────────────────────

const MAJOR_IDS   = ["LAF", "ITC", "IDM", "LEC", "IENG", "LBUS"] as const;
const MAJOR_ICONS = ["₿",   "⌨",   "◈",   "∿",   "⚙",   "◎"]   as const;

const INTEREST_IDS   = ["portfolio", "hft", "altdata", "infra"] as const;
const INTEREST_ICONS = [BarChart2, Zap, Database, Cpu]          as const;

// ─────────────────────────────────────────────────────────────────
// Translations
// ─────────────────────────────────────────────────────────────────

const T = {
  en: {
    nav: { home: "Home", about: "About", team: "Team", learn: "Learn", events: "Events", contact: "Contact" },
    page: {
      eyebrow:    "Founding Cohort · Fall 2026",
      heading:    "Apply to TMQS.",
      desc:       "We're looking for curious students from ",
      descAccent: "any background",
      descPost:   " who want to be part of building something genuinely new at Tec. Tell us about yourself. That's all we need.",
      strip:      ["First quant club at Tec de Monterrey", "All majors welcome", "No prior experience required"],
    },
    sections: {
      personal:       "Personal Details",
      major:          "Your Major",
      stage:          "Academic Stage",
      technical:      "Technical Background",
      techHelper:     "Honest answers help us pair you with the right projects. There's no wrong answer.",
      interests:      "Areas of Interest",
      interestHelper: "Pick everything that sounds interesting. You don't need to know these topics yet.",
      role:           "How You'd Like to Participate",
      sandbox:        "Tell Us About Yourself",
      sandboxHelper:  "Share a project you've built, a market idea you find interesting, or simply why you want to join. Write like you'd talk to us in person.",
    },
    fields: {
      fullName:         "FULL NAME",
      email:            "INSTITUTIONAL EMAIL",
      namePlaceholder:  "Firstname Lastname",
      emailPlaceholder: "a01234567@tec.mx",
      chars:            "chars",
      campusLabel:      "I can attend in-person sessions at Campus Querétaro",
      campusSub:        "Required for Active Researchers & Board members",
    },
    majors: [
      { label: "LAF",        full: "Finance"       },
      { label: "ITC",        full: "Comp. Science" },
      { label: "IDM",        full: "Data Science"  },
      { label: "LEC",        full: "Economics"     },
      { label: "Other Eng.", full: "Engineering"   },
      { label: "Other Bus.", full: "Business"      },
    ],
    stages: [
      { id: "exploration",    label: "Exploration",    range: "1-3 Sem",  desc: "Finding your path"    },
      { id: "enfoque",        label: "Focus",          range: "4-5 Sem",  desc: "Sharpening your edge" },
      { id: "specialization", label: "Specialization", range: "6-8+ Sem", desc: "Deep technical work"  },
    ],
    techLevels: [
      { value: 1, label: "Curious",   desc: "No code / Finance 101"      },
      { value: 2, label: "Learner",   desc: "Python basics, Excel"        },
      { value: 3, label: "Builder",   desc: "APIs, data wrangling, stats" },
      { value: 4, label: "Engineer",  desc: "ML, systematic backtesting"  },
      { value: 5, label: "Architect", desc: "Custom ML / full pipelines"  },
    ],
    interests: [
      { label: "Portfolio Optimization"   },
      { label: "High-Frequency Dev"       },
      { label: "Alternative Data"         },
      { label: "Financial Infrastructure" },
    ],
    roles: [
      { id: "researcher", label: "Active Quant Researcher", desc: "Full research stack: modeling, backtesting, deployment" },
      { id: "board",      label: "Executive Board / Staff", desc: "Ops, partnerships, and community building"              },
      { id: "community",  label: "Community Member",        desc: "Events, workshops, and network access"                  },
    ],
    submit: {
      idle:    "SUBMIT APPLICATION",
      loading: "SENDING APPLICATION...",
      footer:  "We read every application personally · Results in 2-3 weeks",
    },
    errors: {
      fullName:        "Full name is required",
      email:           "Must be a valid @tec.mx institutional email",
      major:           "Select your major",
      academicStage:   "Select your academic stage",
      technicalLevel:  "Rate your technical background",
      interests:       "Select at least one area",
      desiredRole:     "Select your desired role",
      campusConfirmed: "Confirm in-person availability to proceed",
      openSandbox:     "Write at least 50 characters",
      duplicateEmail:  "This email has already been submitted",
      submitFailed:    "Something went wrong. Please try again.",
    },
    success: {
      eyebrow:    "Application Received",
      heading:    "We'll be in touch.",
      body:       "We read every application personally and will get back to you within ",
      bodyAccent: "2-3 weeks",
      bodyPost:   ". Thanks for being part of building something new.",
      sentOn:     "Sent on",
      backHome:   "Back to home",
    },
    sandboxPlaceholder: `e.g. "I'm a second-semester ITC student who got obsessed with algorithmic\ntrading after taking a probability course. I've been learning Python on\nthe side and want to apply it to something real..."`,
  },

  es: {
    nav: { home: "Inicio", about: "Acerca", team: "Equipo", learn: "Aprender", events: "Eventos", contact: "Contacto" },
    page: {
      eyebrow:    "Cohorte Fundadora · Otoño 2026",
      heading:    "Aplica a TMQS.",
      desc:       "Buscamos estudiantes curiosos de ",
      descAccent: "cualquier carrera",
      descPost:   " que quieran ser parte de construir algo genuinamente nuevo en el Tec. Cuéntanos sobre ti. Eso es todo lo que necesitamos.",
      strip:      ["Primer club de quant en Tec de Monterrey", "Todas las carreras bienvenidas", "Sin experiencia previa requerida"],
    },
    sections: {
      personal:       "Datos Personales",
      major:          "Tu Carrera",
      stage:          "Etapa Académica",
      technical:      "Nivel Técnico",
      techHelper:     "Respuestas honestas nos ayudan a asignarte a los proyectos correctos. No hay respuesta incorrecta.",
      interests:      "Áreas de Interés",
      interestHelper: "Elige todo lo que suene interesante. No necesitas conocer estos temas todavía.",
      role:           "Cómo Quieres Participar",
      sandbox:        "Cuéntanos Sobre Ti",
      sandboxHelper:  "Comparte un proyecto que hayas construido, una idea de mercado que te parezca interesante, o simplemente por qué quieres unirte. Escribe como si hablaras con nosotros en persona.",
    },
    fields: {
      fullName:         "NOMBRE COMPLETO",
      email:            "CORREO INSTITUCIONAL",
      namePlaceholder:  "Nombre Apellido",
      emailPlaceholder: "a01234567@tec.mx",
      chars:            "caracteres",
      campusLabel:      "Puedo asistir a sesiones presenciales en Campus Querétaro",
      campusSub:        "Requerido para Investigadores Activos y Directivos",
    },
    majors: [
      { label: "LAF",       full: "Finanzas"         },
      { label: "ITC",       full: "Ciencias Comp."   },
      { label: "IDM",       full: "Ciencia de Datos" },
      { label: "LEC",       full: "Economía"         },
      { label: "Otra Ing.", full: "Ingeniería"        },
      { label: "Otra Adm.", full: "Negocios"          },
    ],
    stages: [
      { id: "exploration",    label: "Exploración",     range: "1-3 Sem",  desc: "Explorando tu camino"      },
      { id: "enfoque",        label: "Enfoque",         range: "4-5 Sem",  desc: "Definiendo tu dirección"   },
      { id: "specialization", label: "Especialización", range: "6-8+ Sem", desc: "Trabajo técnico avanzado"  },
    ],
    techLevels: [
      { value: 1, label: "Curioso",     desc: "Sin código / Finanzas básicas"   },
      { value: 2, label: "Aprendiz",    desc: "Python básico, Excel"            },
      { value: 3, label: "Constructor", desc: "APIs, datos, estadística"        },
      { value: 4, label: "Ingeniero",   desc: "ML, backtesting sistemático"     },
      { value: 5, label: "Arquitecto",  desc: "ML propio / pipelines completos" },
    ],
    interests: [
      { label: "Optimización de Portafolios" },
      { label: "Desarrollo HFT"              },
      { label: "Datos Alternativos"          },
      { label: "Infraestructura Financiera"  },
    ],
    roles: [
      { id: "researcher", label: "Investigador Cuantitativo Activo", desc: "Modelado, backtesting y deployment completo" },
      { id: "board",      label: "Mesa Directiva / Staff",           desc: "Operaciones, alianzas y comunidad"           },
      { id: "community",  label: "Miembro de Comunidad",             desc: "Eventos, talleres y acceso a red"            },
    ],
    submit: {
      idle:    "ENVIAR SOLICITUD",
      loading: "ENVIANDO SOLICITUD...",
      footer:  "Leemos cada solicitud personalmente · Resultados en 2-3 semanas",
    },
    errors: {
      fullName:        "El nombre completo es requerido",
      email:           "Debe ser un correo institucional @tec.mx válido",
      major:           "Selecciona tu carrera",
      academicStage:   "Selecciona tu etapa académica",
      technicalLevel:  "Indica tu nivel técnico",
      interests:       "Selecciona al menos un área",
      desiredRole:     "Selecciona tu rol deseado",
      campusConfirmed: "Confirma disponibilidad presencial para continuar",
      openSandbox:     "Escribe al menos 50 caracteres",
      duplicateEmail:  "Este correo ya fue registrado",
      submitFailed:    "Algo salió mal. Intenta de nuevo.",
    },
    success: {
      eyebrow:    "Solicitud Recibida",
      heading:    "Nos pondremos en contacto.",
      body:       "Leemos cada solicitud personalmente y te responderemos en ",
      bodyAccent: "2-3 semanas",
      bodyPost:   ". Gracias por ser parte de construir algo nuevo.",
      sentOn:     "Enviado el",
      backHome:   "Volver al inicio",
    },
    sandboxPlaceholder: `ej. "Soy estudiante de segundo semestre de ITC y me obsesioné con el trading\nalgorítmico después de tomar probabilidad. He aprendido Python por mi cuenta\ny quiero aplicarlo a algo real..."`,
  },
};

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────

function FormPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="py-7 border-b border-slate-100 last:border-0"
    >
      <h3 className="font-serif text-sm font-semibold text-slate-700 mb-5">{title}</h3>
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

interface FormState {
  fullName: string;
  email: string;
  major: string;
  academicStage: string;
  technicalLevel: number;
  interests: string[];
  desiredRole: string;
  campusConfirmed: boolean;
  openSandbox: string;
}

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────

export default function ApplyPage() {
  const { lang, toggle } = useLang();
  const t = T[lang];

  const [form, setForm] = useState<FormState>({
    fullName: "", email: "", major: "", academicStage: "",
    technicalLevel: 0, interests: [], desiredRole: "",
    campusConfirmed: false, openSandbox: "",
  });
  const [errors, setErrors]        = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const majors    = MAJOR_IDS.map((id, i)   => ({ id, icon: MAJOR_ICONS[i],   ...t.majors[i]   }));
  const interests = INTEREST_IDS.map((id, i) => ({ id, Icon: INTEREST_ICONS[i], ...t.interests[i] }));

  const toggleInterest = (id: string) =>
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter(x => x !== id)
        : [...f.interests, id],
    }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const err = t.errors;
    if (!form.fullName.trim())               e.fullName        = err.fullName;
    if (!/^[^@]+@tec\.mx$/.test(form.email)) e.email           = err.email;
    if (!form.major)                          e.major           = err.major;
    if (!form.academicStage)                  e.academicStage   = err.academicStage;
    if (!form.technicalLevel)                 e.technicalLevel  = err.technicalLevel;
    if (form.interests.length === 0)          e.interests       = err.interests;
    if (!form.desiredRole)                    e.desiredRole     = err.desiredRole;
    if (!form.campusConfirmed)                e.campusConfirmed = err.campusConfirmed;
    if (form.openSandbox.trim().length < 50)  e.openSandbox     = err.openSandbox;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/apply", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (res.status === 409) {
        setErrors(prev => ({ ...prev, email: t.errors.duplicateEmail }));
        return;
      }
      if (!res.ok) throw new Error("api_error");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors(prev => ({ ...prev, _form: t.errors.submitFailed }));
    } finally {
      setSubmitting(false);
    }
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-500 mt-1.5 flex items-center gap-1.5 font-mono"
      >
        <AlertCircle size={10} className="flex-shrink-0" />
        {errors[field]}
      </motion.p>
    ) : null;

  return (
    <div className="min-h-screen bg-white text-slate-900">

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
            <Link href="/learn" className="text-xs font-serif text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.learn}</Link>
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
              href="/"
              className="px-4 py-2 text-xs font-serif font-semibold border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 rounded-full transition-colors duration-200"
            >
              {t.nav.home}
            </Link>
          </div>

        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <AnimatePresence mode="wait">

          {/* ── SUCCESS ── */}
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="border border-tec-200 bg-tec-50 p-12 sm:p-16 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-14 h-14 border border-tec-300 bg-white mx-auto mb-6 flex items-center justify-center"
              >
                <CheckCircle size={24} className="text-tec-600" />
              </motion.div>
              <p className="text-xs font-serif font-semibold tracking-widest uppercase text-tec-600/60 mb-3">
                {t.success.eyebrow}
              </p>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                {t.success.heading}
              </h2>
              <p className="font-serif text-slate-600 max-w-sm mx-auto leading-relaxed">
                {t.success.body}
                <span className="text-slate-900 font-semibold">{t.success.bodyAccent}</span>
                {t.success.bodyPost}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-8">
                {t.success.sentOn}{" "}
                {new Date().toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 mt-8 text-xs font-mono text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft size={10} />
                {t.success.backHome}
              </Link>
            </motion.div>

          ) : (

            /* ── FORM ── */
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* Page header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <p className="text-xs font-serif text-slate-400 tracking-wide mb-3">
                  {t.page.eyebrow}
                </p>
                <h1
                  className="font-serif text-slate-900 mb-4"
                  style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}
                >
                  {t.page.heading}
                </h1>
                <p className="font-serif text-slate-500 leading-relaxed max-w-lg">
                  {t.page.desc}
                  <span className="text-slate-900 font-semibold">{t.page.descAccent}</span>
                  {t.page.descPost}
                </p>
              </motion.div>

              {/* Context strip */}
              <div className="flex flex-wrap divide-x divide-slate-200 mb-8 pb-8 border-b border-slate-100">
                {t.page.strip.map(item => (
                  <span key={item} className="text-xs font-serif text-slate-500 px-4 first:pl-0">
                    {item}
                  </span>
                ))}
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">

                  {/* 01 — Personal */}
                  <FormPanel title={t.sections.personal}>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-2 tracking-widest">
                          {t.fields.fullName}
                        </label>
                        <input
                          type="text"
                          value={form.fullName}
                          onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                          placeholder={t.fields.namePlaceholder}
                          className={`w-full bg-white border text-slate-900 text-sm px-4 py-3 font-mono placeholder-slate-300 focus:outline-none transition-colors ${
                            errors.fullName
                              ? "border-red-400"
                              : "border-slate-200 focus:border-tec-400"
                          }`}
                        />
                        <FieldError field="fullName" />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-2 tracking-widest">
                          {t.fields.email}
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          placeholder={t.fields.emailPlaceholder}
                          className={`w-full bg-white border text-slate-900 text-sm px-4 py-3 font-mono placeholder-slate-300 focus:outline-none transition-colors ${
                            errors.email
                              ? "border-red-400"
                              : "border-slate-200 focus:border-tec-400"
                          }`}
                        />
                        <FieldError field="email" />
                      </div>
                    </div>
                  </FormPanel>

                  {/* 02 — Major */}
                  <FormPanel title={t.sections.major}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {majors.map(m => (
                        <motion.button
                          key={m.id}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, major: m.id }))}
                          whileHover={{ scale: 1.025 }}
                          whileTap={{ scale: 0.97 }}
                          className={`p-4 text-left border transition-all duration-200 ${
                            form.major === m.id
                              ? "border-tec-600 bg-tec-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className={`text-2xl mb-2 ${form.major === m.id ? "text-tec-600" : "text-slate-300"}`}>
                            {m.icon}
                          </div>
                          <div className={`text-sm font-bold font-mono ${form.major === m.id ? "text-tec-700" : "text-slate-600"}`}>
                            {m.label}
                          </div>
                          <div className="text-xs font-mono text-slate-400 mt-0.5">{m.full}</div>
                        </motion.button>
                      ))}
                    </div>
                    <FieldError field="major" />
                  </FormPanel>

                  {/* 03 — Academic Stage */}
                  <FormPanel title={t.sections.stage}>
                    <div className="grid sm:grid-cols-3 gap-2.5">
                      {t.stages.map(stage => (
                        <button
                          key={stage.id}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, academicStage: stage.id }))}
                          className={`p-4 text-left border transition-all duration-200 ${
                            form.academicStage === stage.id
                              ? "border-tec-600 bg-tec-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className={`text-xs font-mono font-bold tracking-widest mb-1.5 ${form.academicStage === stage.id ? "text-tec-600" : "text-slate-400"}`}>
                            {stage.range}
                          </div>
                          <div className={`text-sm font-semibold font-serif ${form.academicStage === stage.id ? "text-tec-800" : "text-slate-700"}`}>
                            {stage.label}
                          </div>
                          <div className="text-xs font-serif text-slate-400 mt-0.5">{stage.desc}</div>
                        </button>
                      ))}
                    </div>
                    <FieldError field="academicStage" />
                  </FormPanel>

                  {/* 04 — Technical Level */}
                  <FormPanel title={t.sections.technical}>
                    <p className="font-serif text-sm text-slate-500 mb-4 leading-relaxed">
                      {t.sections.techHelper}
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {t.techLevels.map(level => (
                        <motion.button
                          key={level.value}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, technicalLevel: level.value }))}
                          whileTap={{ scale: 0.94 }}
                          className={`py-3.5 px-1 text-center border transition-all duration-200 ${
                            form.technicalLevel === level.value
                              ? "border-tec-600 bg-tec-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className={`text-xl font-bold font-mono ${form.technicalLevel === level.value ? "text-tec-600" : "text-slate-300"}`}>
                            {level.value}
                          </div>
                          <div className={`text-[11px] mt-1 font-semibold font-serif leading-tight ${form.technicalLevel === level.value ? "text-tec-800" : "text-slate-500"}`}>
                            {level.label}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 leading-tight font-serif hidden sm:block">
                            {level.desc}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    <div className="mt-4 h-px bg-slate-100 relative">
                      <motion.div
                        className="absolute top-0 left-0 h-px bg-tec-400"
                        animate={{ width: form.technicalLevel ? `${(form.technicalLevel / 5) * 100}%` : "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <FieldError field="technicalLevel" />
                  </FormPanel>

                  {/* 05 — Interests */}
                  <FormPanel title={t.sections.interests}>
                    <p className="font-serif text-sm text-slate-500 mb-4 leading-relaxed">
                      {t.sections.interestHelper}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {interests.map(interest => {
                        const Icon = interest.Icon;
                        const sel  = form.interests.includes(interest.id);
                        return (
                          <motion.button
                            key={interest.id}
                            type="button"
                            onClick={() => toggleInterest(interest.id)}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-4 text-left border transition-all duration-200 ${
                              sel
                                ? "border-tec-600 bg-tec-50"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <Icon size={15} className={sel ? "text-tec-600" : "text-slate-300"} />
                            <span className={`text-sm font-serif font-medium flex-1 ${sel ? "text-tec-800" : "text-slate-600"}`}>
                              {interest.label}
                            </span>
                            <AnimatePresence>
                              {sel && (
                                <motion.span
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ duration: 0.18 }}
                                >
                                  <CheckCircle size={13} className="text-tec-600" />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        );
                      })}
                    </div>
                    <FieldError field="interests" />
                  </FormPanel>

                  {/* 06 — Role */}
                  <FormPanel title={t.sections.role}>
                    <div className="space-y-2.5">
                      {t.roles.map(role => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, desiredRole: role.id }))}
                          className={`w-full flex items-center gap-4 p-4 text-left border transition-all duration-200 ${
                            form.desiredRole === role.id
                              ? "border-tec-600 bg-tec-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center ${form.desiredRole === role.id ? "border-tec-600" : "border-slate-300"}`}>
                            <AnimatePresence>
                              {form.desiredRole === role.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="w-2 h-2 bg-tec-600"
                                />
                              )}
                            </AnimatePresence>
                          </div>
                          <div>
                            <div className={`text-sm font-semibold font-serif ${form.desiredRole === role.id ? "text-tec-800" : "text-slate-700"}`}>
                              {role.label}
                            </div>
                            <div className="text-xs font-serif text-slate-400 mt-0.5">{role.desc}</div>
                          </div>
                        </button>
                      ))}
                      <FieldError field="desiredRole" />

                      {/* Campus toggle */}
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, campusConfirmed: !f.campusConfirmed }))}
                        className={`w-full flex items-center gap-4 p-4 text-left border transition-all duration-200 mt-1 ${
                          form.campusConfirmed
                            ? "border-tec-600 bg-tec-50"
                            : errors.campusConfirmed
                            ? "border-red-400"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className={`relative w-11 h-5 border flex-shrink-0 transition-colors ${form.campusConfirmed ? "border-tec-500" : "border-slate-300"}`}>
                          <motion.div
                            animate={{ x: form.campusConfirmed ? 20 : 2 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={`absolute top-0.5 w-3 h-3 ${form.campusConfirmed ? "bg-tec-600" : "bg-slate-300"}`}
                          />
                        </div>
                        <div>
                          <div className={`text-sm font-semibold font-serif ${form.campusConfirmed ? "text-tec-800" : "text-slate-700"}`}>
                            {t.fields.campusLabel}
                          </div>
                          <div className="text-xs font-serif text-slate-400 mt-0.5">
                            {t.fields.campusSub}
                          </div>
                        </div>
                      </button>
                      <FieldError field="campusConfirmed" />
                    </div>
                  </FormPanel>

                  {/* 07 — Open Sandbox */}
                  <FormPanel title={t.sections.sandbox}>
                    <p className="font-serif text-sm text-slate-500 mb-4 leading-relaxed">
                      {t.sections.sandboxHelper}
                    </p>
                    <div className={`border transition-colors ${errors.openSandbox ? "border-red-400" : "border-slate-200"} focus-within:border-tec-400`}>
                      <textarea
                        value={form.openSandbox}
                        onChange={e => setForm(f => ({ ...f, openSandbox: e.target.value }))}
                        rows={8}
                        placeholder={t.sandboxPlaceholder}
                        className="w-full bg-white text-slate-700 text-sm px-4 py-4 font-serif placeholder-slate-300 focus:outline-none resize-none leading-relaxed"
                      />
                      <div className="flex justify-end px-4 py-2 border-t border-slate-100 bg-slate-50">
                        <span className="text-xs font-serif text-slate-300">
                          {form.openSandbox.length} {t.fields.chars}
                        </span>
                      </div>
                    </div>
                    <FieldError field="openSandbox" />
                  </FormPanel>

                  {/* Submit */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="pt-2"
                  >
                    {errors._form && (
                      <p className="text-xs text-red-500 flex items-center gap-1.5 font-mono mb-3">
                        <AlertCircle size={10} className="flex-shrink-0" />
                        {errors._form}
                      </p>
                    )}
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={submitting ? {} : { scale: 1.008 }}
                      whileTap={submitting ? {} : { scale: 0.996 }}
                      className="w-full flex items-center justify-center gap-3 py-4 font-serif font-bold text-sm tracking-widest transition-all duration-200 bg-slate-900 hover:bg-slate-800 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full"
                          />
                          {t.submit.loading}
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          {t.submit.idle}
                        </>
                      )}
                    </motion.button>
                    <p className="text-center text-xs font-serif text-slate-400 mt-3">
                      {t.submit.footer}
                    </p>
                  </motion.div>

                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 mt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs font-serif text-slate-400">
            Tec de Monterrey Campus Querétaro, Est. 2026
          </span>
          <Link
            href="/"
            className="text-xs font-mono text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← {t.nav.home}
          </Link>
        </div>
      </footer>
    </div>
  );
}
