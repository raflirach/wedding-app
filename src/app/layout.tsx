import type { Metadata } from 'next'
import './globals.css'

const BASE_URL = 'https://undangmanah.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Undangmanah — Undangan Digital untuk Semua Momen',
    template: '%s | Undangmanah',
  },
  description: 'Buat undangan digital elegan dalam hitungan menit. Cocok untuk pernikahan, reuni, syukuran, ulang tahun, wisuda, dan berbagai acara lainnya. Lengkap dengan RSVP, galeri foto, musik, dan countdown timer.',
  keywords: ['undangan digital', 'undangan pernikahan online', 'undangan online', 'undangan digital pernikahan', 'buat undangan online', 'undangan ulang tahun digital', 'undangan wisuda digital', 'undangmanah'],
  authors: [{ name: 'Undangmanah' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: BASE_URL,
    siteName: 'Undangmanah',
    title: 'Undangmanah — Undangan Digital untuk Semua Momen',
    description: 'Buat undangan digital elegan dalam hitungan menit. Pernikahan, reuni, syukuran, ulang tahun, wisuda, dan banyak lagi.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Undangmanah — Undangan Digital untuk Semua Momen',
    description: 'Buat undangan digital elegan dalam hitungan menit.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: 'cC8UQjR81TE4rRRYxX8ScLoj55ahm4_eR6_XritLUGI',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.setAttribute('data-theme',localStorage.getItem('theme')||'winter')}catch(e){}` }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}