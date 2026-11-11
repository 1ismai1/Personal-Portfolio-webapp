/**
 * Case-study component kit. Server components, no client JS.
 * (CaptureViewer is the one interactive piece: see ./CaptureViewer.tsx.)
 *
 *   <StatusBadge tone="ok">Assembled and tested</StatusBadge>
 *   <StatRow stats={[{ value: '1.5', unit: 'ms', label: '...' }]} />
 *   <Section refId="TP2" label="Architecture" title="Four tasks, one rule">...</Section>
 *   <BugCard title="..." symptom="..." cause="..." fix="..." lesson="..." />
 *   <Figure src width height alt caption />            photo or render
 *   <CaptureViewer src width height alt caption />     logic-analyzer capture with zoom
 */
import Image from 'next/image'
import type { ReactNode } from 'react'
import type { Stat, StatusTone } from '@/content/projects'

const toneDot: Record<StatusTone, string> = {
  ok: 'bg-trace',
  live: 'bg-phos pulse',
  neutral: 'bg-silk-3',
}

export function StatusBadge({ tone = 'neutral', children }: { tone?: StatusTone; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xs border border-line-2 bg-mask-900 px-2.5 py-1 font-mono text-xs text-silk">
      <span className={`h-1.5 w-1.5 rounded-full ${toneDot[tone]}`} aria-hidden="true" />
      {children}
    </span>
  )
}

/** A row of measured numbers. Reads like a multimeter display, not a marketing banner. */
export function StatRow({ stats, className = '' }: { stats: Stat[]; className?: string }) {
  return (
    <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line ${stats.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} ${className}`}>
      {stats.map((s, i) => (
        <div key={s.label} className={`flex flex-col-reverse justify-end gap-2 bg-mask-800 p-5 md:p-6 ${stats.length === 3 && i === 2 ? 'col-span-2 lg:col-span-1' : ''}`}>
          <dt className="text-xs leading-snug text-silk-3">{s.label}</dt>
          <dd className="font-mono text-xl font-medium text-silk md:text-2xl">
            {s.value}
            {s.unit && <span className="ml-1 text-sm text-phos md:text-lg">{s.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** A case-study section. `refId` is a silkscreen-style designator (TP1, TP2...). */
export function Section({ refId, label, title, children, id }: { refId?: string; label: string; title: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="grid gap-x-12 gap-y-4 border-t border-line py-12 md:py-16 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="ref flex items-center gap-2 self-start lg:pt-3">
        <span className="tp" aria-hidden="true" />
        {refId && <b>{refId}</b>}
        <span>{label}</span>
      </div>
      <div className="min-w-0">
        <h2 className="display mb-6 max-w-[22ch] text-xl md:text-2xl">{title}</h2>
        <div className="prose-bench">{children}</div>
      </div>
    </section>
  )
}

const bugSteps = [
  ['symptom', 'Symptom'],
  ['cause', 'Root cause'],
  ['fix', 'Fix'],
  ['lesson', 'Lesson'],
] as const

/** Symptom -> root cause -> fix -> lesson. One per bug from the engineering notebook. */
export function BugCard(props: { title: string; tag?: string; symptom: ReactNode; cause: ReactNode; fix: ReactNode; lesson: ReactNode; proof?: ReactNode }) {
  return (
    <article className="panel my-6 overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-mask-700 px-5 py-4 md:px-6">
        <h3 className="font-sans text-lg font-medium text-silk">{props.title}</h3>
        {props.tag && <span className="chip">{props.tag}</span>}
      </header>
      <ol className="m-0 list-none p-0">
        {bugSteps.map(([key, name], i) => (
          <li key={key} className="grid gap-x-6 gap-y-1 border-b border-line px-5 py-4 last:border-b-0 md:grid-cols-[150px_minmax(0,1fr)] md:px-6">
            <div className={`font-mono text-xs ${key === 'symptom' ? 'text-fault' : key === 'lesson' ? 'text-phos' : 'text-trace'}`}>
              <span className="text-silk-3">{i + 1}&nbsp;&nbsp;</span>{name}
            </div>
            <div className={`max-w-prose text-sm ${key === 'lesson' ? 'font-medium text-silk' : 'text-silk-2'}`}>{props[key]}</div>
          </li>
        ))}
      </ol>
      {props.proof && <footer className="border-t border-line bg-mask-900 px-5 py-4 text-sm text-silk-2 md:px-6">{props.proof}</footer>}
    </article>
  )
}

/** A photo or render with a caption. For logic-analyzer captures use CaptureViewer. */
export function Figure({ src, alt, width, height, caption, priority, sizes = '(max-width: 1240px) 100vw, 900px' }: { src: string; alt: string; width: number; height: number; caption?: ReactNode; priority?: boolean; sizes?: string }) {
  return (
    <figure className="my-6">
      <div className="relative overflow-hidden rounded border border-line bg-mask-950 shadow-raised">
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className="block h-auto w-full" />
        {/* Colour treatment: pulls photos toward the mask green so they sit in the page. */}
        <div className="pointer-events-none absolute inset-0 bg-mask-600 opacity-20 mix-blend-multiply" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-mask-950/60 to-transparent" aria-hidden="true" />
      </div>
      {caption && <figcaption className="mt-3 max-w-prose text-xs text-silk-3">{caption}</figcaption>}
    </figure>
  )
}
