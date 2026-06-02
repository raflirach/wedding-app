import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Cormorant_Garamond, Playfair_Display, Lora } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { getTemplate, getColorScheme } from '@/lib/templates'
import ElegantTemplate from './templates/Elegant'
import ModernTemplate from './templates/Modern'
import FloralTemplate from './templates/Floral'
import AttendanceForm from './AttendanceForm'
import WishesDisplay from './WishesDisplay'
import InvitationOpener from './InvitationOpener'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '600', '700'], style: ['normal', 'italic'], display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'], style: ['normal', 'italic'], display: 'swap' })
const lora = Lora({ subsets: ['latin'], weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], display: 'swap' })

const FONT_MAP = { elegant: cormorant, modern: playfair, floral: lora }

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ to?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('weddings')
    .select('bride_name, groom_name, wedding_date')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Undangan Pernikahan' }

  return {
    title: `Undangan ${data.bride_name} & ${data.groom_name}`,
    description: data.wedding_date
      ? new Date(data.wedding_date).toLocaleDateString('id-ID', { dateStyle: 'long' })
      : `Undangan pernikahan ${data.bride_name} & ${data.groom_name}`,
  }
}

const TEMPLATE_MAP = {
  elegant: ElegantTemplate,
  modern: ModernTemplate,
  floral: FloralTemplate,
}

export default async function InvitationPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { to } = await searchParams
  const guestName = to ? decodeURIComponent(to) : undefined
  const supabase = await createClient()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!wedding) notFound()

  const [{ data: wishes }, { data: photos }] = await Promise.all([
    supabase
      .from('wishes')
      .select('id, name, message, created_at')
      .eq('wedding_id', wedding.id)
      .neq('is_hidden', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('wedding_photos')
      .select('id, url')
      .eq('wedding_id', wedding.id)
      .order('position'),
  ])

  const templateId = getTemplate(wedding.theme ?? 'elegant')
  const colors = getColorScheme(wedding.color_scheme ?? 'blush')
  const Template = TEMPLATE_MAP[templateId]
  const font = FONT_MAP[templateId]

  return (
    <div className={font.className}>
    <InvitationOpener
      brideName={wedding.bride_name}
      groomName={wedding.groom_name}
      weddingDate={wedding.wedding_date}
      musicUrl={wedding.music_url ?? null}
      colors={colors}
      guestName={guestName}
    >
      <Template
        wedding={wedding}
        colors={colors}
        AttendanceForm={AttendanceForm}
        WishesDisplayComponent={WishesDisplay}
        wishes={wishes ?? []}
        photos={photos ?? []}
        weddingId={wedding.id}
        guestName={guestName}
      />
    </InvitationOpener>
    </div>
  )
}
