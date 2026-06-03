import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateEvent } from '@/app/actions/events'
import EventForm from '../../_components/EventForm'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
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

  const updateWithId = updateEvent.bind(null, id)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Event</h1>
        <p className="text-base-content/60 mt-1">{event.event_title}</p>
      </div>
      <EventForm
        defaultValues={{
          event_type: event.event_type,
          event_title: event.event_title,
          host_name: event.host_name ?? undefined,
          description: event.description ?? undefined,
          event_date: event.event_date ?? undefined,
          event_time: event.event_time ?? undefined,
          venue_name: event.venue_name ?? undefined,
          venue_address: event.venue_address ?? undefined,
          venue_maps_url: event.venue_maps_url ?? undefined,
          slug: event.slug,
          theme: event.theme ?? 'elegant',
          color_scheme: event.color_scheme ?? 'blush',
          cover_photo_url: event.cover_photo_url ?? undefined,
          music_url: event.music_url ?? undefined,
          show_pattern: event.show_pattern ?? true,
          bank_1_name: event.bank_1_name ?? undefined,
          bank_1_account_name: event.bank_1_account_name ?? undefined,
          bank_1_account_number: event.bank_1_account_number ?? undefined,
          bank_2_name: event.bank_2_name ?? undefined,
          bank_2_account_name: event.bank_2_account_name ?? undefined,
          bank_2_account_number: event.bank_2_account_number ?? undefined,
        }}
        onSubmit={updateWithId}
        submitLabel="Simpan Perubahan"
        cancelHref={`/events/${id}`}
      />
    </div>
  )
}
