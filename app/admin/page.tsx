"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Application = {
  id: number;
  full_name: string;
  email: string;
  major: string;
  academic_stage: string;
  technical_level: number;
  interests: string | string[];
  desired_role: string;
  campus_confirmed: number;
  open_sandbox: string;
  submitted_at: string;
};

const LEVEL_LABEL = ["None", "Beginner", "Intermediate", "Advanced", "Expert"];

function Badge({ children, color = "slate" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    slate:  "bg-slate-100 text-slate-600",
    blue:   "bg-blue-50  text-blue-700",
    green:  "bg-emerald-50 text-emerald-700",
    amber:  "bg-amber-50 text-amber-700",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium ${colors[color] ?? colors.slate}`}>
      {children}
    </span>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/applications")
      .then(r => { if (r.status === 401) router.push("/admin/login"); return r.json(); })
      .then(d => { setApps(d.applications ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    document.cookie = "admin_token=; max-age=0; path=/";
    router.push("/admin/login");
  };

  const interests = (raw: string | string[]) => {
    const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(arr) ? arr.join(", ") : "—";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div>
            <span className="text-lg font-serif tracking-tight text-slate-900">
              <span className="text-tec-600">TM</span>QS
            </span>
            <span className="ml-2 text-xs font-mono text-slate-400">/ admin</span>
          </div>
          <div className="flex items-center gap-4">
            {!loading && (
              <span className="text-xs font-mono text-slate-400">
                {apps.length} application{apps.length !== 1 ? "s" : ""}
              </span>
            )}
            <Link href="/admin/blog" className="text-xs font-mono text-slate-400 hover:text-slate-700 transition-colors">
              Blog →
            </Link>
            <button
              onClick={logout}
              className="text-xs font-mono text-slate-400 hover:text-slate-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <p className="text-sm font-mono text-slate-400">Loading…</p>
        ) : apps.length === 0 ? (
          <p className="text-sm font-mono text-slate-400">No applications yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {apps.map(a => (
              <div
                key={a.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              >
                {/* Main row */}
                <div className="px-5 py-4 grid grid-cols-[1fr_auto] gap-4 items-start">
                  <div className="flex flex-col gap-2">
                    {/* Name + email */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{a.full_name}</span>
                      <span className="text-xs font-mono text-slate-400">{a.email}</span>
                      {a.campus_confirmed ? (
                        <Badge color="green">Campus ✓</Badge>
                      ) : (
                        <Badge color="amber">Campus ?</Badge>
                      )}
                    </div>
                    {/* Tags row */}
                    <div className="flex flex-wrap gap-1.5">
                      <Badge color="blue">{a.major}</Badge>
                      <Badge>{a.academic_stage}</Badge>
                      <Badge>Level {a.technical_level} — {LEVEL_LABEL[a.technical_level] ?? "?"}</Badge>
                      {a.desired_role && <Badge color="slate">{a.desired_role}</Badge>}
                    </div>
                    {/* Interests */}
                    {interests(a.interests) !== "—" && (
                      <p className="text-[11px] font-mono text-slate-400">
                        Interests: {interests(a.interests)}
                      </p>
                    )}
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-slate-300">
                      {new Date(a.submitted_at).toLocaleDateString("en-MX", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                      className="text-[11px] font-mono text-tec-600 hover:text-tec-700 transition-colors"
                    >
                      {expanded === a.id ? "Hide response ↑" : "See response ↓"}
                    </button>
                  </div>
                </div>

                {/* Expanded open sandbox */}
                {expanded === a.id && (
                  <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                    <p className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-widest">
                      Open-ended response
                    </p>
                    <p className="text-sm font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {a.open_sandbox}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
