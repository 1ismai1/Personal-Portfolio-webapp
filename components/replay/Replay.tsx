'use client'
/**
 * IMU orientation replay. This shell owns the data, the clock, the controls
 * and the 2D scope trace; it has no three.js dependency. The 3D board is a
 * separate chunk (BoardView) loaded only when the section scrolls into view
 * and the device can run WebGL. Otherwise a photo of the real board is shown
 * and everything else (trace, readouts, modes) still works.
 */
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { MODES, PARTS, wrap180, type Mode, type Motion, type PartId } from './shared'

const BoardView = dynamic(() => import('./BoardView'), { ssr: false })

const WINDOW_S = 8
const SPEEDS = [0.5, 1, 2]
const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}

function canRun3D() {
  try {
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
    if (nav.connection?.saveData) return false
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 2) return false
    if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 2) return false
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}

const fmt = (deg: number) => (deg < 0 ? '−' : '+') + Math.abs(deg).toFixed(1).padStart(5, '0') + '°'

export default function Replay() {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const range = useRef<HTMLInputElement>(null)
  const outRoll = useRef<HTMLSpanElement>(null)
  const outPitch = useRef<HTMLSpanElement>(null)
  const outTime = useRef<HTMLSpanElement>(null)
  const outErr = useRef<HTMLSpanElement>(null)
  const pos = useRef(0)

  const [data, setData] = useState<Motion | null>(null)
  const [failed, setFailed] = useState(false)
  const [inView, setInView] = useState(false)
  const [seen, setSeen] = useState(false)
  const [use3D, setUse3D] = useState<boolean | null>(null)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [mode, setMode] = useState<Mode>('filt')
  const [active, setActive] = useState<PartId | null>(null)

  // Load nothing until the section is near the viewport.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting)
      if (e.isIntersecting) setSeen(true)
    }, { rootMargin: '200px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!seen || data) return
    setUse3D(canRun3D())
    fetch('/data/motion.json')
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json() })
      .then((d: Motion) => {
        setData(d)
        // Autoplay once, unless the visitor asked for reduced motion.
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(true)
      })
      .catch(() => setFailed(true))
  }, [seen, data])

  const draw = useCallback(() => {
    if (!data) return
    const n = data.meta.samples, hz = data.meta.hz
    const p = Math.min(pos.current, n - 1), i = Math.floor(p)
    const s = data[mode]
    const roll = s.r[i] / 10, pitch = s.p[i] / 10
    if (outRoll.current) outRoll.current.textContent = fmt(roll)
    if (outPitch.current) outPitch.current.textContent = fmt(pitch)
    if (outTime.current) outTime.current.textContent = (p / hz).toFixed(2).padStart(5, '0')
    if (outErr.current) outErr.current.textContent = mode === 'filt' ? '' : `${Math.abs(wrap180(roll - data.filt.r[i] / 10)).toFixed(1)}° off the filter`
    if (range.current && document.activeElement !== range.current) range.current.value = String(i)
    if (range.current) range.current.setAttribute('aria-valuetext', `${(p / hz).toFixed(1)} seconds, roll ${roll.toFixed(0)} degrees, pitch ${pitch.toFixed(0)} degrees`)

    const cv = canvas.current
    if (!cv) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = cv.clientWidth, h = cv.clientHeight
    if (cv.width !== w * dpr || cv.height !== h * dpr) { cv.width = w * dpr; cv.height = h * dpr }
    const g = cv.getContext('2d')
    if (!g) return
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, w, h)
    const span = WINDOW_S * hz, start = p - span
    const xOf = (k: number) => ((k - start) / span) * w
    const yOf = (v: number) => h / 2 - (v / 1800) * (h / 2 - 6)
    const line = (arr: number[], color: string, width: number, alpha = 1) => {
      g.beginPath()
      let prev = 0, pen = false
      for (let k = Math.max(0, Math.floor(start)); k <= i; k++) {
        const v = arr[k]
        // Lift the pen where the angle wraps through ±180°.
        if (!pen || Math.abs(v - prev) > 1800) { g.moveTo(xOf(k), yOf(v)); pen = true } else g.lineTo(xOf(k), yOf(v))
        prev = v
      }
      g.globalAlpha = alpha; g.strokeStyle = color; g.lineWidth = width; g.lineJoin = 'round'; g.stroke(); g.globalAlpha = 1
    }
    if (mode !== 'filt') { // ghost of the filtered answer, for comparison
      line(data.filt.r, css('--silk-3'), 1, 0.7)
      line(data.filt.p, css('--silk-3'), 1, 0.7)
    }
    if (mode === 'gyro') { // mark samples where the gyro hit its ±2000 °/s rail
      g.fillStyle = css('--fault')
      for (const [a, b] of data.saturated) if (b >= start && a <= i) g.fillRect(xOf(a) - 1, 0, Math.max(2, xOf(b) - xOf(a) + 2), h)
    }
    line(s.p, css('--trace'), 1.5)
    line(s.r, css('--phos'), 1.5)
  }, [data, mode])

  // The clock. Runs only while playing and on screen.
  useEffect(() => {
    if (!data) return
    draw()
    if (!playing || !inView) return
    let raf = 0, last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100); last = now
      pos.current += (dt / 1000) * data.meta.hz * speed
      if (pos.current >= data.meta.samples - 1) pos.current = 0
      draw()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [data, playing, inView, speed, draw])

  useEffect(() => {
    const onResize = () => draw()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [draw])

  const part = PARTS.find(p => p.id === active)
  const sat = data?.meta.gyroSaturatedSamples ?? 0
  const show3D = use3D && data && !failed

  return (
    <div ref={root} className="panel grid overflow-hidden lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 border-b border-line lg:border-b-0 lg:border-r">
        {/* Stage */}
        <div className="relative aspect-[4/3] max-h-[520px] w-full bg-mask-950 md:aspect-[16/10]">
          {show3D ? (
            <Boundary onError={() => setUse3D(false)}>
              <BoardView data={data} mode={mode} pos={pos} active={active} onActive={setActive} running={inView} />
            </Boundary>
          ) : (
            <>
              <Image
                src="/imu-shield/shield-on-nucleo.jpg"
                alt="The assembled sensor shield on a NUCLEO-F411RE, powered on, with the MPU-6050 and a microSD card fitted"
                fill sizes="(max-width: 1024px) 100vw, 860px" className="object-cover"
              />
              <div className="absolute inset-0 bg-mask-600 opacity-25 mix-blend-multiply" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-t from-mask-950/60 to-transparent" aria-hidden="true" />
              {use3D === false && (
                <p className="absolute bottom-3 left-3 right-3 rounded-xs bg-mask-950/85 px-3 py-2 text-xs text-silk-2">
                  The 3D view needs WebGL, which this device or browser has turned off. This is a photo of the same board; the trace below is still the real log.
                </p>
              )}
            </>
          )}
          {failed && (
            <p role="alert" className="absolute left-3 top-3 rounded-xs bg-mask-950/85 px-3 py-2 text-xs text-fault">
              The motion log did not load. Reload the page to try again.
            </p>
          )}
          {part && (
            <div className="pointer-events-none absolute left-3 top-3 max-w-[300px] rounded-xs border border-phos bg-mask-950/90 px-3 py-2">
              <div className="font-mono text-xs text-phos">{part.refdes}&nbsp;&nbsp;{part.name}</div>
              <p className="mt-1 text-xs leading-snug text-silk-2">{part.does}</p>
            </div>
          )}
        </div>

        {/* Scope trace */}
        <div className="screen relative mx-3 mt-3 h-[132px] md:mx-4">
          <canvas ref={canvas} className="absolute inset-0 h-full w-full" role="img" aria-label="Scrolling plot of roll and pitch over the last 8 seconds of the replay" />
          <span className="absolute left-2 top-1 font-mono text-2xs text-silk-3">+180°</span>
          <span className="absolute bottom-1 left-2 font-mono text-2xs text-silk-3">−180°</span>
          <span className="absolute right-2 top-1 font-mono text-2xs"><span className="text-phos">roll</span>&nbsp;&nbsp;<span className="text-trace">pitch</span>{mode !== 'filt' && <span className="text-silk-3">&nbsp;&nbsp;filter</span>}</span>
        </div>

        {/* Transport */}
        <div className="flex flex-wrap items-center gap-3 p-3 md:p-4">
          <button type="button" className="ctl min-w-[76px]" onClick={() => setPlaying(p => !p)} disabled={!data} aria-label={playing ? 'Pause replay' : 'Play replay'}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <input
            ref={range} type="range" min={0} max={(data?.meta.samples ?? 1) - 1} defaultValue={0} step={1} disabled={!data}
            aria-label="Replay position"
            className="scrub h-9 min-w-[140px] flex-1 cursor-pointer"
            onChange={e => { pos.current = Number(e.target.value); draw() }}
          />
          <span className="font-mono text-xs text-silk-2"><span ref={outTime}>00.00</span> / {(data?.meta.durationS ?? 0).toFixed(2)} s</span>
          <div className="flex gap-1" role="group" aria-label="Playback speed">
            {SPEEDS.map(v => (
              <button key={v} type="button" className="ctl" aria-pressed={speed === v} onClick={() => setSpeed(v)}>{v}×</button>
            ))}
          </div>
        </div>
      </div>

      {/* Side panel */}
      <div className="flex min-w-0 flex-col gap-6 p-4 md:p-6">
        <div>
          <div className="ref mb-3">Estimate the angle from</div>
          <div className="flex flex-col gap-1.5" role="group" aria-label="Orientation source">
            {MODES.map(m => (
              <button key={m.id} type="button" className="ctl justify-start" aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>{m.label}</button>
            ))}
          </div>
          <p className="mt-3 text-sm text-silk-2">{MODES.find(m => m.id === mode)!.blurb}</p>
          {mode === 'gyro' && (
            <p className="mt-2 text-xs text-silk-3" title="The MPU-6050 is set to ±2000 °/s. Raw gyro values reach 32,125 of a possible 32,767.">
              The gyro also clips at ±2000 °/s. {sat === 1 ? 'One sample' : `${sat} samples`} in this log hit that limit (marked in red on the trace), and clipped rotation is rotation the integral never sees.
            </p>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line font-mono">
          <div className="bg-mask-900 p-3"><dt className="text-2xs text-phos">roll</dt><dd className="text-lg text-silk"><span ref={outRoll}>+000.0°</span></dd></div>
          <div className="bg-mask-900 p-3"><dt className="text-2xs text-trace">pitch</dt><dd className="text-lg text-silk"><span ref={outPitch}>+000.0°</span></dd></div>
          <div className="col-span-2 min-h-[34px] bg-mask-900 px-3 py-2 text-xs text-fault"><dt className="sr-only">Difference from filter</dt><dd><span ref={outErr} /></dd></div>
        </dl>

        <div>
          <div className="ref mb-3">On the board</div>
          <div className="flex flex-wrap gap-1.5">
            {PARTS.map(p => (
              <button key={p.id} type="button" className="ctl" aria-pressed={active === p.id}
                onClick={() => setActive(a => (a === p.id ? null : p.id))}
                onMouseEnter={() => setActive(p.id)} onFocus={() => setActive(p.id)}>
                {p.name}
              </button>
            ))}
          </div>
          <p className="mt-3 min-h-[5.5em] text-sm text-silk-2" aria-live="polite">
            {part ? part.does : 'Hover or tap a part, here or on the model, to see what it does.'}
          </p>
        </div>
      </div>
    </div>
  )
}
