'use client'

import { deleteGuest, updateRsvpStatus } from '@/app/actions/guests'

type Guest = {
  id: string
  name: string
  phone: string | null
  email: string | null
  rsvp_status: string
  notes: string | null
}

const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  pending: { label: 'Belum konfirmasi', badge: 'badge-warning' },
  attending: { label: 'Hadir', badge: 'badge-success' },
  not_attending: { label: 'Tidak Hadir', badge: 'badge-error' },
}

export default function GuestList({
  guests,
  weddingId,
  pending,
}: {
  guests: Guest[]
  weddingId: string
  pending: number
}) {
  if (guests.length === 0) {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body items-center text-center py-10">
          <p className="text-base-content/40">Belum ada tamu ditambahkan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body p-0">
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <h2 className="font-semibold text-base">Daftar Tamu</h2>
          {pending > 0 && (
            <span className="badge badge-warning badge-sm">{pending} belum konfirmasi</span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kontak</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => {
                const status = STATUS_LABELS[guest.rsvp_status] ?? STATUS_LABELS.pending
                const deleteWithIds = deleteGuest.bind(null, weddingId, guest.id)

                return (
                  <tr key={guest.id}>
                    <td className="font-medium">{guest.name}</td>
                    <td className="text-base-content/60 text-xs">
                      {guest.phone && <p>{guest.phone}</p>}
                      {guest.email && <p>{guest.email}</p>}
                      {!guest.phone && !guest.email && '—'}
                    </td>
                    <td>
                      <select
                        className={`select select-xs badge ${status.badge} border-0 font-medium`}
                        defaultValue={guest.rsvp_status}
                        onChange={(e) =>
                          updateRsvpStatus(
                            weddingId,
                            guest.id,
                            e.target.value as 'pending' | 'attending' | 'not_attending'
                          )
                        }
                      >
                        <option value="pending">Belum konfirmasi</option>
                        <option value="attending">Hadir</option>
                        <option value="not_attending">Tidak Hadir</option>
                      </select>
                    </td>
                    <td>
                      <form action={deleteWithIds}>
                        <button
                          type="submit"
                          className="btn btn-ghost btn-xs text-error"
                          onClick={(e) => !confirm(`Hapus ${guest.name}?`) && e.preventDefault()}
                        >
                          Hapus
                        </button>
                      </form>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
