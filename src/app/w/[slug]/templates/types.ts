import type { ColorScheme } from '@/lib/templates'

export type WeddingData = {
  bride_name: string
  groom_name: string
  wedding_date: string | null
  wedding_time: string | null
  venue_name: string | null
  venue_address: string | null
  venue_maps_url: string | null
  cover_photo_url: string | null
  slug: string
}

export type TemplateProps = {
  wedding: WeddingData
  colors: ColorScheme
  RsvpForm: React.ComponentType<{ weddingId: string }>
  weddingId: string
}
