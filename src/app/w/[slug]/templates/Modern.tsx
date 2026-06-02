import Image from 'next/image'
import type { TemplateProps } from './types'
import CountdownTimer from '../CountdownTimer'
import GallerySection from './GallerySection'
import GiftSection from './GiftSection'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function ModernTemplate({ wedding, colors, AttendanceForm, WishesDisplayComponent, wishes, photos, weddingId, guestName }: TemplateProps) {
  return (
    <main className="min-h-screen bg-white">

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
        <p className="relative text-xs tracking-[0.5em] uppercase font-light mb-6" style={{ color: colors.accent }}>
          Wedding Invitation
        </p>
        <div className="relative space-y-0">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
            {wedding.bride_name}
          </h1>
          <div className="inline-block px-6 py-1 my-3 text-sm font-bold tracking-[0.3em] uppercase"
            style={{ backgroundColor: colors.primary, color: 'white' }}>
            &amp;
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
            {wedding.groom_name}
          </h1>
        </div>
      </section>

      {/* Opening + Parents */}
      {(wedding.opening_text || wedding.bride_parents || wedding.groom_parents) && (
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
      )}

      {/* Date strip */}
      {wedding.wedding_date && (
        <div className="py-5 px-4 text-center" style={{ backgroundColor: colors.primary }}>
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

      {/* Countdown */}
      {wedding.wedding_date && (
        <div className="py-8 px-4" style={{ backgroundColor: colors.primaryLight }}>
          <CountdownTimer date={wedding.wedding_date} colors={colors} />
        </div>
      )}

      {/* Venue */}
      {wedding.venue_name && (
        <section className="py-14 px-6 max-w-lg mx-auto">
          <div className="flex gap-4">
            <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: colors.primary }} />
            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-1" style={{ color: colors.primary }}>
                Lokasi
              </p>
              <p className="text-2xl font-bold text-gray-900">{wedding.venue_name}</p>
              {wedding.venue_address && <p className="mt-1 text-gray-500 text-sm">{wedding.venue_address}</p>}
              {wedding.venue_maps_url && (
                <a href={wedding.venue_maps_url} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm font-bold underline underline-offset-4"
                  style={{ color: colors.primary }}>
                  Buka di Maps →
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-lg mx-auto px-6">
        <div className="h-px" style={{ backgroundColor: colors.primaryLight }} />
      </div>

      <GallerySection photos={photos} colors={colors} />

      <GiftSection wedding={wedding} colors={colors} />

      {/* Kehadiran & Ucapan */}
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

      <footer className="py-6 text-center text-xs text-gray-300 border-t">
        Dibuat dengan 💍 Wedding App
      </footer>
    </main>
  )
}
