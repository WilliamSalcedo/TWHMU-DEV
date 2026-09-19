export default function Newsletter() {
  return (
    <section id="journal" className="bg-bg py-[clamp(80px,12vw,140px)] px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center p-8 md:p-16 border border-aqua-deep bg-bg-raised bg-[radial-gradient(circle_at_100%_0%,rgba(127,207,207,0.05),transparent_50%),radial-gradient(circle_at_0%_100%,rgba(232,153,104,0.05),transparent_50%)]">

          <div>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-coral mb-3.5 inline-block">
              Saturday Letters
            </span>
            <h2 className="font-display font-bold text-[clamp(36px,4vw,56px)] leading-[0.98] tracking-[-0.01em] text-ink m-0 mb-6">
              <em className="italic text-aqua font-semibold">A short note from the road —</em>
              <br />
              every Saturday morning.
            </h2>
            <p className="text-[15px] leading-[1.65] text-ink-dim max-w-[56ch]">
              Backstage stories, early ticket access, and the women behind the show. Free, no
              spam, unsubscribe in one click.
            </p>
          </div>

          <form
            className="flex flex-col gap-3.5"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="sr-only" htmlFor="news-email">
              Email address
            </label>
            <input
              id="news-email"
              type="email"
              placeholder="your@email.com"
              required
              className="w-full px-5 py-4 bg-transparent border border-stroke-hi text-ink text-[15px] transition-colors duration-300 placeholder:text-ink-faint focus:outline-none focus:border-aqua"
            />
            <button
              type="submit"
              className="self-start inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua bg-transparent font-body font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)]"
            >
              Subscribe ›
            </button>
            <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-faint">
              Or{" "}
              <a href="/account" className="text-ink-dim underline decoration-dashed underline-offset-4 hover:text-aqua normal-case tracking-normal">
                create an account
              </a>{" "}
              for member pre-sales.
            </span>
          </form>

        </div>
      </div>
    </section>
  );
}
