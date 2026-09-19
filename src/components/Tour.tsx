import { useEffect, useState } from "react";
import { getTourDates } from "../services/tour";
import type { TourDateRow } from "../types/database";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function formatDate(isoDate: string) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${MONTHS[month - 1]} ${String(day).padStart(2, "0")}`;
}

const tagClass: Record<TourDateRow["tag_variant"], string> = {
  default: "border-aqua-deep text-aqua",
  coral: "border-coral-deep text-coral",
  muted: "border-ink-faint text-ink-faint",
  aqua: "border-aqua text-aqua bg-aqua/[0.06]",
};

export default function Tour() {
  const [dates, setDates] = useState<TourDateRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTourDates().then((rows) => {
      setDates(rows);
      setLoading(false);
    });
  }, []);

  return (
    <section id="tour" className="bg-bg-paper border-y border-stroke py-[clamp(80px,12vw,160px)] px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto">

        <header className="mb-14 max-w-[900px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
            Tour · {dates.length} dates
          </span>
          <h2 className="font-display font-extrabold text-[clamp(48px,6.5vw,88px)] leading-[0.98] tracking-[-0.01em] text-ink m-0">
            <em className="italic font-semibold text-aqua">Where</em> we're going
          </h2>
        </header>

        {loading ? (
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint py-10">Loading dates…</p>
        ) : (
          <ul className="list-none m-0 p-0 border-t border-stroke">
            {dates.map((d) => (
              <li
                key={d.id}
                className={`grid grid-cols-[80px_1fr] md:grid-cols-[130px_1fr_140px_160px] grid-rows-[auto_auto] md:grid-rows-1 items-center gap-x-4 gap-y-2 py-7 border-b border-stroke transition-all duration-300 hover:bg-aqua/[0.03] hover:px-3 ${d.sold_out ? "opacity-70" : ""}`}
              >
                <span className="font-display text-[26px] text-aqua tracking-[0.04em]">{formatDate(d.event_date)}</span>

                <div className="flex flex-col gap-1">
                  <span className="font-display text-2xl text-ink font-medium">{d.city}</span>
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-faint">
                    {d.venue}
                  </span>
                </div>

                <span
                  className={`col-start-2 md:col-start-auto justify-self-start inline-flex px-[11px] py-[5px] border font-mono text-[10px] tracking-[0.12em] uppercase ${tagClass[d.tag_variant]}`}
                >
                  {d.tag_label}
                </span>

                {d.action_variant === "btn" ? (
                  <a
                    href={d.action_href}
                    className="col-start-2 md:col-start-auto justify-self-start md:justify-self-end inline-flex items-center gap-2 px-4 py-[9px] rounded-full border-[1.5px] border-aqua text-aqua text-[11px] font-semibold tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg"
                  >
                    {d.action_label}
                  </a>
                ) : (
                  <a
                    href={d.action_href}
                    className="col-start-2 md:col-start-auto justify-self-start md:justify-self-end text-ink-dim text-[13px] underline decoration-dashed underline-offset-4 hover:text-aqua"
                  >
                    {d.action_label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 p-7 md:p-8 flex justify-between items-center flex-wrap gap-5 bg-bg-raised border border-aqua-deep">
          <div>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-coral mb-3.5 inline-block">
              Want us in your city?
            </span>
            <div className="font-display italic font-semibold text-aqua text-[28px]">
              Request a tour stop
            </div>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)]"
          >
            Vote for your city ›
          </a>
        </div>

      </div>
    </section>
  );
}
