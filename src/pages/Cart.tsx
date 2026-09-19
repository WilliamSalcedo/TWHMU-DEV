import Placeholder from "../components/Placeholder";
import { useCart } from "../context/useCart";
import { MAX_QTY_PER_PRODUCT } from "../context/cart-context";

export default function Cart() {
  const { items, totalQuantity, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 bg-bg">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
          Your Cart
        </span>
        <h1 className="font-display font-extrabold text-[clamp(32px,5vw,48px)] text-ink m-0 mb-4">
          Your cart is empty
        </h1>
        <p className="text-[15px] text-ink-dim mb-8 max-w-[40ch]">
          Tour tees, hoodies and vinyl are waiting for you in the shop.
        </p>
        <a
          href="/#shop"
          className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg"
        >
          Browse the shop
        </a>
      </section>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <section className="bg-bg pt-32 pb-24 px-6 lg:px-10">
      <div className="max-w-[820px] mx-auto">

        <a
          href="/#shop"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim hover:text-aqua mb-10 no-underline"
        >
          ‹ Continue shopping
        </a>

        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
              Your Cart · {totalQuantity} item{totalQuantity === 1 ? "" : "s"}
            </span>
            <h1 className="font-display font-extrabold text-[clamp(32px,5vw,48px)] leading-[0.98] text-ink m-0">
              Your Cart
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim hover:text-coral transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            Clear cart
          </button>
        </div>

        <ul className="list-none m-0 p-0 border-t border-stroke">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-5 py-6 border-b border-stroke flex-wrap">
              <div className="w-20 h-24 shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Placeholder label="item" className="h-full" />
                )}
              </div>

              <div className="flex-1 min-w-[160px]">
                <h2 className="font-display text-xl text-ink font-medium m-0 mb-1.5">{item.name}</h2>
                <span className="font-display text-aqua">${item.price.toFixed(2)}</span>
              </div>

              <div className="flex items-center border border-stroke-hi">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-9 h-9 flex items-center justify-center text-ink hover:text-aqua disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  −
                </button>
                <span className="w-9 text-center font-mono text-[13px] text-ink">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= Math.min(item.stock, MAX_QTY_PER_PRODUCT)}
                  className="w-9 h-9 flex items-center justify-center text-ink hover:text-aqua disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>

              <span className="font-display text-lg text-ink w-20 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </span>

              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-faint hover:text-coral transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-10 p-7 md:p-8 flex justify-between items-center flex-wrap gap-5 bg-bg-raised border border-aqua-deep">
          <div>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-dim mb-2 inline-block">
              Subtotal
            </span>
            <div className="font-display text-3xl text-aqua">${subtotal.toFixed(2)}</div>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-ink-faint text-ink-faint font-semibold text-xs tracking-[0.16em] uppercase cursor-not-allowed"
          >
            Checkout — coming soon
          </button>
        </div>

      </div>
    </section>
  );
}
