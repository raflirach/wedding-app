import Image from 'next/image'
import type { TemplateProps } from './types'
import CountdownTimer from '../CountdownTimer'
import GallerySection from './GallerySection'
import GiftSection from './GiftSection'
import EventSection from './EventSection'
import OurStorySection from './OurStorySection'
import TimelineSection from './TimelineSection'
import AnimatedSection from '../AnimatedSection'
import { WeddingRings, ElegantDivider } from './Ornaments'

export default function ElegantTemplate({ wedding, colors, AttendanceForm, WishesDisplayComponent, wishes, photos, weddingId, guestName }: TemplateProps) {
  return (
    <main style={{ backgroundColor: colors.bg, minHeight: '100vh' }}>
      <style>{`
        @keyframes el-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes el-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes el-line-grow {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
      `}</style>

      {/* Cover Photo */}
      {wedding.cover_photo_url && (
        <div className="relative w-full h-72 md:h-96">
          <Image src={wedding.cover_photo_url} alt="Cover" fill className="object-cover" unoptimized />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 50%, ${colors.bg})` }} />
        </div>
      )}

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <p
          className="text-xs tracking-[0.4em] uppercase mb-8 font-light"
          style={{ color: colors.textMuted, animation: 'el-fade-in 0.8s ease both 0.2s' }}
        >
          — Undangan Pernikahan —
        </p>
        <div className="space-y-1">
          <h1
            className="text-6xl md:text-8xl font-bold leading-none"
            style={{ color: colors.textDark, animation: 'el-fade-up 0.9s ease both 0.4s' }}
          >
            {wedding.bride_name}
          </h1>
          <p
            className="text-4xl italic"
            style={{ color: colors.primary, animation: 'el-fade-in 0.8s ease both 0.75s' }}
          >
            &amp;
          </p>
          <h1
            className="text-6xl md:text-8xl font-bold leading-none"
            style={{ color: colors.textDark, animation: 'el-fade-up 0.9s ease both 0.9s' }}
          >
            {wedding.groom_name}
          </h1>
          <div className="flex justify-center mt-8"><WeddingRings colors={colors} size={56} /></div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-10" style={{ animation: 'el-fade-in 0.8s ease both 1.2s' }}>
          <div className="h-px w-16 origin-left" style={{ backgroundColor: colors.accent, animation: 'el-line-grow 0.8s ease both 1.3s' }} />
          <span className="text-lg" style={{ color: colors.accent }}>✦</span>
          <div className="h-px w-16 origin-right" style={{ backgroundColor: colors.accent, animation: 'el-line-grow 0.8s ease both 1.3s' }} />
        </div>
        <p
          className="mt-6 text-sm italic font-light max-w-sm mx-auto leading-relaxed"
          style={{ color: colors.textMuted, animation: 'el-fade-in 0.8s ease both 1.4s' }}
        >
          {wedding.opening_text || 'Bersama keluarga, kami mengundang kehadiran Anda'}
        </p>

        {(wedding.bride_parents || wedding.groom_parents) && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-sm" style={{ animation: 'el-fade-up 0.8s ease both 1.6s' }}>
            {wedding.bride_parents && (
              <div className="text-center p-3 rounded-xl" style={{ backgroundColor: colors.primaryLight }}>
                <p className="font-semibold mb-1" style={{ color: colors.textDark }}>
                  {wedding.bride_full_name || wedding.bride_name}
                </p>
                <p style={{ color: colors.textMuted }}>{wedding.bride_parents}</p>
              </div>
            )}
            {wedding.groom_parents && (
              <div className="text-center p-3 rounded-xl" style={{ backgroundColor: colors.primaryLight }}>
                <p className="font-semibold mb-1" style={{ color: colors.textDark }}>
                  {wedding.groom_full_name || wedding.groom_name}
                </p>
                <p style={{ color: colors.textMuted }}>{wedding.groom_parents}</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Countdown */}
      {(wedding.akad_date || wedding.wedding_date) && (
        <AnimatedSection animation="fade-in">
          <section className="py-12 px-4 text-center" style={{ backgroundColor: colors.primaryLight }}>
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: colors.textMuted }}>
              Menuju Hari Bahagia
            </p>
            <CountdownTimer date={(wedding.akad_date || wedding.wedding_date)!} colors={colors} />
          </section>
        </AnimatedSection>
      )}

      {/* Akad Nikah */}
      <AnimatedSection animation="fade-up">
        <EventSection
          label="Akad Nikah"
          date={wedding.akad_date}
          time={wedding.akad_time}
          venueName={wedding.akad_venue_name}
          venueAddress={wedding.akad_venue_address}
          venueMapsUrl={wedding.akad_venue_maps_url}
          colors={colors}
        />
      </AnimatedSection>

      {/* Resepsi */}
      <AnimatedSection animation="fade-up" delay={100}>
        <EventSection
          label="Resepsi"
          date={wedding.wedding_date}
          time={wedding.wedding_time}
          venueName={wedding.venue_name}
          venueAddress={wedding.venue_address}
          venueMapsUrl={wedding.venue_maps_url}
          colors={colors}
        />
      </AnimatedSection>

      <AnimatedSection animation="fade-up">
        <OurStorySection items={wedding.love_story ?? []} colors={colors} />
      </AnimatedSection>

      <AnimatedSection animation="fade-in">
        <div className="py-6 px-4"><ElegantDivider colors={colors} /></div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up">
        <TimelineSection items={wedding.timeline ?? []} colors={colors} />
      </AnimatedSection>

      <AnimatedSection animation="zoom-in">
        <GallerySection photos={photos} colors={colors} />
      </AnimatedSection>

      <AnimatedSection animation="fade-up">
        <GiftSection wedding={wedding} colors={colors} />
      </AnimatedSection>

      {/* Kehadiran & Ucapan */}
      <AnimatedSection animation="fade-up">
        <section className="py-12 px-4 max-w-md mx-auto">
          <div className="text-center mb-6">
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: colors.textMuted }}>
              Kehadiran & Ucapan
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
      </AnimatedSection>

      <footer className="py-8 text-center text-xs border-t" style={{ color: colors.accent + '80', borderColor: colors.accent + '30' }}>
        Dibuat dengan 💍 Wedding App
      </footer>
    </main>
  )
}
