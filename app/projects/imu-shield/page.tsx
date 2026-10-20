import type { Metadata } from 'next'
import Link from 'next/link'
import ProjectHeader from '@/components/ProjectHeader'
import IMUShieldCaseStudy from '@/components/IMUShieldCaseStudy'
import { projects } from '@/components/projectsData'

const project = projects.find(p => p.slug === 'imu-shield')!

export const metadata: Metadata = {
  title: `${project.title} — Ismail Ahmed`,
  description: project.desc,
}

export default function IMUShieldPage() {
  return (
    <main>
      <div className="proj-page container">
        <ProjectHeader {...project} />
      </div>
      <IMUShieldCaseStudy />
      <div className="container proj-foot">
        <Link href="/" className="btn-ghost">← Back home</Link>
        <Link href="/projects/imu-logger" className="btn-ghost proj-foot-link">See the firmware: IMU Logger →</Link>
      </div>
    </main>
  )
}
