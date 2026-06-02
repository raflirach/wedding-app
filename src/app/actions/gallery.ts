'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function addPhoto(weddingId: string, url: string, position: number) {
  const { supabase, user } = await getAuthUser()

  const { data: wedding } = await supabase
    .from('weddings').select('id').eq('id', weddingId).eq('user_id', user.id).single()
  if (!wedding) return

  await supabase.from('wedding_photos').insert({ wedding_id: weddingId, url, position })
  revalidatePath(`/weddings/${weddingId}/gallery`)
}

export async function deletePhoto(weddingId: string, photoId: string) {
  const { supabase, user } = await getAuthUser()

  const { data: wedding } = await supabase
    .from('weddings').select('id').eq('id', weddingId).eq('user_id', user.id).single()
  if (!wedding) return

  const { data: photo } = await supabase
    .from('wedding_photos').select('url').eq('id', photoId).single()

  await supabase.from('wedding_photos').delete().eq('id', photoId)

  if (photo?.url) {
    const path = photo.url.split('/wedding-images/')[1]
    if (path) await supabase.storage.from('wedding-images').remove([path])
  }

  revalidatePath(`/weddings/${weddingId}/gallery`)
}
