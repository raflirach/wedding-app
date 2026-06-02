'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import type { WeddingActionResult } from '@/app/actions/weddings'
import { TEMPLATES, COLOR_SCHEMES } from '@/lib/templates'
import CoverPhotoUpload from '@/components/CoverPhotoUpload'
import MusicUpload from '@/components/MusicUpload'

export const weddingSchema = z.object({
  bride_name: z.string().min(2, 'Minimal 2 karakter'),
  groom_name: z.string().min(2, 'Minimal 2 karakter'),
  wedding_date: z.string().optional(),
  wedding_time: z.string().optional(),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  venue_maps_url: z.string().optional(),
  akad_date: z.string().optional(),
  akad_time: z.string().optional(),
  akad_venue_name: z.string().optional(),
  akad_venue_address: z.string().optional(),
  akad_venue_maps_url: z.string().optional(),
  slug: z.string()
    .min(3, 'Minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan -'),
  theme: z.string(),
  color_scheme: z.string(),
  cover_photo_url: z.string().optional(),
  bride_full_name: z.string().optional(),
  groom_full_name: z.string().optional(),
  bride_parents: z.string().optional(),
  groom_parents: z.string().optional(),
  opening_text: z.string().optional(),
  music_url: z.string().optional(),
  bank_1_name: z.string().optional(),
  bank_1_account_name: z.string().optional(),
  bank_1_account_number: z.string().optional(),
  bank_2_name: z.string().optional(),
  bank_2_account_name: z.string().optional(),
  bank_2_account_number: z.string().optional(),
  timeline: z.array(z.object({
    time: z.string(),
    title: z.string().min(1, 'Judul wajib diisi'),
    description: z.string().optional(),
  })).optional(),
  love_story: z.array(z.object({
    date: z.string(),
    title: z.string().min(1, 'Judul wajib diisi'),
    description: z.string().optional(),
  })).optional(),
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

  const { register, handleSubmit, setValue, watch, control, formState: { errors, isSubmitting } } =
    useForm<WeddingFormValues>({
      resolver: zodResolver(weddingSchema),
      defaultValues: {
        theme: 'elegant',
        color_scheme: 'blush',
        timeline: [],
        love_story: [],
        ...defaultValues,
      },
    })

  const { fields: timelineFields, append: appendTimeline, remove: removeTimeline } =
    useFieldArray({ control, name: 'timeline' })

  const { fields: storyFields, append: appendStory, remove: removeStory } =
    useFieldArray({ control, name: 'love_story' })

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

      {/* Detail Lengkap Mempelai */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="font-semibold text-base">Detail Lengkap Mempelai</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="bride_full_name">
                <span className="label-text">Nama Lengkap Mempelai Wanita</span>
              </label>
              <input id="bride_full_name" {...register('bride_full_name')} type="text"
                placeholder="Contoh: Sari Dewi Kusuma, S.Pd" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="groom_full_name">
                <span className="label-text">Nama Lengkap Mempelai Pria</span>
              </label>
              <input id="groom_full_name" {...register('groom_full_name')} type="text"
                placeholder="Contoh: Budi Santoso, S.T" className="input input-bordered" />
            </div>
          </div>
          <div className="form-control">
            <label className="label" htmlFor="bride_parents">
              <span className="label-text">Nama Orang Tua Mempelai Wanita</span>
            </label>
            <input id="bride_parents" {...register('bride_parents')} type="text"
              placeholder="Putri dari Bapak Ahmad & Ibu Siti" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="groom_parents">
              <span className="label-text">Nama Orang Tua Mempelai Pria</span>
            </label>
            <input id="groom_parents" {...register('groom_parents')} type="text"
              placeholder="Putra dari Bapak Hendra & Ibu Wati" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="opening_text">
              <span className="label-text">Kata Pembuka</span>
            </label>
            <textarea id="opening_text" {...register('opening_text')} rows={3}
              placeholder="Contoh: Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami..."
              className="textarea textarea-bordered" />
            <label className="label">
              <span className="label-text-alt text-base-content/40">Tampil di bagian atas undangan</span>
            </label>
          </div>
        </div>
      </div>

      {/* Akad Nikah */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <div>
            <h2 className="font-semibold text-base">Akad Nikah</h2>
            <p className="text-sm text-base-content/60 mt-1">Kosongkan jika tidak ada acara akad terpisah</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="akad_date"><span className="label-text">Tanggal</span></label>
              <input id="akad_date" {...register('akad_date')} type="date" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="akad_time"><span className="label-text">Waktu</span></label>
              <input id="akad_time" {...register('akad_time')} type="time" className="input input-bordered" />
            </div>
          </div>
          <div className="form-control">
            <label className="label" htmlFor="akad_venue_name"><span className="label-text">Nama Tempat</span></label>
            <input id="akad_venue_name" {...register('akad_venue_name')} type="text" placeholder="Masjid Al-Ikhlas / Rumah Mempelai" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="akad_venue_address"><span className="label-text">Alamat</span></label>
            <textarea id="akad_venue_address" {...register('akad_venue_address')} placeholder="Alamat lengkap..." className="textarea textarea-bordered" rows={2} />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="akad_venue_maps_url"><span className="label-text">Link Google Maps</span></label>
            <input id="akad_venue_maps_url" {...register('akad_venue_maps_url')} type="url" placeholder="https://maps.google.com/..." className="input input-bordered" />
          </div>
        </div>
      </div>

      {/* Resepsi */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="font-semibold text-base">Resepsi</h2>
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

      {/* Foto Sampul */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="font-semibold text-base">Foto Sampul</h2>
          <p className="text-sm text-base-content/60 mb-2">
            Foto pasangan yang akan ditampilkan di bagian atas undangan
          </p>
          <input type="hidden" {...register('cover_photo_url')} />
          <CoverPhotoUpload
            value={watch('cover_photo_url')}
            onChange={(url) => setValue('cover_photo_url', url)}
          />
        </div>
      </div>

      {/* Musik */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="font-semibold text-base">Musik Latar</h2>
          <p className="text-sm text-base-content/60 mb-2">
            Upload file MP3 — akan diputar otomatis di halaman undangan
          </p>
          <input type="hidden" {...register('music_url')} />
          <MusicUpload
            value={watch('music_url')}
            onChange={(url) => setValue('music_url', url)}
          />
        </div>
      </div>

      {/* Our Story */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <div>
            <h2 className="font-semibold text-base">Perjalanan Cinta</h2>
            <p className="text-sm text-base-content/60 mt-1">Cerita singkat perjalanan kalian — tampil di undangan</p>
          </div>
          {storyFields.map((field, i) => (
            <div key={field.id} className="border border-base-300 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label"><span className="label-text text-xs">Tahun / Tanggal</span></label>
                  <input {...register(`love_story.${i}.date`)} type="text" placeholder="2020 / 14 Feb 2021" className="input input-bordered input-sm" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text text-xs">Judul Momen</span></label>
                  <input {...register(`love_story.${i}.title`)} type="text" placeholder="Pertama Bertemu" className="input input-bordered input-sm" />
                </div>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-xs">Cerita singkat (opsional)</span></label>
                <textarea {...register(`love_story.${i}.description`)} rows={2} placeholder="Kami pertama kali bertemu di..." className="textarea textarea-bordered textarea-sm" />
              </div>
              <button type="button" onClick={() => removeStory(i)} className="btn btn-ghost btn-xs text-error">
                Hapus
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendStory({ date: '', title: '', description: '' })}
            className="btn btn-outline btn-sm w-full"
          >
            + Tambah Momen
          </button>
        </div>
      </div>

      {/* Timeline / Rundown Acara */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <div>
            <h2 className="font-semibold text-base">Rundown Acara</h2>
            <p className="text-sm text-base-content/60 mt-1">Jadwal rangkaian acara — tampil di undangan</p>
          </div>
          {timelineFields.map((field, i) => (
            <div key={field.id} className="border border-base-300 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label"><span className="label-text text-xs">Pukul</span></label>
                  <input {...register(`timeline.${i}.time`)} type="text" placeholder="08:00" className="input input-bordered input-sm" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text text-xs">Nama Acara</span></label>
                  <input {...register(`timeline.${i}.title`)} type="text" placeholder="Akad Nikah" className="input input-bordered input-sm" />
                </div>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-xs">Keterangan (opsional)</span></label>
                <input {...register(`timeline.${i}.description`)} type="text" placeholder="Masjid Al-Ikhlas" className="input input-bordered input-sm" />
              </div>
              <button type="button" onClick={() => removeTimeline(i)} className="btn btn-ghost btn-xs text-error">
                Hapus
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendTimeline({ time: '', title: '', description: '' })}
            className="btn btn-outline btn-sm w-full"
          >
            + Tambah Acara
          </button>
        </div>
      </div>

      {/* Amplop Digital */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <div>
            <h2 className="font-semibold text-base">Amplop Digital</h2>
            <p className="text-sm text-base-content/60 mt-1">
              Nomor rekening untuk transfer hadiah — tampil di undangan
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="form-control">
              <label className="label" htmlFor="bank_1_name"><span className="label-text">Nama Bank 1</span></label>
              <input id="bank_1_name" {...register('bank_1_name')} type="text"
                placeholder="BCA / BNI / Mandiri..." className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="bank_1_account_number"><span className="label-text">Nomor Rekening</span></label>
              <input id="bank_1_account_number" {...register('bank_1_account_number')} type="text"
                placeholder="1234567890" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="bank_1_account_name"><span className="label-text">Atas Nama</span></label>
              <input id="bank_1_account_name" {...register('bank_1_account_name')} type="text"
                placeholder="Nama pemilik rekening" className="input input-bordered" />
            </div>
          </div>
          <div className="divider my-0 text-xs text-base-content/30">Bank kedua (opsional)</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="form-control">
              <label className="label" htmlFor="bank_2_name"><span className="label-text">Nama Bank 2</span></label>
              <input id="bank_2_name" {...register('bank_2_name')} type="text"
                placeholder="BCA / BNI / Mandiri..." className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="bank_2_account_number"><span className="label-text">Nomor Rekening</span></label>
              <input id="bank_2_account_number" {...register('bank_2_account_number')} type="text"
                placeholder="1234567890" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="bank_2_account_name"><span className="label-text">Atas Nama</span></label>
              <input id="bank_2_account_name" {...register('bank_2_account_name')} type="text"
                placeholder="Nama pemilik rekening" className="input input-bordered" />
            </div>
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
