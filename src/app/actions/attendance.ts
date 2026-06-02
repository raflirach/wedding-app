'use server'

import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
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

  // Public client for guests — works with existing RLS policy
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error } = await supabase.from('guests').insert({
    wedding_id: weddingId,
    name: result.data.name,
    rsvp_status: result.data.rsvp_status,
  })

  if (error) return { error: error.message }

  // Admin client for wishes — bypass RLS
  if (result.data.message?.trim()) {
    try {
      const admin = createAdminClient()
      const { error: wishError } = await admin.from('wishes').insert({
        wedding_id: weddingId,
        name: result.data.name,
        message: result.data.message.trim(),
      })
      if (wishError) console.error('Wish insert error:', wishError.message)
    } catch (e) {
      console.error('Admin client error:', e)
    }
  }

  return { success: true }
}
