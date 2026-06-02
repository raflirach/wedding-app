import Image from 'next/image'
import type { TemplateProps } from './types'
import CountdownTimer from '../CountdownTimer'
import GallerySection from './GallerySection'
import GiftSection from './GiftSection'
import EventSection from './EventSection'
import OurStorySection from './OurStorySection'
import TimelineSection from './TimelineSection'
import AnimatedSection from '../AnimatedSection'
import { FloralDivider } from './Ornaments'
import Particles from '../Particles'

export default function FloralTemplate({ wedding, colors, AttendanceForm, WishesDisplayComponent, wishes, photos, weddingId, guestName }: TemplateProps) {
  return (
    <main style={{
      backgroundColor: colors.bg,
      minHeight: '100vh',
      position: 'relative',
      zIndex: 1,
      backgroundImage: `radial-gradient(circle, ${colors.primary}16 1px, transparent 1px), radial-gradient(circle, ${colors.primary}0C 1px, transparent 1px)`,
      backgroundSize: '16px 16px, 16px 16px',
      backgroundPosition: '0 0, 8px 8px',
    }}>
      <Particles variant="floral" colors={colors} />
      <style>{`
        @keyframes fl-float-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fl-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fl-spin-bloom {
          from { opacity: 0; transform: rotate(-25deg) scale(0.6); }
          to   { opacity: 1; transform: rotate(0deg) scale(1); }
        }
        @keyframes fl-border-grow {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Cover Photo */}
      {wedding.cover_photo_url && (
        <div className="relative w-full h-64 md:h-80">
          <Image src={wedding.cover_photo_url} alt="Cover" fill className="object-cover" unoptimized />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, ${colors.bg})` }} />
        </div>
      )}

      {/* Decorative top — animated */}
      <div
        className="text-center pt-8 pb-2 text-3xl select-none"
        style={{ color: colors.accent, animation: 'fl-spin-bloom 1s cubic-bezier(0.22,1,0.36,1) both 0.2s' }}
      >
        ❧ ✾ ❧
      </div>

      {/* Hero */}
      <section className="px-4 py-8 text-center">
        <p
          className="text-xs tracking-[0.35em] uppercase mb-6"
          style={{ color: colors.textMuted, animation: 'fl-fade-in 0.8s ease both 0.3s' }}
        >
          Undangan Pernikahan
        </p>
        <div
          className="inline-block border-2 rounded-full px-10 py-8 mb-6"
          style={{ borderColor: colors.accent + '60', animation: 'fl-border-grow 0.9s cubic-bezier(0.22,1,0.36,1) both 0.4s' }}
        >
          <h1
            className="text-5xl md:text-6xl italic font-bold"
            style={{ color: colors.textDark, animation: 'fl-float-up 0.9s cubic-bezier(0.22,1,0.36,1) both 0.5s' }}
          >
            {wedding.bride_name}
          </h1>
          <div className="flex items-center justify-center gap-3 my-3" style={{ animation: 'fl-fade-in 0.8s ease both 0.8s' }}>
            <div className="h-px w-12" style={{ backgroundColor: colors.accent }} />
            <span
              className="text-2xl"
              style={{ color: colors.primary, animation: 'fl-spin-bloom 0.8s cubic-bezier(0.22,1,0.36,1) both 0.85s' }}
            >
              ✿
            </span>
            <div className="h-px w-12" style={{ backgroundColor: colors.accent }} />
          </div>
          <h1
            className="text-5xl md:text-6xl italic font-bold"
            style={{ color: colors.textDark, animation: 'fl-float-up 0.9s cubic-bezier(0.22,1,0.36,1) both 0.95s' }}
          >
            {wedding.groom_name}
          </h1>
        </div>

        <div style={{ animation: 'fl-fade-in 0.8s ease both 1.2s' }}>
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
        </div>

        {(wedding.bride_parents || wedding.groom_parents) && (
          <div className="mt-6 max-w-sm mx-auto space-y-3 text-sm" style={{ animation: 'fl-float-up 0.9s ease both 1.4s' }}>
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

      {/* Countdown */}
      {(wedding.akad_date || wedding.wedding_date) && (
        <AnimatedSection animation="float-up">
          <section className="py-8 px-4 max-w-sm mx-auto text-center">
            <CountdownTimer date={(wedding.akad_date || wedding.wedding_date)!} colors={colors} />
          </section>
        </AnimatedSection>
      )}

      {/* Akad Nikah */}
      <AnimatedSection animation="float-up">
        <EventSection
          label="Akad Nikah"
          date={wedding.akad_date}
          time={wedding.akad_time}
          venueName={wedding.akad_venue_name}
          venueAddress={wedding.akad_venue_address}
          venueMapsUrl={wedding.akad_venue_maps_url}
          colors={colors}
          decorator={<p className="text-2xl mb-3 select-none" style={{ animation: 'fl-spin-bloom 0.8s ease both' }}>🌿</p>}
        />
      </AnimatedSection>

      {/* Resepsi */}
      <AnimatedSection animation="float-up" delay={100}>
        <EventSection
          label="Resepsi"
          date={wedding.wedding_date}
          time={wedding.wedding_time}
          venueName={wedding.venue_name}
          venueAddress={wedding.venue_address}
          venueMapsUrl={wedding.venue_maps_url}
          colors={colors}
          decorator={<p className="text-2xl mb-3 select-none" style={{ animation: 'fl-spin-bloom 0.8s ease both' }}>🌿</p>}
        />
      </AnimatedSection>

      <AnimatedSection animation="float-up">
        <OurStorySection items={wedding.love_story ?? []} colors={colors} />
      </AnimatedSection>

      <AnimatedSection animation="fade-in">
        <div className="py-4 px-4"><FloralDivider colors={colors} /></div>
      </AnimatedSection>

      <AnimatedSection animation="float-up">
        <TimelineSection items={wedding.timeline ?? []} colors={colors} />
      </AnimatedSection>

      <AnimatedSection animation="zoom-in">
        <GallerySection photos={photos} colors={colors} />
      </AnimatedSection>

      <AnimatedSection animation="float-up">
        <GiftSection wedding={wedding} colors={colors} />
      </AnimatedSection>

      {/* Kehadiran & Ucapan */}
      <AnimatedSection animation="float-up">
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
      </AnimatedSection>

      <div className="text-center pb-6 pt-2 text-2xl select-none" style={{ color: colors.accent }}>❧ ✾ ❧</div>

      <footer className="py-6 text-center text-xs border-t" style={{ color: colors.accent + '80', borderColor: colors.accent + '30' }}>
        Dibuat dengan 💍 Wedding App
      </footer>
    </main>
  )
}
