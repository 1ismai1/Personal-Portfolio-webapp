import type { Metadata } from 'next'
import Link from 'next/link'
import ProjectHeader from '@/components/ProjectHeader'
import DisillusionaryTaleCaseStudy from '@/components/DisillusionaryTaleCaseStudy'
import { projects } from '@/components/projectsData'

const project = projects.find(p => p.slug === 'disillusionary-tale')!

export const metadata: Metadata = {
  title: `${project.title} — Ismail Ahmed`,
  description: project.desc,
}

export default function DisillusionaryTalePage() {
  return (
    <main>
      <div className="proj-page container">
        <ProjectHeader {...project} />
      </div>
      <DisillusionaryTaleCaseStudy />
      <div className="container proj-foot">
        <Link href="/" className="btn-ghost">← Back home</Link>
      </div>
    </main>
  )
}
