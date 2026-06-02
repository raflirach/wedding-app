'use client'

import { useState } from 'react'
import type { ColorScheme } from '@/lib/templates'
import type { WeddingData } from './types'

type BankCardProps = {
  bankName: string
  accountName: string
  accountNumber: string
  colors: ColorScheme
}

function BankCard({ bankName, accountName, accountNumber, colors }: BankCardProps) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className="rounded-2xl p-5 border text-center space-y-1"
      style={{
        background: 'rgba(255, 255, 255, 0.42)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255, 255, 255, 0.65)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.7)',
      }}
    >
      <p className="text-xs tracking-widest uppercase font-semibold" style={{ color: colors.primary }}>
        {bankName}
      </p>
      <p className="text-2xl font-bold tracking-wider" style={{ color: colors.textDark }}>
        {accountNumber}
      </p>
      <p className="text-sm" style={{ color: colors.textMuted }}>a.n. {accountName}</p>
      <button
        onClick={copy}
        className="mt-3 inline-block px-5 py-1.5 rounded-full text-xs font-semibold border transition-all"
        style={
          copied
            ? { backgroundColor: colors.primary, borderColor: colors.primary, color: 'white' }
            : { borderColor: colors.accent + '60', color: colors.textMuted }
        }
      >
        {copied ? 'Tersalin!' : 'Salin Nomor'}
      </button>
    </div>
  )
}

export default function GiftSection({ wedding, colors }: { wedding: WeddingData; colors: ColorScheme }) {
  const hasBank1 = wedding.bank_1_name && wedding.bank_1_account_number
  const hasBank2 = wedding.bank_2_name && wedding.bank_2_account_number

  if (!hasBank1 && !hasBank2) return null

  return (
    <section className="py-12 px-4 max-w-md mx-auto">
      <div className="text-center mb-6">
        <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: colors.textMuted }}>
          Amplop Digital
        </p>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          Bagi yang ingin memberikan hadiah
        </p>
      </div>
      <div className="space-y-4">
        {hasBank1 && (
          <BankCard
            bankName={wedding.bank_1_name!}
            accountName={wedding.bank_1_account_name ?? ''}
            accountNumber={wedding.bank_1_account_number!}
            colors={colors}
          />
        )}
        {hasBank2 && (
          <BankCard
            bankName={wedding.bank_2_name!}
            accountName={wedding.bank_2_account_name ?? ''}
            accountNumber={wedding.bank_2_account_number!}
            colors={colors}
          />
        )}
      </div>
    </section>
  )
}
