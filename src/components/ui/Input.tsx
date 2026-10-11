import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", label, error, hint, id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-rise-navy">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-rise-navy placeholder:text-rise-muted shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rise-blue focus-visible:border-rise-blue ${
          error ? "border-red-400" : "border-rise-border"
        } ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error ? (
        <p id={`${inputId}-hint`} className="text-xs text-rise-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
