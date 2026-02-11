export function ModeCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="rounded-xl p-4 text-left transition-all duration-200 cursor-pointer"
      style={{
        background: active
          ? "rgba(232,185,49,0.06)"
          : "var(--color-surface-base)",
        border: `1.5px solid ${active ? "rgba(232,185,49,0.3)" : "var(--color-surface-border)"}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color: active ? "#e8b931" : "#5c5c66" }}>{icon}</span>
        <span
          className="text-sm font-bold"
          style={{ color: active ? "#e8b931" : "#9898a3" }}
        >
          {title}
        </span>
      </div>
      <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
    </button>
  );
}
