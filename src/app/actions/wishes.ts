'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAnonClient } from '@supabase/supabase-js'

function createPublicClient() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

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

  const supabase = createPublicClient()

  const { error } = await supabase.from('wishes').insert({
    wedding_id: weddingId,
    name: result.data.name,
    message: result.data.message,
  })

  if (error) return { error: 'Gagal menyimpan ucapan. Coba lagi.' }

  revalidatePath(`/w/`)
  return { success: true }
}

async function getAuthUser() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function toggleWishVisibility(weddingId: string, wishId: string, isHidden: boolean) {
  const { supabase, user } = await getAuthUser()

  const { data: wedding } = await supabase
    .from('weddings').select('id').eq('id', weddingId).eq('user_id', user.id).single()
  if (!wedding) return

  await supabase.from('wishes').update({ is_hidden: !isHidden }).eq('id', wishId).eq('wedding_id', weddingId)

  revalidatePath(`/weddings/${weddingId}/wishes`)
}

export async function deleteWish(weddingId: string, wishId: string) {
  const { supabase, user } = await getAuthUser()

  const { data: wedding } = await supabase
    .from('weddings').select('id').eq('id', weddingId).eq('user_id', user.id).single()
  if (!wedding) return

  await supabase.from('wishes').delete().eq('id', wishId).eq('wedding_id', weddingId)

  revalidatePath(`/weddings/${weddingId}/wishes`)
}
