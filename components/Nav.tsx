'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () =>
      navRef.current?.classList.toggle('scrolled', window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav ref={navRef} className="nav" role="navigation" aria-label="Main navigation">
      <Link href="/" className="nav-logo" aria-label="Ismail Ahmed — Home">IA</Link>
      <div className="nav-links">
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#contact" className="nav-cta">Contact</a>
      </div>
    </nav>
  )
}
