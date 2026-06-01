import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import RsvpForm from './RsvpForm'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('weddings')
    .select('bride_name, groom_name, wedding_date')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Undangan Pernikahan' }

  return {
    title: `Undangan Pernikahan ${data.bride_name} & ${data.groom_name}`,
    description: data.wedding_date
      ? `${data.bride_name} & ${data.groom_name} — ${new Date(data.wedding_date).toLocaleDateString('id-ID', { dateStyle: 'long' })}`
      : `Undangan pernikahan ${data.bride_name} & ${data.groom_name}`,
  }
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!wedding) notFound()

  const weddingDateFormatted = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  const weddingTimeFormatted = wedding.wedding_time
    ? wedding.wedding_time.slice(0, 5) + ' WIB'
    : null

  return (
    <main className="min-h-screen bg-base-100">

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary/10 to-base-100 py-20 px-4 text-center">
        <p className="text-sm tracking-[0.3em] uppercase text-primary/70 mb-6">
          Undangan Pernikahan
        </p>
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-base-content">
            {wedding.bride_name}
          </h1>
          <p className="text-3xl md:text-4xl text-primary">&amp;</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-base-content">
            {wedding.groom_name}
          </h1>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="divider divider-primary w-32" />
        </div>
        <p className="text-base-content/60 text-sm mt-2 italic">
          Bersama keluarga, kami mengundang kehadiran Anda
        </p>
      </section>

      {/* Date */}
      {weddingDateFormatted && (
        <section className="py-12 px-4 text-center bg-primary/5">
          <p className="text-xs tracking-[0.3em] uppercase text-primary/60 mb-3">
            Hari Pernikahan
          </p>
          <p className="text-2xl md:text-3xl font-semibold text-base-content">
            {weddingDateFormatted}
          </p>
          {weddingTimeFormatted && (
            <p className="text-lg text-base-content/60 mt-1">{weddingTimeFormatted}</p>
          )}
        </section>
      )}

      {/* Venue */}
      {wedding.venue_name && (
        <section className="py-12 px-4 max-w-lg mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-primary/60 mb-4">
            Lokasi Acara
          </p>
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body items-center">
              <p className="text-xl font-semibold">{wedding.venue_name}</p>
              {wedding.venue_address && (
                <p className="text-base-content/60 text-sm text-center">
                  {wedding.venue_address}
                </p>
              )}
              {wedding.venue_maps_url && (
                <a
                  href={wedding.venue_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-primary btn-sm mt-2"
                >
                  Lihat di Maps
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Divider ornament */}
      <div className="text-center py-4 text-primary/30 text-2xl">✦ ✦ ✦</div>

      {/* RSVP */}
      <section className="py-12 px-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <p className="text-xs tracking-[0.3em] uppercase text-primary/60 mb-2">
            Konfirmasi Kehadiran
          </p>
          <p className="text-base-content/60 text-sm">
            Mohon konfirmasi kehadiran Anda sebelum acara
          </p>
        </div>
        <RsvpForm weddingId={wedding.id} />
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-base-content/30 border-t border-base-200">
        Dibuat dengan 💍 Wedding App
      </footer>
    </main>
  )
}
