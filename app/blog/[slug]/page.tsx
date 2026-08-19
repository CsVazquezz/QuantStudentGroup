"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { useLang } from "@/lib/useLang";
import MobileNav from "@/components/MobileNav";
import type { BlogPost } from "@/lib/blog";

const T = {
  en: {
    nav: { home: "Home", team: "Team", learn: "Learn", events: "Events", contact: "Contact", apply: "Apply" },
    back: "Back to blog",
    notFound: "This post doesn't exist.",
    footer: "Extracting alpha from noise.",
  },
  es: {
    nav: { home: "Inicio", team: "Equipo", learn: "Aprender", events: "Eventos", contact: "Contacto", apply: "Aplicar" },
    back: "Volver al blog",
    notFound: "Esta publicación no existe.",
    footer: "Extrayendo alpha del ruido.",
  },
};

const markdownComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="font-serif text-slate-900 mt-10 mb-3" style={{ fontSize: "1.6rem" }} {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="font-serif text-slate-900 mt-8 mb-2" style={{ fontSize: "1.25rem" }} {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="font-sans text-slate-600 text-base leading-relaxed mb-5" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a className="text-tec-600 hover:text-tec-700 underline underline-offset-2" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-slate-900" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="list-disc pl-5 mb-5 space-y-1.5 font-sans text-slate-600" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="list-decimal pl-5 mb-5 space-y-1.5 font-sans text-slate-600" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="border-l-2 border-tec-600 pl-4 italic text-slate-500 my-6" {...props} />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code className="font-mono text-sm bg-slate-50 px-1.5 py-0.5 rounded" {...props} />
  ),
};

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const { lang, toggle } = useLang();
  const t = T[lang];
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined); // undefined = loading, null = not found

  useEffect(() => {
    fetch(`/api/blog/${params.slug}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => setPost(d?.post ?? null))
      .catch(() => setPost(null));
  }, [params.slug]);

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

      {/* ── POST ── */}
      <article className="max-w-2xl mx-auto px-4 sm:px-6 pt-16 pb-24 lg:pt-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-sans text-slate-400 hover:text-slate-700 transition-colors mb-8"
        >
          <ArrowLeft size={12} />
          {t.back}
        </Link>

        {post === null ? (
          <p className="font-sans text-slate-400 text-sm">{t.notFound}</p>
        ) : post === undefined ? null : (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-mono text-slate-400 mb-4">
              {new Date(post.publishedAt).toLocaleDateString(lang === "en" ? "en-US" : "es-MX", { year: "numeric", month: "long", day: "numeric" })}
              {post.author ? ` · ${post.author}` : ""}
            </p>

            <h1
              className="font-serif tracking-tight text-slate-900 mb-10"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              {post.title[lang]}
            </h1>

            <div>
              <ReactMarkdown components={markdownComponents}>
                {post.content[lang]}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </article>

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
