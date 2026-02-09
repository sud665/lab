/** Skeleton UI building blocks — dark theme with pulse animation */

const pulseStyle = {
  background: 'var(--color-surface-elevated)',
  animation: 'skeleton-pulse 1.8s ease-in-out infinite',
} as const;

export function SkeletonLine({ width = '100%', height = 14 }: { width?: string | number; height?: number }) {
  return <div style={{ ...pulseStyle, width, height, borderRadius: 6 }} />;
}

export function SkeletonCircle({ size = 40 }: { size?: number }) {
  return <div style={{ ...pulseStyle, width: size, height: size, borderRadius: '50%' }} />;
}

export function SkeletonCard({ height = 80 }: { height?: number }) {
  return (
    <div
      className="card rounded-xl"
      style={{ ...pulseStyle, height, border: '1px solid var(--color-surface-border)' }}
    />
  );
}

/** Dashboard full-page skeleton */
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-surface-deep text-text-primary" style={{ fontFamily: "'Noto Sans KR', 'Sora', sans-serif" }}>
      <div className="max-w-[1080px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SkeletonCircle size={10} />
            <SkeletonLine width={100} height={13} />
          </div>
          <SkeletonCircle size={36} />
        </div>

        {/* Hero */}
        <SkeletonCard height={200} />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5">
          <div className="lg:col-span-3 space-y-3">
            <SkeletonLine width={80} height={11} />
            <SkeletonCard height={56} />
            <SkeletonCard height={56} />
            <SkeletonCard height={56} />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <SkeletonCard height={160} />
            <SkeletonCard height={180} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Popup compact skeleton */
export function PopupSkeleton() {
  return (
    <div className="w-[360px] bg-surface-deep text-text-primary" style={{ fontFamily: "'Noto Sans KR', 'Sora', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <SkeletonCircle size={8} />
          <SkeletonLine width={90} height={12} />
        </div>
        <SkeletonLine width={50} height={13} />
      </div>

      <div className="px-4 pb-4 space-y-3">
        {/* Task card */}
        <SkeletonCard height={120} />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <SkeletonCard height={70} />
          <SkeletonCard height={70} />
          <SkeletonCard height={70} />
          <SkeletonCard height={70} />
        </div>

        {/* Mode */}
        <SkeletonCard height={72} />
        {/* Hourly rate */}
        <SkeletonCard height={72} />
      </div>
    </div>
  );
}
