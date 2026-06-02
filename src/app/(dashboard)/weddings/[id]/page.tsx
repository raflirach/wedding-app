import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { togglePublish } from '@/app/actions/weddings'
import DeleteButton from './DeleteButton'
import SharePanel from './SharePanel'

export default async function WeddingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!wedding) notFound()

  const [{ count: guestCount }, { count: rsvpCount }] = await Promise.all([
    supabase
      .from('guests')
      .select('*', { count: 'exact', head: true })
      .eq('wedding_id', id),
    supabase
      .from('guests')
      .select('*', { count: 'exact', head: true })
      .eq('wedding_id', id)
      .eq('rsvp_status', 'attending'),
  ])

  const toggleWithId = togglePublish.bind(null, id, wedding.is_published)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {wedding.bride_name} & {wedding.groom_name}
          </h1>
          <p className="text-base-content/60 text-sm mt-1">/w/{wedding.slug}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href={`/weddings/${id}/edit`} className="btn btn-outline btn-sm">
            Edit
          </Link>
          <DeleteButton id={id} />
        </div>
      </div>

      {/* Publish toggle */}
      <div className="card bg-base-100 shadow">
        <div className="card-body flex-row items-center justify-between py-4">
          <div>
            <p className="font-medium">Status Undangan</p>
            <p className="text-sm text-base-content/60">
              {wedding.is_published
                ? 'Undangan sudah publik — tamu bisa mengaksesnya'
                : 'Undangan masih draft — hanya kamu yang bisa melihat'}
            </p>
          </div>
          <form action={toggleWithId}>
            <button
              type="submit"
              className={`btn btn-sm ${wedding.is_published ? 'btn-ghost' : 'btn-primary'}`}
            >
              {wedding.is_published ? 'Jadikan Draft' : 'Publikasikan'}
            </button>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body py-4">
            <p className="text-3xl font-bold text-primary">{guestCount ?? 0}</p>
            <p className="text-sm text-base-content/60">Total Tamu</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body py-4">
            <p className="text-3xl font-bold text-success">{rsvpCount ?? 0}</p>
            <p className="text-sm text-base-content/60">Konfirmasi Hadir</p>
          </div>
        </div>
      </div>

      {/* Detail */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="font-semibold">Detail Acara</h2>

          {/* Akad */}
          {(wedding.akad_date || wedding.akad_venue_name) && (
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-widest uppercase text-base-content/40">Akad Nikah</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-base-content/60">Tanggal</span>
                <span>{wedding.akad_date
                  ? new Date(wedding.akad_date).toLocaleDateString('id-ID', { dateStyle: 'long' })
                  : '—'}</span>
                <span className="text-base-content/60">Waktu</span>
                <span>{wedding.akad_time ?? '—'}</span>
                <span className="text-base-content/60">Tempat</span>
                <span>{wedding.akad_venue_name ?? '—'}</span>
              </div>
            </div>
          )}

          {(wedding.akad_date || wedding.akad_venue_name) && <div className="divider my-0" />}

          {/* Resepsi */}
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-base-content/40">Resepsi</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-base-content/60">Tanggal</span>
              <span>{wedding.wedding_date
                ? new Date(wedding.wedding_date).toLocaleDateString('id-ID', { dateStyle: 'long' })
                : '—'}</span>
              <span className="text-base-content/60">Waktu</span>
              <span>{wedding.wedding_time ?? '—'}</span>
              <span className="text-base-content/60">Venue</span>
              <span>{wedding.venue_name ?? '—'}</span>
              <span className="text-base-content/60">Alamat</span>
              <span>{wedding.venue_address ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link href={`/weddings/${id}/guests`} className="btn btn-primary">
          Kelola Tamu
        </Link>
        <Link href={`/weddings/${id}/gallery`} className="btn btn-outline">
          Galeri Foto
        </Link>
        <Link href={`/w/${wedding.slug}`} className="btn btn-outline" target="_blank">
          Lihat Undangan
        </Link>
      </div>

      {/* Share */}
      <SharePanel slug={wedding.slug} />
    </div>
  )
}
