'use client'

import { useEffect, useRef, useState } from 'react'

/** One arrival cue, not a scroll listener: content stays visible without JS. */
export default function WorkArrival({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [arrived, setArrived] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || !('IntersectionObserver' in window)) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.3)) {
        setArrived(true)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="work-arrival" data-arrived={arrived || undefined}>
      <div className="work-signal" aria-hidden="true"><span /><span /></div>
      {children}
    </div>
  )
}
