'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const RsvpSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter.'),
  status: z.enum(['attending', 'not_attending']),
})

export type RsvpState = { success?: boolean; error?: string } | undefined

export async function submitRsvp(
  weddingId: string,
  prevState: RsvpState,
  formData: FormData
): Promise<RsvpState> {
  const result = RsvpSchema.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
  })

  if (!result.success) return { error: result.error.issues[0].message }

  const supabase = createAdminClient()

  const { error } = await supabase.from('guests').insert({
    wedding_id: weddingId,
    name: result.data.name,
    rsvp_status: result.data.status,
  })

  if (error) return { error: 'Gagal menyimpan konfirmasi. Coba lagi.' }

  return { success: true }
}
