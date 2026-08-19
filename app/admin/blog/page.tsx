"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

const EMPTY_FORM = {
  author: "",
  slug: "",
  titleEn: "",
  titleEs: "",
  excerptEn: "",
  excerptEs: "",
  contentEn: "",
  contentEs: "",
};

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = () => {
    fetch("/api/blog")
      .then(r => r.json())
      .then(d => { setPosts(d.posts ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/admin/blog")
      .then(r => { if (r.status === 401) router.push("/admin/login"); })
      .catch(() => {});
    loadPosts();
  }, [router]);

  const update = (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (res.status === 401) return router.push("/admin/login");
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error === "duplicate_slug" ? "A post with that slug already exists." : "Couldn't publish — check all fields are filled in.");
      return;
    }
    setForm(EMPTY_FORM);
    loadPosts();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.status === 401) return router.push("/admin/login");
    loadPosts();
  };

  const field = "w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg text-slate-900 placeholder-slate-300 focus:outline-none focus:border-tec-600";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg font-serif tracking-tight text-slate-900">
              <span className="text-tec-600">TM</span>QS
            </span>
            <span className="text-xs font-mono text-slate-400">/ admin / blog</span>
          </div>
          <Link href="/admin" className="text-xs font-mono text-slate-400 hover:text-slate-700 transition-colors">
            ← Applications
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={submit} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4 mb-10">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">New post</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <input className={field} placeholder="Your name (author)" value={form.author} onChange={update("author")} required />
            <input className={field} placeholder="Slug (optional — from title if blank)" value={form.slug} onChange={update("slug")} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input className={field} placeholder="Title (English)" value={form.titleEn} onChange={update("titleEn")} required />
            <input className={field} placeholder="Título (Español)" value={form.titleEs} onChange={update("titleEs")} required />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <textarea className={field} placeholder="Short excerpt (English)" rows={2} value={form.excerptEn} onChange={update("excerptEn")} required />
            <textarea className={field} placeholder="Resumen corto (Español)" rows={2} value={form.excerptEs} onChange={update("excerptEs")} required />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <textarea className={field} placeholder="Full post (English, Markdown supported)" rows={10} value={form.contentEn} onChange={update("contentEn")} required />
            <textarea className={field} placeholder="Publicación completa (Español, admite Markdown)" rows={10} value={form.contentEs} onChange={update("contentEs")} required />
          </div>

          {error && <p className="text-xs font-mono text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="self-start px-5 py-2.5 text-sm font-serif font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            {submitting ? "Publishing…" : "Publish"}
          </button>
        </form>

        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
          Published ({loading ? "…" : posts.length})
        </p>
        <div className="flex flex-col gap-2">
          {posts.map(p => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{p.title.en}</p>
                <p className="text-[11px] font-mono text-slate-400">
                  /{p.slug} · {p.author} · {new Date(p.publishedAt).toLocaleDateString("en-MX", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <button
                onClick={() => remove(p.id)}
                className="shrink-0 text-[11px] font-mono text-red-400 hover:text-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
