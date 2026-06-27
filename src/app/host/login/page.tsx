"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HostLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/host/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Incorrect password.");
        return;
      }
      router.push("/host/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="flex items-center justify-center px-6 py-5 border-b border-border/60 relative">
        <Link href="/" className="absolute left-4 sm:left-6 text-sm text-muted hover:text-foreground transition">
          ← Home
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-pi-red" />
          <span className="h-1.5 w-1.5 rounded-full bg-pi-yellow" />
          <span className="h-1.5 w-1.5 rounded-full bg-pi-green" />
          <span className="font-display font-bold text-sm tracking-tight ml-1">2P</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm bg-card border border-border rounded-3xl shadow-xl shadow-pi-ink/5 p-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-xl">
              🔒
            </div>
            <h1 className="font-display font-bold text-2xl tracking-tight">Host Login</h1>
            <p className="text-muted text-sm">Sign in to view guest results.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-accent transition placeholder:text-muted/50"
            />
            {error && <p className="text-sm text-pi-red text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-accent text-white font-display font-bold rounded-xl py-3 disabled:bg-border disabled:text-muted transition hover:brightness-110 active:brightness-95"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center text-xs text-muted py-6 px-4">
        Private dashboard · for host use only
      </footer>
    </div>
  );
}
