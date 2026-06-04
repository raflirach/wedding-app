'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

type Props = {
  value?: string
  onChange: (url: string) => void
  label?: string
}

export default function PersonPhotoUpload({ value, onChange, label = 'Upload foto' }: Props) {
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
    const path = `persons/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

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
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-dashed border-base-300 cursor-pointer hover:border-primary/50 transition-colors flex items-center justify-center bg-base-200"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <>
            <Image src={value} alt="Foto mempelai" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange('') }}
              className="absolute top-1 right-1 btn btn-xs btn-error btn-circle"
            >
              ✕
            </button>
          </>
        ) : uploading ? (
          <span className="loading loading-spinner loading-md text-primary" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-center px-2">
            <span className="text-2xl">📷</span>
            <span className="text-xs text-base-content/50 leading-tight">{label}</span>
          </div>
        )}
      </div>
      <p className="text-xs text-base-content/40">JPG, PNG · Maks 5MB</p>

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
