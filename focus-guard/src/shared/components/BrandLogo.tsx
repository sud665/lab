export function BrandLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
        fill="rgba(232,185,49,0.12)"
        stroke="#e8b931"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11.5" r="4" stroke="#e8b931" strokeWidth="1.2" fill="none" />
      <line x1="12" y1="11.5" x2="12" y2="9" stroke="#e8b931" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="12" y1="11.5" x2="14" y2="12.5" stroke="#e8b931" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
