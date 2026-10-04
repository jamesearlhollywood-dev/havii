/**
 * PubCover — a stylized publication cover plate rendered to evoke a
 * university research-center or policy-institute report cover.
 * Replaces real cover art until assets are provided.
 */
export function PubCover({
  type,
  title,
  className = "",
  tone = "navy",
}: {
  type: string;
  title: string;
  className?: string;
  tone?: "navy" | "blue" | "gold";
}) {
  const tones: Record<string, string> = {
    navy: "bg-tfy-navy text-tfy-parchment",
    blue: "bg-tfy-blue text-tfy-parchment",
    gold: "bg-tfy-gold text-tfy-navy",
  };
  const rule: Record<string, string> = {
    navy: "bg-tfy-gold",
    blue: "bg-tfy-gold-light",
    gold: "bg-tfy-navy",
  };
  const mark: Record<string, string> = {
    navy: "bg-tfy-gold text-tfy-navy",
    blue: "bg-tfy-gold text-tfy-navy",
    gold: "bg-tfy-navy text-tfy-gold",
  };

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-lg p-5 ${tones[tone]} ${className}`}
      role="img"
      aria-label={`Publication cover placeholder — ${type}: ${title}`}
    >
      {/* Top: TFY mark */}
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-md text-[0.625rem] font-semibold tracking-tight ${mark[tone]}`}
        >
          TFY
        </span>
        <span className="meta-label text-[0.5625rem] opacity-70">
          Together For You, Inc.
        </span>
      </div>

      {/* Middle: type + rule + title */}
      <div className="mt-auto">
        <div className={`mb-3 h-px w-10 ${rule[tone]}`} />
        <p className="meta-label text-[0.5625rem] opacity-70">{type}</p>
        <p className="mt-2 font-display text-base leading-snug">{title}</p>
      </div>
    </div>
  );
}
