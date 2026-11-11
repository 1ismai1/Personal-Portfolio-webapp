import Image from 'next/image'
import Link from 'next/link'
import { StatusBadge } from '@/components/kit'
import type { Project } from '@/content/projects'

/**
 * One card per project, generated from content/projects.ts.
 * No nested links: the title is the only link to the case study and its
 * ::after stretches over the card; the repo link sits above it (z-10).
 * `feature` = wide layout with the image beside the text (the lead project).
 */
export default function ProjectCard({ project: p, feature = false }: { project: Project; feature?: boolean }) {
  const headline = p.stats?.[0]
  return (
    <article className={`panel group relative flex overflow-hidden transition-transform duration-base ease-spring hover:-translate-y-1 ${feature ? 'flex-col lg:flex-row' : 'flex-col'}`}>
      {p.image && p.group === 'embedded' && (
        <div className={`relative shrink-0 overflow-hidden bg-mask-950 ${feature ? 'aspect-[16/10] lg:aspect-auto lg:w-[46%]' : 'aspect-[16/9]'}`}>
          <Image
            src={p.image.src}
            alt={p.image.alt}
            fill
            sizes={feature ? '(max-width: 1024px) 100vw, 560px' : '(max-width: 768px) 100vw, 600px'}
            className="object-cover"
            style={{ objectPosition: p.image.position }}
          />
          <div className="absolute inset-0 bg-mask-600 opacity-25 mix-blend-multiply" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-mask-950/60 to-transparent" aria-hidden="true" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="ref">{p.kind}</span>
          <StatusBadge tone={p.status.tone}>{p.status.label}</StatusBadge>
        </div>
        <div>
          <h3 className={`display ${feature ? 'text-xl md:text-2xl' : 'text-xl'}`}>
            <Link
              href={`/projects/${p.slug}`}
              className="text-silk no-underline transition-colors duration-fast after:absolute after:inset-0 after:content-[''] group-hover:text-phos focus-visible:text-phos active:text-phos"
            >
              {p.title}
            </Link>
          </h3>
          <p className="mt-1.5 font-mono text-xs text-silk-3">{p.sub}</p>
        </div>
        <p className="max-w-prose text-sm text-silk-2">{p.summary}</p>
        {headline && (
          <p className="flex items-baseline gap-3 border-t border-line pt-4">
            <span className="whitespace-nowrap font-mono text-xl font-medium text-silk">
              {headline.value}
              {headline.unit && <span className="ml-1 text-sm text-phos">{headline.unit}</span>}
            </span>
            <span className="text-xs text-silk-3">{headline.label}</span>
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          {p.stack.slice(0, feature ? 7 : 4).map(t => <span key={t} className="chip">{t}</span>)}
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noopener noreferrer" className="link relative z-10 ml-auto inline-flex min-h-[44px] items-center text-xs">
              Source on GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
