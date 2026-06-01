import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Halo, {profile?.full_name ?? user.email} 👋
        </h1>
        <p className="text-base-content/60 mt-1">
          Selamat datang di Wedding App
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-base">Undangan Saya</h2>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-sm text-base-content/60">undangan dibuat</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-base">Total Tamu</h2>
            <p className="text-3xl font-bold text-secondary">0</p>
            <p className="text-sm text-base-content/60">tamu ditambahkan</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-base">RSVP Masuk</h2>
            <p className="text-3xl font-bold text-accent">0</p>
            <p className="text-sm text-base-content/60">konfirmasi hadir</p>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body items-center text-center py-12">
          <p className="text-base-content/40 mb-4">Belum ada undangan</p>
          <button className="btn btn-primary">+ Buat Undangan Baru</button>
        </div>
      </div>
    </div>
  )
}
