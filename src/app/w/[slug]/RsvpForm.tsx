'use client'

import { useActionState } from 'react'
import { submitRsvp, type RsvpState } from '@/app/actions/rsvp'

export default function RsvpForm({ weddingId }: { weddingId: string }) {
  const submitWithId = submitRsvp.bind(null, weddingId)
  const [state, action, isPending] = useActionState<RsvpState, FormData>(submitWithId, undefined)

  if (state?.success) {
    return (
      <div className="card bg-success/10 border border-success/30">
        <div className="card-body items-center text-center py-8">
          <p className="text-3xl mb-2">🎉</p>
          <p className="font-semibold text-success">Terima kasih!</p>
          <p className="text-sm text-base-content/60">
            Konfirmasi kehadiran Anda telah kami terima.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="rsvp-name">
            <span className="label-text">Nama Anda</span>
          </label>
          <input
            id="rsvp-name"
            name="name"
            type="text"
            placeholder="Tulis nama lengkap..."
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Konfirmasi Kehadiran</span>
          </label>
          <div className="flex gap-3">
            <label className="flex-1 cursor-pointer">
              <input type="radio" name="status" value="attending" className="hidden peer" defaultChecked />
              <div className="btn btn-outline peer-checked:btn-success w-full">
                Hadir
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input type="radio" name="status" value="not_attending" className="hidden peer" />
              <div className="btn btn-outline peer-checked:btn-error w-full">
                Tidak Hadir
              </div>
            </label>
          </div>
        </div>

        {state?.error && (
          <div role="alert" className="alert alert-error text-sm py-2">
            <span>{state.error}</span>
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
          {isPending
            ? <span className="loading loading-spinner loading-sm" />
            : 'Kirim Konfirmasi'}
        </button>
      </div>
    </form>
  )
}
