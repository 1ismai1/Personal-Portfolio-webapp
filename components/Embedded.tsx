import Link from 'next/link'
import Image from 'next/image'
import Reveal from './Reveal'
import { projects, type Project } from './projectsData'

function EmbeddedCard({ project }: { project: Project }) {
  const { slug, badge, badgeClass, title, sub, lead, desc, stack, status, images = [] } = project
  return (
    <Link href={`/projects/${slug}`} className="pcard-link" aria-label={`Read more about ${title}`}>
      <article className="pcard ecard">
        <div className="ecard-media">
          {images.map(img => (
            <div key={img.src} className="ecard-tile">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 900px) 100vw, 620px"
                style={{ objectPosition: img.position }}
              />
            </div>
          ))}
          <div className="ecard-shade" aria-hidden="true" />
        </div>
        <div className="ecard-body">
          <div className="ecard-badges">
            <div className={`pbadge ${badgeClass}`}>{badge}</div>
            {status && <div className="ecard-status">{status}</div>}
          </div>
          <h3 className="ptitle">{title}</h3>
          <div className="psub">{sub}</div>
          <p className="pdesc">{lead ?? desc}</p>
          <div className="pstack">
            {stack.map(t => <span key={t} className="ttag">{t}</span>)}
          </div>
          <div className="pcta">Read the case study <span aria-hidden="true">→</span></div>
        </div>
      </article>
    </Link>
  )
}

/** One home screen for the IMU logger and the shield PCB it runs on. */
export default function Embedded() {
  const pair = projects.filter(p => p.group === 'embedded')

  return (
    <section className="embedded" aria-labelledby="emb-title">
      <div className="container embedded-inner">
        <Reveal className="sec-head">
          <div className="sec-label">Embedded Systems</div>
          <h2 className="sec-title" id="emb-title">Logger and shield</h2>
          <p className="embedded-note">The firmware, and the board it runs on.</p>
        </Reveal>

        <div className="embedded-pair">
          {pair.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <EmbeddedCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
