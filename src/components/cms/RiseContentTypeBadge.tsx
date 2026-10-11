import { getRiseContentTypeMeta, type RiseContentType } from "@/data/cms-types";

export function RiseContentTypeBadge({
  type,
  size = "md",
}: {
  type: RiseContentType | string | null | undefined;
  size?: "sm" | "md";
}) {
  const meta = getRiseContentTypeMeta(type);
  if (!meta) return null;

  const sizeClasses = size === "sm"
    ? "px-2 py-0.5 text-[10px] gap-1"
    : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${sizeClasses} ${meta.color} ${meta.bgColor} ${meta.borderColor}`}
    >
      <span>{meta.icon}</span>
      <span>{meta.label}</span>
    </span>
  );
}
