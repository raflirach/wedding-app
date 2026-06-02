'use client'

import { useState } from 'react'
import { logout } from '@/app/actions/auth'

export default function UserMenu({ name, email }: { name: string | null; email: string }) {
  const [open, setOpen] = useState(false)

  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : email[0].toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 btn btn-ghost btn-sm pr-2"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-content text-sm font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium max-w-32 truncate">
          {name ?? email}
        </span>
        <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-base-100 rounded-xl shadow-lg border border-base-200 z-20 py-1 overflow-hidden">
            <div className="px-4 py-3 border-b border-base-200">
              <p className="text-sm font-semibold truncate">{name ?? 'Pengguna'}</p>
              <p className="text-xs text-base-content/50 truncate">{email}</p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Keluar
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
