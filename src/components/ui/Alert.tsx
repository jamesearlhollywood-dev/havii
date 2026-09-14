import { HTMLAttributes } from "react";

type Tone = "info" | "success" | "warning" | "error";

const tones: Record<Tone, string> = {
  info: "bg-sky-50 text-sky-900 border-sky-200",
  success: "bg-emerald-50 text-emerald-900 border-emerald-200",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
  error: "bg-red-50 text-red-900 border-red-200",
};

export function Alert({
  tone = "info",
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: Tone }) {
  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
