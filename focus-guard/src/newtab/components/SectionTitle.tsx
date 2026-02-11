export function SectionTitle({
  icon,
  text,
  compact,
}: {
  icon: React.ReactNode;
  text: string;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "mb-3"}`}>
      <span className="text-gold-400">{icon}</span>
      <h3 className="section-label">{text}</h3>
    </div>
  );
}
