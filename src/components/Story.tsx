import { useEffect, useState } from "react";
import Placeholder from "./Placeholder";
import { getSiteContentValue } from "../services/content";

export default function Story() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    getSiteContentValue("story_photo_url").then(setPhotoUrl);
  }, []);

  return (
    <section id="story" className="bg-bg py-[clamp(56px,8vw,110px)] px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-20 items-center">

        <div>
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
            · Chapter One ·
          </span>

          <h2 className="font-display font-extrabold text-[clamp(48px,6.5vw,88px)] leading-[0.98] tracking-[-0.01em] text-ink m-0 mb-6">
            A Tribute. A Manifesto.
            <br />
            <em className="italic font-semibold text-aqua">A Revolution.</em>
          </h2>

          <p className="font-display italic font-normal text-[clamp(18px,1.6vw,22px)] leading-[1.4] text-ink mb-4.5">
            Born from a desire to reclaim the stage,{" "}
            <em className="text-ink">The Women Who Made Us</em> is more than a
            tribute show. It's a living lineage of artists, icons and dreamers who shaped our
            world.
          </p>

          <p className="text-[15px] leading-[1.65] text-ink-dim max-w-[56ch] mb-4.5">
            We don't just perform the music. We honor the spirit of the women who made us who we
            are. A theatrical experience built for the 90s kid in all of us, and the daughters
            they're raising.
          </p>

          <a
            href="#about"
            className="mt-3 inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua bg-transparent font-body font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)]"
          >
            Read the manifesto <span aria-hidden="true">›</span>
          </a>
        </div>

        <figure className="m-0">
          {photoUrl ? (
            <img src={photoUrl} alt="The company on opening night" className="w-full aspect-[3/4] object-cover" />
          ) : (
            <Placeholder label="cast photo · drop here" aspect="portrait" />
          )}
          <figcaption className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-faint mt-2.5">
            From left: the company on opening night, Brooklyn Steel
          </figcaption>
        </figure>

      </div>
    </section>
  );
}
