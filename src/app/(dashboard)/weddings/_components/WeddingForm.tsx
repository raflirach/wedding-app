'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import type { WeddingActionResult } from '@/app/actions/weddings'
import { TEMPLATES, COLOR_SCHEMES } from '@/lib/templates'

export const weddingSchema = z.object({
  bride_name: z.string().min(2, 'Minimal 2 karakter'),
  groom_name: z.string().min(2, 'Minimal 2 karakter'),
  wedding_date: z.string().optional(),
  wedding_time: z.string().optional(),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  venue_maps_url: z.string().optional(),
  slug: z.string()
    .min(3, 'Minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan -'),
  theme: z.string(),
  color_scheme: z.string(),
})

export type WeddingFormValues = z.infer<typeof weddingSchema>

function toSlug(a: string, b: string) {
  return `${a}-dan-${b}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type Props = {
  defaultValues?: Partial<WeddingFormValues>
  onSubmit: (data: WeddingFormValues) => Promise<WeddingActionResult>
  submitLabel: string
  cancelHref: string
}

export default function WeddingForm({ defaultValues, onSubmit, submitLabel, cancelHref }: Props) {
  const [serverError, setServerError] = useState<string>()

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<WeddingFormValues>({
      resolver: zodResolver(weddingSchema),
      defaultValues: {
        theme: 'elegant',
        color_scheme: 'blush',
        ...defaultValues,
      },
    })

  const brideName = watch('bride_name', '')
  const groomName = watch('groom_name', '')
  const selectedTheme = watch('theme')
  const selectedColor = watch('color_scheme')
  const isEdit = !!defaultValues?.bride_name

  function syncSlug(bride: string, groom: string) {
    if (!isEdit && (bride || groom)) {
      setValue('slug', toSlug(bride, groom), { shouldValidate: false })
    }
  }

  async function submit(data: WeddingFormValues) {
    setServerError(undefined)
    const result = await onSubmit(data)
    if (result?.error) setServerError(result.error)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">

      {/* Data Mempelai */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="font-semibold text-base">Data Mempelai</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="bride_name">
                <span className="label-text">Mempelai Wanita *</span>
              </label>
              <input
                id="bride_name"
                {...register('bride_name', { onChange: (e) => syncSlug(e.target.value, groomName) })}
                type="text" placeholder="Contoh: Sari"
                className={`input input-bordered ${errors.bride_name ? 'input-error' : ''}`}
              />
              {errors.bride_name && <span className="text-error text-xs mt-1">{errors.bride_name.message}</span>}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="groom_name">
                <span className="label-text">Mempelai Pria *</span>
              </label>
              <input
                id="groom_name"
                {...register('groom_name', { onChange: (e) => syncSlug(brideName, e.target.value) })}
                type="text" placeholder="Contoh: Budi"
                className={`input input-bordered ${errors.groom_name ? 'input-error' : ''}`}
              />
              {errors.groom_name && <span className="text-error text-xs mt-1">{errors.groom_name.message}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Waktu & Tempat */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="font-semibold text-base">Waktu & Tempat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="wedding_date"><span className="label-text">Tanggal</span></label>
              <input id="wedding_date" {...register('wedding_date')} type="date" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="wedding_time"><span className="label-text">Waktu</span></label>
              <input id="wedding_time" {...register('wedding_time')} type="time" className="input input-bordered" />
            </div>
          </div>
          <div className="form-control">
            <label className="label" htmlFor="venue_name"><span className="label-text">Nama Venue</span></label>
            <input id="venue_name" {...register('venue_name')} type="text" placeholder="Gedung Serbaguna XYZ" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="venue_address"><span className="label-text">Alamat</span></label>
            <textarea id="venue_address" {...register('venue_address')} placeholder="Alamat lengkap..." className="textarea textarea-bordered" rows={2} />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="venue_maps_url"><span className="label-text">Link Google Maps</span></label>
            <input id="venue_maps_url" {...register('venue_maps_url')} type="url" placeholder="https://maps.google.com/..." className="input input-bordered" />
          </div>
        </div>
      </div>

      {/* Template */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="font-semibold text-base">Desain Template</h2>
          <input type="hidden" {...register('theme')} />
          <div className="grid grid-cols-3 gap-3 mt-2">
            {Object.values(TEMPLATES).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setValue('theme', t.id)}
                className={`rounded-xl border-2 p-4 text-center transition-all ${
                  selectedTheme === t.id
                    ? 'border-primary bg-primary/5'
                    : 'border-base-300 hover:border-primary/40'
                }`}
              >
                <div className="text-3xl mb-2">{t.icon}</div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-base-content/50 mt-1">{t.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color Scheme */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="font-semibold text-base">Skema Warna</h2>
          <input type="hidden" {...register('color_scheme')} />
          <div className="flex flex-wrap gap-3 mt-2">
            {Object.values(COLOR_SCHEMES).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setValue('color_scheme', c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm transition-all ${
                  selectedColor === c.id
                    ? 'border-primary font-semibold'
                    : 'border-base-300 hover:border-primary/40'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: c.swatch }}
                />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* URL */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="font-semibold text-base">URL Undangan</h2>
          <p className="text-sm text-base-content/60 mb-2">
            {isEdit ? 'Ubah slug akan memutus link lama yang sudah dibagikan.' : 'Otomatis diisi dari nama — bisa diubah manual.'}
          </p>
          <label className="input input-bordered flex items-center gap-1">
            <span className="text-base-content/40 text-sm">/w/</span>
            <input {...register('slug')} type="text" placeholder="nama-dan-nama" className="grow text-sm" />
          </label>
          {errors.slug && <span className="text-error text-xs mt-1">{errors.slug.message}</span>}
        </div>
      </div>

      {serverError && (
        <div role="alert" className="alert alert-error">
          <span>{serverError}</span>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Link href={cancelHref} className="btn btn-ghost">Batal</Link>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : submitLabel}
        </button>
      </div>
    </form>
  )
}
