import { TextareaHTMLAttributes, forwardRef } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className = "", label, error, hint, id, ...props }, ref) {
    const inputId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label ? (
          <label htmlFor={inputId} className="block text-sm font-medium text-studio-ink">
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border bg-studio-surface px-3.5 py-2.5 text-studio-ink placeholder:text-studio-muted shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-studio-gold focus-visible:border-studio-gold min-h-[100px] ${
            error ? "border-red-400" : "border-studio-line"
          } ${className}`}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {hint && !error ? (
          <p className="text-xs text-studio-muted">{hint}</p>
        ) : null}
        {error ? (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);
