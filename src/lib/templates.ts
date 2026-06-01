export const TEMPLATES = {
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Klasik & romantis',
    icon: '🌸',
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Bersih & minimalis',
    icon: '◆',
  },
  floral: {
    id: 'floral',
    name: 'Floral',
    description: 'Natural & botanical',
    icon: '🌿',
  },
} as const

export type TemplateId = keyof typeof TEMPLATES

export const COLOR_SCHEMES = {
  blush: {
    id: 'blush',
    name: 'Blush Pink',
    swatch: '#fda4af',
    primary: '#e11d48',
    primaryLight: '#ffe4e6',
    accent: '#fb7185',
    bg: '#fff1f2',
    textDark: '#4c0519',
    textMuted: '#9f1239',
  },
  sage: {
    id: 'sage',
    name: 'Sage Green',
    swatch: '#6ee7b7',
    primary: '#059669',
    primaryLight: '#d1fae5',
    accent: '#34d399',
    bg: '#ecfdf5',
    textDark: '#064e3b',
    textMuted: '#065f46',
  },
  navy: {
    id: 'navy',
    name: 'Navy Blue',
    swatch: '#93c5fd',
    primary: '#1d4ed8',
    primaryLight: '#dbeafe',
    accent: '#60a5fa',
    bg: '#eff6ff',
    textDark: '#1e3a8a',
    textMuted: '#1d4ed8',
  },
  gold: {
    id: 'gold',
    name: 'Champagne',
    swatch: '#fbbf24',
    primary: '#b45309',
    primaryLight: '#fef3c7',
    accent: '#f59e0b',
    bg: '#fffbeb',
    textDark: '#78350f',
    textMuted: '#92400e',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    swatch: '#c4b5fd',
    primary: '#7c3aed',
    primaryLight: '#ede9fe',
    accent: '#a78bfa',
    bg: '#f5f3ff',
    textDark: '#3b0764',
    textMuted: '#5b21b6',
  },
} as const

export type ColorSchemeId = keyof typeof COLOR_SCHEMES
export type ColorScheme = (typeof COLOR_SCHEMES)[ColorSchemeId]

export function getTemplate(id: string): TemplateId {
  return (id in TEMPLATES ? id : 'elegant') as TemplateId
}

export function getColorScheme(id: string): ColorScheme {
  return COLOR_SCHEMES[(id in COLOR_SCHEMES ? id : 'blush') as ColorSchemeId]
}
