import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Cormorant_Garamond, Playfair_Display, Lora } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { getTemplate, getColorScheme } from '@/lib/templates'
import { getEventType } from '@/lib/events'

import ElegantTemplate from '@/app/w/[slug]/templates/Elegant'
import ModernTemplate from '@/app/w/[slug]/templates/Modern'
import FloralTemplate from '@/app/w/[slug]/templates/Floral'
import WishesDisplay from '@/app/w/[slug]/WishesDisplay'
import InvitationOpener from '@/app/w/[slug]/InvitationOpener'
import EventAttendanceForm from './EventAttendanceForm'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300','400','600','700'], style: ['normal','italic'], display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400','700','900'], style: ['normal','italic'], display: 'swap' })
const lora = Lora({ subsets: ['latin'], weight: ['400','500','600','700'], style: ['normal','italic'], display: 'swap' })
const FONT_MAP = { elegant: cormorant, modern: playfair, floral: lora }
const TEMPLATE_MAP = { elegant: ElegantTemplate, modern: ModernTemplate, floral: FloralTemplate }

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ to?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('event_title, event_date').eq('slug', slug).single()
  if (!data) return { title: 'Undangan Event' }
  return {
    title: data.event_title,
    description: data.event_date ? new Date(data.event_date).toLocaleDateString('id-ID', { dateStyle: 'long' }) : data.event_title,
  }
}

export default async function EventPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { to } = await searchParams
  const guestName = to ? decodeURIComponent(to) : undefined
  const supabase = await createClient()

  const { data: event } = await supabase.from('events').select('*').eq('slug', slug).single()
  if (!event) notFound()

  const { data: wishes } = await supabase
    .from('event_wishes')
    .select('id, name, message, created_at')
    .eq('event_id', event.id)
    .neq('is_hidden', true)
    .order('created_at', { ascending: false })

  const templateId = getTemplate(event.theme ?? 'elegant')
  const colors = getColorScheme(event.color_scheme ?? 'blush')
  const Template = TEMPLATE_MAP[templateId]
  const font = FONT_MAP[templateId]
  const eventType = getEventType(event.event_type)

  // Map event data to WeddingData structure for template reuse
  const weddingData = {
    bride_name: event.event_title,
    groom_name: event.host_name ?? '',
    bride_full_name: null,
    groom_full_name: null,
    bride_parents: null,
    groom_parents: null,
    opening_text: event.description ?? null,
    wedding_date: event.event_date ?? null,
    wedding_time: event.event_time ?? null,
    venue_name: event.venue_name ?? null,
    venue_address: event.venue_address ?? null,
    venue_maps_url: event.venue_maps_url ?? null,
    cover_photo_url: event.cover_photo_url ?? null,
    music_url: event.music_url ?? null,
    slug: event.slug,
    akad_date: null,
    akad_time: null,
    akad_venue_name: null,
    akad_venue_address: null,
    akad_venue_maps_url: null,
    bank_1_name: event.bank_1_name ?? null,
    bank_1_account_name: event.bank_1_account_name ?? null,
    bank_1_account_number: event.bank_1_account_number ?? null,
    bank_2_name: event.bank_2_name ?? null,
    bank_2_account_name: event.bank_2_account_name ?? null,
    bank_2_account_number: event.bank_2_account_number ?? null,
    timeline: null,
    love_story: null,
    show_pattern: event.show_pattern ?? true,
    event_type: event.event_type,
    event_title: event.event_title,
    host_name: event.host_name ?? null,
  }

  return (
    <div className={font.className}>
      <InvitationOpener
        title={event.event_title}
        subtitle={null}
        weddingDate={event.event_date ?? null}
        musicUrl={event.music_url ?? null}
        colors={colors}
        guestName={guestName}
        label={`Undangan ${eventType.label}`}
      >
        <Template
          wedding={weddingData}
          colors={colors}
          AttendanceForm={(props) => <EventAttendanceForm {...props} eventId={event.id} />}
          WishesDisplayComponent={WishesDisplay}
          wishes={wishes ?? []}
          photos={[]}
          weddingId={event.id}
          guestName={guestName}
        />
      </InvitationOpener>
    </div>
  )
}
