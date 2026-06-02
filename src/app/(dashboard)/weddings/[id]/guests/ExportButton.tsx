'use client'

type Guest = {
  name: string
  phone: string | null
  email: string | null
  rsvp_status: string
  created_at: string
}

export default function ExportButton({ guests, slug }: { guests: Guest[]; slug: string }) {
  function exportCsv() {
    const headers = ['Nama', 'WhatsApp', 'Email', 'Status Kehadiran', 'Waktu Daftar']
    const statusLabel: Record<string, string> = {
      attending: 'Hadir',
      not_attending: 'Tidak Hadir',
      pending: 'Belum Konfirmasi',
    }
    const rows = guests.map((g) => [
      g.name,
      g.phone ?? '',
      g.email ?? '',
      statusLabel[g.rsvp_status] ?? g.rsvp_status,
      new Date(g.created_at).toLocaleString('id-ID'),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tamu-${slug}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button onClick={exportCsv} className="btn btn-outline btn-sm gap-2" disabled={guests.length === 0}>
      ⬇ Export CSV
    </button>
  )
}
