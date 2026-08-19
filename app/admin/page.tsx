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
  status: "pending" | "accepted";
  accepted_at: string | null;
  email_delivery: "sent" | "delivered" | "bounced" | "failed" | null;
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
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

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

  const toggleSelected = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const pendingApps = apps.filter(a => a.status === "pending");
  const allPendingSelected = pendingApps.length > 0 && pendingApps.every(a => selected.has(a.id));

  const toggleSelectAllPending = () => {
    setSelected(allPendingSelected ? new Set() : new Set(pendingApps.map(a => a.id)));
  };

  const sendAcceptanceEmails = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (!confirm(`Send acceptance emails to ${ids.length} applicant${ids.length !== 1 ? "s" : ""}? This can't be undone.`)) return;

    setSending(true);
    try {
      const res = await fetch("/api/admin/applications/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      const results: Record<number, string> = data.results ?? {};

      setApps(prev => prev.map(a =>
        results[a.id] === "sent"
          ? { ...a, status: "accepted", accepted_at: new Date().toISOString(), email_delivery: "sent" }
          : a
      ));

      const failed = ids.filter(id => results[id] === "failed");
      setSelected(new Set(failed));

      if (failed.length > 0) {
        alert(`${ids.length - failed.length} sent. ${failed.length} failed, still selected so you can retry.`);
      }
    } catch {
      alert("Something went wrong sending the emails. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const verifyDeliveries = async () => {
    setVerifying(true);
    try {
      const res = await fetch("/api/admin/applications/verify-delivery", { method: "POST" });
      const data = await res.json();
      const results: Record<number, Application["email_delivery"]> = data.results ?? {};

      setApps(prev => prev.map(a =>
        results[a.id] ? { ...a, email_delivery: results[a.id] } : a
      ));

      if (data.checked === 0) {
        alert("Nothing to verify, every sent email already has a confirmed status.");
      }
    } catch {
      alert("Couldn't reach Resend to verify deliveries. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const unverifiedCount = apps.filter(a => a.status === "accepted" && (a.email_delivery === "sent" || !a.email_delivery)).length;

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
            {!loading && pendingApps.length > 0 && (
              <button
                onClick={toggleSelectAllPending}
                className="text-xs font-mono text-slate-400 hover:text-slate-700 transition-colors"
              >
                {allPendingSelected ? "Deselect all" : "Select all pending"}
              </button>
            )}
            {!loading && unverifiedCount > 0 && (
              <button
                onClick={verifyDeliveries}
                disabled={verifying}
                className="text-xs font-mono text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50"
              >
                {verifying ? "Verifying…" : `Verify ${unverifiedCount} ${unverifiedCount !== 1 ? "deliveries" : "delivery"}`}
              </button>
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

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 py-8 ${selected.size > 0 ? "pb-24" : ""}`}>
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
                <div className="px-5 py-4 grid grid-cols-[auto_1fr_auto] gap-4 items-start">
                  <input
                    type="checkbox"
                    checked={selected.has(a.id)}
                    disabled={a.status === "accepted"}
                    onChange={() => toggleSelected(a.id)}
                    className="mt-1 h-4 w-4 accent-tec-600 disabled:opacity-30"
                  />
                  <div className="flex flex-col gap-2">
                    {/* Name + email */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{a.full_name}</span>
                      <span className="text-xs font-mono text-slate-400">{a.email}</span>
                      {a.status === "accepted" ? (
                        <>
                          <Badge color="green">Accepted ✓</Badge>
                          {a.email_delivery === "delivered" && <Badge color="green">Delivered ✓</Badge>}
                          {(a.email_delivery === "bounced" || a.email_delivery === "failed") && <Badge color="amber">{a.email_delivery === "bounced" ? "Bounced ✗" : "Failed ✗"}</Badge>}
                          {(a.email_delivery === "sent" || !a.email_delivery) && <Badge>Unverified</Badge>}
                        </>
                      ) : (
                        <Badge>Pending</Badge>
                      )}
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

      {/* Sticky send bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <span className="text-sm font-mono text-slate-600">
              {selected.size} applicant{selected.size !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={sendAcceptanceEmails}
              disabled={sending}
              className="px-5 py-2 text-xs font-sans font-semibold bg-tec-600 text-white hover:bg-tec-700 disabled:opacity-50 rounded-full transition-colors duration-200"
            >
              {sending ? "Sending…" : `Send acceptance email${selected.size !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
