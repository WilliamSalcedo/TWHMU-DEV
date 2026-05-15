import { useState } from "react";

const links = ["Home", "Story", "Tour", "The Women", "Shop", "Journal"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 lg:px-10 py-[18px] bg-[linear-gradient(180deg,rgba(14,15,18,0.85)_0%,rgba(14,15,18,0)_100%)]">
        <button
          className="lg:hidden flex flex-col gap-[5px] cursor-pointer bg-transparent border-none p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-px bg-[var(--ink)] transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block w-5 h-px bg-[var(--ink)] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-[var(--ink)] transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[var(--aqua)] flex items-center justify-center text-[var(--aqua)] text-base italic shrink-0 [font-family:var(--font-display)]">
            W
          </div>
          <span className="hidden lg:block text-[var(--ink)] text-[13px] tracking-[0.04em] [font-family:var(--font-display)]">
            The Women Who Made Us
          </span>
          <span className="lg:hidden text-[var(--aqua)] text-[13px] tracking-[0.12em] uppercase [font-family:var(--font-mono)]">
            WWMU
          </span>
        </div>

        <ul className="hidden lg:flex gap-7 list-none m-0 p-0">
          {links.map((link) => (
            <li key={link}>
              <a
                href="#"
                className={`relative pb-1.5 text-[11px] tracking-[0.18em] uppercase font-medium no-underline transition-colors duration-300 [font-family:var(--font-body)]
                  after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[var(--aqua)] after:transition-all after:duration-300
                  hover:text-[var(--aqua)] hover:after:w-full
                  ${link === "Home" ? "text-[var(--ink)]" : "text-[var(--ink-dim)]"}`}
              >
                {link.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button className="hidden lg:inline-flex items-center gap-2 px-5 py-[10px] rounded-full border border-[var(--aqua)] text-[var(--aqua)] bg-transparent [font-family:var(--font-body)] font-semibold text-[11px] tracking-[0.18em] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--aqua)] hover:text-[var(--bg)] hover:shadow-[0_0_30px_rgba(127,207,207,0.25)]">
            Tickets <span>→</span>
          </button>
          <span className="lg:hidden text-[var(--coral)] [font-family:var(--font-mono)] text-[13px] font-bold tracking-wider">
            2
          </span>
        </div>

      </nav>

      <div className={`fixed inset-0 z-[99] bg-[var(--bg)] flex flex-col items-center justify-center transition-all duration-500 lg:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <ul className="flex flex-col items-center gap-8 list-none m-0 p-0">
          {links.map((link, i) => (
            <li key={link} style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
              className={`transition-all duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <a
                href="#"
                onClick={() => setMenuOpen(false)}
                className="text-[var(--ink)] [font-family:var(--font-display)] italic text-4xl font-semibold no-underline transition-colors duration-200 hover:text-[var(--aqua)]"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <button className="mt-12 inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--aqua)] text-[var(--aqua)] bg-transparent [font-family:var(--font-body)] font-semibold text-[11px] tracking-[0.18em] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--aqua)] hover:text-[var(--bg)]">
          Get Tickets →
        </button>
      </div>
    </>
  );
}
