const columns = [
  {
    heading: "Show",
    links: [
      { label: "Tour dates", href: "/#tour" },
      { label: "Cast & crew", href: "#" },
      { label: "The story", href: "/#story" },
      { label: "Press kit", href: "#" },
    ],
  },
  {
    heading: "Shop",
    links: [
      { label: "Tickets", href: "/#tour" },
      { label: "Merch", href: "/#shop" },
      { label: "Vinyl", href: "#" },
      { label: "Gift cards", href: "#" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Newsletter", href: "/#journal" },
      { label: "Contact", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

const social = ["IG", "TT", "YT", "SP"];

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-stroke pt-[clamp(60px,8vw,96px)] pb-8 px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 mb-14">
          <div className="md:col-span-2 lg:col-span-1">
            <div className="font-display italic font-semibold text-aqua text-[28px] mb-3.5">
              The Women Who Made Us
            </div>
            <p className="text-[15px] leading-[1.65] text-ink-dim max-w-[320px]">
              A tribute. A manifesto. A revolution. Honoring the women of the 90s through live
              music and theatre.
            </p>
            <div className="flex gap-3 mt-5">
              {social.map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="w-9 h-9 rounded-full border border-stroke-hi inline-flex items-center justify-center font-mono text-[10px] tracking-[0.08em] text-ink-dim transition-colors duration-300 hover:border-aqua hover:text-aqua"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-2.5">
              <h4 className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua font-medium m-0 mb-2.5">
                {col.heading}
              </h4>
              {col.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-display text-[15px] text-ink-dim transition-colors duration-300 hover:text-aqua"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center flex-wrap gap-3 pt-7 border-t border-stroke font-mono text-[10px] tracking-[0.12em] uppercase text-ink-faint">
          <span>© 2026 The Women Who Made Us. All rights reserved.</span>
          <span>
            <a href="#" className="hover:text-aqua">Privacy</a> ·{" "}
            <a href="#" className="hover:text-aqua">Terms</a> ·{" "}
            <a href="#" className="hover:text-aqua">Cookies</a>
          </span>
        </div>

      </div>
    </footer>
  );
}
