import { Link } from "react-router-dom";
import Placeholder from "./Placeholder";
import type { ProductRow } from "../types/database";

type Props = {
  products: ProductRow[];
};

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((p) => {
        const onSale = p.compare_at_price != null && p.compare_at_price > p.price;

        return (
          <Link
            key={p.id}
            to={`/shop/${p.id}`}
            className="block transition-transform duration-300 hover:-translate-y-1.5 no-underline"
          >
            <div className="relative">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-full aspect-[3/4] object-cover" />
              ) : (
                <Placeholder label={p.category.toLowerCase()} aspect="tall" />
              )}
              {onSale && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-coral text-bg font-mono text-[10px] tracking-[0.1em] uppercase font-semibold">
                  Sale
                </span>
              )}
            </div>
            <div className="pt-[18px] px-1 pb-2 flex flex-col gap-1.5">
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-coral">
                {p.category}
              </span>
              <h3 className="font-display text-xl text-ink font-medium my-1">{p.name}</h3>
              {p.description && (
                <p className="text-[13px] leading-[1.5] text-ink-dim line-clamp-2">{p.description}</p>
              )}
              <div className="flex items-center gap-2.5 mt-0.5">
                <span className="font-display text-[22px] text-aqua">${Number(p.price).toFixed(2)}</span>
                {onSale && (
                  <span className="font-display text-sm text-ink-faint line-through">
                    ${Number(p.compare_at_price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
