'use client'

import { useEffect, useState } from 'react'
import type { ColorScheme } from '@/lib/templates'

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function calc(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function pad(n: number) { return String(n).padStart(2, '0') }

export default function CountdownTimer({ date, colors }: { date: string; colors: ColorScheme }) {
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    const target = new Date(date)
    setTime(calc(target))
    const id = setInterval(() => setTime(calc(target)), 1000)
    return () => clearInterval(id)
  }, [date])

  if (!time) return null

  const isPast = Object.values(time).every((v) => v === 0)

  if (isPast) {
    return (
      <p className="text-center text-sm font-medium" style={{ color: colors.primary }}>
        🎉 Hari yang ditunggu telah tiba!
      </p>
    )
  }

  const items = [
    { label: 'Hari', value: time.days },
    { label: 'Jam', value: time.hours },
    { label: 'Menit', value: time.minutes },
    { label: 'Detik', value: time.seconds },
  ]

  return (
    <div className="flex justify-center gap-3">
      {items.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div
            className="rounded-xl px-3 py-2 min-w-[3rem] font-mono text-2xl font-bold tabular-nums"
            style={{ backgroundColor: colors.primaryLight, color: colors.textDark }}
          >
            {label === 'Hari' ? value : pad(value)}
          </div>
          <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{label}</p>
        </div>
      ))}
    </div>
  )
}
