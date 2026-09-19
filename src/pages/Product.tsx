import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Placeholder from "../components/Placeholder";
import { getProductById } from "../services/shop";
import { useCart } from "../context/useCart";
import { MAX_QTY_PER_PRODUCT } from "../context/cart-context";
import type { ProductRow } from "../types/database";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, items } = useCart();
  const [product, setProduct] = useState<ProductRow | null | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [ctaMessage, setCtaMessage] = useState<{ text: string; error: boolean } | null>(null);

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
  const existingInCart = items.find((i) => i.id === product.id)?.quantity ?? 0;
  const roomLeft = Math.max(MAX_QTY_PER_PRODUCT - existingInCart, 0);
  const atMax = !outOfStock && roomLeft <= 0;
  const maxQuantity = Math.max(Math.min(product.stock, roomLeft), 1);

  const handleAddToCart = () => {
    const result = addToCart(
      { id: product.id, name: product.name, price: product.price, image_url: product.image_url, stock: product.stock },
      quantity
    );

    if (!result.success) {
      setCtaMessage({ text: result.error, error: true });
      return;
    }

    setCtaMessage({ text: "Added to cart.", error: false });
    setQuantity(1);
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
              {!outOfStock && !atMax && (
                <div className="flex items-center gap-4 mb-5">
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-dim">Qty</span>
                  <div className="flex items-center border border-stroke-hi">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-9 h-9 flex items-center justify-center text-ink hover:text-aqua disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-9 text-center font-mono text-[13px] text-ink">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                      disabled={quantity >= maxQuantity}
                      className="w-9 h-9 flex items-center justify-center text-ink hover:text-aqua disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-faint">
                    max {MAX_QTY_PER_PRODUCT} per item
                  </span>
                </div>
              )}

              {atMax ? (
                <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-faint">
                  You already have the max ({MAX_QTY_PER_PRODUCT}) of this item in your cart.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-[1.5px] border-aqua text-aqua bg-transparent font-body font-semibold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-aqua"
                >
                  {outOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              )}
              {ctaMessage && (
                <p className={`font-mono text-[11px] tracking-[0.12em] mt-4 ${ctaMessage.error ? "text-coral" : "text-aqua"}`}>
                  {ctaMessage.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
