"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORY_BG_CLASS } from "@/lib/categoryColors";
import type { Category } from "@/lib/scoring";

type GuestSummary = {
  id: string;
  firstName: string;
  lastName: string;
  submittedAt: string;
  archetype: string;
  primary: Category;
  isBaseline: boolean;
};

type ActiveCode = {
  code: string;
  createdAt: string;
  expiresAt: string;
};

export default function DashboardClient() {
  const router = useRouter();
  const [guests, setGuests] = useState<GuestSummary[] | null>(null);
  const [activeCodes, setActiveCodes] = useState<ActiveCode[] | null>(null);
  const [newCode, setNewCode] = useState<{ code: string; expiresAt: string } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    loadGuests();
    loadActiveCodes();
  }, []);

  async function loadGuests() {
    const res = await fetch("/api/host/guests");
    if (res.status === 401) {
      router.push("/host/login");
      return;
    }
    const data = await res.json();
    setGuests(data.guests);
  }

  async function loadActiveCodes() {
    const res = await fetch("/api/host/codes");
    if (res.status === 401) {
      router.push("/host/login");
      return;
    }
    const data = await res.json();
    setActiveCodes(data.codes);
  }

  async function handleGenerateCode() {
    setGenerating(true);
    setCopied(null);
    try {
      const res = await fetch("/api/host/codes", { method: "POST" });
      if (res.status === 401) {
        router.push("/host/login");
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setNewCode(data);
        loadActiveCodes();
      }
    } finally {
      setGenerating(false);
    }
  }

  function timeUntil(expiresAt: string) {
    const ms = new Date(expiresAt).getTime() - Date.now();
    if (ms <= 0) return "expired";
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  }

  async function handleLogout() {
    await fetch("/api/host/logout", { method: "POST" });
    router.push("/host/login");
    router.refresh();
  }

  async function handleCopy(code: string) {
    await navigator.clipboard.writeText(code);
    setCopied(code);
  }

  async function handleDeleteCode(code: string) {
    if (!window.confirm(`Delete code ${code}? It will no longer be usable.`)) {
      return;
    }
    const res = await fetch(`/api/host/codes/${code}`, { method: "DELETE" });
    if (res.status === 401) {
      router.push("/host/login");
      return;
    }
    if (res.ok) {
      loadActiveCodes();
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-pi-red" />
          <span className="h-1.5 w-1.5 rounded-full bg-pi-yellow" />
          <span className="h-1.5 w-1.5 rounded-full bg-pi-green" />
          <span className="font-display font-bold text-sm tracking-tight ml-1">2P</span>
        </div>
        <button onClick={handleLogout} className="text-sm text-muted hover:text-foreground transition">
          Log out
        </button>
      </header>

      <main className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full space-y-10">
        <h1 className="font-display font-bold text-3xl tracking-tight">Dashboard</h1>

        <section className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm shadow-pi-ink/5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display font-bold text-lg">Generate a Guest Code</h2>
            <button
              onClick={handleGenerateCode}
              disabled={generating}
              className="bg-accent text-white font-display font-bold text-sm rounded-lg px-4 py-2 disabled:bg-border disabled:text-muted transition hover:brightness-110"
            >
              {generating ? "Generating..." : "Generate Code"}
            </button>
          </div>
          {newCode && (
            <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3">
              <span className="text-2xl tracking-widest font-mono">{newCode.code}</span>
              <button
                onClick={() => handleCopy(newCode.code)}
                className="text-sm text-accent font-semibold ml-auto"
              >
                {copied === newCode.code ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
          {newCode && (
            <p className="text-xs text-muted">
              Expires {new Date(newCode.expiresAt).toLocaleString()}
            </p>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="font-display font-bold text-lg">Active Codes</h2>
          {activeCodes === null && <p className="text-muted text-sm">Loading...</p>}
          {activeCodes && activeCodes.length === 0 && (
            <p className="text-muted text-sm">No active codes right now.</p>
          )}
          {activeCodes && activeCodes.length > 0 && (
            <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border bg-card">
              {activeCodes.map((c) => (
                <div
                  key={c.code}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <span className="text-lg tracking-widest font-mono">{c.code}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted">{timeUntil(c.expiresAt)}</span>
                    <button
                      onClick={() => handleCopy(c.code)}
                      className="text-sm text-accent font-semibold"
                    >
                      {copied === c.code ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={() => handleDeleteCode(c.code)}
                      className="text-sm text-pi-red font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="font-display font-bold text-lg">Guests</h2>
          {guests === null && <p className="text-muted text-sm">Loading...</p>}
          {guests && guests.length === 0 && (
            <p className="text-muted text-sm">No guests have submitted yet.</p>
          )}
          {guests && guests.length > 0 && (
            <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border bg-card">
              {guests.map((g) => (
                <Link
                  key={g.id}
                  href={`/host/dashboard/guest/${g.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-background transition"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${CATEGORY_BG_CLASS[g.primary]}`} />
                    <div>
                      <p className="font-semibold">
                        {g.firstName} {g.lastName}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(g.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-accent text-sm font-display font-bold">{g.archetype}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
