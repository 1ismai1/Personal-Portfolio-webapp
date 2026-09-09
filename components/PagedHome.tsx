'use client'
import { Children, useEffect, useRef, type ReactNode } from 'react'

const PAGE_IDS = ['about', 'projects', 'skills', 'contact']
const TRANSITION_MS = 700
const DESKTOP_QUERY = '(min-width: 900px)'

export default function PagedHome({ children }: { children: ReactNode }) {
  const pages = Children.toArray(children)
  const indexRef = useRef(0)
  const animatingRef = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const isPaged = () => window.matchMedia(DESKTOP_QUERY).matches

    const goTo = (next: number) => {
      const clamped = Math.max(0, Math.min(PAGE_IDS.length - 1, next))
      if (clamped === indexRef.current || animatingRef.current) return
      animatingRef.current = true
      indexRef.current = clamped
      if (trackRef.current) trackRef.current.style.transform = `translateY(-${clamped * 100}vh)`
      const target = window.location.pathname + '#' + PAGE_IDS[clamped]
      window.history.replaceState(null, '', target)
      window.setTimeout(() => { animatingRef.current = false }, TRANSITION_MS)
    }

    const onWheel = (e: WheelEvent) => {
      if (!isPaged()) return
      if (animatingRef.current) { e.preventDefault(); return }
      const activeEl = pageRefs.current[indexRef.current]
      if (!activeEl) return
      const atTop = activeEl.scrollTop <= 1
      const atBottom = activeEl.scrollTop + activeEl.clientHeight >= activeEl.scrollHeight - 1
      if (e.deltaY > 0 && atBottom && indexRef.current < PAGE_IDS.length - 1) {
        e.preventDefault(); goTo(indexRef.current + 1)
      } else if (e.deltaY < 0 && atTop && indexRef.current > 0) {
        e.preventDefault(); goTo(indexRef.current - 1)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isPaged() || animatingRef.current) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'PageDown') { e.preventDefault(); goTo(indexRef.current + 1) }
      else if (e.key === 'PageUp') { e.preventDefault(); goTo(indexRef.current - 1) }
    }

    const onHashChange = () => {
      if (!isPaged()) return
      const id = window.location.hash.replace('#', '')
      const i = PAGE_IDS.indexOf(id)
      if (i >= 0) goTo(i)
    }

    // Same-page hash links (e.g. Hero's "View Projects" -> #projects, Nav's
    // -> /#skills) must not also trigger the browser's native jump-to-anchor —
    // that scrolls .paged-viewport itself on top of our transform, stacking
    // an extra page-height of movement. Handle the navigation ourselves instead.
    const onClick = (e: MouseEvent) => {
      if (!isPaged()) return
      const a = (e.target as HTMLElement)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a) return
      const url = new URL(a.href, window.location.href)
      if (url.pathname !== window.location.pathname || !url.hash) return
      const i = PAGE_IDS.indexOf(url.hash.slice(1))
      if (i < 0) return
      e.preventDefault()
      goTo(i)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('click', onClick)
    onHashChange()

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div className="paged-viewport">
      <div className="paged-track" ref={trackRef}>
        {pages.map((child, i) => (
          <div
            key={PAGE_IDS[i]}
            id={PAGE_IDS[i]}
            className="page"
            ref={el => { pageRefs.current[i] = el }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
