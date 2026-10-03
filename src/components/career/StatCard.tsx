export function StatCard({
  label,
  value,
  icon,
  accent = "blue",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: "blue" | "amber" | "emerald" | "slate";
}) {
  const accents: Record<string, string> = {
    blue: "bg-blue-50 text-career-blue",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-career-slate">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${accents[accent]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-career-navy">{value}</p>
    </div>
  );
}
