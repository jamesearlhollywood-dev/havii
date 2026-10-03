/**
 * Decorative audio-waveform element. Renders a row of vertical bars whose
 * heights follow a smooth pseudo-random pattern — subtle, never animated
 * by default (pass `animated` to enable a gentle pulse).
 */
export function Waveform({
  bars = 48,
  className = "",
  animated = false,
}: {
  bars?: number;
  className?: string;
  animated?: boolean;
}) {
  // Deterministic height profile so it looks organic but stable.
  const heights = Array.from({ length: bars }, (_, i) => {
    const t = i / (bars - 1);
    const wave = Math.sin(t * Math.PI * 3) * 0.5 + 0.5;
    const detail = Math.sin(t * Math.PI * 11) * 0.18;
    return Math.max(0.12, Math.min(1, wave + detail + 0.15));
  });

  return (
    <div
      className={`flex items-center gap-[3px] ${className}`}
      aria-hidden="true"
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full bg-studio-gold/70 ${
            animated ? "animate-pulse" : ""
          }`}
          style={{ height: `${Math.round(h * 100)}%` }}
        />
      ))}
    </div>
  );
}
