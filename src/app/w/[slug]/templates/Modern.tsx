import Image from 'next/image'
import type { TemplateProps } from './types'
import CountdownTimer from '../CountdownTimer'
import GallerySection from './GallerySection'
import GiftSection from './GiftSection'
import OurStorySection from './OurStorySection'
import TimelineSection from './TimelineSection'
import AnimatedSection from '../AnimatedSection'
import { ModernDivider } from './Ornaments'
import Particles from '../Particles'

export default function ModernTemplate({ wedding, colors, AttendanceForm, WishesDisplayComponent, wishes, photos, weddingId, guestName }: TemplateProps) {
  return (
    <main className="min-h-screen bg-white" style={{
      position: 'relative',
      zIndex: 1,
      ...(wedding.show_pattern !== false && {
        backgroundImage: `repeating-linear-gradient(45deg, ${colors.primary}12 0, ${colors.primary}12 1px, transparent 0, transparent 9px)`,
      }),
    }}>
      <Particles variant="modern" colors={colors} />
      <style>{`
        @keyframes mo-slide-down {
          from { opacity: 0; transform: translateY(-30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mo-slide-left {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes mo-slide-right {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes mo-bar-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>

      {/* Hero */}
      <section className="relative pt-24 pb-20 px-6 text-center overflow-hidden"
        style={{ backgroundColor: colors.textDark }}>
        {wedding.cover_photo_url && (
          <div className="absolute inset-0">
            <Image src={wedding.cover_photo_url} alt="Cover" fill className="object-cover opacity-20" unoptimized />
          </div>
        )}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${colors.accent} 0, ${colors.accent} 1px, transparent 0, transparent 50%)`,
            backgroundSize: '10px 10px',
          }}
        />
        <p
          className="relative text-xs tracking-[0.5em] uppercase font-light mb-6"
          style={{ color: colors.accent, animation: 'mo-slide-down 0.6s ease both 0.2s' }}
        >
          Wedding Invitation
        </p>
        <div className="relative space-y-0">
          <h1
            className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-none"
            style={{ animation: 'mo-slide-left 0.7s ease-out both 0.4s' }}
          >
            {wedding.bride_name}
          </h1>
          <div
            className="inline-block px-6 py-1 my-3 text-sm font-bold tracking-[0.3em] uppercase"
            style={{ backgroundColor: colors.primary, color: 'white', animation: 'mo-slide-down 0.5s ease both 0.7s' }}
          >
            &amp;
          </div>
          <h1
            className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-none"
            style={{ animation: 'mo-slide-right 0.7s ease-out both 0.9s' }}
          >
            {wedding.groom_name}
          </h1>
        </div>
      </section>

      {/* Opening + Parents */}
      {(wedding.opening_text || wedding.bride_parents || wedding.groom_parents) && (
        <AnimatedSection animation="fade-up">
          <section className="py-10 px-6 max-w-lg mx-auto space-y-6">
            {wedding.opening_text && (
              <p className="text-center text-sm text-gray-500 italic leading-relaxed">
                {wedding.opening_text}
              </p>
            )}
            {(wedding.bride_parents || wedding.groom_parents) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wedding.bride_parents && (
                  <div className="border-l-4 pl-4" style={{ borderColor: colors.primary }}>
                    <p className="font-bold text-gray-900">{wedding.bride_full_name || wedding.bride_name}</p>
                    <p className="text-sm text-gray-500 mt-1">{wedding.bride_parents}</p>
                  </div>
                )}
                {wedding.groom_parents && (
                  <div className="border-l-4 pl-4" style={{ borderColor: colors.primary }}>
                    <p className="font-bold text-gray-900">{wedding.groom_full_name || wedding.groom_name}</p>
                    <p className="text-sm text-gray-500 mt-1">{wedding.groom_parents}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </AnimatedSection>
      )}

      {/* Countdown */}
      {(wedding.akad_date || wedding.wedding_date) && (
        <AnimatedSection animation="fade-in">
          <div className="py-8 px-4" style={{ backgroundColor: colors.primaryLight }}>
            <p className="text-xs font-bold tracking-[0.4em] uppercase text-center mb-4" style={{ color: colors.primary }}>
              Menuju Hari Bahagia
            </p>
            <CountdownTimer date={(wedding.akad_date || wedding.wedding_date)!} colors={colors} />
          </div>
        </AnimatedSection>
      )}

      {/* Akad Nikah */}
      {(wedding.akad_date || wedding.akad_venue_name) && (
        <AnimatedSection animation="slide-left">
          <section className="py-10 px-6 max-w-lg mx-auto">
            <div className="flex gap-4">
              <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: colors.primary }} />
              <div>
                <p className="text-xs font-bold tracking-[0.3em] uppercase mb-1" style={{ color: colors.primary }}>Akad Nikah</p>
                {wedding.akad_date && (
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(wedding.akad_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    {wedding.akad_time && <span className="font-normal text-gray-500 ml-2 text-sm">· {wedding.akad_time.slice(0, 5)} WIB</span>}
                  </p>
                )}
                {wedding.akad_venue_name && <p className="mt-1 font-semibold text-gray-800">{wedding.akad_venue_name}</p>}
                {wedding.akad_venue_address && <p className="mt-0.5 text-gray-500 text-sm">{wedding.akad_venue_address}</p>}
                {wedding.akad_venue_maps_url && (
                  <a href={wedding.akad_venue_maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm font-bold underline underline-offset-4" style={{ color: colors.primary }}>
                    Buka di Maps →
                  </a>
                )}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Resepsi */}
      {(wedding.wedding_date || wedding.venue_name) && (
        <AnimatedSection animation="slide-right">
          <section className="py-10 px-6 max-w-lg mx-auto">
            <div className="flex gap-4">
              <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: colors.primary }} />
              <div>
                <p className="text-xs font-bold tracking-[0.3em] uppercase mb-1" style={{ color: colors.primary }}>Resepsi</p>
                {wedding.wedding_date && (
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(wedding.wedding_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    {wedding.wedding_time && <span className="font-normal text-gray-500 ml-2 text-sm">· {wedding.wedding_time.slice(0, 5)} WIB</span>}
                  </p>
                )}
                {wedding.venue_name && <p className="mt-1 font-semibold text-gray-800">{wedding.venue_name}</p>}
                {wedding.venue_address && <p className="mt-0.5 text-gray-500 text-sm">{wedding.venue_address}</p>}
                {wedding.venue_maps_url && (
                  <a href={wedding.venue_maps_url} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm font-bold underline underline-offset-4" style={{ color: colors.primary }}>
                    Buka di Maps →
                  </a>
                )}
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      <AnimatedSection animation="slide-left">
        <OurStorySection items={wedding.love_story ?? []} colors={colors} />
      </AnimatedSection>

      <div className="py-6 px-4"><ModernDivider colors={colors} /></div>

      <AnimatedSection animation="slide-right">
        <TimelineSection items={wedding.timeline ?? []} colors={colors} />
      </AnimatedSection>

      <AnimatedSection animation="zoom-in">
        <GallerySection photos={photos} colors={colors} />
      </AnimatedSection>

      <AnimatedSection animation="slide-left">
        <GiftSection wedding={wedding} colors={colors} />
      </AnimatedSection>

      {/* Kehadiran & Ucapan */}
      <AnimatedSection animation="fade-up">
        <section className="py-14 px-6 max-w-md mx-auto">
          <p className="text-xs font-bold tracking-[0.4em] uppercase mb-6" style={{ color: colors.primary }}>
            Kehadiran & Ucapan
          </p>
          <AttendanceForm weddingId={weddingId} colors={colors} defaultName={guestName} />
          {wishes.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-bold tracking-[0.4em] uppercase mb-4" style={{ color: colors.primary }}>
                Ucapan Tamu
              </p>
              <WishesDisplayComponent wishes={wishes} colors={colors} />
            </div>
          )}
        </section>
      </AnimatedSection>

      <footer className="py-6 text-center text-xs text-gray-300 border-t">
        Dibuat dengan 💍 Wedding App
      </footer>
    </main>
  )
}
