import { useEffect, useState, type FormEvent } from "react";

type Props = {
  onClose: () => void;
  onConfirm: () => void;
};

type Errors = { name?: string; number?: string; expiry?: string; cvv?: string };

function validate(values: { name: string; number: string; expiry: string; cvv: string }): Errors {
  const errors: Errors = {};

  if (values.name.trim().length < 2) errors.name = "Enter the name on the card";
  if (!/^\d{16}$/.test(values.number.replace(/\s/g, ""))) errors.number = "Enter a 16-digit card number";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiry)) errors.expiry = "Use MM/YY";
  if (!/^\d{3,4}$/.test(values.cvv)) errors.cvv = "Enter a valid CVV";

  return errors;
}

export default function CardDetailsModal({ onClose, onConfirm }: Props) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const errors = validate({ name, number, expiry, cvv });
  const showError = (field: keyof Errors) => submitted && errors[field];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    onConfirm();
  };

  const inputClass = (field: keyof Errors) =>
    `w-full px-5 py-3.5 bg-transparent border text-ink text-[15px] transition-colors duration-300 placeholder:text-ink-faint focus:outline-none ${
      showError(field) ? "border-coral" : "border-stroke-hi focus:border-aqua"
    }`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby="card-modal-title">
      <div className="absolute inset-0 bg-bg/85 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[460px] max-h-[90vh] overflow-y-auto bg-bg-raised border border-stroke p-7 sm:p-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-ink-dim hover:text-ink text-xl leading-none transition-colors duration-200"
        >
          ×
        </button>

        <h2 id="card-modal-title" className="font-display font-extrabold text-[clamp(26px,4vw,32px)] leading-[0.98] text-aqua m-0 mb-2">
          Card details
        </h2>
        <p className="text-[13px] text-ink-dim mb-8">This is a simulated checkout. No real payment is processed.</p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="card-name" className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-dim mb-2 inline-block">
              Name on card
            </label>
            <input
              id="card-name"
              type="text"
              autoComplete="cc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass("name")}
              placeholder="Jane Doe"
            />
            {showError("name") && <p className="font-mono text-[11px] text-coral mt-1.5">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="card-number" className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-dim mb-2 inline-block">
              Card number
            </label>
            <input
              id="card-number"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className={inputClass("number")}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
            {showError("number") && <p className="font-mono text-[11px] text-coral mt-1.5">{errors.number}</p>}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="card-expiry" className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-dim mb-2 inline-block">
                Expiry
              </label>
              <input
                id="card-expiry"
                type="text"
                autoComplete="cc-exp"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className={inputClass("expiry")}
                placeholder="MM/YY"
                maxLength={5}
              />
              {showError("expiry") && <p className="font-mono text-[11px] text-coral mt-1.5">{errors.expiry}</p>}
            </div>
            <div>
              <label htmlFor="card-cvv" className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-dim mb-2 inline-block">
                CVV
              </label>
              <input
                id="card-cvv"
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className={inputClass("cvv")}
                placeholder="123"
                maxLength={4}
              />
              {showError("cvv") && <p className="font-mono text-[11px] text-coral mt-1.5">{errors.cvv}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-[1.5px] border-aqua text-aqua bg-transparent font-body font-semibold text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:bg-aqua hover:text-bg hover:shadow-[0_0_40px_rgba(127,207,207,0.25)]"
          >
            Save card
          </button>
        </form>
      </div>
    </div>
  );
}
