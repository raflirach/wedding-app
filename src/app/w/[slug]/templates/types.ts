import type { ColorScheme } from '@/lib/templates'

export type WeddingData = {
  bride_name: string
  groom_name: string
  bride_full_name: string | null
  groom_full_name: string | null
  bride_parents: string | null
  groom_parents: string | null
  opening_text: string | null
  wedding_date: string | null
  wedding_time: string | null
  venue_name: string | null
  venue_address: string | null
  venue_maps_url: string | null
  cover_photo_url: string | null
  music_url: string | null
  slug: string
}

export type Wish = {
  id: string
  name: string
  message: string
  created_at: string
}

export type TemplateProps = {
  wedding: WeddingData
  colors: ColorScheme
  RsvpForm: React.ComponentType<{ weddingId: string }>
  WishFormComponent: React.ComponentType<{ weddingId: string; colors: ColorScheme }>
  WishesDisplayComponent: React.ComponentType<{ wishes: Wish[]; colors: ColorScheme }>
  wishes: Wish[]
  weddingId: string
}
