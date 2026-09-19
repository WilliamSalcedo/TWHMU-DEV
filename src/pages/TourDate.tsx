import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTourDateById } from "../services/tour";
import { useAuth } from "../context/useAuth";
import { useAuthModal } from "../context/useAuthModal";
import type { TourDateRow } from "../types/database";
import { formatFullDate } from "../utils/date";

const tagClass: Record<TourDateRow["tag_variant"], string> = {
  default: "border-aqua-deep text-aqua",
  coral: "border-coral-deep text-coral",
  muted: "border-ink-faint text-ink-faint",
  aqua: "border-aqua text-aqua bg-aqua/[0.06]",
};

export default function TourDate() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const [event, setEvent] = useState<TourDateRow | null | undefined>(undefined);
  const [ctaMessage, setCtaMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    getTourDateById(id).then(setEvent);
  }, [id]);

  if (event === undefined) {
    return <section className="min-h-[70vh] bg-bg" />;
  }

  if (event === null) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 bg-bg">
        <h1 className="font-display font-extrabold text-[clamp(32px,5vw,48px)] text-ink m-0 mb-4">
          Event not found
        </h1>
        <a
          href="/#tour"
          className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg"
        >
          ‹ Back to tour dates
        </a>
      </section>
    );
  }

  const remaining = Math.max(event.capacity - event.tickets_sold, 0);
  const isMembersPresale = event.tag_variant === "aqua";
  const gatedByAuth = isMembersPresale && !user;

  const mapsHref = event.venue_address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.venue_address}`)}`
    : undefined;

  const handleGetTickets = () => {
    setCtaMessage("Checkout is launching soon — this event is not purchasable yet.");
  };

  return (
    <section className="bg-bg pt-32 pb-24 px-6 lg:px-10">
      <div className="max-w-[820px] mx-auto">
        <div className="mb-10">
          <a
            href="/#tour"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim hover:text-aqua no-underline"
          >
            ‹ Back to tour dates
          </a>
        </div>

        <div className="mb-5">
          <span
            className={`inline-flex px-[11px] py-[5px] border font-mono text-[10px] tracking-[0.12em] uppercase ${tagClass[event.tag_variant]}`}
          >
            {event.tag_label}
          </span>
        </div>

        <h1 className="font-display font-extrabold text-[clamp(36px,5.5vw,64px)] leading-[0.98] tracking-[-0.01em] text-ink m-0 mb-2">
          {event.city}
        </h1>
        <p className="font-display italic text-aqua text-xl mb-8">{event.venue}</p>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mb-10 pb-10 border-b border-stroke">
          <div>
            <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint mb-1">Date</dt>
            <dd className="text-ink text-[15px] m-0">{formatFullDate(event.event_date)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint mb-1">Time</dt>
            <dd className="text-ink text-[15px] m-0">{event.event_time ?? "TBA"}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint mb-1">Venue address</dt>
            <dd className="text-ink text-[15px] m-0">
              {event.venue_address ?? "TBA"}
              {mapsHref && (
                <>
                  {" "}
                  ·{" "}
                  <a href={mapsHref} target="_blank" rel="noreferrer" className="text-aqua underline decoration-dashed underline-offset-4 hover:text-aqua-hi">
                    View on map
                  </a>
                </>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint mb-1">Age restriction</dt>
            <dd className="text-ink text-[15px] m-0">{event.age_restriction}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint mb-1">Price</dt>
            <dd className="text-aqua font-display text-2xl m-0">${Number(event.price).toFixed(2)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint mb-1">Availability</dt>
            <dd className="text-ink text-[15px] m-0">
              {event.sold_out ? "Sold out" : `${remaining} of ${event.capacity} tickets remaining`}
            </dd>
          </div>
        </dl>

        {event.headliner && (
          <h2 className="font-display italic text-ink text-xl mb-3">{event.headliner}</h2>
        )}
        {event.description && (
          <p className="text-[15px] leading-[1.65] text-ink-dim max-w-[64ch] mb-10">{event.description}</p>
        )}

        <div className="p-7 md:p-8 bg-bg-raised border border-aqua-deep">
          {event.sold_out ? (
            <button
              type="button"
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-[1.5px] border-ink-faint text-ink-faint font-body font-semibold text-xs tracking-[0.18em] uppercase cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : gatedByAuth ? (
            <>
              <p className="text-[15px] text-ink-dim mb-4">Sign in to access members pre-sale pricing for this show.</p>
              <button
                type="button"
                onClick={() => openAuth("signin")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-[1.5px] border-aqua text-aqua bg-transparent font-body font-semibold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg"
              >
                Sign in
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleGetTickets}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-[1.5px] border-aqua text-aqua bg-transparent font-body font-semibold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)]"
            >
              Get Tickets · ${Number(event.price).toFixed(2)}
            </button>
          )}
          {ctaMessage && (
            <p className="font-mono text-[11px] tracking-[0.12em] text-coral mt-4">{ctaMessage}</p>
          )}
        </div>
      </div>
    </section>
  );
}
