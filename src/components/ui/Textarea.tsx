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
          <label htmlFor={inputId} className="block text-sm font-medium text-havii-ink">
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-havii-ink placeholder:text-havii-muted shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-havii-teal focus-visible:border-havii-teal min-h-[100px] ${
            error ? "border-red-400" : "border-havii-mist"
          } ${className}`}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {hint && !error ? (
          <p className="text-xs text-havii-muted">{hint}</p>
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
