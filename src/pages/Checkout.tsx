import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useAuthModal } from "../context/useAuthModal";
import { useCart } from "../context/useCart";
import { createOrder } from "../services/orders";
import { getAddresses, createAddress } from "../services/addresses";
import CardDetailsModal from "../components/CardDetailsModal";
import type { AddressRow } from "../types/database";

type PaymentMethod = "card" | "cash" | "other";

const inputClass =
  "w-full px-5 py-3.5 bg-transparent border border-stroke-hi text-ink text-[15px] transition-colors duration-300 placeholder:text-ink-faint focus:outline-none focus:border-aqua";

const paymentOptions: { value: PaymentMethod; label: string }[] = [
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash on pickup" },
  { value: "other", label: "Other" },
];

export default function Checkout() {
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const { items, clearCart } = useCart();

  const [name, setName] = useState(user?.user_metadata?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [cardConfirmed, setCardConfirmed] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<AddressRow[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const applyAddress = (a: AddressRow) => {
    setSelectedAddressId(a.id);
    setName(a.full_name);
    setPhone(a.phone);
    setAddress(a.address_line);
    setCity(a.city);
    setRegion(a.region);
    setPostalCode(a.postal_code);
    setCountry(a.country);
  };

  useEffect(() => {
    if (!user) return;
    getAddresses().then((rows) => {
      setSavedAddresses(rows);
      const preferred = rows.find((a) => a.is_default) ?? rows[0];
      if (preferred) applyAddress(preferred);
    });
  }, [user]);

  if (!user) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 bg-bg">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
          Checkout
        </span>
        <h1 className="font-display font-extrabold text-[clamp(32px,5vw,48px)] text-ink m-0 mb-4">
          Sign in to check out
        </h1>
        <p className="text-[15px] text-ink-dim mb-8 max-w-[40ch]">
          Browsing and adding to your cart is free. An account just keeps your orders in one place.
        </p>
        <button
          type="button"
          onClick={() => openAuth("signin")}
          className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg"
        >
          Sign in
        </button>
      </section>
    );
  }

  if (orderId) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 bg-bg">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full border border-aqua flex items-center justify-center text-aqua text-3xl">
          ✓
        </div>
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-3.5 inline-block">
          Order confirmed
        </span>
        <h1 className="font-display font-extrabold text-[clamp(32px,5vw,48px)] text-ink m-0 mb-4">
          Thank you, <em className="italic text-coral">{name.split(" ")[0] || "friend"}</em>.
        </h1>
        <p className="text-[15px] text-ink-dim mb-2 max-w-[44ch]">
          Your order has been placed. A confirmation would normally be sent to {email}.
        </p>
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint mb-8">
          Order #{orderId.slice(0, 8)}
        </p>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link
            to="/account"
            className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg no-underline"
          >
            View my orders
          </Link>
          <Link
            to="/"
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim hover:text-aqua no-underline"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 bg-bg">
        <h1 className="font-display font-extrabold text-[clamp(32px,5vw,48px)] text-ink m-0 mb-4">
          Your cart is empty
        </h1>
        <Link
          to="/#shop"
          className="inline-flex items-center gap-2 px-[22px] py-[13px] rounded-full border-[1.5px] border-aqua text-aqua font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg no-underline"
        >
          Browse the shop
        </Link>
      </section>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const contactValid = name.trim() && email.trim() && phone.trim() && address.trim() && city.trim() && region.trim() && postalCode.trim() && country.trim();
  const paymentValid = paymentMethod === "card" ? cardConfirmed : paymentMethod !== null;

  const handlePay = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (!contactValid || !paymentValid) return;

    setPlacing(true);

    const result = await createOrder({
      userId: user.id,
      items,
      total: subtotal,
      paymentMethod: paymentMethod!,
      shipping: { customerName: name, customerEmail: email, customerPhone: phone, address, city, region, postalCode, country },
    });

    if (result.success && saveAddress && !selectedAddressId) {
      createAddress(user.id, {
        label: "Home",
        full_name: name,
        phone,
        address_line: address,
        city,
        region,
        postal_code: postalCode,
        country,
        is_default: savedAddresses.length === 0,
      });
    }

    setPlacing(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    clearCart();
    setOrderId(result.orderId);
  };

  return (
    <section className="bg-bg pt-32 pb-24 px-6 lg:px-10">
      <div className="max-w-[980px] mx-auto">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim hover:text-aqua mb-10 no-underline"
        >
          ‹ Back to cart
        </Link>

        <h1 className="font-display font-extrabold text-[clamp(32px,5vw,48px)] leading-[0.98] text-ink m-0 mb-10">
          Checkout
        </h1>

        <form onSubmit={handlePay} className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-12">
          <div className="flex flex-col gap-10">

            <div>
              <h2 className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-5">Contact & shipping</h2>

              {savedAddresses.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {savedAddresses.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => applyAddress(a)}
                      className={`px-4 py-2 border font-mono text-[10px] tracking-[0.1em] uppercase transition-colors duration-200 ${
                        selectedAddressId === a.id ? "border-aqua text-aqua bg-aqua/[0.06]" : "border-stroke-hi text-ink-dim hover:border-aqua/50"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input value={name} onChange={(e) => { setName(e.target.value); setSelectedAddressId(null); }} placeholder="Full name" className={`${inputClass} sm:col-span-2`} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className={inputClass} />
                <input value={phone} onChange={(e) => { setPhone(e.target.value); setSelectedAddressId(null); }} placeholder="Phone" className={inputClass} />
                <input value={address} onChange={(e) => { setAddress(e.target.value); setSelectedAddressId(null); }} placeholder="Address" className={`${inputClass} sm:col-span-2`} />
                <input value={city} onChange={(e) => { setCity(e.target.value); setSelectedAddressId(null); }} placeholder="City" className={inputClass} />
                <input value={region} onChange={(e) => { setRegion(e.target.value); setSelectedAddressId(null); }} placeholder="State / Region" className={inputClass} />
                <input value={postalCode} onChange={(e) => { setPostalCode(e.target.value); setSelectedAddressId(null); }} placeholder="Postal code" className={inputClass} />
                <input value={country} onChange={(e) => { setCountry(e.target.value); setSelectedAddressId(null); }} placeholder="Country" className={inputClass} />
              </div>
              {submitted && !contactValid && (
                <p className="font-mono text-[11px] text-coral mt-3">Please fill in all contact and shipping fields.</p>
              )}
              {!selectedAddressId && (
                <label className="flex items-center gap-2 mt-4 font-mono text-[11px] tracking-[0.1em] uppercase text-ink-dim cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="accent-aqua"
                  />
                  Save this address for next time
                </label>
              )}
            </div>

            <div>
              <h2 className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-5">Payment method</h2>
              <div className="grid grid-cols-3 gap-3">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(opt.value);
                      if (opt.value === "card" && !cardConfirmed) setShowCardModal(true);
                    }}
                    className={`px-4 py-4 border font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 ${
                      paymentMethod === opt.value ? "border-aqua text-aqua bg-aqua/[0.06]" : "border-stroke-hi text-ink-dim hover:border-aqua/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {paymentMethod === "card" && (
                <p className="font-mono text-[11px] tracking-[0.12em] mt-3 text-ink-dim">
                  {cardConfirmed ? (
                    <>
                      Card on file.{" "}
                      <button type="button" onClick={() => setShowCardModal(true)} className="text-aqua underline decoration-dashed underline-offset-4">
                        Edit
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setShowCardModal(true)} className="text-aqua underline decoration-dashed underline-offset-4">
                      Enter card details
                    </button>
                  )}
                </p>
              )}
              {submitted && !paymentValid && (
                <p className="font-mono text-[11px] text-coral mt-3">Choose a payment method to continue.</p>
              )}
            </div>
          </div>

          <div className="bg-bg-raised border border-aqua-deep p-7 h-fit">
            <h2 className="font-mono text-[11px] tracking-[0.18em] uppercase text-aqua mb-5">Order summary</h2>
            <ul className="list-none m-0 p-0 flex flex-col gap-4 mb-6">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-[14px]">
                  <span className="text-ink-dim">
                    {item.name} <span className="text-ink-faint">×{item.quantity}</span>
                  </span>
                  <span className="text-ink shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center pt-5 border-t border-stroke mb-6">
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim">Total</span>
              <span className="font-display text-2xl text-aqua">${subtotal.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              disabled={placing}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-[1.5px] border-aqua text-aqua bg-transparent font-body font-semibold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placing ? "Placing order..." : "Pay now"}
            </button>
            {error && <p className="font-mono text-[11px] text-coral mt-3">{error}</p>}
          </div>
        </form>
      </div>

      {showCardModal && (
        <CardDetailsModal
          onClose={() => setShowCardModal(false)}
          onConfirm={() => {
            setCardConfirmed(true);
            setShowCardModal(false);
          }}
        />
      )}
    </section>
  );
}
