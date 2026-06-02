'use client'

import { useMemo } from 'react'
import type { ColorScheme } from '@/lib/templates'

export type ParticleVariant = 'elegant' | 'modern' | 'floral'

interface P {
  id: number
  left: number
  delay: number
  duration: number
  size: number
}

function gen(count: number, minDur: number, maxDur: number, minSize: number, maxSize: number): P[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 16,
    duration: minDur + Math.random() * (maxDur - minDur),
    size: minSize + Math.random() * (maxSize - minSize),
  }))
}

export default function Particles({ variant, colors }: { variant: ParticleVariant; colors: ColorScheme }) {
  const particles = useMemo(() => {
    if (variant === 'elegant') return gen(18, 10, 18, 5, 11)
    if (variant === 'modern') return gen(14, 5, 10, 4, 9)
    return gen(20, 12, 22, 6, 14)
  }, [variant]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      aria-hidden
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}
    >
      <style>{`
        @keyframes ptcl-elegant {
          0%   { transform: translateY(-30px) rotate(0deg);   opacity: 0; }
          8%   { opacity: 0.55; }
          92%  { opacity: 0.25; }
          100% { transform: translateY(106vh) rotate(200deg); opacity: 0; }
        }
        @keyframes ptcl-modern {
          0%   { transform: translateY(-20px) rotate(0deg) scale(1);    opacity: 0; }
          8%   { opacity: 0.5; }
          92%  { opacity: 0.15; }
          100% { transform: translateY(106vh) rotate(400deg) scale(0.4); opacity: 0; }
        }
        @keyframes ptcl-floral {
          0%   { transform: translateY(-20px) translateX(0px)  rotate(0deg);   opacity: 0; }
          8%   { opacity: 0.55; }
          35%  { transform: translateY(35vh)  translateX(18px)  rotate(90deg); }
          65%  { transform: translateY(65vh)  translateX(-12px) rotate(190deg); }
          92%  { opacity: 0.25; }
          100% { transform: translateY(106vh) translateX(6px)  rotate(270deg); opacity: 0; }
        }
      `}</style>

      {particles.map((p) => {
        const base: React.CSSProperties = {
          position: 'absolute',
          left: `${p.left}%`,
          top: 0,
          opacity: 0,
          willChange: 'transform, opacity',
          animation: `ptcl-${variant} ${p.duration}s linear ${p.delay}s infinite`,
        }

        /* ── Elegant: ✦ gold sparkles ─────────────────────────────── */
        if (variant === 'elegant') return (
          <span key={p.id} style={{ ...base, fontSize: `${p.size}px`, color: colors.accent, fontFamily: 'serif', lineHeight: 1 }}>
            ✦
          </span>
        )

        /* ── Modern: rotating diamond squares ────────────────────── */
        if (variant === 'modern') return (
          <div key={p.id} style={{
            ...base,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: colors.primary,
            opacity: 0,
          }} />
        )

        /* ── Floral: oval petals with sway ───────────────────────── */
        return (
          <div key={p.id} style={{
            ...base,
            width: `${p.size * 1.7}px`,
            height: `${p.size}px`,
            backgroundColor: colors.primary,
            borderRadius: '50% 0 50% 0',
            opacity: 0,
          }} />
        )
      })}
    </div>
  )
}
