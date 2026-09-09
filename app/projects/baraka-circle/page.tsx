import type { Metadata } from 'next'
import ProjectHeader from '@/components/ProjectHeader'
import { projects } from '@/components/projectsData'

const project = projects.find(p => p.slug === 'baraka-circle')!

export const metadata: Metadata = {
  title: `${project.title} — Ismail Ahmed`,
  description: project.desc,
}

export default function BarakaCirclePage() {
  return (
    <main className="proj-page container">
      <ProjectHeader {...project} />
      <div className="proj-placeholder">
        <p>More about this build is coming soon — check back shortly.</p>
      </div>
    </main>
  )
}
