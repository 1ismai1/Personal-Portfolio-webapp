import type { Metadata } from 'next'
import { Newsreader, Figtree } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-newsreader',
  display: 'swap',
})

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-figtree',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ismail Ahmed — Engineering Student & Builder',
  description:
    'First-year engineering student at McMaster University. 3.9 GPA. Competed at DECA Provincials. Building bare-metal firmware, wearable devices, and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${figtree.variable}`}>
      <body>
        {/* .grain and .ambient are display:none in Soft Field — safe to delete these two lines */}
        <div className="grain" aria-hidden="true" />
        <div className="ambient" aria-hidden="true" />
        <Nav />
        {children}
      </body>
    </html>
  )
}
