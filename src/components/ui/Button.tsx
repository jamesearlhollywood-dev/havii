import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline" | "success";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-rise-navy text-white hover:bg-rise-navy-light focus-visible:ring-rise-blue shadow-sm",
  secondary:
    "bg-rise-red text-white hover:bg-rise-red-dark focus-visible:ring-rise-red shadow-sm",
  ghost:
    "bg-transparent text-rise-navy hover:bg-rise-sky focus-visible:ring-rise-blue",
  outline:
    "border border-rise-border bg-white text-rise-navy hover:bg-rise-sky focus-visible:ring-rise-blue",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  success:
    "bg-rise-success text-white hover:bg-rise-success/90 focus-visible:ring-rise-success shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className = "",
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />
        ) : null}
        {children}
      </button>
    );
  }
);
