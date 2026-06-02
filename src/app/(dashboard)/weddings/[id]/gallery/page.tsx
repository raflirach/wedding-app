import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { deletePhoto } from '@/app/actions/gallery'
import PhotoUploader from './PhotoUploader'

export default async function GalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: wedding } = await supabase
    .from('weddings').select('id, bride_name, groom_name')
    .eq('id', id).eq('user_id', user.id).single()
  if (!wedding) notFound()

  const { data: photos } = await supabase
    .from('wedding_photos').select('*')
    .eq('wedding_id', id).order('position')

  const list = photos ?? []

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/weddings/${id}`} className="btn btn-ghost btn-sm btn-square">←</Link>
        <div>
          <h1 className="text-2xl font-bold">Galeri Foto</h1>
          <p className="text-base-content/60 text-sm">
            {wedding.bride_name} & {wedding.groom_name} · {list.length} foto
          </p>
        </div>
      </div>

      <PhotoUploader weddingId={id} photoCount={list.length} />

      {list.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {list.map((photo) => {
            const deleteWithIds = deletePhoto.bind(null, id, photo.id)
            return (
              <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden">
                <Image
                  src={photo.url}
                  alt="Gallery"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <form
                  action={deleteWithIds}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    type="submit"
                    className="btn btn-error btn-circle btn-xs"
                    onClick={(e) => !confirm('Hapus foto ini?') && e.preventDefault()}
                  >
                    ✕
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card bg-base-100 shadow">
          <div className="card-body items-center text-center py-12">
            <p className="text-base-content/40">Belum ada foto — upload foto prewedding kamu</p>
          </div>
        </div>
      )}
    </div>
  )
}
