'use client'

import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { bulkImportGuests } from '@/app/actions/guests'

type ParsedGuest = {
  name: string
  phone: string
  email: string
  notes: string
  valid: boolean
}

function normalizeKey(key: string): string {
  return key.trim().toLowerCase()
}

function col(row: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const found = Object.keys(row).find((r) => normalizeKey(r) === k)
    if (found) return String(row[found] ?? '').trim()
  }
  return ''
}

function parseSheet(data: ArrayBuffer): ParsedGuest[] {
  const wb = XLSX.read(data, { type: 'array' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)

  return rows.map((row) => {
    const name = col(row, ['name', 'nama'])
    const phone = col(row, ['phone', 'hp', 'telepon', 'nomor', 'whatsapp'])
    const email = col(row, ['email'])
    const notes = col(row, ['notes', 'catatan', 'keterangan'])
    return { name, phone, email, notes, valid: name.length >= 2 }
  }).filter((g) => g.name !== '')
}

function downloadTemplate() {
  const rows = [
    { Nama: 'Budi Santoso', WhatsApp: '081234567890', Email: 'budi@email.com', Catatan: '' },
    { Nama: 'Sari Dewi', WhatsApp: '082345678901', Email: '', Catatan: 'Keluarga' },
  ]
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Tamu')
  XLSX.writeFile(wb, 'template-tamu.xlsx')
}

export default function ImportGuestsButton({ weddingId }: { weddingId: string }) {
  const [open, setOpen] = useState(false)
  const [guests, setGuests] = useState<ParsedGuest[]>([])
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ imported: number; error?: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setResult(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const data = ev.target?.result as ArrayBuffer
      setGuests(parseSheet(data))
    }
    reader.readAsArrayBuffer(file)
  }

  async function handleImport() {
    const valid = guests.filter((g) => g.valid)
    if (!valid.length) return
    setLoading(true)
    const res = await bulkImportGuests(weddingId, valid)
    setResult(res)
    setLoading(false)
    if (!res.error) {
      setGuests([])
      setFileName('')
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleClose() {
    setOpen(false)
    setGuests([])
    setFileName('')
    setResult(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const validCount = guests.filter((g) => g.valid).length
  const invalidCount = guests.length - validCount

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn btn-outline btn-sm">
        Import Excel
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">Import Tamu dari Excel</h3>
                  <p className="text-sm text-base-content/60 mt-0.5">
                    Kolom wajib: <code className="text-xs bg-base-200 px-1 py-0.5 rounded">Nama</code>.
                    Opsional: <code className="text-xs bg-base-200 px-1 py-0.5 rounded">WhatsApp</code>,{' '}
                    <code className="text-xs bg-base-200 px-1 py-0.5 rounded">Email</code>,{' '}
                    <code className="text-xs bg-base-200 px-1 py-0.5 rounded">Catatan</code>
                  </p>
                </div>
                <button onClick={handleClose} className="btn btn-ghost btn-sm btn-square">✕</button>
              </div>

              {/* Download template */}
              <button
                type="button"
                onClick={downloadTemplate}
                className="text-xs text-primary underline underline-offset-2"
              >
                Download template Excel
              </button>

              {/* File input */}
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFile}
                className="file-input file-input-bordered file-input-sm w-full"
              />

              {/* Preview */}
              {guests.length > 0 && !result && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-success font-medium">{validCount} tamu valid</span>
                    {invalidCount > 0 && (
                      <span className="text-error font-medium">{invalidCount} dilewati</span>
                    )}
                  </div>
                  <div className="overflow-x-auto max-h-52 rounded-xl border border-base-300">
                    <table className="table table-xs">
                      <thead className="sticky top-0 bg-base-200">
                        <tr>
                          <th>Nama</th>
                          <th>HP</th>
                          <th>Email</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {guests.map((g, i) => (
                          <tr key={i} className={g.valid ? '' : 'opacity-40'}>
                            <td className="font-medium">{g.name}</td>
                            <td className="text-base-content/60">{g.phone || '—'}</td>
                            <td className="text-base-content/60">{g.email || '—'}</td>
                            <td>
                              {!g.valid && <span className="badge badge-error badge-xs">skip</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Result */}
              {result && (
                <div className={`alert ${result.error ? 'alert-error' : 'alert-success'} py-3`}>
                  <span className="text-sm">
                    {result.error ?? `${result.imported} tamu berhasil diimpor!`}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-1">
                <button onClick={handleClose} className="btn btn-ghost btn-sm">
                  {result && !result.error ? 'Tutup' : 'Batal'}
                </button>
                {!result && (
                  <button
                    onClick={handleImport}
                    disabled={validCount === 0 || loading}
                    className="btn btn-primary btn-sm"
                  >
                    {loading
                      ? <span className="loading loading-spinner loading-xs" />
                      : `Impor ${validCount} Tamu`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
