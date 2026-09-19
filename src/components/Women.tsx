import { useEffect, useState } from "react";
import Placeholder from "./Placeholder";
import { getWomen } from "../services/women";
import type { WomanRow } from "../types/database";

export default function Women() {
  const [women, setWomen] = useState<WomanRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWomen().then((rows) => {
      setWomen(rows);
      setLoading(false);
    });
  }, []);

  return (
    <section id="women" className="bg-bg py-[clamp(80px,12vw,160px)] px-6 lg:px-10">
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
          <div className="grid grid-cols-6 md:grid-cols-12 gap-[18px]">
            {women.map((w) => (
              <a
                key={w.id}
                href="#"
                className={`relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 col-span-3 ${
                  w.is_large ? "md:col-span-6 md:row-span-2" : "md:col-span-3"
                }`}
              >
                {w.image_url ? (
                  <img
                    src={w.image_url}
                    alt={w.name}
                    className={`w-full h-full object-cover ${w.is_large ? "aspect-[4/5]" : "aspect-[3/4]"}`}
                  />
                ) : (
                  <Placeholder label="portrait" aspect={w.is_large ? "default" : "portrait"} className="h-full" />
                )}
                <div className="absolute left-0 right-0 bottom-0 px-[18px] py-3.5 flex flex-col gap-1 bg-[linear-gradient(0deg,rgba(14,15,18,0.95)_0%,rgba(14,15,18,0.7)_50%,transparent_100%)]">
                  <span className={`font-display italic text-aqua ${w.is_large ? "text-[32px]" : "text-[22px]"}`}>
                    {w.name}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint">
                    {w.role}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        <a
          href="#"
          className="mt-10 inline-flex items-center gap-2 font-display italic text-lg text-aqua border-b border-transparent pb-0.5 transition-all duration-300 hover:border-aqua hover:gap-3.5"
        >
          See all {women.length} icons →
        </a>

      </div>
    </section>
  );
}
