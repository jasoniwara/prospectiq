"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ALL_QUESTIONS } from "@/lib/questions";
import type { Category, CategoryResult } from "@/lib/scoring";
import { CATEGORY_BG_CLASS, CATEGORY_TEXT_CLASS, CATEGORY_COLOR, tierBadgeStyle } from "@/lib/categoryColors";

type Answer = { questionId: string; category: Category; subcategory: string; value: number };

type GuestDetail = {
  guest: {
    id: string;
    firstName: string;
    lastName: string;
    submittedAt: string;
    isBaseline: boolean;
    answers: Answer[];
  };
  result: {
    categories: CategoryResult[];
    primary: Category;
    secondary: Category;
    archetype: string;
  };
  averages: {
    categories: Record<string, number | null>;
    subcategories: Record<string, number | null>;
  };
  sampleSize: number;
};

type SubcategoryRanked = {
  category: Category;
  subcategory: string;
  score: number;
  questionId: string;
};

export default function GuestDetailClient({ guestId }: { guestId: string }) {
  const router = useRouter();
  const [data, setData] = useState<GuestDetail | null>(null);
  const [podcastMode, setPodcastMode] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [settingBaseline, setSettingBaseline] = useState(false);

  useEffect(() => {
    load();
  }, [guestId]);

  async function load() {
    const res = await fetch(`/api/host/guests/${guestId}`);
    if (res.status === 401) {
      router.push("/host/login");
      return;
    }
    const json = await res.json();
    setData(json);
  }

  if (!data) {
    return <main className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full">Loading...</main>;
  }

  const { guest, result, averages, sampleSize } = data;
  const questionMap = new Map(ALL_QUESTIONS.map((q) => [q.id, q]));

  const answersByCategory = new Map<Category, Answer[]>();
  for (const cat of result.categories) {
    answersByCategory.set(
      cat.category,
      guest.answers.filter((a) => a.category === cat.category)
    );
  }

  const top2Categories = result.categories.slice(0, 2);

  const rankedSubcategories: SubcategoryRanked[] = result.categories
    .flatMap((cat) =>
      cat.subcategories.map((sub) => {
        const answer = guest.answers.find(
          (a) => a.category === cat.category && a.subcategory === sub.subcategory
        );
        return {
          category: cat.category,
          subcategory: sub.subcategory,
          score: sub.score,
          questionId: answer?.questionId ?? "",
        };
      })
    )
    .sort((a, b) => b.score - a.score);
  const top3Subcategories = rankedSubcategories.slice(0, 3);

  async function handleDelete() {
    if (!window.confirm(`Delete ${guest.firstName} ${guest.lastName}'s data? This can't be undone.`)) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/host/guests/${guestId}`, { method: "DELETE" });
      if (res.status === 401) {
        router.push("/host/login");
        return;
      }
      if (res.ok) {
        router.push("/host/dashboard");
      }
    } finally {
      setDeleting(false);
    }
  }

  async function handleSetBaseline() {
    if (!window.confirm(`Use ${guest.firstName} ${guest.lastName}'s answers as the baseline shown to guests?`)) {
      return;
    }
    setSettingBaseline(true);
    try {
      const res = await fetch(`/api/host/guests/${guestId}`, { method: "PATCH" });
      if (res.status === 401) {
        router.push("/host/login");
        return;
      }
      if (res.ok) {
        await load();
      }
    } finally {
      setSettingBaseline(false);
    }
  }

  if (podcastMode) {
    return (
      <PodcastModeView
        guest={guest}
        archetype={result.archetype}
        primaryCategory={result.primary}
        top2Categories={top2Categories}
        top3Subcategories={top3Subcategories}
        questionMap={questionMap}
        onClose={() => setPodcastMode(false)}
      />
    );
  }

  function diffLabel(value: number, average: number | null) {
    if (average === null) return "No prior guests yet";
    const diff = Math.round((value - average) * 10) / 10;
    if (diff === 0) return "Right at average";
    return diff > 0 ? `+${diff} above average` : `${diff} below average`;
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="flex items-center gap-2 px-6 sm:px-10 py-5 border-b border-border/60">
        <span className="h-1.5 w-1.5 rounded-full bg-pi-red" />
        <span className="h-1.5 w-1.5 rounded-full bg-pi-yellow" />
        <span className="h-1.5 w-1.5 rounded-full bg-pi-green" />
        <span className="font-display font-bold text-sm tracking-tight ml-1">2P</span>
      </header>

      <main className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full space-y-10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link href="/host/dashboard" className="text-sm text-muted hover:text-foreground transition">
            ← Back to dashboard
          </Link>
          <div className="flex items-center gap-2">
            {!guest.isBaseline && (
              <button
                onClick={handleSetBaseline}
                disabled={settingBaseline}
                className="text-accent text-sm font-semibold px-3 py-2 rounded-lg border border-accent/30 hover:bg-accent/10 transition disabled:opacity-50"
              >
                {settingBaseline ? "Setting..." : "★ Set as Baseline"}
              </button>
            )}
            <button
              onClick={() => setPodcastMode(true)}
              className="bg-pi-ink text-pi-cream font-display font-bold text-sm rounded-lg px-4 py-2 hover:brightness-110 transition"
            >
              🎙️ Podcast Mode
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-pi-red text-sm font-semibold px-3 py-2 rounded-lg border border-pi-red/30 hover:bg-pi-red/10 transition disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-bold text-3xl tracking-tight">
            {guest.firstName} {guest.lastName}
            {guest.isBaseline && <span className="text-accent ml-2">★ Baseline</span>}
          </h1>
          <p className="text-muted text-sm">{new Date(guest.submittedAt).toLocaleString()}</p>
          <span
            className={`inline-block font-display font-bold text-sm px-3 py-1 rounded-full text-white ${CATEGORY_BG_CLASS[result.primary]}`}
          >
            {result.archetype}
          </span>
          <p className="text-xs text-muted">
            Primary:{" "}
            <span className={`font-semibold ${CATEGORY_TEXT_CLASS[result.primary]}`}>{result.primary}</span>
            {" · "}Secondary:{" "}
            <span className={`font-semibold ${CATEGORY_TEXT_CLASS[result.secondary]}`}>{result.secondary}</span>
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="font-display font-bold text-lg">Category Scores (highest to lowest)</h2>
          <div className="space-y-3">
            {result.categories.map((cat) => {
              const avg = averages.categories[cat.category];
              return (
                <div
                  key={cat.category}
                  className="bg-card border border-border rounded-2xl p-5 space-y-3 border-l-4"
                  style={{ borderLeftColor: CATEGORY_COLOR[cat.category] }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-display font-bold ${CATEGORY_TEXT_CLASS[cat.category]}`}>
                        {cat.category}
                      </p>
                      <span
                        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1"
                        style={tierBadgeStyle(cat.category, cat.tier)}
                      >
                        {cat.tier}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-display font-bold">{cat.score}</p>
                      <p className="text-xs text-muted">{diffLabel(cat.score, avg)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                    {cat.subcategories.map((sub) => {
                      const subAvg = averages.subcategories[sub.subcategory];
                      return (
                        <div key={sub.subcategory} className="text-sm">
                          <p className="text-muted">{sub.subcategory}</p>
                          <p className="font-semibold">
                            {sub.score}{" "}
                            <span className="text-xs text-muted font-normal">
                              ({diffLabel(sub.score, subAvg)})
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted">
            Compared against {sampleSize} previous guest{sampleSize === 1 ? "" : "s"}.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display font-bold text-lg">All Responses by Category</h2>
          {result.categories.map((cat) => (
            <div key={cat.category} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${CATEGORY_BG_CLASS[cat.category]}`} />
                <h3 className={`font-display font-bold ${CATEGORY_TEXT_CLASS[cat.category]}`}>
                  {cat.category}
                </h3>
              </div>
              <div className="border border-border rounded-2xl divide-y divide-border overflow-hidden bg-card">
                {(answersByCategory.get(cat.category) ?? []).map((a) => {
                  const question = questionMap.get(a.questionId);
                  return (
                    <div key={a.questionId} className="px-5 py-4 space-y-1">
                      <p className="text-sm">{question?.text}</p>
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>{a.subcategory}</span>
                        <span
                          className={`font-display font-bold text-sm ${CATEGORY_TEXT_CLASS[cat.category]}`}
                        >
                          {a.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

function PodcastModeView({
  guest,
  archetype,
  primaryCategory,
  top2Categories,
  top3Subcategories,
  questionMap,
  onClose,
}: {
  guest: { firstName: string; lastName: string };
  archetype: string;
  primaryCategory: Category;
  top2Categories: CategoryResult[];
  top3Subcategories: SubcategoryRanked[];
  questionMap: Map<string, { text: string }>;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-pi-cream overflow-y-auto">
      <button
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 text-pi-ink/50 hover:text-pi-ink font-display font-bold text-2xl leading-none z-10"
        aria-label="Close podcast mode"
      >
        ×
      </button>

      <div className="min-h-screen flex flex-col items-center text-center px-6 py-16 gap-8">
        <div className="flex flex-col items-center gap-3">
          <p className="font-display font-bold text-2xl sm:text-4xl tracking-tight">
            {guest.firstName} {guest.lastName}
          </p>
          <span
            className={`inline-block font-display font-bold text-sm sm:text-base px-4 py-1.5 rounded-full text-white ${CATEGORY_BG_CLASS[primaryCategory]}`}
          >
            {archetype}
          </span>
        </div>

        <div className="flex flex-col items-center gap-5 w-full max-w-xl">
          <p className="text-xs sm:text-sm text-muted uppercase tracking-[0.15em] font-semibold">
            Top Categories
          </p>
          {top2Categories.map((cat, i) => (
            <div key={cat.category} className="flex flex-col items-center gap-2 w-full">
              <p
                className={`font-display font-extrabold text-2xl sm:text-4xl ${CATEGORY_TEXT_CLASS[cat.category]}`}
              >
                {i + 1}. {cat.category} — {cat.score}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-pi-ink/60">
                {cat.subcategories.map((sub) => (
                  <span key={sub.subcategory}>
                    {sub.subcategory} — {sub.score}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-5 w-full max-w-xl">
          <p className="text-xs sm:text-sm text-muted uppercase tracking-[0.15em] font-semibold">
            Top Subcategories
          </p>
          {top3Subcategories.map((sub, i) => (
            <div key={sub.subcategory} className="flex flex-col items-center gap-1">
              <p className={`font-display font-bold text-xl sm:text-2xl ${CATEGORY_TEXT_CLASS[sub.category]}`}>
                {i + 1}. {sub.subcategory} — {sub.score}
              </p>
              <p className="max-w-md text-sm sm:text-base text-pi-ink/80 font-medium leading-snug">
                {questionMap.get(sub.questionId)?.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
