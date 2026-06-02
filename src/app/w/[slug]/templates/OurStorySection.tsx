import type { ColorScheme } from '@/lib/templates'
import type { StoryMilestone } from './types'

type Props = {
  items: StoryMilestone[]
  colors: ColorScheme
}

export default function OurStorySection({ items, colors }: Props) {
  if (!items.length) return null

  return (
    <section className="py-12 px-4 max-w-md mx-auto">
      <p
        className="text-xs tracking-[0.3em] uppercase text-center mb-8"
        style={{ color: colors.textMuted }}
      >
        Perjalanan Cinta
      </p>
      <div className="relative">
        {/* vertical line */}
        <div
          className="absolute left-20 top-0 bottom-0 w-px"
          style={{ backgroundColor: colors.accent + '40' }}
        />
        <div className="space-y-8">
          {items.map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              {/* Date */}
              <div className="w-18 shrink-0 text-right" style={{ width: '4.5rem' }}>
                <span className="text-xs font-semibold leading-tight" style={{ color: colors.primary }}>
                  {item.date}
                </span>
              </div>
              {/* Dot */}
              <div className="shrink-0 mt-1 relative z-10">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              </div>
              {/* Content */}
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: colors.textDark }}>
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: colors.textMuted }}>
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
