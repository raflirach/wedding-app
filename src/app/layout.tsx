import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wedding Invitation',
  description: 'Buat undangan pernikahan digitalmu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.setAttribute('data-theme',localStorage.getItem('theme')||'cupcake')}catch(e){}` }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}