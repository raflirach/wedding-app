'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Plus, X, CalendarDays, Mail } from 'lucide-react'

export default function FabMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 md:hidden">
      {open && (
        <>
          <Link
            href="/events/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 btn btn-sm btn-secondary shadow-lg"
          >
            <CalendarDays size={16} /> Event
          </Link>
          <Link
            href="/weddings/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 btn btn-sm btn-secondary shadow-lg"
          >
            <Mail size={16} /> Undangan
          </Link>
        </>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Buat baru"
        className="btn btn-primary btn-circle shadow-xl"
      >
        {open ? <X size={22} /> : <Plus size={22} />}
      </button>
    </div>
  )
}
