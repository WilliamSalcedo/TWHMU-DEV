import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WomenGrid from "./WomenGrid";
import WomanModal from "./WomanModal";
import { getWomen } from "../services/women";
import type { WomanRow } from "../types/database";

const PREVIEW_LIMIT = 9;

export default function Women() {
  const [women, setWomen] = useState<WomanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<WomanRow | null>(null);

  useEffect(() => {
    getWomen().then((rows) => {
      setWomen(rows);
      setLoading(false);
    });
  }, []);

  const preview = women.slice(0, PREVIEW_LIMIT);
  const hasMore = women.length > PREVIEW_LIMIT;

  return (
    <section id="women" className="bg-bg py-[clamp(56px,8vw,110px)] px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto">

        <header className="mb-14 max-w-[900px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
            The Lineage · {women.length} icons
          </span>
          <h2 className="font-display font-extrabold text-[clamp(48px,6.5vw,88px)] leading-[0.98] tracking-[-0.01em] text-ink m-0">
            <em className="italic font-semibold text-aqua">The Women</em>
            <br />
            <span className="text-ink-dim italic font-normal">who shaped the show</span>
          </h2>
        </header>

        {loading ? (
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint py-10">Loading…</p>
        ) : (
          <WomenGrid women={preview} onSelect={setSelected} />
        )}

        {hasMore && (
          <Link
            to="/lineage"
            className="mt-10 inline-flex items-center gap-2 font-display italic text-lg text-aqua border-b border-transparent pb-0.5 transition-all duration-300 hover:border-aqua hover:gap-3.5 no-underline"
          >
            See all {women.length} icons →
          </Link>
        )}

        {selected && <WomanModal woman={selected} onClose={() => setSelected(null)} />}

      </div>
    </section>
  );
}
