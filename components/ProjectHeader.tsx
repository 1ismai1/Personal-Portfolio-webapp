import Link from 'next/link'
import type { Project } from './projectsData'

export default function ProjectHeader({ badge, badgeClass, title, sub, desc, stack, lead, repo }: Project) {
  return (
    <div className="proj-header">
      <div className="proj-actions">
        <Link href="/" className="btn-ghost proj-back">← Back home</Link>
        {repo && (
          <a href={repo} target="_blank" rel="noopener noreferrer" className="btn-primary proj-repo">
            View on GitHub
            <span aria-hidden="true">&nbsp;↗</span>
          </a>
        )}
      </div>
      <div className={`pbadge ${badgeClass}`}>{badge}</div>
      <h1 className="proj-title">{title}</h1>
      <div className="psub">{sub}</div>
      <p className="proj-desc">{lead ?? desc}</p>
      <div className="pstack">
        {stack.map(t => <span key={t} className="ttag">{t}</span>)}
      </div>
    </div>
  )
}
