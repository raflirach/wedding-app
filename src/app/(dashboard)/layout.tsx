import { logout } from '@/app/actions/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-200">
      <nav className="navbar bg-base-100 shadow-sm px-4">
        <div className="flex-1">
          <span className="text-lg font-bold text-primary">💍 Wedding App</span>
        </div>
        <div className="flex-none">
          <form action={logout}>
            <button type="submit" className="btn btn-ghost btn-sm">
              Keluar
            </button>
          </form>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
