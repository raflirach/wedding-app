'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { addPhoto } from '@/app/actions/gallery'

export default function PhotoUploader({ weddingId, photoCount }: { weddingId: string; photoCount: number }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    setUploading(true)
    const supabase = createClient()

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setProgress(Math.round(((i) / files.length) * 100))

      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `gallery/${weddingId}/${Date.now()}-${i}.${ext}`

      const { data, error } = await supabase.storage
        .from('wedding-images')
        .upload(path, file, { upsert: false })

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('wedding-images').getPublicUrl(data.path)
        await addPhoto(weddingId, publicUrl, photoCount + i)
      }
    }

    setUploading(false)
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <div
        className="border-2 border-dashed border-base-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className="space-y-2">
            <span className="loading loading-spinner loading-md text-primary" />
            <p className="text-sm text-base-content/60">Mengupload... {progress}%</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-3xl">🖼️</p>
            <p className="text-sm font-medium">Upload Foto</p>
            <p className="text-xs text-base-content/40">Pilih beberapa foto sekaligus · JPG, PNG, WebP</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
        disabled={uploading}
      />
    </div>
  )
}
