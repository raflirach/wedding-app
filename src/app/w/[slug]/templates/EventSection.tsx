import type { ColorScheme } from '@/lib/templates'

type Props = {
  label: string
  date: string | null
  time: string | null
  venueName: string | null
  venueAddress: string | null
  venueMapsUrl: string | null
  colors: ColorScheme
  decorator?: React.ReactNode
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function EventSection({ label, date, time, venueName, venueAddress, venueMapsUrl, colors, decorator }: Props) {
  if (!date && !venueName) return null

  return (
    <section className="py-8 px-4 max-w-md mx-auto text-center">
      {decorator}
      <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: colors.textMuted }}>
        {label}
      </p>
      <div
        className="rounded-2xl p-6 border space-y-2"
        style={{
          background: 'rgba(255, 255, 255, 0.42)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255, 255, 255, 0.65)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.7)',
        }}
      >
        {date && (
          <p className="text-lg font-semibold" style={{ color: colors.textDark }}>
            {formatDate(date)}
          </p>
        )}
        {time && (
          <p style={{ color: colors.primary }}>
            Pukul {time.slice(0, 5)} WIB
          </p>
        )}
        {venueName && (
          <p className="font-medium mt-2" style={{ color: colors.textDark }}>{venueName}</p>
        )}
        {venueAddress && (
          <p className="text-sm" style={{ color: colors.textMuted }}>{venueAddress}</p>
        )}
        {venueMapsUrl && (
          <a
            href={venueMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-medium border"
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            Lihat di Maps
          </a>
        )}
      </div>
    </section>
  )
}
