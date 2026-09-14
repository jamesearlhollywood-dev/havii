import { SelectHTMLAttributes, forwardRef } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className = "", label, error, id, options, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-havii-ink">
          {label}
        </label>
      ) : null}
      <select
        ref={ref}
        id={inputId}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-havii-ink shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-havii-teal ${
          error ? "border-red-400" : "border-havii-mist"
        } ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
