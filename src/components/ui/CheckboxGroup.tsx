"use client";

export function CheckboxGroup({
  legend,
  options,
  values,
  onChange,
  name,
}: {
  legend: string;
  name: string;
  options: { value: string; label: string }[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-havii-ink">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const id = `${name}-${opt.value}`;
          const checked = values.includes(opt.value);
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                checked
                  ? "border-havii-teal bg-havii-teal/5 text-havii-ink"
                  : "border-havii-mist bg-white text-havii-muted hover:border-havii-teal/40"
              }`}
            >
              <input
                id={id}
                type="checkbox"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => toggle(opt.value)}
                className="h-4 w-4 rounded border-havii-mist text-havii-teal focus:ring-havii-teal"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
