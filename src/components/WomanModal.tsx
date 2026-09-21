import { useEffect } from "react";
import Placeholder from "./Placeholder";
import type { WomanRow } from "../types/database";

type Props = {
  woman: WomanRow;
  onClose: () => void;
};

export default function WomanModal({ woman, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby="woman-modal-title">
      <div className="absolute inset-0 bg-bg/85 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[720px] max-h-[90vh] overflow-y-auto bg-bg-raised border border-stroke grid grid-cols-1 sm:grid-cols-[220px_1fr]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-ink-dim hover:text-ink text-xl leading-none transition-colors duration-200 z-10"
        >
          ×
        </button>

        <div className="aspect-[3/4] sm:aspect-auto sm:h-full">
          {woman.image_url ? (
            <img src={woman.image_url} alt={woman.name} className="w-full h-full object-cover" />
          ) : (
            <Placeholder label="portrait" className="h-full" />
          )}
        </div>

        <div className="p-7 sm:p-10">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-coral mb-3.5 inline-block">
            {woman.role}
          </span>
          <h2 id="woman-modal-title" className="font-display italic font-semibold text-aqua text-[clamp(28px,4vw,36px)] leading-[0.98] m-0 mb-5">
            {woman.name}
          </h2>
          <p className="text-[15px] leading-[1.65] text-ink-dim">
            {woman.bio ?? "Bio coming soon."}
          </p>
        </div>
      </div>
    </div>
  );
}
