'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import { StarIcon, type Project } from './projectsData'

export default function ProjectCard({ badge, badgeClass, title, sub, desc, lead, stack, featured, image, imageAlt }: Project) {
  const cardRef = useRef<HTMLElement>(null)
  // The featured card is big, so it tilts less than the small ones.
  const tilt = featured ? 1.5 : 5

  const onMove = (e: React.MouseEvent) => {
    const r = cardRef.current!.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width  - .5
    const y = (e.clientY - r.top)  / r.height - .5
    cardRef.current!.style.transition = 'border-color .3s, box-shadow .3s'
    cardRef.current!.style.transform  = `translateY(-4px) rotateX(${-y * tilt}deg) rotateY(${x * tilt}deg)`
  }
  const onLeave = () => {
    cardRef.current!.style.transition = 'border-color .3s, box-shadow .3s, transform .4s ease'
    cardRef.current!.style.transform  = ''
  }

  const body = (
    <>
      {featured ? (
        <div className="pfeat-badges">
          <div className="pbadge badge-gold"><StarIcon />Featured project</div>
          <div className={`pbadge ${badgeClass}`}>{badge}</div>
        </div>
      ) : (
        <div className={`pbadge ${badgeClass}`}>{badge}</div>
      )}
      <h3 className="ptitle">{title}</h3>
      <div className="psub">{sub}</div>
      <p className="pdesc">{featured ? (lead ?? desc) : desc}</p>
      <div className="pstack">
        {stack.map(t => <span key={t} className="ttag">{t}</span>)}
      </div>
      {featured && <div className="pcta">Read the case study <span aria-hidden="true">→</span></div>}
    </>
  )

  return (
    <article
      ref={cardRef as React.RefObject<HTMLElement>}
      className={featured ? 'pcard pcard-feature' : 'pcard'}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {featured && image ? (
        <>
          <div className="pfeat-body">{body}</div>
          <div className="pfeat-media">
            <Image src={image} alt={imageAlt ?? ''} fill priority sizes="(max-width: 900px) 100vw, 760px" />
            <div className="pfeat-shade" aria-hidden="true" />
          </div>
        </>
      ) : body}
    </article>
  )
}
