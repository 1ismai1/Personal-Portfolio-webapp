import Hero from '@/components/home/Hero'
import ProjectCard from '@/components/home/ProjectCard'
import ProofStrip from '@/components/home/ProofStrip'
import Skills from '@/components/home/Skills'
import TimingDiagram from '@/components/home/TimingDiagram'
import Replay from '@/components/replay/Replay'
import { projects } from '@/content/projects'

function Heading({ refId, label, title, children }: { refId: string; label: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="ref mb-4 flex items-center gap-2">
        <span className="tp" aria-hidden="true" />
        <b>{refId}</b>
        <span>{label}</span>
      </div>
      <h2 className="display max-w-[20ch] text-2xl md:text-3xl">{title}</h2>
      {children && <p className="mt-4 max-w-[62ch] text-base text-silk-2">{children}</p>}
    </div>
  )
}

function Evidence({ id, title, note, children }: { id?: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <div id={id} className="mt-14 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
      <div>
        <h3 className="display text-xl">{title}</h3>
        <p className="mt-3 text-sm text-silk-2">{note}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export default function Page() {
  const embedded = projects.filter(p => p.group === 'embedded')
  const other = projects.filter(p => p.group === 'other')
  const [lead, ...rest] = embedded

  return (
    <>
      <Hero />

      <section id="replay" className="wrap py-section" aria-label="IMU orientation replay">
        <Heading refId="TP1" label="Replay" title="My board, replaying its own log">
          This is real data: 48.9 seconds recorded at 100 Hz by my firmware, on the board shown. Switch the source to see why the filter exists.
        </Heading>
        <Replay />
      </section>

      <section id="work" className="wrap py-section" aria-label="Embedded work">
        <Heading refId="TP2" label="Embedded work" title="Firmware, the board under it, and the proof" />
        <ProjectCard project={lead} feature />

        <Evidence id="timing" title="Where the 1.5 ms went" note="One 10 ms sample period, before and after moving bus transfers to DMA. The bus takes just as long. The CPU stops waiting for it.">
          <TimingDiagram />
        </Evidence>

        <Evidence title="Measured, not claimed" note="Computed from the timestamps of one log file recorded on the assembled board, including the fault I injected on purpose.">
          <ProofStrip />
        </Evidence>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {rest.map(p => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>

      <section className="wrap pb-section" aria-label="Other projects">
        <Heading refId="TP3" label="Other projects" title="Design projects and a game" />
        <div className="grid gap-6 md:grid-cols-3">
          {other.map(p => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>

      <section id="skills" className="wrap pb-section" aria-label="Skills">
        <Heading refId="TP4" label="Skills" title="What I work with" />
        <Skills />
      </section>
    </>
  )
}
