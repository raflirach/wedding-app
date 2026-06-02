import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getTemplate, getColorScheme } from '@/lib/templates'
import ElegantTemplate from './templates/Elegant'
import ModernTemplate from './templates/Modern'
import FloralTemplate from './templates/Floral'
import AttendanceForm from './AttendanceForm'
import WishesDisplay from './WishesDisplay'
import InvitationOpener from './InvitationOpener'

type Props = { params: Promise<{ slug: string }> }

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

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!wedding) notFound()

  const { data: wishes } = await supabase
    .from('wishes')
    .select('id, name, message, created_at')
    .eq('wedding_id', wedding.id)
    .order('created_at', { ascending: false })

  const templateId = getTemplate(wedding.theme ?? 'elegant')
  const colors = getColorScheme(wedding.color_scheme ?? 'blush')
  const Template = TEMPLATE_MAP[templateId]

  return (
    <InvitationOpener
      brideName={wedding.bride_name}
      groomName={wedding.groom_name}
      weddingDate={wedding.wedding_date}
      musicUrl={wedding.music_url ?? null}
      colors={colors}
    >
      <Template
        wedding={wedding}
        colors={colors}
        AttendanceForm={AttendanceForm}
        WishesDisplayComponent={WishesDisplay}
        wishes={wishes ?? []}
        weddingId={wedding.id}
      />
    </InvitationOpener>
  )
}
