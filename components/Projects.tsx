import Link from 'next/link'
import Reveal from './Reveal'
import ProjectCard from './ProjectCard'
import { projects } from './projectsData'

export default function Projects() {
  const list = projects.filter(p => p.group !== 'embedded')

  return (
    <section className="projects" aria-labelledby="proj-title">
      <div className="container projects-inner">
        <Reveal className="sec-head">
          <div className="sec-label">Selected Work</div>
          <h2 className="sec-title" id="proj-title">Projects</h2>
        </Reveal>

        <div className="projects-others">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={(i + 1) * 100}>
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
