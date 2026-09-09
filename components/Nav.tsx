'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Scroll events don't bubble, but a capturing listener on window still
    // sees them fire on nested scroll containers (each .page on desktop) —
    // this covers both that case and plain document scroll (mobile, project pages).
    const onScroll = (e: Event) => {
      const target = e.target as Document | HTMLElement
      const scrollTop = target instanceof Document ? window.scrollY : target.scrollTop
      navRef.current?.classList.toggle('scrolled', scrollTop > 24)
    }
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [])

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.page[id]'))
    const links = navRef.current?.querySelectorAll<HTMLAnchorElement>('.nav-links a[href^="/#"]')
    if (!sections.length || !links || !links.length) return

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          links.forEach(a =>
            a.classList.toggle('active', a.getAttribute('href') === `/#${entry.target.id}`)
          )
        })
      },
      { threshold: 0.5 }
    )
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <nav ref={navRef} className="nav" role="navigation" aria-label="Main navigation">
      <Link href="/" className="nav-logo" aria-label="Ismail Ahmed — Home">IA</Link>
      <div className="nav-links">
        <a href="/#projects">Projects</a>
        <a href="/#skills">Skills</a>
        <a href="/#contact" className="nav-cta">Contact</a>
      </div>
    </nav>
  )
}
