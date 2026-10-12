// ============================================================================
// RISE USA LMS — Simple SVG Chart Components
// ============================================================================

import type { TimeSeriesPoint } from "@/lib/types";

// ---------------------------------------------------------------------------
// Bar Chart (horizontal)
// ---------------------------------------------------------------------------
export function BarChart({
  data,
  color = "var(--rise-navy)",
  height = 200,
  max,
  unit = "",
}: {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  max?: number;
  unit?: string;
}) {
  const maxValue = max ?? Math.max(...data.map((d) => d.value), 1);
  const barHeight = Math.max(8, Math.floor(height / data.length) - 6);

  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-32 shrink-0 truncate text-xs text-rise-muted">
            {d.label}
          </div>
          <div className="relative flex-1">
            <div
              className="rounded-full transition-all"
              style={{
                width: `${(d.value / maxValue) * 100}%`,
                height: `${barHeight}px`,
                backgroundColor: color,
                minWidth: d.value > 0 ? "4px" : "0",
              }}
            />
          </div>
          <div className="w-16 shrink-0 text-right text-xs font-semibold text-rise-navy">
            {d.value}{unit}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vertical Bar Chart (for time series)
// ---------------------------------------------------------------------------
export function VerticalBarChart({
  data,
  color = "var(--rise-blue)",
  height = 180,
  unit = "",
}: {
  data: TimeSeriesPoint[];
  color?: string;
  height?: number;
  unit?: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div>
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((d, i) => (
          <div
            key={i}
            className="group relative flex flex-1 flex-col items-center justify-end"
            style={{ minWidth: `${barWidth}%` }}
          >
            <div
              className="absolute -top-5 rounded px-1 text-[10px] font-semibold text-rise-navy opacity-0 transition-opacity group-hover:opacity-100"
            >
              {d.value}{unit}
            </div>
            <div
              className="w-full max-w-[28px] rounded-t-md transition-all"
              style={{
                height: `${(d.value / maxValue) * (height - 30)}px`,
                backgroundColor: color,
                minHeight: d.value > 0 ? "2px" : "0",
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 truncate text-center text-[9px] text-rise-muted"
            style={{ minWidth: `${barWidth}%` }}
          >
            {d.label.split(" ").slice(-1)[0]}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Line Chart (SVG-based)
// ---------------------------------------------------------------------------
export function LineChart({
  data,
  color = "var(--rise-blue-dark)",
  height = 180,
  width = 600,
  unit = "",
}: {
  data: TimeSeriesPoint[];
  color?: string;
  height?: number;
  width?: number;
  unit?: string;
}) {
  if (data.length === 0) return null;

  const padding = { top: 10, right: 10, bottom: 25, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1 || 1)) * chartW;
    const y = padding.top + chartH - ((d.value - minValue) / range) * chartH;
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${padding.top + chartH}` +
    ` L ${points[0].x} ${padding.top + chartH} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ maxHeight: height }}
    >
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = padding.top + chartH - t * chartH;
        const val = Math.round(minValue + t * range);
        return (
          <g key={t}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="var(--rise-border)"
              strokeWidth="1"
            />
            <text
              x={padding.left - 5}
              y={y + 3}
              textAnchor="end"
              className="fill-rise-muted"
              style={{ fontSize: 9 }}
            >
              {val}{unit}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaD} fill={color} opacity="0.1" />

      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" />

      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill={color} />
          <text
            x={p.x}
            y={height - 8}
            textAnchor="middle"
            className="fill-rise-muted"
            style={{ fontSize: 8 }}
          >
            {p.label.split(" ").slice(-1)[0]}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Progress Ring (circular gauge)
// ---------------------------------------------------------------------------
export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  color = "var(--rise-navy)",
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--rise-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="-mt-[calc(50%+8px)] flex flex-col items-center" style={{ marginTop: `-${size / 2 + 4}px` }}>
        <span className="text-2xl font-bold text-rise-navy">{label ?? `${value}%`}</span>
        {sublabel && <span className="text-xs text-rise-muted">{sublabel}</span>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Comparison Bar (pre vs post)
// ---------------------------------------------------------------------------
export function ComparisonBar({
  label,
  preValue,
  postValue,
  max = 5,
}: {
  label: string;
  preValue: number;
  postValue: number;
  max?: number;
}) {
  const preWidth = (preValue / max) * 100;
  const postWidth = (postValue / max) * 100;
  const change = postValue - preValue;
  const isPositive = change > 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-rise-navy">{label}</span>
        <span className={`font-semibold ${isPositive ? "text-rise-success" : change < 0 ? "text-rise-red" : "text-rise-muted"}`}>
          {change > 0 ? "+" : ""}{change.toFixed(1)}
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-8 shrink-0 text-[10px] text-rise-muted">Pre</span>
          <div className="relative h-4 flex-1 rounded-full bg-rise-sky">
            <div
              className="h-full rounded-full bg-rise-blue-light"
              style={{ width: `${preWidth}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-[10px] font-medium text-rise-muted">{preValue.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-8 shrink-0 text-[10px] text-rise-muted">Post</span>
          <div className="relative h-4 flex-1 rounded-full bg-rise-sky">
            <div
              className="h-full rounded-full bg-rise-blue-dark"
              style={{ width: `${postWidth}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-[10px] font-medium text-rise-navy">{postValue.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
