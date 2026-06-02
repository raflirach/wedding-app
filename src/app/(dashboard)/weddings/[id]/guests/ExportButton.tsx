'use client'

import * as XLSX from 'xlsx'

type Guest = {
  name: string
  phone: string | null
  email: string | null
  rsvp_status: string
  created_at: string
}

const STATUS_LABEL: Record<string, string> = {
  attending: 'Hadir',
  not_attending: 'Tidak Hadir',
  pending: 'Belum Konfirmasi',
}

export default function ExportButton({ guests, slug }: { guests: Guest[]; slug: string }) {
  function exportExcel() {
    const rows = guests.map((g) => ({
      Nama: g.name,
      WhatsApp: g.phone ?? '',
      Email: g.email ?? '',
      'Status Kehadiran': STATUS_LABEL[g.rsvp_status] ?? g.rsvp_status,
      'Waktu Daftar': new Date(g.created_at).toLocaleString('id-ID'),
    }))

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Tamu')
    XLSX.writeFile(wb, `tamu-${slug}.xlsx`)
  }

  return (
    <button onClick={exportExcel} className="btn btn-outline btn-sm gap-2" disabled={guests.length === 0}>
      ⬇ Export Excel
    </button>
  )
}
