import type { Metadata } from 'next'
import Link from 'next/link'
import ProjectHeader from '@/components/ProjectHeader'
import IMULoggerCaseStudy from '@/components/IMULoggerCaseStudy'
import { projects } from '@/components/projectsData'

const project = projects.find(p => p.slug === 'imu-logger')!

export const metadata: Metadata = {
  title: `${project.title} — Ismail Ahmed`,
  description: project.desc,
}

export default function IMULoggerPage() {
  return (
    <main>
      <div className="proj-page container">
        <ProjectHeader {...project} />
      </div>
      <IMULoggerCaseStudy />
      <div className="container proj-foot">
        <Link href="/" className="btn-ghost">← Back home</Link>
      </div>
    </main>
  )
}
