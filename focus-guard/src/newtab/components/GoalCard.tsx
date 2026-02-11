import { MONO, hexToRgba } from "../../shared/utils/style";

export function GoalCard({
  icon,
  label,
  current,
  target,
  progress,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  current: string;
  target: string;
  progress: number;
  color: string;
}) {
  return (
    <div className="card card-interactive rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2" style={{ color }}>
          {icon}
          <span className="text-xs font-bold tracking-wide uppercase">
            {label}
          </span>
        </div>
        <span className="text-xs text-text-muted font-tnum" style={MONO}>
          {current} / {target}
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${hexToRgba(
              color,
              0.6,
            )}, ${color})`,
            boxShadow: `0 0 8px ${hexToRgba(color, 0.2)}`,
          }}
        />
      </div>
    </div>
  );
}
