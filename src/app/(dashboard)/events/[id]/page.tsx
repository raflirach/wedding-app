import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { toggleEventPublish } from '@/app/actions/events'
import { getEventType } from '@/lib/events'
import SharePanel from '../../weddings/[id]/SharePanel'
import DeleteEventButton from './DeleteEventButton'

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!event) notFound()

  const rsvpResult = await supabase
    .from('event_rsvp')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', id)
    .eq('rsvp_status', 'attending')
  const rsvpCount = rsvpResult.error ? 0 : (rsvpResult.count ?? 0)

  const eventType = getEventType(event.event_type)
  const toggleWithId = toggleEventPublish.bind(null, id, event.is_published)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{eventType.icon}</span>
            <span className="badge badge-outline badge-sm">{eventType.label}</span>
          </div>
          <h1 className="text-2xl font-bold">{event.event_title}</h1>
          {event.host_name && <p className="text-base-content/60 text-sm mt-1">oleh {event.host_name}</p>}
          <p className="text-base-content/40 text-xs mt-1">/e/{event.slug}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href={`/events/${id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
          <DeleteEventButton id={id} />
        </div>
      </div>

      {/* Publish */}
      <div className="card bg-base-100 shadow">
        <div className="card-body flex-row items-center justify-between py-4">
          <div>
            <p className="font-medium">Status Undangan</p>
            <p className="text-sm text-base-content/60">
              {event.is_published ? 'Sudah publik — tamu bisa mengaksesnya' : 'Draft — hanya kamu yang bisa melihat'}
            </p>
          </div>
          <form action={toggleWithId}>
            <button type="submit" className={`btn btn-sm ${event.is_published ? 'btn-primary btn-outline' : 'btn-primary'}`}>
              {event.is_published ? 'Jadikan Draft' : 'Publikasikan'}
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body py-4">
            <p className="text-3xl font-bold text-success">{rsvpCount ?? 0}</p>
            <p className="text-sm text-base-content/60">Konfirmasi Hadir</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body py-4">
            <p className="text-3xl font-bold text-primary">{event.event_date ? new Date(event.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '—'}</p>
            <p className="text-sm text-base-content/60">Tanggal Event</p>
          </div>
        </div>
      </div>

      {/* Detail */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-3">
          <h2 className="font-semibold">Detail Acara</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-base-content/60">Tanggal</span>
            <span>{event.event_date ? new Date(event.event_date).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '—'}</span>
            <span className="text-base-content/60">Waktu</span>
            <span>{event.event_time ?? '—'}</span>
            <span className="text-base-content/60">Tempat</span>
            <span>{event.venue_name ?? '—'}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href={`/e/${event.slug}`} className="btn btn-outline" target="_blank">Lihat Undangan</Link>
        <Link href={`/events/${id}/edit`} className="btn btn-primary">Edit Event</Link>
        <Link href={`/events/${id}/gallery`} className="btn btn-outline col-span-2">🖼️ Galeri Foto</Link>
      </div>

      <SharePanel slug={event.slug} pathPrefix="e" />
    </div>
  )
}
