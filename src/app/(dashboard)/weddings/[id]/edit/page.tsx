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
          bride_full_name: wedding.bride_full_name ?? undefined,
          groom_full_name: wedding.groom_full_name ?? undefined,
          bride_parents: wedding.bride_parents ?? undefined,
          groom_parents: wedding.groom_parents ?? undefined,
          opening_text: wedding.opening_text ?? undefined,
          music_url: wedding.music_url ?? undefined,
          akad_date: wedding.akad_date ?? undefined,
          akad_time: wedding.akad_time ?? undefined,
          akad_venue_name: wedding.akad_venue_name ?? undefined,
          akad_venue_address: wedding.akad_venue_address ?? undefined,
          akad_venue_maps_url: wedding.akad_venue_maps_url ?? undefined,
          bank_1_name: wedding.bank_1_name ?? undefined,
          bank_1_account_name: wedding.bank_1_account_name ?? undefined,
          bank_1_account_number: wedding.bank_1_account_number ?? undefined,
          bank_2_name: wedding.bank_2_name ?? undefined,
          bank_2_account_name: wedding.bank_2_account_name ?? undefined,
          bank_2_account_number: wedding.bank_2_account_number ?? undefined,
          timeline: (wedding.timeline as { time: string; title: string; description?: string }[] | null) ?? [],
          love_story: (wedding.love_story as { date: string; title: string; description?: string }[] | null) ?? [],
        }}
        onSubmit={updateWithId}
        submitLabel="Simpan Perubahan"
        cancelHref={`/weddings/${id}`}
      />
    </div>
  )
}
