import type { ColorScheme } from '@/lib/templates'

export function ElegantDivider({ colors }: { colors: ColorScheme }) {
  const c = colors.accent
  return (
    <svg viewBox="0 0 260 18" fill="none" className="w-full max-w-xs mx-auto" aria-hidden>
      <line x1="2" y1="9" x2="96" y2="9" stroke={c} strokeWidth="0.5" strokeDasharray="1 4" />
      <circle cx="104" cy="9" r="1.2" fill={c} opacity="0.5" />
      <circle cx="110" cy="9" r="1.8" fill={c} opacity="0.7" />
      <path d="M120 2 L128 9 L120 16 L112 9 Z" fill={c} />
      <path d="M120 5.5 L124.5 9 L120 12.5 L115.5 9 Z" fill="white" opacity="0.35" />
      <circle cx="130" cy="9" r="1.8" fill={c} opacity="0.7" />
      <circle cx="136" cy="9" r="1.2" fill={c} opacity="0.5" />
      <line x1="144" y1="9" x2="258" y2="9" stroke={c} strokeWidth="0.5" strokeDasharray="1 4" />
    </svg>
  )
}

export function FloralDivider({ colors }: { colors: ColorScheme }) {
  const c = colors.primary
  return (
    <svg viewBox="0 0 280 30" fill="none" className="w-full max-w-sm mx-auto" aria-hidden>
      <path d="M8 15 C50 15 80 10 112 15" stroke={c} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M272 15 C230 15 200 10 168 15" stroke={c} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M38 15 C36 8 30 6 26 10" stroke={c} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M72 15 C74 22 80 24 84 20" stroke={c} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M242 15 C244 8 250 6 254 10" stroke={c} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M208 15 C206 22 200 24 196 20" stroke={c} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="140" cy="9" rx="3.5" ry="6" fill={c} opacity="0.35" />
      <ellipse cx="140" cy="21" rx="3.5" ry="6" fill={c} opacity="0.35" />
      <ellipse cx="133" cy="15" rx="6" ry="3.5" fill={c} opacity="0.35" />
      <ellipse cx="147" cy="15" rx="6" ry="3.5" fill={c} opacity="0.35" />
      <ellipse cx="135" cy="10" rx="3" ry="4.5" fill={c} opacity="0.25" transform="rotate(-45 135 10)" />
      <ellipse cx="145" cy="10" rx="3" ry="4.5" fill={c} opacity="0.25" transform="rotate(45 145 10)" />
      <ellipse cx="135" cy="20" rx="3" ry="4.5" fill={c} opacity="0.25" transform="rotate(45 135 20)" />
      <ellipse cx="145" cy="20" rx="3" ry="4.5" fill={c} opacity="0.25" transform="rotate(-45 145 20)" />
      <circle cx="140" cy="15" r="4" fill={c} />
      <circle cx="140" cy="15" r="1.8" fill="white" opacity="0.5" />
    </svg>
  )
}

export function ModernDivider({ colors }: { colors: ColorScheme }) {
  const c = colors.primary
  return (
    <svg viewBox="0 0 200 10" fill="none" className="w-full max-w-xs mx-auto" aria-hidden>
      <line x1="0" y1="5" x2="80" y2="5" stroke={c} strokeWidth="2.5" strokeLinecap="square" />
      <rect x="87" y="1" width="8" height="8" transform="rotate(45 91 5)" fill={c} />
      <rect x="99" y="2.5" width="5" height="5" transform="rotate(45 101.5 5)" fill={c} opacity="0.4" />
      <line x1="110" y1="5" x2="200" y2="5" stroke={c} strokeWidth="2.5" strokeLinecap="square" />
    </svg>
  )
}

export function WeddingRings({ colors, size = 64 }: { colors: ColorScheme; size?: number }) {
  const c = colors.accent
  return (
    <svg width={size} height={Math.round(size * 0.55)} viewBox="0 0 64 35" fill="none" aria-hidden>
      <circle cx="22" cy="17.5" r="13.5" stroke={c} strokeWidth="2.2" />
      <circle cx="42" cy="17.5" r="13.5" stroke={c} strokeWidth="2.2" />
      <circle cx="22" cy="17.5" r="10" stroke={c} strokeWidth="0.5" opacity="0.2" />
      <circle cx="42" cy="17.5" r="10" stroke={c} strokeWidth="0.5" opacity="0.2" />
      <path d="M13.5 10.5 Q17 7.5 22 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      <path d="M33.5 10.5 Q37 7.5 42 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}
