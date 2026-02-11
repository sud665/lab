import { MONO, SORA } from "../../shared/utils/style";

export function ProgressArc({
  progress,
  hours,
  minutes,
  goalHours,
}: {
  progress: number;
  hours: number;
  minutes: number;
  goalHours: number;
}) {
  const size = 180;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const startAngle = 135;
  const sweepAngle = 270;
  const endAngle = startAngle + sweepAngle;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcPath = (startDeg: number, endDeg: number) => {
    const x1 = center + radius * Math.cos(toRad(startDeg));
    const y1 = center + radius * Math.sin(toRad(startDeg));
    const x2 = center + radius * Math.cos(toRad(endDeg));
    const y2 = center + radius * Math.sin(toRad(endDeg));
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const trackPath = arcPath(startAngle, endAngle);
  const fillEndAngle = startAngle + sweepAngle * Math.min(progress, 1);
  const fillPath = progress > 0.005 ? arcPath(startAngle, fillEndAngle) : "";

  const pct = Math.round(progress * 100);
  const gradientId = "arc-gold-gradient";

  return (
    <div
      className="relative animate-arc-glow"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`일일 목표 진행률 ${pct}%`}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="block"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="50%" stopColor="#e8b931" />
            <stop offset="100%" stopColor="#d4a017" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ animation: "arc-breathe 4s ease-in-out infinite" }}
        />

        {/* Fill */}
        {fillPath && (
          <path
            d={fillPath}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        )}
      </svg>

      {/* Center text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingBottom: 8 }}
      >
        <span
          className="text-3xl font-bold text-gold-gradient leading-none font-tnum"
          style={SORA}
        >
          {pct}%
        </span>
        <span className="text-xs text-text-muted mt-1 font-tnum" style={MONO}>
          {hours}h {minutes}m / {goalHours}h
        </span>
      </div>
    </div>
  );
}
