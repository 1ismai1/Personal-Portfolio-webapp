import Link from 'next/link'
import type { Project } from './projectsData'

export default function ProjectHeader({ badge, badgeClass, title, sub, desc, stack }: Project) {
  return (
    <div className="proj-header">
      <Link href="/" className="btn-ghost proj-back">← Back home</Link>
      <div className={`pbadge ${badgeClass}`}>{badge}</div>
      <h1 className="proj-title">{title}</h1>
      <div className="psub">{sub}</div>
      <p className="proj-desc">{desc}</p>
      <div className="pstack">
        {stack.map(t => <span key={t} className="ttag">{t}</span>)}
      </div>
    </div>
  )
}
