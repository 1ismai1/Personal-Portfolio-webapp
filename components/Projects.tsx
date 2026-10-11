import Link from 'next/link'
import Reveal from './Reveal'
import ProjectCard from './ProjectCard'
import { projects } from './projectsData'

export default function Projects() {
  const featured = projects.find(p => p.featured)
  const others = projects.filter(p => p !== featured)

  return (
    <section className="projects" aria-labelledby="proj-title">
      <div className="container projects-inner">
        <Reveal className="sec-head">
          <div className="sec-label">Selected Work</div>
          <h2 className="sec-title" id="proj-title">Projects</h2>
        </Reveal>

        {featured && (
          <Reveal className="projects-feature">
            <Link href={`/projects/${featured.slug}`} className="pcard-link" aria-label={`Read more about ${featured.title}`}>
              <ProjectCard {...featured} />
            </Link>
          </Reveal>
        )}

        <div className="projects-others">
          {others.map((p, i) => (
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
