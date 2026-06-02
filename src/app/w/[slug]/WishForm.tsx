'use client'

import { useActionState, useRef } from 'react'
import { submitWish, type WishState } from '@/app/actions/wishes'
import type { ColorScheme } from '@/lib/templates'

export default function WishForm({ weddingId, colors }: { weddingId: string; colors: ColorScheme }) {
  const submitWithId = submitWish.bind(null, weddingId)
  const [state, action, isPending] = useActionState<WishState, FormData>(submitWithId, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  if (state?.success) {
    return (
      <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: colors.primaryLight }}>
        <p className="text-2xl mb-2">🙏</p>
        <p className="font-semibold" style={{ color: colors.textDark }}>
          Terima kasih atas ucapannya!
        </p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      action={async (fd) => { await action(fd); formRef.current?.reset() }}
      className="space-y-3"
    >
      <input
        name="name"
        type="text"
        placeholder="Nama kamu"
        required
        className="w-full rounded-xl px-4 py-3 text-sm border outline-none focus:ring-2 transition-all"
        style={{ borderColor: colors.accent + '50', backgroundColor: 'white',
          outlineColor: colors.primary }}
      />
      <textarea
        name="message"
        rows={3}
        placeholder="Tulis ucapan dan doa untuk pasangan..."
        required
        className="w-full rounded-xl px-4 py-3 text-sm border outline-none focus:ring-2 transition-all resize-none"
        style={{ borderColor: colors.accent + '50', backgroundColor: 'white' }}
      />

      {state?.error && (
        <p className="text-red-500 text-xs">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        style={{ backgroundColor: colors.primary }}
      >
        {isPending ? 'Mengirim...' : 'Kirim Ucapan'}
      </button>
    </form>
  )
}
