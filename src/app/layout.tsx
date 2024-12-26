import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Face-detection App',
  description: 'Developed by Joshua',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
