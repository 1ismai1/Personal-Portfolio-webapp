import type { Metadata } from 'next'
import Link from 'next/link'
import ProjectHeader from '@/components/ProjectHeader'
import EndEffectorCaseStudy from '@/components/EndEffectorCaseStudy'
import { projects } from '@/components/projectsData'

const project = projects.find(p => p.slug === 'end-effector')!

export const metadata: Metadata = {
  title: `${project.title} — Ismail Ahmed`,
  description: project.desc,
}

export default function EndEffectorPage() {
  return (
    <main>
      <div className="proj-page container">
        <ProjectHeader {...project} />
      </div>
      <EndEffectorCaseStudy />
      <div className="container proj-foot">
        <Link href="/" className="btn-ghost">← Back home</Link>
      </div>
    </main>
  )
}
