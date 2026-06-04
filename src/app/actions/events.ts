'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAnonClient } from '@supabase/supabase-js'

const EventSchema = z.object({
  event_type: z.string(),
  event_title: z.string().min(2, 'Judul event minimal 2 karakter.'),
  host_name: z.string().optional(),
  description: z.string().optional(),
  event_date: z.string().optional(),
  event_time: z.string().optional(),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  venue_maps_url: z.string().optional(),
  slug: z.string().min(3, 'Slug minimal 3 karakter.').regex(/^[a-z0-9-]+$/, 'Slug hanya huruf kecil, angka, dan -'),
  theme: z.string(),
  color_scheme: z.string(),
  cover_photo_url: z.string().optional(),
  music_url: z.string().optional(),
  show_pattern: z.boolean().optional(),
  bank_1_name: z.string().optional(),
  bank_1_account_name: z.string().optional(),
  bank_1_account_number: z.string().optional(),
  bank_2_name: z.string().optional(),
  bank_2_account_name: z.string().optional(),
  bank_2_account_number: z.string().optional(),
})

export type EventFormData = z.infer<typeof EventSchema>
export type EventActionResult = { error: string } | undefined

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function createEvent(data: EventFormData): Promise<EventActionResult> {
  const result = EventSchema.safeParse(data)
  if (!result.success) return { error: result.error.issues[0].message }

  const { supabase, user } = await getAuthUser()
  const d = result.data

  const { data: event, error } = await supabase
    .from('events')
    .insert({
      user_id: user.id,
      event_type: d.event_type,
      event_title: d.event_title,
      host_name: d.host_name || null,
      description: d.description || null,
      event_date: d.event_date || null,
      event_time: d.event_time || null,
      venue_name: d.venue_name || null,
      venue_address: d.venue_address || null,
      venue_maps_url: d.venue_maps_url || null,
      slug: d.slug,
      theme: d.theme,
      color_scheme: d.color_scheme,
      cover_photo_url: d.cover_photo_url || null,
      music_url: d.music_url || null,
      show_pattern: d.show_pattern ?? true,
      bank_1_name: d.bank_1_name || null,
      bank_1_account_name: d.bank_1_account_name || null,
      bank_1_account_number: d.bank_1_account_number || null,
      bank_2_name: d.bank_2_name || null,
      bank_2_account_name: d.bank_2_account_name || null,
      bank_2_account_number: d.bank_2_account_number || null,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Slug sudah digunakan, coba yang lain.' }
    return { error: error.message }
  }

  redirect(`/events/${event.id}`)
}

export async function updateEvent(id: string, data: EventFormData): Promise<EventActionResult> {
  const result = EventSchema.safeParse(data)
  if (!result.success) return { error: result.error.issues[0].message }

  const { supabase, user } = await getAuthUser()
  const d = result.data

  const { error } = await supabase
    .from('events')
    .update({
      event_type: d.event_type,
      event_title: d.event_title,
      host_name: d.host_name || null,
      description: d.description || null,
      event_date: d.event_date || null,
      event_time: d.event_time || null,
      venue_name: d.venue_name || null,
      venue_address: d.venue_address || null,
      venue_maps_url: d.venue_maps_url || null,
      slug: d.slug,
      theme: d.theme,
      color_scheme: d.color_scheme,
      cover_photo_url: d.cover_photo_url || null,
      music_url: d.music_url || null,
      show_pattern: d.show_pattern ?? true,
      bank_1_name: d.bank_1_name || null,
      bank_1_account_name: d.bank_1_account_name || null,
      bank_1_account_number: d.bank_1_account_number || null,
      bank_2_name: d.bank_2_name || null,
      bank_2_account_name: d.bank_2_account_name || null,
      bank_2_account_number: d.bank_2_account_number || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    if (error.code === '23505') return { error: 'Slug sudah digunakan, coba yang lain.' }
    return { error: error.message }
  }

  revalidatePath(`/events/${id}`)
  redirect(`/events/${id}`)
}

export async function deleteEvent(id: string): Promise<void> {
  const { supabase, user } = await getAuthUser()
  await supabase.from('events').delete().eq('id', id).eq('user_id', user.id)
  redirect('/dashboard')
}

export async function toggleEventPublish(id: string, isPublished: boolean): Promise<void> {
  const { supabase, user } = await getAuthUser()
  await supabase.from('events').update({ is_published: !isPublished, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id)
  revalidatePath(`/events/${id}`)
}

export async function submitEventRsvp(
  eventId: string,
  prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim()
  const rsvp_status = formData.get('rsvp_status') as string
  const message = (formData.get('message') as string)?.trim()

  if (!name || name.length < 2) return { error: 'Nama minimal 2 karakter.' }
  if (!rsvp_status) return { error: 'Pilih konfirmasi kehadiran.' }

  const supabase = createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error } = await supabase.from('event_rsvp').insert({
    event_id: eventId,
    name,
    rsvp_status,
    message: message || null,
  })

  if (error) return { error: error.message }
  return { success: true }
}
