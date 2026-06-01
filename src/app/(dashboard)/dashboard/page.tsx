import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: weddings }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase
      .from('weddings')
      .select('id, bride_name, groom_name, wedding_date, slug, is_published')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Halo, {profile?.full_name ?? user.email} 👋
          </h1>
          <p className="text-base-content/60 mt-1">Kelola undangan pernikahanmu</p>
        </div>
        <Link href="/dashboard/weddings/new" className="btn btn-primary">
          + Buat Undangan
        </Link>
      </div>

      {weddings && weddings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weddings.map((w) => (
            <Link
              key={w.id}
              href={`/dashboard/weddings/${w.id}`}
              className="card bg-base-100 shadow hover:shadow-md transition-shadow"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <h2 className="card-title text-base">
                    {w.bride_name} & {w.groom_name}
                  </h2>
                  <span className={`badge badge-sm ${w.is_published ? 'badge-success' : 'badge-ghost'}`}>
                    {w.is_published ? 'Publik' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-base-content/60">
                  {w.wedding_date
                    ? new Date(w.wedding_date).toLocaleDateString('id-ID', { dateStyle: 'long' })
                    : 'Tanggal belum diset'}
                </p>
                <p className="text-xs text-base-content/40">/w/{w.slug}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card bg-base-100 shadow">
          <div className="card-body items-center text-center py-16">
            <p className="text-4xl mb-3">💍</p>
            <p className="font-medium">Belum ada undangan</p>
            <p className="text-base-content/60 text-sm mb-4">
              Buat undangan digital pertamamu sekarang
            </p>
            <Link href="/dashboard/weddings/new" className="btn btn-primary">
              Buat Undangan Pertama
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
