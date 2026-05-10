export const colors = {
  bg: {
    base: '#000000',
    surface: '#0e0e0e',
    elevated: '#181818',
    card: '#1a1a1a',
    pill: '#1f1f1f',
  },
  text: {
    primary: '#ffffff',
    secondary: '#c8c8c8',
    tertiary: '#8a8a8a',
    onAccent: '#000000',
  },
  border: {
    subtle: 'rgba(255,255,255,0.08)',
    default: 'rgba(255,255,255,0.14)',
    strong: 'rgba(255,255,255,0.24)',
  },
  accent: {
    solid: '#22c55e',
    glass: 'rgba(34,197,94,0.18)',
    glassBorder: 'rgba(34,197,94,0.35)',
    soft: 'rgba(34,197,94,0.12)',
  },
  price: {
    up: '#22c55e',
    down: '#ef4444',
    flat: '#8a8a8a',
  },
  source: {
    hk: '#a78bfa',
    mk: '#60a5fa',
    cb: '#fbbf24',
  },
} as const;

export type SourceKey = keyof typeof colors.source;
