import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getTourDates } from "../services/tour";
import { requestCity } from "../services/cityRequests";
import { useAuth } from "../context/useAuth";
import TourDatesList from "./TourDatesList";
import type { TourDateRow } from "../types/database";

const PREVIEW_LIMIT = 4;

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
    setCityMessage("Thanks for participating. Your vote has been counted.");
    setCityInput("");
  };

  const preview = dates.slice(0, PREVIEW_LIMIT);
  const hasMore = dates.length > PREVIEW_LIMIT;

  return (
    <section id="tour" className="bg-bg-paper border-y border-stroke py-[clamp(56px,8vw,110px)] px-6 lg:px-10">
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
          <TourDatesList dates={preview} />
        )}

        {hasMore && (
          <Link
            to="/tour"
            className="mt-8 inline-flex items-center gap-2 font-display italic text-lg text-aqua border-b border-transparent pb-0.5 transition-all duration-300 hover:border-aqua hover:gap-3.5 no-underline"
          >
            See all {dates.length} tour dates →
          </Link>
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

          {cityStatus === "success" ? (
            <p className="font-mono text-[12px] tracking-[0.12em] uppercase text-aqua">{cityMessage}</p>
          ) : (
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
                  className="px-5 py-[13px] rounded-full bg-transparent border-[1.5px] border-stroke-hi text-ink text-[13px] transition-colors duration-300 placeholder:text-ink-faint focus:outline-none focus:border-aqua disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={cityStatus === "loading"}
                  className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cityStatus === "loading" ? "..." : "Vote for your city ›"}
                </button>
              </form>
              {cityStatus === "error" && cityMessage && (
                <p className="font-mono text-[11px] tracking-[0.12em] text-coral">{cityMessage}</p>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
