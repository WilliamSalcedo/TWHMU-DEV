import Placeholder from "./Placeholder";

type Woman = {
  name: string;
  role: string;
  large?: boolean;
};

const women: Woman[] = [
  { name: "Whitney", role: "Vocalist · 90s", large: true },
  { name: "Aaliyah", role: "R&B · 90s" },
  { name: "Lauryn", role: "Hip-Hop · 90s" },
  { name: "Mariah", role: "Pop · 90s" },
  { name: "Janet", role: "Pop · 90s" },
  { name: "Sade", role: "Soul · legend", large: true },
  { name: "Toni", role: "R&B · 90s" },
  { name: "Tina", role: "Rock · legend" },
  { name: "Selena", role: "Latin · 90s" },
];

export default function Women() {
  return (
    <section id="women" className="bg-bg py-[clamp(80px,12vw,160px)] px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto">

        <header className="mb-14 max-w-[900px]">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
            The Lineage · 12 icons
          </span>
          <h2 className="font-display font-extrabold text-[clamp(48px,6.5vw,88px)] leading-[0.98] tracking-[-0.01em] text-ink m-0">
            <em className="italic font-semibold text-aqua">The Women</em>
            <br />
            <span className="text-ink-dim italic font-normal">who shaped the show</span>
          </h2>
        </header>

        <div className="grid grid-cols-6 md:grid-cols-12 gap-[18px]">
          {women.map((w) => (
            <a
              key={w.name}
              href="#"
              className={`relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 col-span-3 ${
                w.large ? "md:col-span-6 md:row-span-2" : "md:col-span-3"
              }`}
            >
              <Placeholder label="portrait" aspect={w.large ? "default" : "portrait"} className="h-full" />
              <div className="absolute left-0 right-0 bottom-0 px-[18px] py-3.5 flex flex-col gap-1 bg-[linear-gradient(0deg,rgba(14,15,18,0.95)_0%,rgba(14,15,18,0.7)_50%,transparent_100%)]">
                <span className={`font-display italic text-aqua ${w.large ? "text-[32px]" : "text-[22px]"}`}>
                  {w.name}
                </span>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint">
                  {w.role}
                </span>
              </div>
            </a>
          ))}
        </div>

        <a
          href="#"
          className="mt-10 inline-flex items-center gap-2 font-display italic text-lg text-aqua border-b border-transparent pb-0.5 transition-all duration-300 hover:border-aqua hover:gap-3.5"
        >
          See all 12 icons →
        </a>

      </div>
    </section>
  );
}
