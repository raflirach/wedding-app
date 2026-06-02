'use client'

import { useActionState } from 'react'
import { submitAttendance, type AttendanceState } from '@/app/actions/attendance'
import type { ColorScheme } from '@/lib/templates'

export default function AttendanceForm({ weddingId, colors }: { weddingId: string; colors: ColorScheme }) {
  const submitWithId = submitAttendance.bind(null, weddingId)
  const [state, action, isPending] = useActionState<AttendanceState, FormData>(submitWithId, undefined)

  if (state?.success) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: colors.primaryLight }}>
        <p className="text-3xl mb-3">🙏</p>
        <p className="font-semibold text-lg mb-1" style={{ color: colors.textDark }}>
          Terima kasih!
        </p>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          Konfirmasi dan ucapan kamu sudah kami terima.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      {/* Nama */}
      <div>
        <label className="text-sm font-medium block mb-1.5" style={{ color: colors.textDark }}>
          Nama
        </label>
        <input
          name="name"
          type="text"
          placeholder="Tulis nama kamu..."
          required
          className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all"
          style={{ borderColor: colors.accent + '60', backgroundColor: 'white' }}
        />
      </div>

      {/* Kehadiran */}
      <div>
        <label className="text-sm font-medium block mb-2" style={{ color: colors.textDark }}>
          Konfirmasi Kehadiran
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="cursor-pointer">
            <input type="radio" name="rsvp_status" value="attending" className="hidden peer" defaultChecked />
            <div
              className="rounded-xl py-3 text-center text-sm font-semibold border-2 transition-all peer-checked:text-white"
              style={{
                borderColor: colors.primary,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = colors.primary
                el.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = ''
                el.style.color = ''
              }}
            >
              ✓ Hadir
            </div>
          </label>
          <label className="cursor-pointer">
            <input type="radio" name="rsvp_status" value="not_attending" className="hidden peer" />
            <div
              className="rounded-xl py-3 text-center text-sm font-semibold border-2 transition-all"
              style={{ borderColor: colors.accent + '60' }}
            >
              ✗ Tidak Hadir
            </div>
          </label>
        </div>
      </div>

      {/* Ucapan */}
      <div>
        <label className="text-sm font-medium block mb-1.5" style={{ color: colors.textDark }}>
          Ucapan & Doa <span className="font-normal opacity-60">(opsional)</span>
        </label>
        <textarea
          name="message"
          rows={3}
          placeholder="Tulis ucapan dan doa untuk pasangan..."
          className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all resize-none"
          style={{ borderColor: colors.accent + '60', backgroundColor: 'white' }}
        />
      </div>

      {state?.error && (
        <p className="text-red-500 text-xs">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        style={{ backgroundColor: colors.primary }}
      >
        {isPending ? 'Mengirim...' : 'Kirim'}
      </button>
    </form>
  )
}
