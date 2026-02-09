import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { DailyStats } from '../types';

interface StatsChartProps {
  dailyStatsMap: Record<string, DailyStats>;
}

export function StatsChart({ dailyStatsMap }: StatsChartProps) {
  const data = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const stats = dailyStatsMap[key];
    const dayLabel = `${date.getMonth() + 1}/${date.getDate()}`;
    return {
      name: dayLabel,
      집중: stats ? Math.round(stats.totalFocusTime / 60) : 0,
      산만: stats ? Math.round(stats.totalDistractTime / 60) : 0,
      획득: stats ? stats.earnedMoney : 0,
      손실: stats ? stats.lostMoney : 0,
    };
  });

  const tooltipStyle = {
    backgroundColor: '#1e1e24',
    border: '1px solid #2a2a32',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    padding: '8px 12px',
    fontSize: '11px',
  };

  const axis = {
    stroke: '#2a2a32',
    fontSize: 10,
    fontFamily: "'JetBrains Mono', monospace",
    fill: '#5c5c66',
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase mb-2 block" style={{ fontFamily: "'Sora', sans-serif" }}>
          시간 (분)
        </span>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={data} barCategoryGap="30%">
            <XAxis dataKey="name" {...axis} tickLine={false} axisLine={false} />
            <YAxis {...axis} tickLine={false} axisLine={false} width={28} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#ededf0', fontSize: '11px', fontWeight: 700 }} cursor={{ fill: 'rgba(232,185,49,0.03)' }} />
            <Bar dataKey="집중" fill="#e8b931" radius={[4, 4, 0, 0]} maxBarSize={18} />
            <Bar dataKey="산만" fill="#fb7185" radius={[4, 4, 0, 0]} maxBarSize={18} opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-px bg-surface-border" style={{ opacity: 0.4 }} />

      <div>
        <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase mb-2 block" style={{ fontFamily: "'Sora', sans-serif" }}>
          금액 (₩)
        </span>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={data} barCategoryGap="30%">
            <XAxis dataKey="name" {...axis} tickLine={false} axisLine={false} />
            <YAxis {...axis} tickLine={false} axisLine={false} width={36} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: '#ededf0', fontSize: '11px', fontWeight: 700 }}
              formatter={(value: number | string | undefined) => `₩${Number(value ?? 0).toLocaleString('ko-KR')}`}
              cursor={{ fill: 'rgba(52,211,153,0.03)' }}
            />
            <Bar dataKey="획득" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={18} />
            <Bar dataKey="손실" fill="#fb7185" radius={[4, 4, 0, 0]} maxBarSize={18} opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
