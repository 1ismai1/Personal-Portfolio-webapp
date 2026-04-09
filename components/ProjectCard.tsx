'use client'
import React, { useRef } from 'react'

interface Props {
  badge: React.ReactNode
  badgeClass: string
  title: string
  sub: string
  desc: string
  stack: string[]
}

export default function ProjectCard({ badge, badgeClass, title, sub, desc, stack }: Props) {
  const cardRef = useRef<HTMLElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const r = cardRef.current!.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - .5
    const y = (e.clientY - r.top)  / r.height - .5
    cardRef.current!.style.transition = 'border-color .3s, box-shadow .3s'
    cardRef.current!.style.transform  = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`
  }
  const onLeave = () => {
    cardRef.current!.style.transition = 'border-color .3s, box-shadow .3s, transform .4s ease'
    cardRef.current!.style.transform  = ''
  }

  return (
    <article
      ref={cardRef as React.RefObject<HTMLElement>}
      className="pcard"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className={`pbadge ${badgeClass}`}>{badge}</div>
      <h3 className="ptitle">{title}</h3>
      <div className="psub">{sub}</div>
      <p className="pdesc">{desc}</p>
      <div className="pstack">
        {stack.map(t => <span key={t} className="ttag">{t}</span>)}
      </div>
    </article>
  )
}
