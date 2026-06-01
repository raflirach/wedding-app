'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { register, type AuthState } from '@/app/actions/auth'

export default function RegisterPage() {
  const [state, action, isPending] = useActionState<AuthState, FormData>(register, undefined)

  return (
    <>
      <h2 className="card-title text-2xl font-bold mb-2">Daftar</h2>
      <p className="text-sm text-base-content/60 mb-4">
        Buat undangan pernikahanmu secara gratis
      </p>

      <form action={action} className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="fullName">
            <span className="label-text">Nama Lengkap</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nama lengkap"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            className="input input-bordered w-full"
            required
          />
        </div>

        {state?.error && (
          <div role="alert" className="alert alert-error text-sm py-2">
            <span>{state.error}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isPending}
        >
          {isPending ? <span className="loading loading-spinner loading-sm" /> : 'Daftar Sekarang'}
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Sudah punya akun?{' '}
        <Link href="/login" className="link link-primary">
          Masuk
        </Link>
      </p>
    </>
  )
}
