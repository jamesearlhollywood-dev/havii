import { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-rise-border bg-white p-5 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-semibold text-rise-navy ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`mt-1 text-sm text-rise-muted ${className}`} {...props}>
      {children}
    </p>
  );
}

export function ComingNextBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-rise-blue/10 px-2.5 py-0.5 text-xs font-medium text-rise-blue">
      Coming Next
    </span>
  );
}
