'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function addEventPhoto(eventId: string, url: string, position: number): Promise<string | null> {
  const { supabase, user } = await getAuthUser()

  const { data: event } = await supabase
    .from('events').select('id').eq('id', eventId).eq('user_id', user.id).single()
  if (!event) return 'Event tidak ditemukan'

  const admin = createAdminClient()
  const { error } = await admin
    .from('event_photos')
    .insert({ event_id: eventId, url, position })

  if (error) return error.message

  revalidatePath(`/events/${eventId}/gallery`)
  return null
}

export async function deleteEventPhoto(eventId: string, photoId: string) {
  const { supabase, user } = await getAuthUser()

  const { data: event } = await supabase
    .from('events').select('id').eq('id', eventId).eq('user_id', user.id).single()
  if (!event) return

  const admin = createAdminClient()
  const { data: photo } = await admin
    .from('event_photos').select('url').eq('id', photoId).single()

  await admin.from('event_photos').delete().eq('id', photoId)

  if (photo?.url) {
    const path = photo.url.split('/wedding-images/')[1]
    if (path) await supabase.storage.from('wedding-images').remove([path])
  }

  revalidatePath(`/events/${eventId}/gallery`)
}
