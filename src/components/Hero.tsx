export default function Hero() {
  return (
    <section className="relative h-screen min-h-[720px] flex flex-col items-center justify-center overflow-hidden px-6 lg:px-10 bg-bg">

      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_20%,rgba(127,207,207,0.10),transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(232,153,104,0.10),transparent_50%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,transparent_40%,rgba(14,15,18,0.85)_100%)]" />

      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center">

        {/* Eyebrow */}
        <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-coral mb-7 border border-coral-deep px-4 py-1.5">
          Now Touring · USA 2026
        </span>

        {/* Title */}
        <h1 className="m-0 flex flex-col items-center font-display">
          <span className="text-[clamp(64px,10vw,150px)] leading-[0.92] font-extrabold text-aqua tracking-[-0.01em] [text-shadow:0_8px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(127,207,207,0.18)]">
            The Women
          </span>
          <span className="text-[clamp(50px,8vw,120px)] leading-[0.95] italic font-semibold text-coral tracking-[-0.005em] [text-shadow:0_8px_60px_rgba(0,0,0,0.5)] -mt-2">
            Who Made Us
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-6 font-display italic font-medium text-[clamp(16px,1.8vw,22px)] text-ink tracking-[0.04em]">
          A Tribute. A Manifesto. A Revolution.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-5 mt-8 flex-wrap justify-center">
          <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-aqua text-aqua bg-transparent font-body font-semibold text-[11px] tracking-[0.18em] uppercase cursor-pointer transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)]">
            Get Tickets <span>→</span>
          </button>
          <button className="inline-flex items-center gap-2 text-ink-dim font-body text-[11px] tracking-[0.18em] uppercase font-medium cursor-pointer transition-colors duration-300 hover:text-ink bg-transparent border-none">
            <span className="text-coral">▶</span> Watch Trailer
          </button>
        </div>

      </div>
    </section>
  );
}
