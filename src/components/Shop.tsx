import Placeholder from "./Placeholder";

type Product = {
  category: string;
  name: string;
  price: string;
  label: string;
};

const products: Product[] = [
  { category: "Ticket", name: "Opening Night · NYC", price: "$95", label: "ticket" },
  { category: "Apparel", name: "Tour Tee · Aqua", price: "$38", label: "apparel" },
  { category: "Apparel", name: "Hoodie · Black", price: "$72", label: "apparel" },
  { category: "Music", name: "Vinyl · Live in NYC", price: "$28", label: "music" },
];

export default function Shop() {
  return (
    <section id="shop" className="bg-bg-paper border-y border-stroke py-[clamp(80px,12vw,160px)] px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto">

        <header className="mb-14 flex justify-between items-end flex-wrap gap-6">
          <div>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
              Shop · Tickets + Merch
            </span>
            <h2 className="font-display font-extrabold text-[clamp(48px,6.5vw,88px)] leading-[0.98] tracking-[-0.01em] text-ink m-0">
              <em className="italic font-semibold text-aqua">The</em> Box Office
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 font-display italic text-lg text-aqua border-b border-transparent pb-0.5 transition-all duration-300 hover:border-aqua hover:gap-3.5"
          >
            View everything →
          </a>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <a key={p.name} href="#" className="block transition-transform duration-300 hover:-translate-y-1.5">
              <Placeholder label={p.label} aspect="tall" />
              <div className="pt-[18px] px-1 pb-2 flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-coral">
                  {p.category}
                </span>
                <h3 className="font-display text-xl text-ink font-medium my-1">{p.name}</h3>
                <span className="font-display text-[22px] text-aqua">{p.price}</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
