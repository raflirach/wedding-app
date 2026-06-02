import Image from 'next/image'
import type { ColorScheme } from '@/lib/templates'
import type { Photo } from './types'

export default function GallerySection({ photos, colors }: { photos: Photo[]; colors: ColorScheme }) {
  if (photos.length === 0) return null

  return (
    <section className="py-12 px-4 max-w-2xl mx-auto">
      <p
        className="text-xs tracking-[0.3em] uppercase text-center mb-6"
        style={{ color: colors.textMuted }}
      >
        Galeri Foto
      </p>
      <div className={`grid gap-2 ${photos.length === 1 ? 'grid-cols-1' : photos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className={`relative overflow-hidden rounded-xl ${
              photos.length >= 3 && i === 0 ? 'col-span-2 row-span-2 aspect-square' :
              photos.length === 1 ? 'aspect-video' : 'aspect-square'
            }`}
          >
            <Image
              src={photo.url}
              alt={`Foto ${i + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          </div>
        ))}
      </div>
    </section>
  )
}
