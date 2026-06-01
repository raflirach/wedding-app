import type { TemplateProps } from './types'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function ModernTemplate({ wedding, colors, RsvpForm, weddingId }: TemplateProps) {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero — split color bar */}
      <section
        className="relative pt-24 pb-20 px-6 text-center overflow-hidden"
        style={{ backgroundColor: colors.textDark }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${colors.accent} 0, ${colors.accent} 1px, transparent 0, transparent 50%)`,
            backgroundSize: '10px 10px',
          }}
        />
        <p
          className="relative text-xs tracking-[0.5em] uppercase font-light mb-6"
          style={{ color: colors.accent }}
        >
          Wedding Invitation
        </p>
        <div className="relative space-y-0">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
            {wedding.bride_name}
          </h1>
          <div
            className="inline-block px-6 py-1 my-3 text-sm font-bold tracking-[0.3em] uppercase"
            style={{ backgroundColor: colors.primary, color: 'white' }}
          >
            &amp;
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
            {wedding.groom_name}
          </h1>
        </div>
      </section>

      {/* Date strip */}
      {wedding.wedding_date && (
        <div
          className="py-5 px-4 text-center"
          style={{ backgroundColor: colors.primary }}
        >
          <p className="text-white font-bold text-lg tracking-wide">
            {formatDate(wedding.wedding_date)}
            {wedding.wedding_time && (
              <span className="font-normal opacity-80 ml-3 text-base">
                · {wedding.wedding_time.slice(0, 5)} WIB
              </span>
            )}
          </p>
        </div>
      )}

      {/* Venue */}
      {wedding.venue_name && (
        <section className="py-14 px-6 max-w-lg mx-auto">
          <div className="flex gap-4">
            <div
              className="w-1 rounded-full shrink-0"
              style={{ backgroundColor: colors.primary }}
            />
            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-1" style={{ color: colors.primary }}>
                Lokasi
              </p>
              <p className="text-2xl font-bold text-gray-900">{wedding.venue_name}</p>
              {wedding.venue_address && (
                <p className="mt-1 text-gray-500 text-sm">{wedding.venue_address}</p>
              )}
              {wedding.venue_maps_url && (
                <a
                  href={wedding.venue_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm font-bold underline underline-offset-4"
                  style={{ color: colors.primary }}
                >
                  Buka di Maps →
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="max-w-lg mx-auto px-6">
        <div className="h-px" style={{ backgroundColor: colors.primaryLight }} />
      </div>

      {/* RSVP */}
      <section className="py-14 px-6 max-w-md mx-auto">
        <p
          className="text-xs font-bold tracking-[0.4em] uppercase mb-6"
          style={{ color: colors.primary }}
        >
          Konfirmasi Kehadiran
        </p>
        <RsvpForm weddingId={weddingId} />
      </section>

      <footer className="py-6 text-center text-xs text-gray-300 border-t">
        Dibuat dengan 💍 Wedding App
      </footer>
    </main>
  )
}
