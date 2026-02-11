export function PopupStat({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent: string;
  icon: React.ReactNode;
}) {
  const r = parseInt(accent.slice(1, 3), 16);
  const g = parseInt(accent.slice(3, 5), 16);
  const b = parseInt(accent.slice(5, 7), 16);
  return (
    <div
      className="card rounded-xl p-3"
      style={{ borderColor: `rgba(${r},${g},${b},0.1)` }}
    >
      <div
        className="flex items-center gap-1.5 mb-1.5"
        style={{ color: accent }}
      >
        {icon}
        <span className="text-xs font-bold tracking-wide">{label}</span>
      </div>
      <span
        className="text-base font-bold block"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "-0.02em",
          color: accent,
        }}
      >
        {value}
      </span>
    </div>
  );
}
