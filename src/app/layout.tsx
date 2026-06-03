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
    <html lang="id" data-theme="cupcake">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}