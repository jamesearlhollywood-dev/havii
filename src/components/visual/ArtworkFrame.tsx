import { Waveform } from "./Waveform";

/**
 * Large podcast-artwork placeholder. Uses a deep charcoal tile with a gold
 * monogram and a subtle waveform — stands in for real cover art until
 * uploads are wired up. Square by default.
 */
export function ArtworkFrame({
  label = "GH3",
  subtitle = "Grace Beyond",
  size = "md",
  className = "",
}: {
  label?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes: Record<string, string> = {
    sm: "h-24 w-24 text-2xl",
    md: "h-40 w-40 text-4xl",
    lg: "h-56 w-56 sm:h-64 sm:w-64 text-5xl",
    xl: "h-72 w-72 sm:h-80 sm:w-80 text-6xl",
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-studio-line bg-gradient-to-br from-studio-surface to-studio-black ${sizes[size]} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
        <Waveform bars={28} className="h-3/4 w-full" />
      </div>
      <span className="font-mono font-bold tracking-tight text-studio-gold">
        {label}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-studio-muted">
        {subtitle}
      </span>
    </div>
  );
}
