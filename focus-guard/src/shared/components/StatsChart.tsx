import { Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DailyStats } from '../types';

interface StatsChartProps {
  dailyStatsMap: Record<string, DailyStats>;
}

export function StatsChart({ dailyStatsMap }: StatsChartProps) {
  // 최근 7일 데이터 생성
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

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>시간 (분)</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#ffffff' }}
            />
            <Legend />
            <Bar dataKey="집중" fill="#FFD700" radius={[4, 4, 0, 0]} />
            <Bar dataKey="산만" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>금액 (₩)</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#ffffff' }}
              formatter={(value) => `₩${Number(value).toLocaleString('ko-KR')}`}
            />
            <Legend />
            <Bar dataKey="획득" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="손실" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
