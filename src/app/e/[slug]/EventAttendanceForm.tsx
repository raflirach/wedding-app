'use client'

import { useActionState, useState } from 'react'
import { submitEventRsvp } from '@/app/actions/events'
import type { ColorScheme } from '@/lib/templates'

type Props = { weddingId: string; colors: ColorScheme; defaultName?: string; eventId: string }

export default function EventAttendanceForm({ colors, defaultName, eventId }: Props) {
  const submitWithId = submitEventRsvp.bind(null, eventId)
  const [state, action, isPending] = useActionState(submitWithId, undefined)
  const [status, setStatus] = useState<'attending' | 'not_attending'>('attending')

  if (state?.success) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: colors.primaryLight }}>
        <p className="text-3xl mb-3">🙏</p>
        <p className="font-semibold text-lg mb-1" style={{ color: colors.textDark }}>Terima kasih!</p>
        <p className="text-sm" style={{ color: colors.textMuted }}>Konfirmasi dan ucapan kamu sudah kami terima.</p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1.5" style={{ color: colors.textDark }}>Nama</label>
        <input name="name" type="text" defaultValue={defaultName ?? ''} placeholder="Tulis nama kamu..." required
          className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all"
          style={{ borderColor: colors.accent + '60', backgroundColor: 'white' }} />
      </div>
      <input type="hidden" name="rsvp_status" value={status} />
      <div>
        <label className="text-sm font-medium block mb-2" style={{ color: colors.textDark }}>Konfirmasi Kehadiran</label>
        <div className="grid grid-cols-2 gap-3">
          {(['attending', 'not_attending'] as const).map((s) => (
            <button key={s} type="button" onClick={() => setStatus(s)}
              className="rounded-xl py-3 text-sm font-semibold border-2 transition-all"
              style={status === s
                ? { backgroundColor: colors.primary, borderColor: colors.primary, color: 'white' }
                : { borderColor: colors.accent + '60', color: colors.textMuted }}>
              {s === 'attending' ? '✓ Hadir' : '✗ Tidak Hadir'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1.5" style={{ color: colors.textDark }}>
          Ucapan & Doa <span className="font-normal opacity-60">(opsional)</span>
        </label>
        <textarea name="message" rows={3} placeholder="Tulis ucapan..."
          className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all resize-none"
          style={{ borderColor: colors.accent + '60', backgroundColor: 'white' }} />
      </div>
      {state?.error && <p className="text-sm text-center font-medium" style={{ color: '#dc2626' }}>{state.error}</p>}
      <button type="submit" disabled={isPending}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        style={{ backgroundColor: colors.primary }}>
        {isPending ? 'Mengirim...' : 'Kirim'}
      </button>
    </form>
  )
}
