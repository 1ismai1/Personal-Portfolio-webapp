import type { Metadata } from 'next'
import Link from 'next/link'
import ProjectHeader from '@/components/ProjectHeader'
import ExoArmCaseStudy from '@/components/ExoArmCaseStudy'
import { projects } from '@/components/projectsData'

const project = projects.find(p => p.slug === 'exo-arm')!

export const metadata: Metadata = {
  title: `${project.title} — Ismail Ahmed`,
  description: project.desc,
}

export default function ExoArmPage() {
  return (
    <main>
      <div className="proj-page container">
        <ProjectHeader {...project} />
      </div>
      <ExoArmCaseStudy />
      <div className="container proj-foot">
        <Link href="/" className="btn-ghost">← Back home</Link>
      </div>
    </main>
  )
}
