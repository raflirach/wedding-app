'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

type Props = {
  value?: string
  onChange: (url: string) => void
}

export default function CoverPhotoUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB')
      return
    }

    setError(undefined)
    setUploading(true)

    const supabase = createClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error: uploadError } = await supabase.storage
      .from('wedding-images')
      .upload(path, file, { upsert: false })

    if (uploadError) {
      setError('Gagal upload foto. Coba lagi.')
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
      {value && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-base-300">
          <Image src={value} alt="Cover photo" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 btn btn-xs btn-error btn-circle"
          >
            ✕
          </button>
        </div>
      )}

      <div
        className="border-2 border-dashed border-base-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <span className="loading loading-spinner loading-md text-primary" />
            <p className="text-sm text-base-content/60">Mengupload...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl">🖼️</span>
            <p className="text-sm font-medium">{value ? 'Ganti foto' : 'Upload foto sampul'}</p>
            <p className="text-xs text-base-content/40">JPG, PNG, WebP · Maks 5MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />

      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  )
}
