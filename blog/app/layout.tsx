import type { Metadata } from 'next'
import { Lato, Oswald } from 'next/font/google'
import './globals.css'

// ⚠️ SAME FONTS AS PORTFOLIO
const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
})

const oswald = Oswald({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Slav.hr Blog',
    default: 'Slav.hr Blog - Web Development & Tech',
  },
  description: 'Technical blog by Slaven Sakačić covering web development, JavaScript, DevOps, and career insights.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Slav.hr Blog',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${lato.variable} ${oswald.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
