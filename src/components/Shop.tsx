import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import { getProducts } from "../services/shop";
import type { ProductRow } from "../types/database";

const PREVIEW_LIMIT = 4;

export default function Shop() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((rows) => {
      setProducts(rows);
      setLoading(false);
    });
  }, []);

  const preview = products.slice(0, PREVIEW_LIMIT);
  const hasMore = products.length > PREVIEW_LIMIT;

  return (
    <section id="shop" className="bg-bg-paper border-y border-stroke py-[clamp(56px,8vw,110px)] px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto">

        <header className="mb-14 flex justify-between items-end flex-wrap gap-6">
          <div>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
              Shop · Merch
            </span>
            <h2 className="font-display font-extrabold text-[clamp(48px,6.5vw,88px)] leading-[0.98] tracking-[-0.01em] text-ink m-0">
              <em className="italic font-semibold text-aqua">The</em> Box Office
            </h2>
          </div>
          {hasMore && (
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-display italic text-lg text-aqua border-b border-transparent pb-0.5 transition-all duration-300 hover:border-aqua hover:gap-3.5 no-underline"
            >
              View everything →
            </Link>
          )}
        </header>

        {loading ? (
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint py-10">Loading…</p>
        ) : (
          <ProductGrid products={preview} />
        )}

      </div>
    </section>
  );
}
