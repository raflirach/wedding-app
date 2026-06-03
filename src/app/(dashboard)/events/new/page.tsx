import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createEvent } from '@/app/actions/events'
import EventForm from '../_components/EventForm'

export default async function NewEventPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Buat Event</h1>
        <p className="text-base-content/60 mt-1">Reuni, syukuran, ulang tahun, dan lainnya</p>
      </div>
      <EventForm onSubmit={createEvent} submitLabel="Buat Event" cancelHref="/dashboard" />
    </div>
  )
}
