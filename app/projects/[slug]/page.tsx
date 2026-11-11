import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StatRow, StatusBadge } from '@/components/kit'
import { getProject, projects } from '@/content/projects'
import { bodies } from './bodies'
import ProjectArrival from '@/components/ProjectArrival'

/**
 * One route for every project. The header comes from content/projects.ts;
 * the body is looked up in ./bodies.tsx. Adding a project needs no new route.
 */
export const dynamicParams = false
export const generateStaticParams = () => projects.map(p => ({ slug: p.slug }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug)
  if (!p) return {}
  const description = p.lead ?? p.summary
  const images = p.image && p.image.width >= 600 && p.image.height >= 315 ? [{ url: p.image.src, width: p.image.width, height: p.image.height, alt: p.image.alt }] : ['/opengraph-image']
  return {
    title: p.title, description,
    openGraph: { title: p.title, description, url: `/projects/${p.slug}`, siteName: 'Ismail Ahmed', type: 'website', images },
    twitter: { card: 'summary_large_image', title: p.title, description, images },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug)
  if (!p) notFound()
  const Body = bodies[p.slug]
  const i = projects.indexOf(p)
  const next = projects[(i + 1) % projects.length]

  return (
    <article key={p.slug} data-project-motion={p.slug}>
      <header className="project-header relative isolate overflow-hidden">
        <ProjectArrival slug={p.slug} />
        <div className="wrap relative pb-10 pt-28 md:pt-36">
        <Link href="/#work" className="link text-sm">All projects</Link>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="ref">{p.kind}</span>
          <StatusBadge tone={p.status.tone}>{p.status.label}</StatusBadge>
          {p.team && <span className="chip">{p.team}</span>}
        </div>
        <h1 className="display mt-4 max-w-[16ch] text-[clamp(2.25rem,6vw,4.25rem)] leading-[1]">{p.title}</h1>
        <p className="mt-3 font-mono text-xs text-silk-3">{p.sub}</p>
        <p className="mt-6 max-w-[60ch] text-lg text-silk">{p.lead ?? p.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-1.5">
          {p.stack.map(t => <span key={t} className="chip">{t}</span>)}
        </div>
        {p.repo && (
          <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-line mt-7">Source on GitHub</a>
        )}
        {p.stats && p.stats.length > 1 && <StatRow stats={p.stats} className="mt-10" />}
        </div>
      </header>

      {Body ? <Body /> : (
        <div className="wrap pb-16">
          <p className="panel max-w-prose p-6 text-sm text-silk-2">The full write-up for this project is on its way.</p>
        </div>
      )}

      <nav className="wrap flex flex-wrap items-center justify-between gap-4 border-t border-line py-10" aria-label="More projects">
        <Link href="/#work" className="btn btn-line">All projects</Link>
        <Link href={`/projects/${next.slug}`} className="btn btn-line">Next: {next.title}</Link>
      </nav>
    </article>
  )
}
