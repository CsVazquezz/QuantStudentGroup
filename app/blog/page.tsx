"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLang } from "@/lib/useLang";
import MobileNav from "@/components/MobileNav";
import type { BlogPost } from "@/lib/blog";

const T = {
  en: {
    nav: { home: "Home", team: "Team", learn: "Learn", events: "Events", contact: "Contact", apply: "Apply" },
    eyebrow: "Insights",
    heading: "Blog.",
    sub: "Ideas and research on markets, data, and quantitative finance — written for anyone curious, not just our members.",
    empty: "Nothing published yet. Check back soon.",
    readMore: "Read",
    footer: "Extracting alpha from noise.",
  },
  es: {
    nav: { home: "Inicio", team: "Equipo", learn: "Aprender", events: "Eventos", contact: "Contacto", apply: "Aplicar" },
    eyebrow: "Ideas",
    heading: "Blog.",
    sub: "Ideas e investigación sobre mercados, datos y finanzas cuantitativas, escritas para cualquier persona curiosa, no solo para nuestros miembros.",
    empty: "Aún no hay publicaciones. Vuelve pronto.",
    readMore: "Leer",
    footer: "Extrayendo alpha del ruido.",
  },
};

export default function BlogPage() {
  const { lang, toggle } = useLang();
  const t = T[lang];
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then(r => r.json())
      .then(d => { setPosts(d.posts ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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
            <Link href="/events"  className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.events}</Link>
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
          <p className="font-sans text-slate-500 text-lg max-w-lg leading-relaxed">
            {t.sub}
          </p>
        </motion.div>
      </section>

      {/* ── POSTS ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-24 border-t border-slate-100">
        {loading ? null : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-dashed border-slate-200 rounded-sm py-16 mt-10 flex items-center justify-center text-center px-6"
          >
            <p className="font-sans text-slate-400 text-sm max-w-md">{t.empty}</p>
          </motion.div>
        ) : (
          posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block py-10 border-b border-slate-100"
              >
                <p className="text-xs font-mono text-slate-400 mb-3">
                  {new Date(post.publishedAt).toLocaleDateString(lang === "en" ? "en-US" : "es-MX", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                <h2 className="font-serif text-slate-900 group-hover:text-tec-600 transition-colors" style={{ fontSize: "clamp(1.4rem,2.5vw,1.9rem)" }}>
                  {post.title[lang]}
                </h2>
                <p className="font-sans text-slate-500 leading-relaxed mt-3 max-w-xl">
                  {post.excerpt[lang]}
                </p>
                <span className="inline-block text-xs font-sans font-semibold text-tec-600 mt-4 tracking-wide">
                  {t.readMore} →
                </span>
              </Link>
            </motion.div>
          ))
        )}
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
