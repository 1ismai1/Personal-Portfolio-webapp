import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import Cursor from '@/components/Cursor'
import Nav from '@/components/Nav'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ismail Ahmed — Engineering Student & Builder',
  description:
    'First-year engineering student at McMaster University. 3.9 GPA. 2× hackathon winner. Building AI platforms, wearable devices, and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <div className="grain" aria-hidden="true" />
        <div className="ambient" aria-hidden="true" />
        <Cursor />
        <Nav />
        {children}
      </body>
    </html>
  )
}
