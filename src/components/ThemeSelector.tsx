'use client'

import { useEffect, useState } from 'react'

const THEMES = [
  { id: 'cupcake',   label: 'Cupcake',   primary: '#93c5fd', base: '#faf7f5' },
  { id: 'light',     label: 'Light',     primary: '#5b21b6', base: '#ffffff' },
  { id: 'valentine', label: 'Valentine', primary: '#e96d7b', base: '#fff0f3' },
  { id: 'garden',    label: 'Garden',    primary: '#5c7f67', base: '#e9e7e7' },
  { id: 'nord',      label: 'Nord',      primary: '#5e81ac', base: '#eceff4' },
  { id: 'dim',       label: 'Dim',       primary: '#9ca3af', base: '#2a323c' },
  { id: 'dark',      label: 'Dark',      primary: '#818cf8', base: '#1f2937' },
]

export default function ThemeSelector() {
  const [theme, setTheme] = useState('cupcake')

  useEffect(() => {
    const saved = localStorage.getItem('theme') ?? 'cupcake'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  function changeTheme(newTheme: string) {
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle" title="Ganti tema">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      </div>
      <div tabIndex={0} className="dropdown-content bg-base-100 rounded-box shadow-lg border border-base-200 z-50 p-3 mt-1 w-44">
        <p className="text-xs font-semibold text-base-content/50 mb-2 px-1 uppercase tracking-wider">Tema</p>
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => changeTheme(t.id)}
            className={`flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg hover:bg-base-200 transition-colors text-sm ${theme === t.id ? 'font-semibold text-primary' : ''}`}
          >
            <span className="flex gap-0.5 shrink-0">
              <span className="w-3 h-4 rounded-l-sm" style={{ backgroundColor: t.base }} />
              <span className="w-3 h-4 rounded-r-sm" style={{ backgroundColor: t.primary }} />
            </span>
            {t.label}
            {theme === t.id && <span className="ml-auto text-xs">✓</span>}
          </button>
        ))}
      </div>
    </div>
  )
}