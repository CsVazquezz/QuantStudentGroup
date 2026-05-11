"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-xs font-mono text-slate-400 mb-2 tracking-widest uppercase">
          QuantTec
        </p>
        <h1 className="text-2xl font-display font-bold text-slate-900 mb-8">
          Admin access
        </h1>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full px-4 py-3 text-sm font-mono border border-slate-200 rounded-lg
                       text-slate-900 placeholder-slate-300 focus:outline-none focus:border-tec-600"
          />
          {error && (
            <p className="text-xs font-mono text-red-500">Incorrect password.</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 text-sm font-display font-semibold bg-slate-900 text-white
                       rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
