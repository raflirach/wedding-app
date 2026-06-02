'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const AttendanceSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter.'),
  rsvp_status: z.enum(['attending', 'not_attending']),
  message: z.string().optional(),
})

export type AttendanceState = { success?: boolean; error?: string } | undefined

export async function submitAttendance(
  weddingId: string,
  prevState: AttendanceState,
  formData: FormData
): Promise<AttendanceState> {
  const result = AttendanceSchema.safeParse({
    name: formData.get('name'),
    rsvp_status: formData.get('rsvp_status'),
    message: formData.get('message'),
  })

  if (!result.success) return { error: result.error.issues[0].message }

  const supabase = createAdminClient()

  const { error } = await supabase.from('guests').insert({
    wedding_id: weddingId,
    name: result.data.name,
    rsvp_status: result.data.rsvp_status,
  })

  if (error) return { error: 'Gagal menyimpan konfirmasi. Coba lagi.' }

  if (result.data.message?.trim()) {
    await supabase.from('wishes').insert({
      wedding_id: weddingId,
      name: result.data.name,
      message: result.data.message.trim(),
    })
  }

  return { success: true }
}
