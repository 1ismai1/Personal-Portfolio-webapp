import endurance from '@/public/data/endurance.json'
import { useId } from 'react'

/**
 * "Measured, not claimed": every number here is computed from LOG_30MIN.CSV by
 * scripts/build-data.mjs. Nothing is typed in by hand, so re-running
 * `npm run data` on a new log updates this strip.
 */
const mmss = (ms: number) => {
  const s = Math.round(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
const num = (n: number) => n.toLocaleString('en-US')

export default function ProofStrip() {
  const e = endurance
  const gap = e.gaps[0]
  const hatchId = useId()
  const after = e.stretches[e.stretches.length - 1]
  const dropped = e.stretches.reduce((s, x) => s + x.droppedSamples, 0)
  const worst = Math.max(...e.stretches.map(s => s.worstIntervalMs))
  const total = e.endMs - e.startMs
  const W = 1000, H = 64, PAD = 6
  const tx = (ms: number) => ((ms - e.startMs) / total) * W
  const n = e.timeline.count.length
  const bw = W / n
  const yRoll = (deg: number) => H / 2 - (deg / 90) * (H / 2 - PAD)

  // Roll envelope per 5 s bucket: shows the board was being handled the whole run.
  const env = e.timeline.rollLo.map((lo, i) => {
    const hi = e.timeline.rollHi[i]
    if (lo === null || hi === null) return null
    const y0 = yRoll(Math.min(90, hi)), y1 = yRoll(Math.max(-90, lo))
    return <rect key={i} x={i * bw} y={y0} width={Math.max(bw - 0.4, 0.6)} height={Math.max(y1 - y0, 1.5)} fill="var(--trace)" opacity=".75" />
  })
  // Sample-interval sparkline (worst interval in each bucket, gap excluded).
  const spark = e.timeline.worstIntervalMs.map((w, i) => `${i ? 'L' : 'M'}${(i + 0.5) * bw} ${w ? 14 - (w - e.meta.periodMs) : 14}`).join(' ')

  return (
    <div className="panel overflow-hidden">
      <div className={`grid gap-px bg-line ${gap ? 'md:grid-cols-2' : ''}`}>
        <div className="bg-mask-800 p-5 md:p-6">
          <div className="font-mono text-xl font-medium text-silk md:text-2xl">
            {(after.durationS / 60).toFixed(0)} min
          </div>
          <p className="mt-1 font-mono text-xs text-trace">{after.droppedSamples === 0 ? 'continuous, zero dropped samples' : `${after.droppedSamples} dropped samples`}</p>
          <p className="mt-3 text-sm text-silk-2">
            {num(after.samples)} samples with a {e.meta.periodMs} ms target interval, {after.droppedSamples === 0 ? 'zero dropped' : `${after.droppedSamples} dropped`}.
          </p>
        </div>
        {gap && <div className="bg-mask-800 p-5 md:p-6">
          <div className="font-mono text-xl font-medium text-silk md:text-2xl">
            {(gap.durationMs / 1000).toFixed(1)} s
          </div>
          <p className="mt-1 font-mono text-xs text-fault">{e.gaps.length === 1 ? 'sensor unplugged, then logging resumed in the same file' : `${e.gaps.length} interruptions in the log`}</p>
          <p className="mt-3 text-sm text-silk-2">
            {e.gaps.length === 1 ? 'I pulled the MPU-6050 out of its socket mid-log. The firmware kept retrying, the sensor came back, and logging resumed in the same file with no reboot.' : 'The timeline marks each interruption. The duration above is the first gap; the continuous stretch is the final recording segment.'}
          </p>
        </div>}
      </div>

      <figure className="border-t border-line p-4 md:p-6">
        <div className="relative">
          {gap && <p className="mb-2 font-mono text-2xs text-fault">{mmss(gap.fromMs)} interrupted, {mmss(gap.toMs)} resumed{e.gaps.length > 1 ? `; ${e.gaps.length} interruptions total` : ''}</p>}
          <svg viewBox={`0 0 ${W} ${H + 40}`} className="block h-auto w-full" role="img"
            aria-label={`Timeline of the ${(e.durationS / 60).toFixed(1)} minute log, with a ${e.meta.periodMs} millisecond target interval and ${e.gaps.length} interruptions.`}>
            <defs>
              <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="2.5" height="6" fill="var(--fault)" />
              </pattern>
            </defs>
            <rect x="0" y="0" width={W} height={H} fill="var(--mask-950)" rx="2" />
            <line x1="0" x2={W} y1={H / 2} y2={H / 2} stroke="var(--line)" />
            {env}
            {e.gaps.map(g => <rect key={g.fromMs} x={tx(g.fromMs)} y="0" width={Math.max(tx(g.toMs) - tx(g.fromMs), 4)} height={H} fill={`url(#${hatchId})`} />)}
            {/* interval sparkline lane */}
            <path d={spark} transform={`translate(0 ${H + 6})`} fill="none" stroke="var(--phos)" strokeWidth="1.5" />
            {e.gaps.map(g => <line key={g.fromMs} x1={tx(g.fromMs)} x2={tx(g.fromMs)} y1="0" y2={H + 24} stroke="var(--fault)" />)}
          </svg>
          <div className="mt-2 flex justify-between font-mono text-2xs text-silk-3">
            <span>0:00</span>
            <span>{mmss(e.endMs)}</span>
          </div>
        </div>
        <figcaption className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-silk-3">
          <span><span className="text-trace">■</span> roll range per 5 s</span>
          <span><span className="text-phos">━</span> sample interval: worst {worst} ms, average {Number.isFinite(after.avgIntervalMs) ? `${after.avgIntervalMs.toFixed(3)} ms` : 'unavailable for a single sample'}</span>
          <span>{num(e.totalSamples)} samples over {(e.durationS / 60).toFixed(1)} min</span>
          <span>{dropped} dropped outside interruptions, {e.gaps.length} {e.gaps.length === 1 ? 'gap' : 'gaps'}</span>
        </figcaption>
      </figure>
    </div>
  )
}
