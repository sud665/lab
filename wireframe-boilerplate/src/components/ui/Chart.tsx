"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export type ChartType = "bar" | "line" | "pie";

export interface ChartProps {
  type: ChartType;
  data: ChartDataPoint[];
  width?: number | string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
}

// Grayscale color palette for charts
const GRAYSCALE_COLORS = [
  "#ffffff",
  "#a3a3a3",
  "#737373",
  "#525252",
  "#404040",
  "#262626",
];

// Custom tooltip component
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: ChartDataPoint }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-lg">
      <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
      <p className="text-sm text-[var(--text-secondary)]">
        Value: {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export function Chart({
  type,
  data,
  width = "100%",
  height = 300,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  xAxisLabel,
  yAxisLabel,
  className,
}: ChartProps) {
  // Assign colors to data points
  const coloredData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      color: item.color || GRAYSCALE_COLORS[index % GRAYSCALE_COLORS.length],
    }));
  }, [data]);

  const commonAxisProps = {
    tick: { fill: "var(--text-muted)", fontSize: 12 },
    axisLine: { stroke: "var(--border-default)" },
    tickLine: { stroke: "var(--border-default)" },
  };

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart data={coloredData}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-default)"
                opacity={0.5}
              />
            )}
            <XAxis
              dataKey="name"
              {...commonAxisProps}
              label={
                xAxisLabel
                  ? {
                      value: xAxisLabel,
                      position: "insideBottom",
                      offset: -5,
                      fill: "var(--text-muted)",
                    }
                  : undefined
              }
            />
            <YAxis
              {...commonAxisProps}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                      fill: "var(--text-muted)",
                    }
                  : undefined
              }
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && (
              <Legend
                wrapperStyle={{ color: "var(--text-secondary)" }}
                formatter={(value) => (
                  <span style={{ color: "var(--text-secondary)" }}>{value}</span>
                )}
              />
            )}
            <Bar dataKey="value" name="Value" radius={[4, 4, 0, 0]}>
              {coloredData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={coloredData}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-default)"
                opacity={0.5}
              />
            )}
            <XAxis
              dataKey="name"
              {...commonAxisProps}
              label={
                xAxisLabel
                  ? {
                      value: xAxisLabel,
                      position: "insideBottom",
                      offset: -5,
                      fill: "var(--text-muted)",
                    }
                  : undefined
              }
            />
            <YAxis
              {...commonAxisProps}
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: "insideLeft",
                      fill: "var(--text-muted)",
                    }
                  : undefined
              }
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && (
              <Legend
                wrapperStyle={{ color: "var(--text-secondary)" }}
                formatter={(value) => (
                  <span style={{ color: "var(--text-secondary)" }}>{value}</span>
                )}
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              name="Value"
              stroke="#ffffff"
              strokeWidth={2}
              dot={{ fill: "#ffffff", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#ffffff" }}
            />
          </LineChart>
        );

      case "pie":
        return (
          <PieChart>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && (
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value) => (
                  <span style={{ color: "var(--text-secondary)" }}>{value}</span>
                )}
              />
            )}
            <Pie
              data={coloredData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
              }
              labelLine={{ stroke: "var(--text-muted)" }}
            >
              {coloredData.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="var(--bg-primary)" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn("w-full", className)}
      style={{ width, height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

// Preset chart configurations
export function BarChartPreset(props: Omit<ChartProps, "type">) {
  return <Chart {...props} type="bar" />;
}

export function LineChartPreset(props: Omit<ChartProps, "type">) {
  return <Chart {...props} type="line" />;
}

export function PieChartPreset(props: Omit<ChartProps, "type">) {
  return <Chart {...props} type="pie" />;
}
