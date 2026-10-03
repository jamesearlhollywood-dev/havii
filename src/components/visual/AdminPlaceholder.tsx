import { Waveform } from "@/components/visual/Waveform";

/**
 * Placeholder for admin sections whose advanced functionality is built in
 * later steps. Shows the section heading and a clear "structure ready" note.
 */
export function AdminPlaceholder({
  title,
  description,
  columns,
}: {
  title: string;
  description: string;
  columns?: string[];
}) {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-studio-ink sm:text-3xl">
          {title}
        </h1>
        <p className="text-sm text-studio-muted">{description}</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-studio-line bg-studio-charcoal">
        <div className="border-b border-studio-line px-5 py-3">
          <p className="text-xs uppercase tracking-wide text-studio-muted">
            {title} table
          </p>
        </div>
        <div className="divide-y divide-studio-line">
          {(columns ?? ["—"]).map((col) => (
            <div
              key={col}
              className="flex items-center justify-between px-5 py-3 text-sm"
            >
              <span className="text-studio-muted">{col}</span>
              <span className="text-xs text-studio-muted/60">—</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Waveform bars={48} className="h-8 w-40 opacity-40" />
        <p className="text-xs text-studio-muted">
          Schema and navigation ready — data and forms arrive in the next step.
        </p>
      </div>
    </div>
  );
}
