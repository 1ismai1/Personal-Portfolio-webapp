'use client'
import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const cur  = document.getElementById('cur')!
    const ring = document.getElementById('cur-ring')!
    let mx = -200, my = -200, rx = -200, ry = -200

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      cur.style.left = mx + 'px'
      cur.style.top  = my + 'px'
    }
    document.addEventListener('mousemove', onMove)

    let rafId: number
    const tick = () => {
      rx += (mx - rx) * .11
      ry += (my - ry) * .11
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      rafId = requestAnimationFrame(tick)
    }
    tick()

    const expand = () => {
      cur.style.width  = '11px'; cur.style.height = '11px'
      ring.style.width = '42px'; ring.style.height = '42px'
      ring.style.borderColor = 'rgba(224,147,64,.7)'
    }
    const shrink = () => {
      cur.style.width  = '7px';  cur.style.height = '7px'
      ring.style.width = '30px'; ring.style.height = '30px'
      ring.style.borderColor = 'rgba(224,147,64,.45)'
    }
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', expand)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div id="cur" aria-hidden="true" />
      <div id="cur-ring" aria-hidden="true" />
    </>
  )
}
