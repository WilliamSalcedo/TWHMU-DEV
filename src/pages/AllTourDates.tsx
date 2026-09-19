import { useEffect, useState } from "react";
import TourDatesList from "../components/TourDatesList";
import { getTourDates } from "../services/tour";
import type { TourDateRow } from "../types/database";

export default function AllTourDates() {
  const [dates, setDates] = useState<TourDateRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTourDates().then((rows) => {
      setDates(rows);
      setLoading(false);
    });
  }, []);

  return (
    <section className="bg-bg pt-32 pb-24 px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto">

        <a
          href="/#tour"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim hover:text-aqua mb-10 no-underline"
        >
          ‹ Back to home
        </a>

        <header className="mb-14 max-w-[900px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
            Tour · {dates.length} dates
          </span>
          <h1 className="font-display font-extrabold text-[clamp(48px,6.5vw,88px)] leading-[0.98] tracking-[-0.01em] text-ink m-0">
            <em className="italic font-semibold text-aqua">Where</em> we're going
          </h1>
        </header>

        {loading ? (
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint py-10">Loading dates…</p>
        ) : (
          <TourDatesList dates={dates} />
        )}

      </div>
    </section>
  );
}
