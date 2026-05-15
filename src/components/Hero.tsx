export default function Hero() {
  return (
    <section className="relative h-screen min-h-[720px] flex flex-col items-center justify-center overflow-hidden px-10 bg-[var(--bg)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(127,207,207,0.10),transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(232,153,104,0.10),transparent_50%)] pointer-events-none" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(14,15,18,0.8)_100%)] pointer-events-none" />

      <div className="relative z-10 text-center flex flex-col items-center">
        <span className="[font-family:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--coral)] mb-7 border border-[var(--coral-deep)] px-4 py-1.5">
          Now Touring · USA 2026
        </span>

        <h1 className="m-0 flex flex-col items-center gap-1 [font-family:var(--font-display)]">
          <span className="text-[clamp(72px,10vw,150px)] leading-[0.92] font-extrabold text-[var(--aqua)] tracking-[-0.01em] [text-shadow:0_8px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(127,207,207,0.18)]">
            The Women
          </span>
          <span className="text-[clamp(56px,8vw,120px)] leading-[0.95] italic font-semibold text-[var(--coral)] tracking-[-0.005em] [text-shadow:0_8px_60px_rgba(0,0,0,0.5)] -mt-2">
            Who Made Us
          </span>
        </h1>

        <p className="mt-7 [font-family:var(--font-display)] italic font-medium text-[clamp(18px,1.8vw,24px)] text-[var(--ink)] tracking-[0.04em]">
          A Tribute. A Manifesto. A Revolution.
        </p>

        <div className="flex items-center gap-5 mt-9 flex-wrap justify-center">
          <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--aqua)] text-[var(--aqua)] bg-transparent [font-family:var(--font-body)] font-semibold text-[11px] tracking-[0.18em] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--aqua)] hover:text-[var(--bg)] hover:shadow-[0_0_40px_rgba(127,207,207,0.25)]">
            Get Tickets <span>→</span>
          </button>
          <button className="inline-flex items-center gap-2 text-[var(--ink-dim)] [font-family:var(--font-body)] text-[11px] tracking-[0.18em] uppercase font-medium cursor-pointer transition-colors duration-300 hover:text-[var(--ink)] bg-transparent border-none">
            <span className="text-[var(--coral)]">▶</span> Watch Trailer
          </button>
        </div>
      </div>
    </section>
  );
}
