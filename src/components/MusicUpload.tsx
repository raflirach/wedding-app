'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  value?: string
  onChange: (url: string) => void
}

export default function MusicUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB')
      return
    }

    setError(undefined)
    setUploading(true)

    const supabase = createClient()
    const ext = file.name.split('.').pop() ?? 'mp3'
    const path = `music/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error: uploadError } = await supabase.storage
      .from('wedding-images')
      .upload(path, file, { upsert: false })

    if (uploadError) {
      setError('Gagal upload. Coba lagi.')
    } else if (data) {
      const { data: { publicUrl } } = supabase.storage
        .from('wedding-images')
        .getPublicUrl(data.path)
      onChange(publicUrl)
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {/* Preview player */}
      {value && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-base-300 bg-base-200">
          <span className="text-2xl shrink-0">🎵</span>
          <audio controls src={value} className="flex-1 h-9 min-w-0" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="btn btn-xs btn-error btn-circle shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload area */}
      <div
        className="border-2 border-dashed border-base-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <span className="loading loading-spinner loading-md text-primary" />
            <p className="text-sm text-base-content/60">Mengupload musik...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl">🎵</span>
            <p className="text-sm font-medium">
              {value ? 'Ganti musik' : 'Upload file musik'}
            </p>
            <p className="text-xs text-base-content/40">MP3, M4A, WAV · Maks 10MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/mp4,audio/wav,audio/*"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />

      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  )
}
