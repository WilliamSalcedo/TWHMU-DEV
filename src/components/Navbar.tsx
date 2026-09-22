import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useAuthModal } from "../context/useAuthModal";
import { useCart } from "../context/useCart";

const links = [
  { label: "Home", href: "/" },
  { label: "Story", href: "/#story" },
  { label: "Tour", href: "/#tour" },
  { label: "The Women", href: "/#women" },
  { label: "Shop", href: "/#shop" },
  { label: "Casting", href: "/casting" },
  { label: "Journal", href: "/#journal" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const { totalQuantity } = useCart();

  const displayName: string = user?.user_metadata?.name || user?.email || "";
  const initial = displayName ? displayName[0].toUpperCase() : "";

  const handleOpenAuth = (mode: "signin" | "register") => {
    setMenuOpen(false);
    openAuth(mode);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 lg:px-10 py-[18px] bg-[linear-gradient(180deg,rgba(14,15,18,0.85)_0%,rgba(14,15,18,0)_100%)]">
        <button
          className="lg:hidden flex flex-col gap-[5px] cursor-pointer bg-transparent border-none p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            className={`block w-5 h-px bg-ink transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`}
          />
          <span
            className={`block w-5 h-px bg-ink transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-px bg-ink transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}
          />
        </button>

        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 rounded-full border border-aqua flex items-center justify-center text-aqua text-base italic shrink-0 font-display">
            W
          </div>
          <span className="hidden lg:block text-ink text-[13px] tracking-[0.04em] font-display">
            The Women Who Made Us
          </span>
          <span className="lg:hidden text-aqua text-[13px] tracking-[0.12em] uppercase font-mono">
            WWMU
          </span>
        </Link>

        <ul className="hidden lg:flex gap-7 list-none m-0 p-0">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`relative pb-1.5 text-[11px] tracking-[0.18em] uppercase font-medium no-underline font-body transition-colors duration-300
                  after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-aqua after:transition-all after:duration-300
                  hover:text-aqua hover:after:w-full
                  ${link.label === "Home" ? "text-ink" : "text-ink-dim"}`}
              >
                {link.label.toUpperCase()}
              </a>
            </li>
          ))}
          {user && (
            <li>
              <Link
                to="/cart"
                className="relative pb-1.5 text-[11px] tracking-[0.18em] uppercase font-medium no-underline font-body text-ink-dim transition-colors duration-300
                  after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-aqua after:transition-all after:duration-300
                  hover:text-aqua hover:after:w-full"
              >
                CART{totalQuantity > 0 ? ` (${totalQuantity})` : ""}
              </Link>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/account"
              className="flex items-center gap-2 text-ink hover:text-aqua transition-colors duration-300 no-underline"
            >
              <span className="w-8 h-8 rounded-full border border-aqua flex items-center justify-center text-aqua text-sm font-display italic shrink-0">
                {initial}
              </span>
              <span className="hidden lg:inline text-[11px] tracking-[0.14em] uppercase font-body font-medium">
                {displayName}
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenAuth("signin")}
              className="text-coral font-body text-[11px] tracking-[0.14em] uppercase font-medium transition-colors duration-300 hover:text-aqua bg-transparent border-none cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[99] bg-bg flex flex-col items-center justify-center transition-all duration-500 lg:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <ul className="flex flex-col items-center gap-8 list-none m-0 p-0">
          {links.map((link, i) => (
            <li
              key={link.label}
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
              className={`transition-all duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-ink font-display italic text-4xl font-semibold no-underline transition-colors duration-200 hover:text-aqua"
              >
                {link.label}
              </a>
            </li>
          ))}
          {user && (
            <li
              style={{
                transitionDelay: menuOpen ? `${links.length * 60}ms` : "0ms",
              }}
              className={`transition-all duration-300 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="text-ink font-display italic text-4xl font-semibold no-underline transition-colors duration-200 hover:text-aqua"
              >
                Cart{totalQuantity > 0 ? ` (${totalQuantity})` : ""}
              </Link>
            </li>
          )}
        </ul>
        <a
          href="/#tour"
          onClick={() => setMenuOpen(false)}
          className="mt-12 inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-aqua text-aqua bg-transparent font-body font-semibold text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg no-underline"
        >
          Get Tickets →
        </a>
        {user ? (
          <Link
            to="/account"
            onClick={() => setMenuOpen(false)}
            className="mt-6 flex items-center gap-2 text-ink hover:text-aqua no-underline"
          >
            <span className="w-8 h-8 rounded-full border border-aqua flex items-center justify-center text-aqua text-sm font-display italic shrink-0">
              {initial}
            </span>
            <span className="text-[11px] tracking-[0.14em] uppercase font-body font-medium">
              {displayName}
            </span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => handleOpenAuth("signin")}
            className="mt-6 text-coral font-body text-[11px] tracking-[0.18em] uppercase font-medium bg-transparent border-none cursor-pointer"
          >
            Sign in
          </button>
        )}
      </div>
    </>
  );
}
