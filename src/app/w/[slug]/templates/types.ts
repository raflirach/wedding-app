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
  bank_1_name: string | null
  bank_1_account_name: string | null
  bank_1_account_number: string | null
  bank_2_name: string | null
  bank_2_account_name: string | null
  bank_2_account_number: string | null
}

export type Wish = {
  id: string
  name: string
  message: string
  created_at: string
}

export type Photo = {
  id: string
  url: string
}

export type TemplateProps = {
  wedding: WeddingData
  colors: ColorScheme
  AttendanceForm: React.ComponentType<{ weddingId: string; colors: ColorScheme; defaultName?: string }>
  WishesDisplayComponent: React.ComponentType<{ wishes: Wish[]; colors: ColorScheme }>
  wishes: Wish[]
  photos: Photo[]
  weddingId: string
  guestName?: string
}
