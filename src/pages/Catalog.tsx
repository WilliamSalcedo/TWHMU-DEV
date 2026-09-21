import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../services/shop";
import type { ProductRow } from "../types/database";

export default function Catalog() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((rows) => {
      setProducts(rows);
      setLoading(false);
    });
  }, []);

  return (
    <section className="bg-bg pt-32 pb-24 px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto">

        <a
          href="/#shop"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim hover:text-aqua mb-10 no-underline"
        >
          ‹ Back to home
        </a>

        <header className="mb-14 flex justify-between items-end flex-wrap gap-6">
          <div>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
              Shop · {products.length} items
            </span>
            <h1 className="font-display font-extrabold text-[clamp(48px,6.5vw,88px)] leading-[0.98] tracking-[-0.01em] text-ink m-0">
              <em className="italic font-semibold text-aqua">The</em> Box Office
            </h1>
          </div>
        </header>

        {loading ? (
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint py-10">Loading…</p>
        ) : (
          <ProductGrid products={products} />
        )}

      </div>
    </section>
  );
}
