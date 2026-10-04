/**
 * PhotoPlaceholder — stands in for professional photography that will be
 * added later. Renders a warm, labeled gradient block sized by className.
 * Replace with real <Image /> / <img> when assets are available.
 */
export function PhotoPlaceholder({
  label,
  className = "",
  tone = "warm",
}: {
  label: string;
  className?: string;
  tone?: "warm" | "forest" | "navy" | "clay";
}) {
  const tones: Record<string, string> = {
    warm: "from-[#d9c4a9] via-[#e8d5b8] to-[#c9a87c]",
    forest: "from-[#4A7BAB] via-[#6B8EB5] to-[#2C5282]",
    navy: "from-[#1e293b] via-[#334155] to-[#0f172a]",
    clay: "from-[#D4A93E] via-[#E0BC5C] to-[#B8860B]",
  };
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${tones[tone]} ${className}`}
      role="img"
      aria-label={`Photography placeholder — ${label}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="opacity-50"
          aria-hidden
        >
          <rect x="3" y="5" width="18" height="14" rx="3" stroke="white" strokeWidth="1.5" />
          <circle cx="8.5" cy="10.5" r="1.5" fill="white" opacity="0.7" />
          <path d="m4 17 5-5 4 4 3-3 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="meta-label text-[0.625rem] text-white/80">{label}</span>
      </div>
    </div>
  );
}
