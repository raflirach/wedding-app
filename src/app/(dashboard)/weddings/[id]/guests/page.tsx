import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AddGuestForm from './AddGuestForm'
import GuestList from './GuestList'

export default async function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('wedding_id', id)
    .order('created_at', { ascending: false })

  const all = guests ?? []
  const attending = all.filter((g) => g.rsvp_status === 'attending').length
  const notAttending = all.filter((g) => g.rsvp_status === 'not_attending').length
  const pending = all.filter((g) => g.rsvp_status === 'pending').length

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/weddings/${id}`} className="btn btn-ghost btn-sm btn-square">
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Kelola Tamu</h1>
          <p className="text-base-content/60 text-sm">
            {wedding.bride_name} & {wedding.groom_name}
          </p>
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
            <p className="text-2xl font-bold text-success">{attending}</p>
            <p className="text-xs text-base-content/60">Hadir</p>
          </div>
        </div>
        <div className="card bg-error/10 shadow text-center">
          <div className="card-body py-3 px-2">
            <p className="text-2xl font-bold text-error">{notAttending}</p>
            <p className="text-xs text-base-content/60">Tidak Hadir</p>
          </div>
        </div>
      </div>

      {/* Add Guest Form */}
      <AddGuestForm weddingId={id} />

      {/* Guest List */}
      <GuestList guests={all} weddingId={id} pending={pending} />
    </div>
  )
}
