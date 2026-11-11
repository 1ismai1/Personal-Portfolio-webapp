import type { Metadata } from 'next'
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// Display: Archivo at 125% width, like front-panel lettering. Body: IBM Plex Sans.
// Readouts, decode labels and silkscreen refs: IBM Plex Mono.
const display = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-display', display: 'swap' })
const body = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://personal-portfolio-webapp.vercel.app'),
  title: { default: 'Ismail Ahmed, firmware and embedded hardware', template: '%s | Ismail Ahmed' },
  description:
    'Computer Engineering co-op student at McMaster. Real-time C firmware on STM32, register-level drivers, FreeRTOS, PCB design in Altium. Seeking a firmware or hardware co-op for Summer 2027.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="btn btn-solid fixed left-4 top-4 z-[200] -translate-y-24 focus-visible:translate-y-0">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
