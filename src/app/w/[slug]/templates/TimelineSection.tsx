import type { ColorScheme } from '@/lib/templates'
import type { TimelineItem } from './types'

type Props = {
  items: TimelineItem[]
  colors: ColorScheme
}

export default function TimelineSection({ items, colors }: Props) {
  if (!items.length) return null

  return (
    <section className="py-12 px-4 max-w-md mx-auto">
      <p
        className="text-xs tracking-[0.3em] uppercase text-center mb-8"
        style={{ color: colors.textMuted }}
      >
        Rundown Acara
      </p>
      <div className="relative">
        {/* vertical line */}
        <div
          className="absolute left-16 top-0 bottom-0 w-px"
          style={{ backgroundColor: colors.accent + '40' }}
        />
        <div className="space-y-6">
          {items.map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              {/* Time */}
              <div className="w-14 shrink-0 text-right">
                <span className="text-sm font-mono font-semibold" style={{ color: colors.primary }}>
                  {item.time}
                </span>
              </div>
              {/* Dot */}
              <div className="shrink-0 mt-1.5 relative z-10">
                <div
                  className="w-3 h-3 rounded-full border-2"
                  style={{ borderColor: colors.primary, backgroundColor: colors.bg }}
                />
              </div>
              {/* Content */}
              <div className="flex-1 pb-1">
                <p className="font-semibold text-sm" style={{ color: colors.textDark }}>
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
