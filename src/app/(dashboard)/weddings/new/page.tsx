'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { createWedding } from '@/app/actions/weddings'

const schema = z.object({
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
})

type FormValues = z.infer<typeof schema>

function toSlug(a: string, b: string) {
  return `${a}-dan-${b}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function NewWeddingPage() {
  const [serverError, setServerError] = useState<string>()

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  const brideName = watch('bride_name', '')
  const groomName = watch('groom_name', '')

  function syncSlug(bride: string, groom: string) {
    if (bride || groom) setValue('slug', toSlug(bride, groom), { shouldValidate: false })
  }

  async function onSubmit(data: FormValues) {
    setServerError(undefined)
    const result = await createWedding(data)
    if (result?.error) setServerError(result.error)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Buat Undangan Baru</h1>
        <p className="text-base-content/60 mt-1">Isi detail pernikahan kamu</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  {...register('bride_name', {
                    onChange: (e) => syncSlug(e.target.value, groomName),
                  })}
                  type="text"
                  placeholder="Contoh: Sari"
                  className={`input input-bordered ${errors.bride_name ? 'input-error' : ''}`}
                />
                {errors.bride_name && (
                  <span className="text-error text-xs mt-1">{errors.bride_name.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label" htmlFor="groom_name">
                  <span className="label-text">Mempelai Pria *</span>
                </label>
                <input
                  id="groom_name"
                  {...register('groom_name', {
                    onChange: (e) => syncSlug(brideName, e.target.value),
                  })}
                  type="text"
                  placeholder="Contoh: Budi"
                  className={`input input-bordered ${errors.groom_name ? 'input-error' : ''}`}
                />
                {errors.groom_name && (
                  <span className="text-error text-xs mt-1">{errors.groom_name.message}</span>
                )}
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
                <label className="label" htmlFor="wedding_date">
                  <span className="label-text">Tanggal</span>
                </label>
                <input id="wedding_date" {...register('wedding_date')} type="date" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="wedding_time">
                  <span className="label-text">Waktu</span>
                </label>
                <input id="wedding_time" {...register('wedding_time')} type="time" className="input input-bordered" />
              </div>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="venue_name">
                <span className="label-text">Nama Venue</span>
              </label>
              <input
                id="venue_name"
                {...register('venue_name')}
                type="text"
                placeholder="Contoh: Gedung Serbaguna XYZ"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="venue_address">
                <span className="label-text">Alamat</span>
              </label>
              <textarea
                id="venue_address"
                {...register('venue_address')}
                placeholder="Alamat lengkap venue..."
                className="textarea textarea-bordered"
                rows={2}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="venue_maps_url">
                <span className="label-text">Link Google Maps</span>
              </label>
              <input
                id="venue_maps_url"
                {...register('venue_maps_url')}
                type="url"
                placeholder="https://maps.google.com/..."
                className="input input-bordered"
              />
            </div>
          </div>
        </div>

        {/* URL Undangan */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="font-semibold text-base">URL Undangan</h2>
            <p className="text-sm text-base-content/60 mb-2">
              Otomatis diisi dari nama — bisa diubah manual
            </p>
            <label className="input input-bordered flex items-center gap-1">
              <span className="text-base-content/40 text-sm">/w/</span>
              <input
                {...register('slug')}
                type="text"
                placeholder="nama-dan-nama"
                className="grow text-sm"
              />
            </label>
            {errors.slug && (
              <span className="text-error text-xs mt-1">{errors.slug.message}</span>
            )}
          </div>
        </div>

        {serverError && (
          <div role="alert" className="alert alert-error">
            <span>{serverError}</span>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Link href="/dashboard" className="btn btn-ghost">Batal</Link>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting
              ? <span className="loading loading-spinner loading-sm" />
              : 'Buat Undangan'}
          </button>
        </div>
      </form>
    </div>
  )
}
