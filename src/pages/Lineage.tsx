import { useEffect, useState } from "react";
import WomenGrid from "../components/WomenGrid";
import WomanModal from "../components/WomanModal";
import { getWomen } from "../services/women";
import type { WomanRow } from "../types/database";

export default function Lineage() {
  const [women, setWomen] = useState<WomanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<WomanRow | null>(null);

  useEffect(() => {
    getWomen().then((rows) => {
      setWomen(rows);
      setLoading(false);
    });
  }, []);

  return (
    <section className="bg-bg pt-32 pb-24 px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto">

        <a
          href="/#women"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim hover:text-aqua mb-10 no-underline"
        >
          ‹ Back to home
        </a>

        <header className="mb-14 max-w-[900px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
            The Lineage · {women.length} icons
          </span>
          <h1 className="font-display font-extrabold text-[clamp(48px,6.5vw,88px)] leading-[0.98] tracking-[-0.01em] text-ink m-0">
            <em className="italic font-semibold text-aqua">The Women</em>
            <br />
            <span className="text-ink-dim italic font-normal">who shaped the show</span>
          </h1>
        </header>

        {loading ? (
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint py-10">Loading…</p>
        ) : (
          <WomenGrid women={women} onSelect={setSelected} />
        )}

        {selected && <WomanModal woman={selected} onClose={() => setSelected(null)} />}

      </div>
    </section>
  );
}
