export function NotificationToggle({
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between py-1 ${disabled ? "opacity-40" : ""}`}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {desc && <p className="text-xs text-text-muted mt-0.5">{desc}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className="relative flex-shrink-0 w-10 h-[22px] rounded-full transition-colors duration-200 cursor-pointer border-none"
        style={{
          background: checked
            ? "rgba(232,185,49,0.25)"
            : "var(--color-surface-elevated)",
          border: `1px solid ${checked ? "rgba(232,185,49,0.3)" : "var(--color-surface-border)"}`,
        }}
      >
        <span
          className="absolute top-[2px] w-4 h-4 rounded-full transition-all duration-200"
          style={{
            left: checked ? "20px" : "2px",
            background: checked ? "#e8b931" : "var(--color-text-muted)",
          }}
        />
      </button>
    </div>
  );
}
