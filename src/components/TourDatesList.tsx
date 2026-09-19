import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { TourDateRow } from "../types/database";
import { formatShortDate } from "../utils/date";

const tagClass: Record<TourDateRow["tag_variant"], string> = {
  default: "border-aqua-deep text-aqua",
  coral: "border-coral-deep text-coral",
  muted: "border-ink-faint text-ink-faint",
  aqua: "border-aqua text-aqua bg-aqua/[0.06]",
};

type Props = {
  dates: TourDateRow[];
};

export default function TourDatesList({ dates }: Props) {
  const { user } = useAuth();

  return (
    <ul className="list-none m-0 p-0 border-t border-stroke">
      {dates.map((d) => {
        const isMembersPresale = d.tag_variant === "aqua";
        const unlocked = isMembersPresale && !!user;
        const actionLabel = unlocked ? "Tickets ›" : d.action_label;
        const actionVariant = unlocked ? "btn" : d.action_variant;

        return (
          <li key={d.id} className="border-b border-stroke">
            <Link
              to={`/tour/${d.id}`}
              className={`grid grid-cols-[80px_1fr] md:grid-cols-[130px_1fr_140px_160px] grid-rows-[auto_auto] md:grid-rows-1 items-center gap-x-4 gap-y-2 py-7 transition-all duration-300 hover:bg-aqua/[0.03] hover:px-3 no-underline ${d.sold_out ? "opacity-70" : ""}`}
            >
              <span className="font-display text-[26px] text-aqua tracking-[0.04em]">{formatShortDate(d.event_date)}</span>

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

              {actionVariant === "btn" ? (
                <span className="col-start-2 md:col-start-auto justify-self-start md:justify-self-end inline-flex items-center gap-2 px-4 py-[9px] rounded-full border-[1.5px] border-aqua text-aqua text-[11px] font-semibold tracking-[0.16em] uppercase transition-all duration-300">
                  {actionLabel}
                </span>
              ) : (
                <span className="col-start-2 md:col-start-auto justify-self-start md:justify-self-end text-ink-dim text-[13px] underline decoration-dashed underline-offset-4">
                  {actionLabel}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
