'use client'

import { deleteEvent } from '@/app/actions/events'

export default function DeleteEventButton({ id }: { id: string }) {
  const deleteWithId = deleteEvent.bind(null, id)

  return (
    <form action={deleteWithId}>
      <button
        type="submit"
        className="btn btn-ghost btn-sm text-error"
        onClick={(e) => {
          if (!confirm('Hapus event ini?')) {
            e.preventDefault()
          }
        }}
      >
        Hapus
      </button>
    </form>
  )
}
