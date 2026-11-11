'use client'
import { useState } from 'react'

/**
 * "Before vs after DMA": one 10 ms sample period, drawn from data.
 * The bus is busy for the same 1.5 ms either way; what changes is whether
 * the CPU sits in a polling loop for it.
 *
 * Only the 1.5 ms figure and the 10 ms period are measured (resume + logic
 * analyzer). TODO(ismail): the "start DMA" and "filter and queue" widths are
 * illustrative; replace t0/t1 below with measured values if you have them.
 */
type Kind = 'bus' | 'wait' | 'work' | 'free'
interface Seg { id: string; lane: 0 | 1; t0: number; t1: number; kind: Kind; label: string; shortLabel?: string; explain: string; approx?: boolean }

const PERIOD = 10
const BUSY = 1.5

const SEGS: Record<'before' | 'after', Seg[]> = {
  before: [
    { id: 'b-bus', lane: 0, t0: 0, t1: BUSY, kind: 'bus', label: 'Transfer', explain: 'The sensor read (and SD bytes) cross the bus. The wire time is set by the bus speed, so it is the same before and after.' },
    { id: 'b-wait', lane: 1, t0: 0, t1: BUSY, kind: 'wait', label: 'Busy-wait', explain: 'The CPU loops on a status flag, moving one byte at a time. For 1.5 ms of every 10 ms it can do nothing else: 15% of the period, gone.' },
    { id: 'b-work', lane: 1, t0: BUSY, t1: BUSY + 0.45, kind: 'work', label: 'Filter', explain: 'Real work: run the complementary filter and queue the sample for the SD task. Width not to scale.', approx: true },
    { id: 'b-free', lane: 1, t0: BUSY + 0.45, t1: PERIOD, kind: 'free', label: 'Free', explain: 'Time left over for the other tasks until the next 10 ms tick.' },
  ],
  after: [
    { id: 'a-bus', lane: 0, t0: 0, t1: BUSY, kind: 'bus', label: 'Transfer', explain: 'Same bytes, same 1.5 ms on the wire. DMA does not make the bus faster.' },
    { id: 'a-start', lane: 1, t0: 0, t1: 0.12, kind: 'work', label: '', explain: 'The CPU points the DMA controller at a buffer and starts the transfer. Width not to scale.', approx: true },
    { id: 'a-freed', lane: 1, t0: 0.12, t1: BUSY, kind: 'free', label: 'Freed by DMA', shortLabel: 'CPU free', explain: 'Hardware copies the bytes into memory. The CPU is free for other tasks and is woken by an interrupt when the transfer completes.' },
    { id: 'a-work', lane: 1, t0: BUSY, t1: BUSY + 0.45, kind: 'work', label: 'Filter', explain: 'Same real work as before: filter the sample and queue it. Width not to scale.', approx: true },
    { id: 'a-free', lane: 1, t0: BUSY + 0.45, t1: PERIOD, kind: 'free', label: 'Free', explain: 'Time left over for the other tasks until the next 10 ms tick.' },
  ],
}

const X0 = 52, X1 = 748, LANE_Y = [34, 92], LANE_H = 44
const x = (t: number) => X0 + (t / PERIOD) * (X1 - X0)
const fill: Record<Kind, string> = { bus: 'var(--trace-dim)', wait: 'url(#hatch)', work: 'var(--phos)', free: 'var(--mask-700)' }
const stroke: Record<Kind, string> = { bus: 'var(--trace)', wait: 'var(--fault)', work: 'var(--phos)', free: 'var(--line-2)' }

export default function TimingDiagram() {
  const [state, setState] = useState<'before' | 'after'>('before')
  const [sel, setSel] = useState<string | null>(null)
  const segs = SEGS[state]
  const current = segs.find(s => s.id === sel)

  return (
    <div className="panel p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1" role="group" aria-label="Compare the sample period">
          <button type="button" className="ctl" aria-pressed={state === 'before'} onClick={() => { setState('before'); setSel(null) }}>Before DMA</button>
          <button type="button" className="ctl" aria-pressed={state === 'after'} onClick={() => { setState('after'); setSel(null) }}>After DMA</button>
        </div>
        <p className="font-mono text-xs text-silk-2" aria-live="polite">
          CPU busy-waiting:{' '}
          <span className={state === 'before' ? 'text-fault' : 'text-trace'}>{state === 'before' ? '1.5 ms (15% of the period)' : '0 ms'}</span>
        </p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg viewBox="0 0 760 176" className="block h-auto w-full min-w-[640px]" role="group" aria-label={`Timing of one 10 millisecond sample period, ${state} DMA`}>
          <defs>
            <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="8" height="8" fill="var(--fault)" opacity=".28" />
              <rect width="3" height="8" fill="var(--fault)" opacity=".8" />
            </pattern>
          </defs>
          {['Bus', 'CPU'].map((name, i) => (
            <text key={name} x={X0 - 10} y={LANE_Y[i] + LANE_H / 2 + 4} textAnchor="end" className="fill-silk-2 font-mono" fontSize="13">{name}</text>
          ))}
          {segs.map(s => {
            const w = x(s.t1) - x(s.t0), on = sel === s.id
            return (
              <g
                key={s.id} tabIndex={0} role="button" aria-label={`${s.label || 'Start DMA'}. ${s.explain}`} aria-pressed={on}
                className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[3]"
                onMouseEnter={() => setSel(s.id)} onFocus={() => setSel(s.id)} onClick={() => setSel(s.id)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(s.id) } }}
              >
                <rect x={x(s.t0)} y={LANE_Y[s.lane]} width={Math.max(w, 5)} height={LANE_H} rx="2"
                  fill={fill[s.kind]} stroke={on ? 'var(--silk)' : stroke[s.kind]} strokeWidth={on ? 2 : 1}
                  opacity={s.kind === 'free' && s.id !== 'a-freed' ? 0.7 : 1} />
                {s.id === 'a-freed' && <rect x={x(s.t0)} y={LANE_Y[1]} width={w} height={LANE_H} rx="2" fill="none" stroke="var(--trace)" strokeDasharray="5 4" pointerEvents="none" />}
                {s.label && w > 60 && (
                  <text x={x(s.t0) + 10} y={LANE_Y[s.lane] + LANE_H / 2 + 4} fontSize="12.5" pointerEvents="none"
                    className={`font-mono ${s.kind === 'work' ? 'fill-phos-ink' : 'fill-silk'}`}>{s.shortLabel ?? s.label}</text>
                )}
              </g>
            )
          })}
          {/* Time axis */}
          {Array.from({ length: 11 }, (_, t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={LANE_Y[1] + LANE_H + 6} y2={LANE_Y[1] + LANE_H + 12} stroke="var(--silk-3)" />
              {(t % 2 === 0) && <text x={x(t)} y={LANE_Y[1] + LANE_H + 28} textAnchor={t === PERIOD ? 'end' : 'middle'} fontSize="12" className="fill-silk-3 font-mono">{t} ms</text>}
            </g>
          ))}
          {/* Cursor pair marking the 1.5 ms */}
          <g pointerEvents="none">
            <line x1={x(0)} x2={x(0)} y1="10" y2={LANE_Y[1] + LANE_H} stroke="var(--silk-3)" strokeDasharray="2 3" />
            <line x1={x(BUSY)} x2={x(BUSY)} y1="10" y2={LANE_Y[1] + LANE_H} stroke="var(--silk-3)" strokeDasharray="2 3" />
            <text x={x(BUSY) + 8} y="20" fontSize="12" className="fill-silk-2 font-mono">Δt 1.5 ms</text>
          </g>
        </svg>
      </div>

      <p className="mt-4 min-h-[3.4em] max-w-prose text-sm text-silk-2" aria-live="polite">
        {current ? current.explain : 'Hover, tap or tab to a segment to see what the bus and the CPU are doing.'}
      </p>
    </div>
  )
}
