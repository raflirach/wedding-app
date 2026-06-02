'use client'

import { deletePhoto } from '@/app/actions/gallery'

export default function DeletePhotoButton({ weddingId, photoId }: { weddingId: string; photoId: string }) {
  const deleteWithIds = deletePhoto.bind(null, weddingId, photoId)

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
