'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

const WishSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter.'),
  message: z.string().min(5, 'Pesan minimal 5 karakter.'),
})

export type WishState = { success?: boolean; error?: string } | undefined

export async function submitWish(
  weddingId: string,
  prevState: WishState,
  formData: FormData
): Promise<WishState> {
  const result = WishSchema.safeParse({
    name: formData.get('name'),
    message: formData.get('message'),
  })

  if (!result.success) return { error: result.error.issues[0].message }

  const supabase = createAdminClient()

  const { error } = await supabase.from('wishes').insert({
    wedding_id: weddingId,
    name: result.data.name,
    message: result.data.message,
  })

  if (error) return { error: 'Gagal menyimpan ucapan. Coba lagi.' }

  revalidatePath(`/w/`)
  return { success: true }
}
