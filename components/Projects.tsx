import Link from 'next/link'
import Reveal from './Reveal'
import ProjectCard from './ProjectCard'
import { projects } from './projectsData'

export default function Projects() {
  return (
    <section id="projects" className="projects page" aria-labelledby="proj-title">
      <div className="container">
        <Reveal className="sec-head">
          <div className="sec-label">Selected Work</div>
          <h2 className="sec-title" id="proj-title">Projects</h2>
        </Reveal>

        <div className="projects-grid">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <Link href={`/projects/${p.slug}`} className="pcard-link" aria-label={`Read more about ${p.title}`}>
                <ProjectCard {...p} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
