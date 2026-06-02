'use server'

import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error: guestError } = await supabase.from('guests').insert({
    wedding_id: weddingId,
    name: result.data.name,
    rsvp_status: result.data.rsvp_status,
  })

  if (guestError) return { error: guestError.message }

  if (result.data.message?.trim()) {
    const { error: wishError } = await supabase.from('wishes').insert({
      wedding_id: weddingId,
      name: result.data.name,
      message: result.data.message.trim(),
    })
    if (wishError) return { error: wishError.message }
  }

  return { success: true }
}
