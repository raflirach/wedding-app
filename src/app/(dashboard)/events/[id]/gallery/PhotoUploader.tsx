'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { addEventPhoto } from '@/app/actions/event-gallery'

export default function PhotoUploader({ eventId, photoCount }: { eventId: string; photoCount: number }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    setUploading(true)
    setError(undefined)
    const supabase = createClient()
    let errorMsg: string | undefined

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setProgress(Math.round((i / files.length) * 100))

      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `events/${eventId}/${Date.now()}-${i}.${ext}`

      const { data, error: uploadError } = await supabase.storage
        .from('wedding-images')
        .upload(path, file, { upsert: false })

      if (uploadError || !data) {
        errorMsg = 'Gagal mengupload foto. Pastikan ukuran file tidak terlalu besar dan coba lagi.'
        break
      }

      const { data: { publicUrl } } = supabase.storage
        .from('wedding-images').getPublicUrl(data.path)

      const dbError = await addEventPhoto(eventId, publicUrl, photoCount + i)
      if (dbError) {
        errorMsg = 'Foto terupload tapi gagal disimpan. Coba refresh halaman.'
        break
      }
    }

    setUploading(false)
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
    if (errorMsg) setError(errorMsg)
  }

  return (
    <div className="space-y-2">
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
      {error && (
        <div role="alert" className="alert alert-error text-sm py-2">
          <span>{error}</span>
        </div>
      )}
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
