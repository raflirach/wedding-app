import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getEventType } from '@/lib/events'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: weddings }, { data: events }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase
      .from('weddings')
      .select('id, bride_name, groom_name, wedding_date, slug, is_published')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('events')
      .select('id, event_type, event_title, host_name, event_date, slug, is_published')
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
        <div className="flex gap-2">
          <Link href="/events/new" className="btn btn-outline btn-primary">
            + Buat Event
          </Link>
          <Link href="/weddings/new" className="btn btn-primary">
            + Buat Undangan
          </Link>
        </div>
      </div>

      {/* Undangan Pernikahan */}
      <div>
        <h2 className="text-lg font-semibold mb-3">💍 Undangan Pernikahan</h2>
        {weddings && weddings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weddings.map((w) => (
              <Link
                key={w.id}
                href={`/weddings/${w.id}`}
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
            <div className="card-body items-center text-center py-10">
              <p className="text-4xl mb-3">💍</p>
              <p className="font-medium">Belum ada undangan pernikahan</p>
              <p className="text-base-content/60 text-sm mb-4">
                Buat undangan digital pertamamu sekarang
              </p>
              <Link href="/weddings/new" className="btn btn-primary">
                Buat Undangan Pertama
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Event Lainnya */}
      <div>
        <h2 className="text-lg font-semibold mb-3">📅 Event Lainnya</h2>
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((e) => {
              const eventType = getEventType(e.event_type)
              return (
                <Link
                  key={e.id}
                  href={`/events/${e.id}`}
                  className="card bg-base-100 shadow hover:shadow-md transition-shadow"
                >
                  <div className="card-body">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{eventType.icon}</span>
                        <div>
                          <h2 className="card-title text-base">{e.event_title}</h2>
                          {e.host_name && <p className="text-xs text-base-content/50">oleh {e.host_name}</p>}
                        </div>
                      </div>
                      <span className={`badge badge-sm ${e.is_published ? 'badge-success' : 'badge-ghost'}`}>
                        {e.is_published ? 'Publik' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge badge-outline badge-xs">{eventType.label}</span>
                      <p className="text-sm text-base-content/60">
                        {e.event_date
                          ? new Date(e.event_date).toLocaleDateString('id-ID', { dateStyle: 'long' })
                          : 'Tanggal belum diset'}
                      </p>
                    </div>
                    <p className="text-xs text-base-content/40">/e/{e.slug}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center py-10">
              <p className="text-4xl mb-3">📅</p>
              <p className="font-medium">Belum ada event</p>
              <p className="text-base-content/60 text-sm mb-4">
                Buat undangan reuni, syukuran, ulang tahun, dan lainnya
              </p>
              <Link href="/events/new" className="btn btn-primary">
                Buat Event Pertama
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
