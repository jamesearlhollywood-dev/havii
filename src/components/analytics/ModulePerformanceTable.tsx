import type { ModulePerformance } from "@/lib/types";
import { BarChart } from "./Charts";

export function ModulePerformanceTable({
  modules,
}: {
  modules: ModulePerformance[];
}) {
  return (
    <div className="space-y-6">
      {/* Chart: avg KC score by module */}
      <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-rise-navy">
          Average Knowledge Check Score by Module
        </h3>
        <BarChart
          data={modules.map((m) => ({
            label: `M${m.module_number}`,
            value: m.avg_knowledge_check_score,
            unit: "%",
          }))}
          color="var(--rise-blue-dark)"
          max={100}
        />
      </div>

      {/* Chart: pass rate by module */}
      <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-rise-navy">
          Pass Rate by Module
        </h3>
        <BarChart
          data={modules.map((m) => ({
            label: `M${m.module_number}`,
            value: m.pass_rate,
            unit: "%",
          }))}
          color="var(--rise-success)"
          max={100}
        />
      </div>

      {/* Chart: avg attempts by module */}
      <div className="rounded-2xl border border-rise-border bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-rise-navy">
          Average Attempts by Module
        </h3>
        <BarChart
          data={modules.map((m) => ({
            label: `M${m.module_number}`,
            value: m.avg_attempts,
          }))}
          color="var(--rise-gold)"
        />
      </div>

      {/* Detailed table */}
      <div className="overflow-x-auto rounded-2xl border border-rise-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-rise-navy text-white">
              <th className="px-4 py-3 text-left font-medium">Module</th>
              <th className="px-4 py-3 text-center font-medium">Avg KC Score</th>
              <th className="px-4 py-3 text-center font-medium">Pass Rate</th>
              <th className="px-4 py-3 text-center font-medium">Avg Attempts</th>
              <th className="px-4 py-3 text-left font-medium">Most Missed Topics</th>
              <th className="px-4 py-3 text-left font-medium">Strongest Topics</th>
              <th className="px-4 py-3 text-left font-medium">Needs Reinforcement</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => (
              <tr key={m.module_id} className="border-t border-rise-border">
                <td className="px-4 py-3">
                  <span className="font-medium text-rise-navy">M{m.module_number}</span>
                  <span className="block text-xs text-rise-muted">{m.module_title.split("—")[0]}</span>
                </td>
                <td className="px-4 py-3 text-center font-semibold text-rise-navy">
                  {m.avg_knowledge_check_score}%
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    m.pass_rate >= 70 ? "bg-rise-success-light text-rise-success" : "bg-rise-warning-light text-rise-warning"
                  }`}>
                    {m.pass_rate}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-rise-navy">{m.avg_attempts}</td>
                <td className="px-4 py-3">
                  <ul className="space-y-0.5 text-xs text-rise-muted">
                    {m.most_missed_topics.map((t, i) => (
                      <li key={i}>• {t}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3">
                  <ul className="space-y-0.5 text-xs text-rise-success">
                    {m.strongest_topics.map((t, i) => (
                      <li key={i}>• {t}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3">
                  <ul className="space-y-0.5 text-xs text-rise-warning">
                    {m.needs_reinforcement.map((t, i) => (
                      <li key={i}>• {t}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
