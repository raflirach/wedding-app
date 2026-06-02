'use client'

import { useState } from 'react'
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

function toWaPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('62')) return digits
  if (digits.startsWith('0')) return '62' + digits.slice(1)
  return digits
}

function CopyLinkButton({ slug, guestName }: { slug: string; guestName: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    const url = `${window.location.origin}/w/${slug}?to=${encodeURIComponent(guestName)}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button type="button" onClick={copy} className="btn btn-ghost btn-xs text-info">
      {copied ? 'Tersalin!' : 'Salin Link'}
    </button>
  )
}

function WhatsAppButton({
  slug, guestName, phone, brideName, groomName, weddingDate,
}: {
  slug: string
  guestName: string
  phone: string | null
  brideName: string
  groomName: string
  weddingDate: string | null
}) {
  function open() {
    const inviteUrl = `${window.location.origin}/w/${slug}?to=${encodeURIComponent(guestName)}`
    const dateStr = weddingDate
      ? new Date(weddingDate).toLocaleDateString('id-ID', { dateStyle: 'long' })
      : ''

    const lines = [
      `Halo ${guestName} 👋`,
      '',
      'Kami mengundang kehadiran Bapak/Ibu/Saudara/i dalam acara pernikahan:',
      '',
      `*${brideName} & ${groomName}*`,
      dateStr ? `📅 ${dateStr}` : '',
      '',
      `Buka undangan lengkap di:\n${inviteUrl}`,
      '',
      'Mohon konfirmasi kehadiran melalui link undangan. Terima kasih 🙏',
    ].filter(Boolean)

    const text = encodeURIComponent(lines.join('\n'))
    const waPhone = phone ? toWaPhone(phone) : ''
    window.open(`https://wa.me/${waPhone}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <button type="button" onClick={open} className="btn btn-ghost btn-xs text-success">
      WA
    </button>
  )
}

export default function GuestList({
  guests,
  weddingId,
  slug,
  pending,
  brideName,
  groomName,
  weddingDate,
}: {
  guests: Guest[]
  weddingId: string
  slug: string
  pending: number
  brideName: string
  groomName: string
  weddingDate: string | null
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
                      <div className="flex gap-1">
                        <WhatsAppButton
                          slug={slug}
                          guestName={guest.name}
                          phone={guest.phone}
                          brideName={brideName}
                          groomName={groomName}
                          weddingDate={weddingDate}
                        />
                        <CopyLinkButton slug={slug} guestName={guest.name} />
                        <form action={deleteWithIds}>
                          <button
                            type="submit"
                            className="btn btn-ghost btn-xs text-error"
                            onClick={(e) => !confirm(`Hapus ${guest.name}?`) && e.preventDefault()}
                          >
                            Hapus
                          </button>
                        </form>
                      </div>
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
