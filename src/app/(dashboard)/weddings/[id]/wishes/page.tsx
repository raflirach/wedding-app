import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import WishModerationList from './WishModerationList'

export default async function WishesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: wedding } = await supabase
    .from('weddings')
    .select('id, bride_name, groom_name')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!wedding) notFound()

  // Fetch without is_hidden first, fall back gracefully if column missing
  const { data: wishes, error } = await supabase
    .from('wishes')
    .select('id, name, message, created_at, is_hidden')
    .eq('wedding_id', id)
    .order('created_at', { ascending: false })

  let all: { id: string; name: string; message: string; created_at: string; is_hidden: boolean }[] = []

  if (error) {
    // is_hidden column doesn't exist yet — fetch without it
    const { data: fallback } = await supabase
      .from('wishes')
      .select('id, name, message, created_at')
      .eq('wedding_id', id)
      .order('created_at', { ascending: false })
    all = (fallback ?? []).map((w) => ({ ...w, is_hidden: false }))
  } else {
    all = (wishes ?? []).map((w) => ({ ...w, is_hidden: w.is_hidden ?? false }))
  }

  const visible = all.filter((w) => !w.is_hidden).length
  const hidden = all.filter((w) => w.is_hidden).length

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/weddings/${id}`} className="btn btn-ghost btn-sm btn-square">←</Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Moderasi Ucapan</h1>
          <p className="text-base-content/60 text-sm">{wedding.bride_name} & {wedding.groom_name}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card bg-base-100 shadow text-center">
          <div className="card-body py-3 px-2">
            <p className="text-2xl font-bold">{all.length}</p>
            <p className="text-xs text-base-content/60">Total</p>
          </div>
        </div>
        <div className="card bg-success/10 shadow text-center">
          <div className="card-body py-3 px-2">
            <p className="text-2xl font-bold text-success">{visible}</p>
            <p className="text-xs text-base-content/60">Tampil</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow text-center">
          <div className="card-body py-3 px-2">
            <p className="text-2xl font-bold text-base-content/40">{hidden}</p>
            <p className="text-xs text-base-content/60">Disembunyikan</p>
          </div>
        </div>
      </div>

      <WishModerationList wishes={all} weddingId={id} />
    </div>
  )
}
