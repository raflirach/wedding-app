import Image from 'next/image'
import type { TemplateProps } from './types'
import CountdownTimer from '../CountdownTimer'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function FloralTemplate({ wedding, colors, RsvpForm, weddingId }: TemplateProps) {
  return (
    <main style={{ backgroundColor: colors.bg, minHeight: '100vh' }}>

      {/* Cover Photo */}
      {wedding.cover_photo_url && (
        <div className="relative w-full h-64 md:h-80">
          <Image src={wedding.cover_photo_url} alt="Cover" fill className="object-cover" unoptimized />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, ${colors.bg})` }} />
        </div>
      )}

      <div className="text-center pt-8 pb-2 text-3xl select-none" style={{ color: colors.accent }}>
        ❧ ✾ ❧
      </div>

      {/* Hero */}
      <section className="px-4 py-8 text-center">
        <p className="text-xs tracking-[0.35em] uppercase mb-6" style={{ color: colors.textMuted }}>
          Undangan Pernikahan
        </p>
        <div className="inline-block border-2 rounded-full px-10 py-8 mb-6"
          style={{ borderColor: colors.accent + '60' }}>
          <h1 className="text-5xl md:text-6xl font-serif italic font-bold" style={{ color: colors.textDark }}>
            {wedding.bride_name}
          </h1>
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-px w-12" style={{ backgroundColor: colors.accent }} />
            <span className="text-2xl" style={{ color: colors.primary }}>✿</span>
            <div className="h-px w-12" style={{ backgroundColor: colors.accent }} />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic font-bold" style={{ color: colors.textDark }}>
            {wedding.groom_name}
          </h1>
        </div>
        {wedding.opening_text ? (
          <p className="text-sm italic max-w-sm mx-auto leading-relaxed" style={{ color: colors.textMuted }}>
            {wedding.opening_text}
          </p>
        ) : (
          <>
            <p className="text-sm italic" style={{ color: colors.textMuted }}>
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan-pasangan untukmu"
            </p>
            <p className="text-xs mt-1" style={{ color: colors.accent }}>— QS. Ar-Rum: 21</p>
          </>
        )}

        {/* Parents */}
        {(wedding.bride_parents || wedding.groom_parents) && (
          <div className="mt-6 max-w-sm mx-auto space-y-3 text-sm">
            {wedding.bride_parents && (
              <div className="text-center">
                <p className="font-semibold" style={{ color: colors.textDark }}>
                  {wedding.bride_full_name || wedding.bride_name}
                </p>
                <p style={{ color: colors.textMuted }}>{wedding.bride_parents}</p>
              </div>
            )}
            {wedding.bride_parents && wedding.groom_parents && (
              <p className="text-center" style={{ color: colors.accent }}>✿</p>
            )}
            {wedding.groom_parents && (
              <div className="text-center">
                <p className="font-semibold" style={{ color: colors.textDark }}>
                  {wedding.groom_full_name || wedding.groom_name}
                </p>
                <p style={{ color: colors.textMuted }}>{wedding.groom_parents}</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Date + Countdown */}
      {wedding.wedding_date && (
        <section className="py-8 px-4 max-w-sm mx-auto text-center space-y-6">
          <div className="rounded-2xl p-8 border-2" style={{ borderColor: colors.accent + '50', backgroundColor: colors.primaryLight }}>
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: colors.textMuted }}>
              Insya Allah Akan Dilangsungkan
            </p>
            <p className="text-xl font-semibold" style={{ color: colors.textDark }}>
              {formatDate(wedding.wedding_date)}
            </p>
            {wedding.wedding_time && (
              <p className="mt-1" style={{ color: colors.primary }}>
                Pukul {wedding.wedding_time.slice(0, 5)} WIB
              </p>
            )}
          </div>
          <CountdownTimer date={wedding.wedding_date} colors={colors} />
        </section>
      )}

      {/* Venue */}
      {wedding.venue_name && (
        <section className="py-8 px-4 max-w-sm mx-auto text-center">
          <p className="text-2xl mb-2 select-none">🌿</p>
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: colors.textMuted }}>Bertempat di</p>
          <p className="text-xl font-semibold" style={{ color: colors.textDark }}>{wedding.venue_name}</p>
          {wedding.venue_address && (
            <p className="mt-1 text-sm" style={{ color: colors.textMuted }}>{wedding.venue_address}</p>
          )}
          {wedding.venue_maps_url && (
            <a href={wedding.venue_maps_url} target="_blank" rel="noopener noreferrer"
              className="inline-block mt-3 px-5 py-2 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: colors.primary }}>
              Petunjuk Arah
            </a>
          )}
        </section>
      )}

      <div className="text-center py-2 text-2xl select-none" style={{ color: colors.accent }}>✾ ✾ ✾</div>

      {/* RSVP */}
      <section className="py-10 px-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <p className="text-xs tracking-[0.3em] uppercase" style={{ color: colors.textMuted }}>
            Konfirmasi Kehadiran
          </p>
          <p className="text-sm mt-1 italic" style={{ color: colors.textMuted }}>
            Kehadiran Anda adalah kebahagiaan kami
          </p>
        </div>
        <RsvpForm weddingId={weddingId} />
      </section>

      <div className="text-center pb-6 pt-2 text-2xl select-none" style={{ color: colors.accent }}>❧ ✾ ❧</div>

      <footer className="py-6 text-center text-xs border-t" style={{ color: colors.accent + '80', borderColor: colors.accent + '30' }}>
        Dibuat dengan 💍 Wedding App
      </footer>
    </main>
  )
}
