type PlaceholderProps = {
  label: string;
  aspect?: "portrait" | "tall" | "default";
  className?: string;
};

const aspectClass: Record<NonNullable<PlaceholderProps["aspect"]>, string> = {
  portrait: "aspect-[3/4]",
  tall: "aspect-[3/4]",
  default: "aspect-[4/5]",
};

export default function Placeholder({ label, aspect = "default", className = "" }: PlaceholderProps) {
  return (
    <div
      className={`relative w-full h-full overflow-hidden border border-stroke bg-bg-paper bg-[linear-gradient(135deg,rgba(127,207,207,0.04),rgba(232,153,104,0.04))] ${aspectClass[aspect]} ${className}`}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_24px,rgba(127,207,207,0.025)_24px_26px)]" />
      <span className="absolute left-4 bottom-3.5 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-faint px-2 py-1 border border-dashed border-stroke-hi">
        {label}
      </span>
    </div>
  );
}
