import { HTMLAttributes } from "react";

type Tone = "info" | "success" | "warning" | "error";

const tones: Record<Tone, string> = {
  info: "bg-rise-sky text-rise-navy border-rise-blue-light",
  success: "bg-rise-success-light text-rise-success border-rise-success/30",
  warning: "bg-rise-warning-light text-rise-warning border-rise-warning/30",
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
