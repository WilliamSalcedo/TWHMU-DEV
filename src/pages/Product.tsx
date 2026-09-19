import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Placeholder from "../components/Placeholder";
import { getProductById } from "../services/shop";
import type { ProductRow } from "../types/database";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductRow | null | undefined>(undefined);
  const [ctaMessage, setCtaMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    getProductById(id).then(setProduct);
  }, [id]);

  if (product === undefined) {
    return <section className="min-h-[70vh] bg-bg" />;
  }

  if (product === null) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 bg-bg">
        <h1 className="font-display font-extrabold text-[clamp(32px,5vw,48px)] text-ink m-0 mb-4">
          Product not found
        </h1>
        <a
          href="/#shop"
          className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg"
        >
          ‹ Back to shop
        </a>
      </section>
    );
  }

  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;
  const outOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    setCtaMessage("Checkout is launching soon — this item is not purchasable yet.");
  };

  return (
    <section className="bg-bg pt-32 pb-24 px-6 lg:px-10">
      <div className="max-w-[980px] mx-auto">
        <a
          href="/#shop"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim hover:text-aqua mb-10 no-underline"
        >
          ‹ Back to shop
        </a>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-10 md:gap-16">
          <div className="relative">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full aspect-[3/4] object-cover" />
            ) : (
              <Placeholder label={product.category.toLowerCase()} aspect="tall" />
            )}
            {onSale && (
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-coral text-bg font-mono text-[10px] tracking-[0.1em] uppercase font-semibold">
                Sale
              </span>
            )}
          </div>

          <div>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-coral mb-3.5 inline-block">
              {product.category}
            </span>

            <h1 className="font-display font-extrabold text-[clamp(32px,4.5vw,48px)] leading-[1.02] tracking-[-0.01em] text-ink m-0 mb-5">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-3xl text-aqua">${Number(product.price).toFixed(2)}</span>
              {onSale && (
                <span className="font-display text-lg text-ink-faint line-through">
                  ${Number(product.compare_at_price).toFixed(2)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-[15px] leading-[1.65] text-ink-dim max-w-[52ch] mb-8">{product.description}</p>
            )}

            <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-faint mb-8">
              {outOfStock ? "Out of stock" : `${product.stock} in stock`}
            </p>

            <div className="p-7 bg-bg-raised border border-aqua-deep">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={outOfStock}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-[1.5px] border-aqua text-aqua bg-transparent font-body font-semibold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-aqua"
              >
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              {ctaMessage && (
                <p className="font-mono text-[11px] tracking-[0.12em] text-coral mt-4">{ctaMessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
