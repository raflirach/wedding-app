'use client'

import { useActionState, useRef } from 'react'
import { addGuest, type GuestState } from '@/app/actions/guests'

export default function AddGuestForm({ weddingId }: { weddingId: string }) {
  const addWithId = addGuest.bind(null, weddingId)
  const [state, action, isPending] = useActionState<GuestState, FormData>(addWithId, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="font-semibold text-base">Tambah Tamu</h2>
        <form
          ref={formRef}
          action={async (formData) => {
            await action(formData)
            formRef.current?.reset()
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label" htmlFor="guest-name">
                <span className="label-text">Nama *</span>
              </label>
              <input
                id="guest-name"
                name="name"
                type="text"
                placeholder="Nama tamu"
                className="input input-bordered input-sm"
                required
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="guest-phone">
                <span className="label-text">WhatsApp</span>
              </label>
              <input
                id="guest-phone"
                name="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                className="input input-bordered input-sm"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="guest-email">
              <span className="label-text">Email</span>
            </label>
            <input
              id="guest-email"
              name="email"
              type="email"
              placeholder="email@contoh.com"
              className="input input-bordered input-sm"
            />
          </div>

          {state?.error && (
            <div role="alert" className="alert alert-error text-sm py-2">
              <span>{state.error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm" disabled={isPending}>
              {isPending ? <span className="loading loading-spinner loading-xs" /> : '+ Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
