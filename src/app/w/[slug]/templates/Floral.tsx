import Image from 'next/image'
import type { TemplateProps } from './types'
import CountdownTimer from '../CountdownTimer'
import GallerySection from './GallerySection'
import GiftSection from './GiftSection'
import EventSection from './EventSection'
import OurStorySection from './OurStorySection'
import TimelineSection from './TimelineSection'

export default function FloralTemplate({ wedding, colors, AttendanceForm, WishesDisplayComponent, wishes, photos, weddingId, guestName }: TemplateProps) {
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

      {/* Countdown — ke tanggal terdekat */}
      {(wedding.akad_date || wedding.wedding_date) && (
        <section className="py-8 px-4 max-w-sm mx-auto text-center">
          <CountdownTimer date={(wedding.akad_date || wedding.wedding_date)!} colors={colors} />
        </section>
      )}

      {/* Akad Nikah */}
      <EventSection
        label="Akad Nikah"
        date={wedding.akad_date}
        time={wedding.akad_time}
        venueName={wedding.akad_venue_name}
        venueAddress={wedding.akad_venue_address}
        venueMapsUrl={wedding.akad_venue_maps_url}
        colors={colors}
        decorator={<p className="text-2xl mb-3 select-none">🌿</p>}
      />

      {/* Resepsi */}
      <EventSection
        label="Resepsi"
        date={wedding.wedding_date}
        time={wedding.wedding_time}
        venueName={wedding.venue_name}
        venueAddress={wedding.venue_address}
        venueMapsUrl={wedding.venue_maps_url}
        colors={colors}
        decorator={<p className="text-2xl mb-3 select-none">🌿</p>}
      />

      <OurStorySection items={wedding.love_story ?? []} colors={colors} />

      <div className="text-center py-2 text-2xl select-none" style={{ color: colors.accent }}>✾ ✾ ✾</div>

      <TimelineSection items={wedding.timeline ?? []} colors={colors} />

      <GallerySection photos={photos} colors={colors} />

      <GiftSection wedding={wedding} colors={colors} />

      {/* Kehadiran & Ucapan */}
      <section className="py-10 px-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <p className="text-xs tracking-[0.3em] uppercase" style={{ color: colors.textMuted }}>
            Kehadiran & Ucapan
          </p>
          <p className="text-sm mt-1 italic" style={{ color: colors.textMuted }}>
            Kehadiran Anda adalah kebahagiaan kami
          </p>
        </div>
        <AttendanceForm weddingId={weddingId} colors={colors} defaultName={guestName} />
        {wishes.length > 0 && (
          <div className="mt-8">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 text-center" style={{ color: colors.textMuted }}>
              Ucapan Tamu
            </p>
            <WishesDisplayComponent wishes={wishes} colors={colors} />
          </div>
        )}
      </section>

      <div className="text-center pb-6 pt-2 text-2xl select-none" style={{ color: colors.accent }}>❧ ✾ ❧</div>

      <footer className="py-6 text-center text-xs border-t" style={{ color: colors.accent + '80', borderColor: colors.accent + '30' }}>
        Dibuat dengan 💍 Wedding App
      </footer>
    </main>
  )
}
