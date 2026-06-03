'use client'

import { deleteWedding } from '@/app/actions/weddings'

export default function DeleteButton({ id }: { id: string }) {
  const deleteWithId = deleteWedding.bind(null, id)

  return (
    <form action={deleteWithId}>
      <button
        type="submit"
        className="btn btn-error btn-outline btn-sm w-16"
        onClick={(e) => {
          if (!confirm('Hapus undangan ini? Semua data tamu juga akan terhapus.')) {
            e.preventDefault()
          }
        }}
      >
        Hapus
      </button>
    </form>
  )
}
