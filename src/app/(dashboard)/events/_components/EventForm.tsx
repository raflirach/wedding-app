'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { EVENT_TYPES } from '@/lib/events'
import { TEMPLATES, COLOR_SCHEMES } from '@/lib/templates'
import CoverPhotoUpload from '@/components/CoverPhotoUpload'
import MusicUpload from '@/components/MusicUpload'
import type { EventActionResult } from '@/app/actions/events'

export const eventSchema = z.object({
  event_type: z.string(),
  event_title: z.string().min(2, 'Minimal 2 karakter'),
  host_name: z.string().optional(),
  description: z.string().optional(),
  event_date: z.string().optional(),
  event_time: z.string().optional(),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  venue_maps_url: z.string().optional(),
  slug: z.string().min(3, 'Minimal 3 karakter').regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan -'),
  theme: z.string(),
  color_scheme: z.string(),
  cover_photo_url: z.string().optional(),
  music_url: z.string().optional(),
  show_pattern: z.boolean().optional(),
  bank_1_name: z.string().optional(),
  bank_1_account_name: z.string().optional(),
  bank_1_account_number: z.string().optional(),
  bank_2_name: z.string().optional(),
  bank_2_account_name: z.string().optional(),
  bank_2_account_number: z.string().optional(),
})

export type EventFormValues = z.infer<typeof eventSchema>

function toSlug(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type Props = {
  defaultValues?: Partial<EventFormValues>
  onSubmit: (data: EventFormValues) => Promise<EventActionResult>
  submitLabel: string
  cancelHref: string
}

const EVENT_OPTIONS = EVENT_TYPES.filter((e) => e.id !== 'wedding')

export default function EventForm({ defaultValues, onSubmit, submitLabel, cancelHref }: Props) {
  const [serverError, setServerError] = useState<string>()

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<EventFormValues>({
      resolver: zodResolver(eventSchema),
      defaultValues: {
        event_type: 'reunion',
        theme: 'elegant',
        color_scheme: 'blush',
        show_pattern: true,
        ...defaultValues,
      },
    })

  const selectedTheme = watch('theme')
  const selectedColor = watch('color_scheme')
  const selectedType = watch('event_type')
  const isEdit = !!defaultValues?.event_title

  async function submit(data: EventFormValues) {
    setServerError(undefined)
    const result = await onSubmit(data)
    if (result?.error) setServerError(result.error)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">

      {/* Jenis Event */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="font-semibold text-base">Jenis Event</h2>
          <input type="hidden" {...register('event_type')} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
            {EVENT_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setValue('event_type', t.id)}
                className={`rounded-xl border-2 p-3 text-center transition-all ${
                  selectedType === t.id ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/40'
                }`}
              >
                <div className="text-2xl mb-1">{t.icon}</div>
                <p className="font-semibold text-sm">{t.label}</p>
                <p className="text-xs text-base-content/50 mt-0.5">{t.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Event */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="font-semibold text-base">Info Event</h2>
          <div className="form-control">
            <label className="label" htmlFor="event_title">
              <span className="label-text">Judul Event *</span>
            </label>
            <input
              id="event_title"
              {...register('event_title', {
                onChange: (e) => {
                  if (!isEdit) setValue('slug', toSlug(e.target.value), { shouldValidate: false })
                },
              })}
              type="text"
              placeholder="Contoh: Reuni Angkatan 2005, Syukuran Rumah Baru"
              className={`input input-bordered ${errors.event_title ? 'input-error' : ''}`}
            />
            {errors.event_title && <span className="text-error text-xs mt-1">{errors.event_title.message}</span>}
          </div>
          <div className="form-control">
            <label className="label" htmlFor="host_name">
              <span className="label-text">Nama Penyelenggara / Host</span>
            </label>
            <input id="host_name" {...register('host_name')} type="text"
              placeholder="Keluarga Besar Hasan / Panitia Reuni 2005" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="description">
              <span className="label-text">Kata Pembuka / Deskripsi</span>
            </label>
            <textarea id="description" {...register('description')} rows={3}
              placeholder="Dengan hormat, kami mengundang kehadiran Bapak/Ibu..."
              className="textarea textarea-bordered" />
          </div>
        </div>
      </div>

      {/* Waktu & Tempat */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="font-semibold text-base">Waktu & Tempat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="event_date"><span className="label-text">Tanggal</span></label>
              <input id="event_date" {...register('event_date')} type="date" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="event_time"><span className="label-text">Waktu</span></label>
              <input id="event_time" {...register('event_time')} type="time" className="input input-bordered" />
            </div>
          </div>
          <div className="form-control">
            <label className="label" htmlFor="venue_name"><span className="label-text">Nama Tempat</span></label>
            <input id="venue_name" {...register('venue_name')} type="text" placeholder="Gedung / Aula / Rumah" className="input input-bordered" />
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
              <button key={t.id} type="button" onClick={() => setValue('theme', t.id)}
                className={`rounded-xl border-2 p-4 text-center transition-all ${
                  selectedTheme === t.id ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/40'
                }`}>
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
              <button key={c.id} type="button" onClick={() => setValue('color_scheme', c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm transition-all ${
                  selectedColor === c.id ? 'border-primary font-semibold' : 'border-base-300 hover:border-primary/40'
                }`}>
                <span className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: c.swatch }} />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pola Latar */}
      <div className="card bg-base-100 shadow">
        <div className="card-body flex-row items-center justify-between py-4">
          <div>
            <p className="font-semibold text-base">Pola Latar Belakang</p>
            <p className="text-sm text-base-content/60 mt-0.5">Tambahkan tekstur halus di latar undangan</p>
          </div>
          <input type="checkbox" className="toggle toggle-primary"
            checked={watch('show_pattern') ?? true}
            onChange={(e) => setValue('show_pattern', e.target.checked)} />
        </div>
      </div>

      {/* Foto Sampul */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="font-semibold text-base">Foto Sampul</h2>
          <input type="hidden" {...register('cover_photo_url')} />
          <CoverPhotoUpload value={watch('cover_photo_url')} onChange={(url) => setValue('cover_photo_url', url)} />
        </div>
      </div>

      {/* Musik */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="font-semibold text-base">Musik Latar</h2>
          <input type="hidden" {...register('music_url')} />
          <MusicUpload value={watch('music_url')} onChange={(url) => setValue('music_url', url)} />
        </div>
      </div>

      {/* Amplop Digital */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <div>
            <h2 className="font-semibold text-base">Amplop Digital</h2>
            <p className="text-sm text-base-content/60 mt-1">Nomor rekening untuk transfer hadiah (opsional)</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="form-control">
              <label className="label" htmlFor="bank_1_name"><span className="label-text">Nama Bank 1</span></label>
              <input id="bank_1_name" {...register('bank_1_name')} type="text" placeholder="BCA / BNI..." className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="bank_1_account_number"><span className="label-text">Nomor Rekening</span></label>
              <input id="bank_1_account_number" {...register('bank_1_account_number')} type="text" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="bank_1_account_name"><span className="label-text">Atas Nama</span></label>
              <input id="bank_1_account_name" {...register('bank_1_account_name')} type="text" className="input input-bordered" />
            </div>
          </div>
          <div className="divider my-0 text-xs text-base-content/30">Bank kedua (opsional)</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="form-control">
              <label className="label" htmlFor="bank_2_name"><span className="label-text">Nama Bank 2</span></label>
              <input id="bank_2_name" {...register('bank_2_name')} type="text" placeholder="BCA / BNI..." className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="bank_2_account_number"><span className="label-text">Nomor Rekening</span></label>
              <input id="bank_2_account_number" {...register('bank_2_account_number')} type="text" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="bank_2_account_name"><span className="label-text">Atas Nama</span></label>
              <input id="bank_2_account_name" {...register('bank_2_account_name')} type="text" className="input input-bordered" />
            </div>
          </div>
        </div>
      </div>

      {/* URL */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="font-semibold text-base">URL Undangan</h2>
          <label className="input input-bordered flex items-center gap-1">
            <span className="text-base-content/40 text-sm">/e/</span>
            <input {...register('slug')} type="text" placeholder="nama-event" className="grow text-sm" />
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
