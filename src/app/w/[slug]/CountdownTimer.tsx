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

const LABELS = ['Hari', 'Jam', 'Menit', 'Detik'] as const

export default function CountdownTimer({ date, colors }: { date: string; colors: ColorScheme }) {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date(date)

    const update = () => {
      const t = calc(target)
      setTime(t)
    }

    update()
    setMounted(true)
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [date])

  const skeleton = (
    <div className="flex justify-center gap-3">
      {LABELS.map((label) => (
        <div key={label} className="text-center">
          <div
            className="rounded-xl px-3 py-2 min-w-12 text-2xl font-bold tabular-nums"
            style={{ backgroundColor: colors.primaryLight, color: colors.textDark + '40' }}
          >
            --
          </div>
          <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{label}</p>
        </div>
      ))}
    </div>
  )

  if (!mounted) return skeleton

  const isPast = time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0

  if (isPast) {
    return (
      <p className="text-center font-semibold" style={{ color: colors.primary }}>
        🎉 Hari yang ditunggu telah tiba!
      </p>
    )
  }

  const values = [time.days, time.hours, time.minutes, time.seconds]

  return (
    <div className="flex justify-center gap-3">
      {LABELS.map((label, i) => (
        <div key={label} className="text-center">
          <div
            className="rounded-xl px-3 py-2 min-w-12 font-mono text-2xl font-bold tabular-nums"
            style={{ backgroundColor: colors.primaryLight, color: colors.textDark }}
          >
            {i === 0 ? values[i] : pad(values[i])}
          </div>
          <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{label}</p>
        </div>
      ))}
    </div>
  )
}
