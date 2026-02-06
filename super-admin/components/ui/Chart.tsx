'use client'

import {
  AreaChart,
  Area,
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
  ResponsiveContainer,
  Legend,
} from 'recharts'

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

interface ChartData {
  name: string
  [key: string]: string | number
}

interface ChartProps {
  type: 'area' | 'bar' | 'line' | 'pie'
  data: ChartData[]
  dataKey?: string
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  colors?: string[]
}

export function Chart({
  type,
  data,
  dataKey = 'value',
  height = 300,
  showLegend = false,
  showGrid = true,
  colors = COLORS,
}: ChartProps) {
  const tooltipStyle = {
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
  }

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />}
          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
          <YAxis stroke="var(--text-muted)" fontSize={12} />
          <Tooltip contentStyle={tooltipStyle} />
          {showLegend && <Legend />}
          <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />}
          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
          <YAxis stroke="var(--text-muted)" fontSize={12} />
          <Tooltip contentStyle={tooltipStyle} />
          {showLegend && <Legend />}
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey={dataKey} stroke={colors[0]} fill="url(#colorValue)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />}
        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
        <YAxis stroke="var(--text-muted)" fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        {showLegend && <Legend />}
        <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface MultiLineChartProps {
  data: ChartData[]
  lines: { dataKey: string; name: string; color?: string }[]
  height?: number
  showLegend?: boolean
}

export function MultiLineChart({ data, lines, height = 300, showLegend = true }: MultiLineChartProps) {
  const tooltipStyle = {
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
        <YAxis stroke="var(--text-muted)" fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        {showLegend && <Legend />}
        {lines.map((line, i) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color || COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
