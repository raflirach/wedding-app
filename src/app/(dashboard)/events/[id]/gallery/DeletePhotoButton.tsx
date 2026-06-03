'use client'

import { deleteEventPhoto } from '@/app/actions/event-gallery'

export default function DeletePhotoButton({ eventId, photoId }: { eventId: string; photoId: string }) {
  const deleteWithIds = deleteEventPhoto.bind(null, eventId, photoId)

  return (
    <form action={deleteWithIds}>
      <button
        type="submit"
        className="btn btn-error btn-circle btn-xs"
        onClick={(e) => {
          if (!confirm('Hapus foto ini?')) e.preventDefault()
        }}
      >
        ✕
      </button>
    </form>
  )
}
