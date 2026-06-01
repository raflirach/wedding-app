'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const AddGuestSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter.'),
  phone: z.string().optional(),
  email: z.email({ error: 'Email tidak valid.' }).optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type GuestState = { error?: string } | undefined

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function addGuest(
  weddingId: string,
  prevState: GuestState,
  formData: FormData
): Promise<GuestState> {
  const result = AddGuestSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    notes: formData.get('notes'),
  })

  if (!result.success) return { error: result.error.issues[0].message }

  const { supabase, user } = await getAuthUser()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('id')
    .eq('id', weddingId)
    .eq('user_id', user.id)
    .single()

  if (!wedding) return { error: 'Undangan tidak ditemukan.' }

  const { error } = await supabase.from('guests').insert({
    wedding_id: weddingId,
    name: result.data.name,
    phone: result.data.phone || null,
    email: result.data.email || null,
    notes: result.data.notes || null,
  })

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/weddings/${weddingId}/guests`)
}

export async function deleteGuest(weddingId: string, guestId: string) {
  const { supabase, user } = await getAuthUser()

  await supabase
    .from('guests')
    .delete()
    .eq('id', guestId)
    .eq('wedding_id', weddingId)
    .eq(
      'wedding_id',
      supabase.from('weddings').select('id').eq('id', weddingId).eq('user_id', user.id)
    )

  revalidatePath(`/dashboard/weddings/${weddingId}/guests`)
}

export async function updateRsvpStatus(
  weddingId: string,
  guestId: string,
  status: 'pending' | 'attending' | 'not_attending'
) {
  const { supabase, user } = await getAuthUser()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('id')
    .eq('id', weddingId)
    .eq('user_id', user.id)
    .single()

  if (!wedding) return

  await supabase
    .from('guests')
    .update({ rsvp_status: status })
    .eq('id', guestId)
    .eq('wedding_id', weddingId)

  revalidatePath(`/dashboard/weddings/${weddingId}/guests`)
}
