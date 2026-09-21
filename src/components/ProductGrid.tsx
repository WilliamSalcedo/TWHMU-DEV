import { useState } from "react";
import { Link } from "react-router-dom";
import Placeholder from "./Placeholder";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import { useAuthModal } from "../context/useAuthModal";
import type { ProductRow } from "../types/database";

type Props = {
  products: ProductRow[];
};

function ProductCard({ product: p }: { product: ProductRow }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const onSale = p.compare_at_price != null && p.compare_at_price > p.price;
  const outOfStock = p.stock <= 0;

  const handleAddToCart = () => {
    if (!user) {
      openAuth("signin");
      return;
    }

    const result = addToCart({ id: p.id, type: "product", name: p.name, price: p.price, image_url: p.image_url, stock: p.stock });
    setMessage(result.success ? { text: "Added to cart.", error: false } : { text: result.error, error: true });
  };

  return (
    <div className="flex flex-col h-full transition-transform duration-300 hover:-translate-y-1.5">
      <Link to={`/shop/${p.id}`} className="block no-underline">
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
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-coral line-clamp-1">
            {p.category}
          </span>
          <h3 className="font-display text-xl text-ink font-medium my-1 line-clamp-1">{p.name}</h3>
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

      <div className="px-1 mt-auto">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-[9px] border-[1.5px] border-aqua text-aqua text-[11px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-aqua"
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
        {message && (
          <p className={`font-mono text-[10px] tracking-[0.1em] mt-1.5 ${message.error ? "text-coral" : "text-aqua"}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
