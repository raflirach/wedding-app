import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateWedding } from '@/app/actions/weddings'
import WeddingForm from '../../_components/WeddingForm'

export default async function EditWeddingPage({ params }: { params: Promise<{ id: string }> }) {
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

  const updateWithId = updateWedding.bind(null, id)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Undangan</h1>
        <p className="text-base-content/60 mt-1">
          {wedding.bride_name} & {wedding.groom_name}
        </p>
      </div>
      <WeddingForm
        defaultValues={{
          bride_name: wedding.bride_name,
          groom_name: wedding.groom_name,
          wedding_date: wedding.wedding_date ?? undefined,
          wedding_time: wedding.wedding_time ?? undefined,
          venue_name: wedding.venue_name ?? undefined,
          venue_address: wedding.venue_address ?? undefined,
          venue_maps_url: wedding.venue_maps_url ?? undefined,
          slug: wedding.slug,
          theme: wedding.theme ?? 'elegant',
          color_scheme: wedding.color_scheme ?? 'blush',
          cover_photo_url: wedding.cover_photo_url ?? undefined,
        }}
        onSubmit={updateWithId}
        submitLabel="Simpan Perubahan"
        cancelHref={`/weddings/${id}`}
      />
    </div>
  )
}
