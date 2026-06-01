'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const WeddingSchema = z.object({
  bride_name: z.string().min(2, 'Nama mempelai wanita minimal 2 karakter.'),
  groom_name: z.string().min(2, 'Nama mempelai pria minimal 2 karakter.'),
  wedding_date: z.string().optional(),
  wedding_time: z.string().optional(),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  venue_maps_url: z.string().optional(),
  slug: z.string().min(3, 'Slug minimal 3 karakter.').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung.'),
  theme: z.string().default('elegant'),
  color_scheme: z.string().default('blush'),
})

export type WeddingFormData = z.infer<typeof WeddingSchema>
export type WeddingActionResult = { error: string } | undefined

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function createWedding(data: WeddingFormData): Promise<WeddingActionResult> {
  const result = WeddingSchema.safeParse(data)
  if (!result.success) return { error: result.error.issues[0].message }

  const { supabase, user } = await getAuthUser()

  const { data: wedding, error } = await supabase
    .from('weddings')
    .insert({
      ...result.data,
      wedding_date: result.data.wedding_date || null,
      wedding_time: result.data.wedding_time || null,
      venue_name: result.data.venue_name || null,
      venue_address: result.data.venue_address || null,
      venue_maps_url: result.data.venue_maps_url || null,
      theme: result.data.theme,
      color_scheme: result.data.color_scheme,
      user_id: user.id,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Slug sudah digunakan, coba yang lain.' }
    return { error: error.message }
  }

  redirect(`/weddings/${wedding.id}`)
}

export async function updateWedding(id: string, data: WeddingFormData): Promise<WeddingActionResult> {
  const result = WeddingSchema.safeParse(data)
  if (!result.success) return { error: result.error.issues[0].message }

  const { supabase, user } = await getAuthUser()

  const { error } = await supabase
    .from('weddings')
    .update({
      ...result.data,
      wedding_date: result.data.wedding_date || null,
      wedding_time: result.data.wedding_time || null,
      venue_name: result.data.venue_name || null,
      venue_address: result.data.venue_address || null,
      venue_maps_url: result.data.venue_maps_url || null,
      theme: result.data.theme,
      color_scheme: result.data.color_scheme,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    if (error.code === '23505') return { error: 'Slug sudah digunakan, coba yang lain.' }
    return { error: error.message }
  }

  revalidatePath(`/weddings/${id}`)
  revalidatePath('/dashboard')
}

export async function deleteWedding(id: string): Promise<void> {
  const { supabase, user } = await getAuthUser()

  const { error } = await supabase
    .from('weddings')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  redirect('/dashboard')
}

export async function togglePublish(id: string, isPublished: boolean): Promise<void> {
  const { supabase, user } = await getAuthUser()

  const { error } = await supabase
    .from('weddings')
    .update({ is_published: !isPublished, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath(`/weddings/${id}`)
}
