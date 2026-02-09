/** Shared font style constants — avoids repetition across components */
export const MONO = {
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  letterSpacing: '-0.02em',
} as const;

export const SORA = {
  fontFamily: "'Sora', sans-serif",
} as const;

export const BODY_FONT = {
  fontFamily: "'Noto Sans KR', 'Sora', sans-serif",
} as const;

/**
 * Design token colors — mirrors CSS custom properties from global.css @theme.
 * Use these when inline styles need color values (e.g. SVG, Recharts, dynamic).
 * For static styles, prefer Tailwind classes (text-gold-400, bg-surface-card, etc.)
 */
export const COLORS = {
  // Gold spectrum
  gold300: '#fcd34d',
  gold400: '#e8b931',
  gold500: '#d4a017',
  gold600: '#b8860b',

  // Semantic
  earn: '#34d399',
  loss: '#fb7185',

  // Surface
  surfaceElevated: '#1e1e24',
  surfaceBorder: '#2a2a32',

  // Text
  textPrimary: '#ededf0',
  textSecondary: '#9898a3',
  textMuted: '#5c5c66',
} as const;

/** Convert hex color to rgba string */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
