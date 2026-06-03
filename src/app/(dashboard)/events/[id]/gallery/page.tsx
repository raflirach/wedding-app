import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import PhotoUploader from './PhotoUploader'
import DeletePhotoButton from './DeletePhotoButton'

export default async function EventGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: event } = await supabase
    .from('events').select('id, event_title')
    .eq('id', id).eq('user_id', user.id).single()
  if (!event) notFound()

  const admin = createAdminClient()
  const { data: photos } = await admin
    .from('event_photos').select('*')
    .eq('event_id', id).order('position')

  const list = photos ?? []

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/events/${id}`} className="btn btn-ghost btn-sm btn-square">←</Link>
        <div>
          <h1 className="text-2xl font-bold">Galeri Foto</h1>
          <p className="text-base-content/60 text-sm">
            {event.event_title} · {list.length} foto
          </p>
        </div>
      </div>

      <PhotoUploader eventId={id} photoCount={list.length} />

      {list.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {list.map((photo) => (
            <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden">
              <Image
                src={photo.url}
                alt="Gallery"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DeletePhotoButton eventId={id} photoId={photo.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-base-100 shadow">
          <div className="card-body items-center text-center py-12">
            <p className="text-base-content/40">Belum ada foto — upload foto event kamu</p>
          </div>
        </div>
      )}
    </div>
  )
}
