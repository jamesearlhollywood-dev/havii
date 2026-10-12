// ============================================================================
// RISE USA LMS — Metric Card for Analytics Dashboards
// ============================================================================

export function MetricCard({
  label,
  value,
  sublabel,
  tone = "default",
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  tone?: "default" | "success" | "warning" | "navy";
}) {
  const valueColor =
    tone === "success"
      ? "text-rise-success"
      : tone === "warning"
      ? "text-rise-warning"
      : tone === "navy"
      ? "text-rise-navy"
      : "text-rise-navy";

  return (
    <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
      <p className="text-sm text-rise-muted">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${valueColor}`}>{value}</p>
      {sublabel && <p className="mt-0.5 text-xs text-rise-muted">{sublabel}</p>}
    </div>
  );
}
