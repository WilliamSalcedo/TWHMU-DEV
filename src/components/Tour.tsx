import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getTourDates } from "../services/tour";
import { requestCity } from "../services/cityRequests";
import { useAuth } from "../context/useAuth";
import type { TourDateRow } from "../types/database";
import { formatShortDate } from "../utils/date";

const tagClass: Record<TourDateRow["tag_variant"], string> = {
  default: "border-aqua-deep text-aqua",
  coral: "border-coral-deep text-coral",
  muted: "border-ink-faint text-ink-faint",
  aqua: "border-aqua text-aqua bg-aqua/[0.06]",
};

export default function Tour() {
  const { user } = useAuth();
  const [dates, setDates] = useState<TourDateRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [cityInput, setCityInput] = useState("");
  const [cityStatus, setCityStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [cityMessage, setCityMessage] = useState("");

  useEffect(() => {
    getTourDates().then((rows) => {
      setDates(rows);
      setLoading(false);
    });
  }, []);

  const handleCitySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCityStatus("loading");

    const result = await requestCity(cityInput, user?.email);

    if (!result.success) {
      setCityStatus("error");
      setCityMessage(result.error);
      return;
    }

    setCityStatus("success");
    setCityMessage("Thanks — we'll count your vote.");
    setCityInput("");
  };

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

          <div className="flex flex-col items-start gap-2">
            <form onSubmit={handleCitySubmit} className="flex items-center gap-3 flex-wrap">
              <label className="sr-only" htmlFor="city-request">
                Your city
              </label>
              <input
                id="city-request"
                type="text"
                required
                placeholder="Your city"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                disabled={cityStatus === "loading"}
                className="px-4 py-3 bg-transparent border border-stroke-hi text-ink text-[13px] transition-colors duration-300 placeholder:text-ink-faint focus:outline-none focus:border-aqua disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={cityStatus === "loading"}
                className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cityStatus === "loading" ? "..." : "Vote for your city ›"}
              </button>
            </form>
            {cityMessage && (
              <p className={`font-mono text-[11px] tracking-[0.12em] ${cityStatus === "error" ? "text-coral" : "text-aqua"}`}>
                {cityMessage}
              </p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
