import Placeholder from "./Placeholder";
import type { WomanRow } from "../types/database";

type Props = {
  women: WomanRow[];
  onSelect: (woman: WomanRow) => void;
};

export default function WomenGrid({ women, onSelect }: Props) {
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 gap-[18px]">
      {women.map((w) => (
        <button
          key={w.id}
          type="button"
          onClick={() => onSelect(w)}
          className={`relative overflow-hidden text-left transition-transform duration-300 hover:-translate-y-1 col-span-3 cursor-pointer ${
            w.is_large ? "md:col-span-6 md:row-span-2" : "md:col-span-3"
          }`}
        >
          {w.image_url ? (
            <img
              src={w.image_url}
              alt={w.name}
              className={`w-full h-full object-cover ${w.is_large ? "aspect-[4/5]" : "aspect-[3/4]"}`}
            />
          ) : (
            <Placeholder label="portrait" aspect={w.is_large ? "default" : "portrait"} className="h-full" />
          )}
          <div className="absolute left-0 right-0 bottom-0 px-[18px] py-3.5 flex flex-col gap-1 bg-[linear-gradient(0deg,rgba(14,15,18,0.95)_0%,rgba(14,15,18,0.7)_50%,transparent_100%)]">
            <span className={`font-display italic text-aqua ${w.is_large ? "text-[32px]" : "text-[22px]"}`}>
              {w.name}
            </span>
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint">
              {w.role}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
