import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import UserMenu from './UserMenu'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    : { data: null }

  return (
    <div className="min-h-screen bg-base-200">
      <nav className="navbar bg-base-100 shadow-sm px-4 md:px-6 sticky top-0 z-30 border-b border-base-200">
        {/* Logo */}
        <div className="flex-1">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">💍</span>
            <span className="font-bold text-primary hidden sm:block">Wedding App</span>
          </Link>
        </div>

        {/* Nav links */}
        <div className="flex-none hidden md:flex items-center gap-1 mr-4">
          <Link href="/dashboard" className="btn btn-ghost btn-sm">
            Dashboard
          </Link>
          <Link href="/weddings/new" className="btn btn-ghost btn-sm">
            + Buat Undangan
          </Link>
        </div>

        {/* User menu */}
        <div className="flex-none flex items-center gap-2">
          {/* Mobile: buat undangan */}
          <Link href="/weddings/new" className="btn btn-primary btn-sm md:hidden">
            + Buat
          </Link>

          {user && (
            <UserMenu
              name={profile?.full_name ?? null}
              email={user.email ?? ''}
            />
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {children}
      </main>
    </div>
  )
}
