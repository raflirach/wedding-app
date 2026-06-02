'use client'

import { useRef, useState } from 'react'
import type { ColorScheme } from '@/lib/templates'

type Props = {
  brideName: string
  groomName: string
  weddingDate: string | null
  musicUrl: string | null
  colors: ColorScheme
  children: React.ReactNode
  guestName?: string
}

export default function InvitationOpener({
  brideName, groomName, weddingDate, musicUrl, colors, children, guestName,
}: Props) {
  const [opened, setOpened] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  function open() {
    setOpened(true)
    if (musicUrl && audioRef.current) {
      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(() => {})
    }
  }

  function toggleMusic() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      {/* Audio element always in DOM so it persists after open */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Splash screen */}
      {!opened && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
          style={{ backgroundColor: colors.bg }}
        >
          {/* Decorative top */}
          <p className="text-2xl mb-6 select-none" style={{ color: colors.accent }}>✦</p>

          <p
            className="text-xs tracking-[0.4em] uppercase mb-8 font-light"
            style={{ color: colors.textMuted }}
          >
            Undangan Pernikahan
          </p>

          <h1
            className="text-5xl md:text-7xl font-serif font-bold leading-none"
            style={{ color: colors.textDark }}
          >
            {brideName}
          </h1>
          <p className="text-4xl font-serif italic my-3" style={{ color: colors.primary }}>
            &amp;
          </p>
          <h1
            className="text-5xl md:text-7xl font-serif font-bold leading-none"
            style={{ color: colors.textDark }}
          >
            {groomName}
          </h1>

          {weddingDate && (
            <p className="mt-5 text-sm font-light" style={{ color: colors.textMuted }}>
              {new Date(weddingDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}
            </p>
          )}

          {guestName && (
            <div className="mt-6 px-6 py-3 rounded-xl border" style={{ borderColor: colors.accent + '50', backgroundColor: colors.primaryLight }}>
              <p className="text-xs tracking-[0.3em] uppercase" style={{ color: colors.textMuted }}>
                Kepada Yth.
              </p>
              <p className="text-base font-semibold mt-0.5" style={{ color: colors.textDark }}>
                {guestName}
              </p>
            </div>
          )}

          <button
            onClick={open}
            className="mt-10 px-10 py-3.5 rounded-full text-white text-sm font-semibold tracking-wide transition-all hover:opacity-90 hover:scale-105 active:scale-95"
            style={{ backgroundColor: colors.primary }}
          >
            {musicUrl ? '🎵 Buka Undangan' : 'Buka Undangan'}
          </button>

          <p className="mt-4 text-xs" style={{ color: colors.accent + '80' }}>
            {musicUrl ? 'Musik akan diputar otomatis' : 'Ketuk untuk membuka'}
          </p>

          {/* Decorative bottom */}
          <p className="text-2xl mt-8 select-none" style={{ color: colors.accent }}>✦</p>
        </div>
      )}

      {/* Invitation content */}
      <div className={opened ? 'block' : 'hidden'}>
        {children}
      </div>

      {/* Floating music toggle (shown after open) */}
      {opened && musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2.5 text-white text-xs font-medium shadow-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: colors.primary }}
        >
          {playing ? (
            <><span>🎵</span> Pause</>
          ) : (
            <><span>🔇</span> Play</>
          )}
        </button>
      )}
    </>
  )
}
