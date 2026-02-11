export function SettingsSection({
  icon,
  title,
  children,
  goldIcon = true,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  goldIcon?: boolean;
  delay?: string;
}) {
  return (
    <section
      className="card rounded-xl p-5 animate-fade-in"
      style={delay ? { animationDelay: delay } : undefined}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <span className={goldIcon ? "text-gold-400" : ""}>{icon}</span>
        <h2
          className="text-sm font-bold"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
