"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { QUESTION_GROUPS, ALL_QUESTIONS } from "@/lib/questions";

type Baseline = { firstName: string; answers: Record<string, number> };

type Step =
  | { kind: "code" }
  | { kind: "name" }
  | { kind: "group"; groupIndex: number }
  | { kind: "submitting" }
  | { kind: "done" }
  | { kind: "fatal-error"; message: string };

export default function StartPage() {
  const [step, setStep] = useState<Step>({ kind: "code" });
  const [code, setCode] = useState("");
  const [codeId, setCodeId] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [checkingCode, setCheckingCode] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [answers, setAnswers] = useState<Record<string, number>>(
    Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, 5]))
  );

  const [baseline, setBaseline] = useState<Baseline | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/baseline");
        const data = await res.json();
        if (data.baseline) {
          setBaseline({
            firstName: data.baseline.firstName,
            answers: Object.fromEntries(
              data.baseline.answers.map((a: { questionId: string; value: number }) => [a.questionId, a.value])
            ),
          });
        }
      } catch {
        // No baseline available; proceed without it.
      }
    })();
  }, []);

  const totalSteps = QUESTION_GROUPS.length;

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCodeError(null);
    setCheckingCode(true);
    try {
      const res = await fetch("/api/codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCodeError(data.message || "That code didn't work. Please try again.");
        return;
      }
      setCodeId(data.codeId);
      setStep({ kind: "name" });
    } catch {
      setCodeError("Something went wrong. Please try again.");
    } finally {
      setCheckingCode(false);
    }
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    setStep({ kind: "group", groupIndex: 0 });
  }

  async function handleSubmitAll() {
    setStep({ kind: "submitting" });
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codeId,
          firstName,
          lastName,
          answers: ALL_QUESTIONS.map((q) => ({ questionId: q.id, value: answers[q.id] })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStep({ kind: "fatal-error", message: data.error || "We couldn't save your responses." });
        return;
      }
      setStep({ kind: "done" });
    } catch {
      setStep({ kind: "fatal-error", message: "We couldn't save your responses. Please try again." });
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
      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl shadow-pi-ink/5 p-8">
        {step.kind === "code" && (
          <CodeScreen
            code={code}
            setCode={setCode}
            onSubmit={handleCodeSubmit}
            error={codeError}
            loading={checkingCode}
          />
        )}

        {step.kind === "name" && (
          <NameScreen
            firstName={firstName}
            lastName={lastName}
            setFirstName={setFirstName}
            setLastName={setLastName}
            onSubmit={handleNameSubmit}
          />
        )}

        {step.kind === "group" && (
          <GroupScreen
            groupIndex={step.groupIndex}
            totalSteps={totalSteps}
            answers={answers}
            setAnswers={setAnswers}
            baseline={baseline}
            onBack={() =>
              setStep(
                step.groupIndex === 0
                  ? { kind: "name" }
                  : { kind: "group", groupIndex: step.groupIndex - 1 }
              )
            }
            onNext={() => {
              if (step.groupIndex + 1 < totalSteps) {
                setStep({ kind: "group", groupIndex: step.groupIndex + 1 });
              } else {
                handleSubmitAll();
              }
            }}
            isLast={step.groupIndex + 1 === totalSteps}
          />
        )}

        {step.kind === "submitting" && (
          <div className="text-center text-muted py-20">Submitting your responses...</div>
        )}

        {step.kind === "done" && <DoneScreen firstName={firstName} />}

        {step.kind === "fatal-error" && (
          <div className="text-center py-20 space-y-4">
            <p className="text-lg">{step.message}</p>
            <button
              onClick={() => setStep({ kind: "group", groupIndex: totalSteps - 1 })}
              className="text-accent underline"
            >
              Go back and try again
            </button>
          </div>
        )}
      </div>
      </main>

      <footer className="text-center text-xs text-muted py-6 px-4">
        Pre-podcast intake · your answers stay between you and the host
      </footer>
    </div>
  );
}

function CodeScreen({
  code,
  setCode,
  onSubmit,
  error,
  loading,
}: {
  code: string;
  setCode: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  loading: boolean;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="mx-auto h-12 w-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-xl">
          🎙️
        </div>
        <h1 className="font-display font-bold text-2xl tracking-tight">Welcome</h1>
        <p className="text-muted text-sm">Enter the code your host gave you to begin.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ABC-123"
          className="w-full text-center text-2xl tracking-widest uppercase bg-background border border-border rounded-xl py-4 px-4 outline-none focus:border-accent transition placeholder:text-muted/50"
        />
        {error && <p className="text-center text-sm text-pi-red">{error}</p>}
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full bg-accent text-white font-display font-bold rounded-xl py-3 disabled:bg-border disabled:text-muted transition hover:brightness-110 active:brightness-95"
        >
          {loading ? "Checking..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

function NameScreen({
  firstName,
  lastName,
  setFirstName,
  setLastName,
  onSubmit,
}: {
  firstName: string;
  lastName: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-display font-bold text-2xl tracking-tight">What&apos;s your name?</h1>
        <p className="text-muted">So we know who&apos;s joining us.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          autoFocus
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-accent transition placeholder:text-muted/50"
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
          className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-accent transition placeholder:text-muted/50"
        />
        <button
          type="submit"
          disabled={!firstName.trim() || !lastName.trim()}
          className="w-full bg-accent text-white font-display font-bold rounded-xl py-3 disabled:bg-border disabled:text-muted transition hover:brightness-110 active:brightness-95"
        >
          Start the assessment
        </button>
      </form>
    </div>
  );
}

function GroupScreen({
  groupIndex,
  totalSteps,
  answers,
  setAnswers,
  baseline,
  onBack,
  onNext,
  isLast,
}: {
  groupIndex: number;
  totalSteps: number;
  answers: Record<string, number>;
  setAnswers: (fn: (prev: Record<string, number>) => Record<string, number>) => void;
  baseline: Baseline | null;
  onBack: () => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const group = QUESTION_GROUPS[groupIndex];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <ProgressBar current={groupIndex + 1} total={totalSteps} />
        <h2 className="font-display font-bold text-xl tracking-tight">{group.title}</h2>
      </div>

      <div className="space-y-5">
        {group.questions.map((q) => (
          <div key={q.id} className="space-y-3 bg-background border border-border/70 rounded-2xl p-4">
            <p className="text-sm leading-relaxed">{q.text}</p>
            <SliderInput
              value={answers[q.id]}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [q.id]: value }))}
            />
            {baseline && baseline.answers[q.id] !== undefined && (
              <p className="text-xs italic text-muted">
                {baseline.firstName} answered {baseline.answers[q.id]}/10
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 border border-border rounded-xl py-3 text-muted hover:text-foreground hover:border-muted transition"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-accent text-white font-display font-bold rounded-xl py-3 transition hover:brightness-110 active:brightness-95"
        >
          {isLast ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}

const SLIDER_THUMB_SIZE = 26;

function SliderInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const percent = ((value - 1) / 9) * 100;

  return (
    <div className="space-y-1">
      <div className="relative">
        <span
          className="absolute -top-5 text-accent font-medium text-sm -translate-x-1/2"
          style={{
            left: `calc(${SLIDER_THUMB_SIZE / 2}px + (100% - ${SLIDER_THUMB_SIZE}px) * ${percent / 100})`,
          }}
        >
          {value}
        </span>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = useMemo(() => Math.round((current / total) * 100), [current, total]);
  return (
    <div className="space-y-1">
      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
        <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-muted">
        Step {current} of {total}
      </p>
    </div>
  );
}

function DoneScreen({ firstName }: { firstName: string }) {
  return (
    <div className="text-center space-y-4 py-12">
      <div className="text-5xl">🎙️</div>
      <h1 className="font-display font-bold text-2xl tracking-tight">
        You&apos;re all set{firstName ? `, ${firstName}` : ""}.
      </h1>
      <p className="text-muted">
        Thanks for taking the time. Your host will take it from here, and we&apos;ll see you soon.
      </p>
      <div className="flex items-center justify-center gap-2 pt-2">
        <span className="h-2 w-2 rounded-full bg-pi-red" />
        <span className="h-2 w-2 rounded-full bg-pi-yellow" />
        <span className="h-2 w-2 rounded-full bg-pi-green" />
        <span className="h-2 w-2 rounded-full bg-pi-blue" />
      </div>
    </div>
  );
}
