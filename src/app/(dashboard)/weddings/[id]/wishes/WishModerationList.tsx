'use client'

import { toggleWishVisibility, deleteWish } from '@/app/actions/wishes'

type Wish = {
  id: string
  name: string
  message: string
  created_at: string
  is_hidden: boolean
}

export default function WishModerationList({ wishes, weddingId }: { wishes: Wish[]; weddingId: string }) {
  if (wishes.length === 0) {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body items-center text-center py-10">
          <p className="text-base-content/40">Belum ada ucapan masuk</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {wishes.map((wish) => {
        const toggleWithIds = toggleWishVisibility.bind(null, weddingId, wish.id, wish.is_hidden)
        const deleteWithIds = deleteWish.bind(null, weddingId, wish.id)

        return (
          <div
            key={wish.id}
            className={`card bg-base-100 shadow transition-opacity ${wish.is_hidden ? 'opacity-50' : ''}`}
          >
            <div className="card-body py-4 px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{wish.name}</p>
                    {wish.is_hidden && (
                      <span className="badge badge-ghost badge-xs">Disembunyikan</span>
                    )}
                  </div>
                  <p className="text-sm text-base-content/70 leading-relaxed">{wish.message}</p>
                  <p className="text-xs text-base-content/40 mt-2">
                    {new Date(wish.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <form action={toggleWithIds}>
                    <button type="submit" className="btn btn-ghost btn-xs">
                      {wish.is_hidden ? 'Tampilkan' : 'Sembunyikan'}
                    </button>
                  </form>
                  <form action={deleteWithIds}>
                    <button
                      type="submit"
                      className="btn btn-ghost btn-xs text-error"
                      onClick={(e) => !confirm('Hapus ucapan ini permanen?') && e.preventDefault()}
                    >
                      Hapus
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
