import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-pi-cream text-pi-ink overflow-hidden relative">
      <header className="flex items-center justify-between px-6 py-5 relative z-10">
        <span className="font-display font-extrabold text-xl tracking-tight">
          2P
        </span>
        <Link
          href="/host/login"
          className="text-sm font-medium text-pi-ink/60 hover:text-pi-ink transition underline-offset-4 hover:underline"
        >
          Host Login
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center relative z-10">
        <div className="relative inline-block">
          <h1 className="font-display font-extrabold leading-[0.95] tracking-tight text-[15vw] sm:text-7xl md:text-8xl">
            <span className="block text-pi-red">WHO ARE</span>
            <span className="block text-pi-blue">YOU BEYOND</span>
            <span className="block text-pi-green">THE GAME?</span>
          </h1>
          <span className="absolute -top-3 -right-6 sm:-right-10 rotate-12 bg-pi-yellow text-pi-ink font-display font-bold text-xs sm:text-sm rounded-full h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center text-center leading-tight shadow-lg">
            16
            <br />
            questions
          </span>
        </div>

        <p className="mt-8 max-w-md text-base sm:text-lg text-pi-ink/70 font-medium">
          A quick questionnaire before we record the episode. Try to be as
          honest as possible, and only your highest scores are used in the
          episode.
        </p>

        <Link
          href="/start"
          className="mt-10 inline-flex items-center gap-2 bg-pi-ink text-pi-cream font-display font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 transition"
        >
          Enter Your Code
          <span aria-hidden>→</span>
        </Link>

        <div className="mt-12 flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-pi-red" />
          <span className="h-3 w-3 rounded-full bg-pi-yellow" />
          <span className="h-3 w-3 rounded-full bg-pi-green" />
          <span className="h-3 w-3 rounded-full bg-pi-blue" />
        </div>
      </main>

      <footer className="text-center text-xs text-pi-ink/50 py-6 px-4 relative z-10 font-medium">
        Pre-podcast intake · built for the show
      </footer>

      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pi-red/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-pi-blue/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-pi-green/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-pi-yellow/25 blur-3xl"
      />
    </div>
  );
}
