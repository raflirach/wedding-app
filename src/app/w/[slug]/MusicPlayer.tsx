'use client'

import { useEffect, useRef, useState } from 'react'
import type { ColorScheme } from '@/lib/templates'

export default function MusicPlayer({ url, colors }: { url: string; colors: ColorScheme }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.5
    audio.loop = true
    const onCanPlay = () => setLoaded(true)
    audio.addEventListener('canplaythrough', onCanPlay)
    return () => audio.removeEventListener('canplaythrough', onCanPlay)
  }, [])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2 shadow-lg cursor-pointer select-none"
      style={{ backgroundColor: colors.primary, color: 'white' }}
      onClick={toggle}
    >
      <audio ref={audioRef} src={url} preload="auto" />
      <span className="text-base">{playing ? '🎵' : '🔇'}</span>
      <span className="text-xs font-medium">
        {playing ? 'Pause' : 'Play Music'}
      </span>
      {!loaded && (
        <span className="w-3 h-3 rounded-full border-2 border-white/50 border-t-white animate-spin" />
      )}
    </div>
  )
}
