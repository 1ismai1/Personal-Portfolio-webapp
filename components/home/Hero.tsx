import { StatusBadge } from '@/components/kit'
import Link from 'next/link'

/**
 * Hero. Server-rendered: the H1 is plain HTML (so it is the
 * LCP element and paints immediately) and the decode animation is CSS only.
 * The waveform is the real I2C encoding of the ASCII bytes of the name:
 * MSB first, an ACK bit after each byte, SDA only changing while SCL is low.
 */
const NAME = 'ISMAIL AHMED'
const BYTES = [...NAME].map((ch, i) => ({ ch, code: ch.charCodeAt(0), i }))
const STEP_MS = 150 // per byte; keep in sync with .hero-letter in globals.css
const START_MS = 420

type ByteInfo = (typeof BYTES)[number]

function TraceRow({ bytes, first, last, className = '' }: { bytes: ByteInfo[]; first: boolean; last: boolean; className?: string }) {
  // One unit = one SCL period. 1 unit lead-in (start or idle), 9 per byte, 1 lead-out (stop).
  const W = bytes.length * 9 + 2
  const H = 100
  const sdaHi = 12, sdaLo = 38, sclHi = 62, sclLo = 88

  // SCL: idle high, then a clock pulse per bit (low half, then high half).
  let scl = `M0 ${first ? sclHi : sclLo}`
  if (first) scl += ` H0.75 V${sclLo}`
  // SDA: start condition = SDA falls while SCL is still high.
  let sda = `M0 ${first ? sdaHi : sdaLo}`
  if (first) sda += ` H0.45 V${sdaLo}`
  let level = 0
  bytes.forEach((b, k) => {
    for (let bit = 0; bit < 9; bit++) {
      const x = 1 + k * 9 + bit
      const v = bit === 8 ? 0 : (b.code >> (7 - bit)) & 1 // 9th bit: ACK, pulled low
      if (v !== level) { sda += ` H${x + 0.12} V${v ? sdaHi : sdaLo}`; level = v }
      scl += ` H${x + 0.5} V${sclHi} H${x + 1} V${sclLo}`
    }
  })
  if (last) {
    // Stop condition: SCL goes high, then SDA rises.
    scl += ` H${W - 0.75} V${sclHi} H${W}`
    sda += ` H${W - 0.4} V${sdaHi} H${W}`
  } else {
    scl += ` H${W}`
    sda += ` H${W}`
  }

  const delay = START_MS + bytes[0].i * STEP_MS
  const dur = bytes.length * STEP_MS + 100
  const anim = { animationDelay: `${delay}ms`, animationDuration: `${dur}ms` }

  return (
    <div className={className}>
      {/* Protocol decode row: hex first, resolves to the letter as the cursor passes. */}
      <div className="grid font-mono text-2xs md:text-xs" style={{ gridTemplateColumns: `1fr repeat(${bytes.length}, 9fr) 1fr` }}>
        <span className="text-center text-silk-3">{first ? 'S' : ''}</span>
        {bytes.map(b => (
          <span key={b.i} className="relative mx-px h-6 rounded-xs border border-phos-dim bg-mask-800 text-center leading-[22px]" style={{ '--i': b.i } as React.CSSProperties}>
            <span className="decode-hex absolute inset-0 text-silk-3">{b.code.toString(16).toUpperCase()}</span>
            <span className="decode-chr absolute inset-0 font-medium text-phos">{b.ch === ' ' ? '␣' : b.ch}</span>
          </span>
        ))}
        <span className="text-center text-silk-3">{last ? 'P' : ''}</span>
      </div>
      <div className="relative mt-2 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-[52px] w-full md:h-[84px]">
          <path d={sda} fill="none" stroke="var(--phos)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          <path d={scl} fill="none" stroke="var(--trace)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
        <div className="trace-wipe absolute inset-0 bg-mask-950" style={anim} />
        <div className="trace-cursor absolute inset-0 border-l border-silk" style={anim} />
      </div>
    </div>
  )
}

export default function Hero() {
  const words = NAME.split(' ')
  let idx = 0
  return (
    <section className="wrap pb-16 pt-24 md:pt-36" aria-labelledby="hero-name">
      <StatusBadge tone="live">Open to firmware and hardware co-ops, Summer 2027</StatusBadge>

      <h1 id="hero-name" aria-label="Ismail Ahmed" className="display mt-6 text-[clamp(2.75rem,9.4vw,6.75rem)] uppercase leading-[0.95]">
        {words.map((word, w) => {
          const el = (
            <span key={word} className="inline-block whitespace-nowrap" aria-hidden="true">
              {[...word].map(ch => (
                <span key={idx} className="hero-letter inline-block" style={{ '--i': idx++ } as React.CSSProperties}>{ch}</span>
              ))}
            </span>
          )
          idx++ // the space is a byte too (0x20)
          return w < words.length - 1 ? [el, ' '] : el
        })}
      </h1>

      {/* The analyzer: decorative, the H1 carries the meaning. */}
      <div className="screen relative mt-6 px-3 pb-3 pt-3 md:px-5 md:pt-4" aria-hidden="true">
        <div className="mb-2 flex items-center justify-between font-mono text-2xs text-silk-3">
          <span>I2C decode, ASCII</span>
          <span><span className="text-phos">SDA</span>&nbsp;&nbsp;<span className="text-trace">SCL</span></span>
        </div>
        <TraceRow bytes={BYTES} first last className="hidden md:block" />
        <div className="space-y-3 md:hidden">
          <TraceRow bytes={BYTES.slice(0, 6)} first last={false} />
          <TraceRow bytes={BYTES.slice(6)} first={false} last />
        </div>
      </div>

      <div className="mt-7 grid items-start gap-6 lg:mt-10 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div>
          <p className="max-w-[46ch] text-lg text-silk">
            I write real-time firmware in C for STM32, design the boards it runs on, and prove both with a logic analyzer.
          </p>
          {/* Small screens: the hard number sits above the buttons so it lands on the first screen. */}
          <Link href="#timing" className="mt-4 flex items-baseline gap-3 border-y border-line py-3 no-underline lg:hidden">
            <span className="whitespace-nowrap font-mono text-xl font-medium text-silk">−1.5<span className="ml-1 text-sm text-phos">ms</span></span>
            <span className="text-xs text-silk-2">CPU busy-waiting removed from every 10 ms sample, measured on a logic analyzer</span>
          </Link>
          <p className="mt-3 hidden max-w-[58ch] text-sm text-silk-2 lg:block">
            Computer Engineering co-op student at McMaster University, Level 2. Available full-time and on-site, May to August 2027.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 lg:mt-7">
            <a href="mailto:Ismail.ahm22d@gmail.com" className="btn btn-solid">Email me</a>
            <Link href="#work" className="btn btn-line">See the work</Link>
            <a href="https://github.com/1ismai1" target="_blank" rel="noopener noreferrer" className="btn btn-line">GitHub</a>
          </div>
        </div>

        {/* The one hard number, drawn as a cursor measurement. */}
        <Link href="#timing" className="panel group hidden p-5 lg:block no-underline transition-transform duration-base ease-spring hover:-translate-y-1 active:translate-y-0 md:p-6">
          <div className="flex items-baseline justify-between font-mono text-xs text-silk-3">
            <span>Δt per 10 ms sample</span>
            <span className="text-trace">measured</span>
          </div>
          <div className="mt-2 font-mono text-3xl font-medium text-silk">
            −1.5<span className="ml-2 text-xl text-phos">ms</span>
          </div>
          {/* 10 ms period; the hatched 15% is the busy-wait that DMA removed. */}
          <div className="mt-4 flex h-3 overflow-hidden rounded-xs border border-line-2" aria-hidden="true">
            <div className="w-[15%] bg-phos" style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 3px, rgba(10,19,18,.55) 3px 6px)' }} />
            <div className="flex-1 bg-mask-700" />
          </div>
          <p className="mt-4 text-sm text-silk-2">
            Removed 1.5 ms of CPU busy-waiting per 10 ms sample by moving sensor reads and SD writes to DMA.
            <span className="link ml-1 whitespace-nowrap">See the timing</span>
          </p>
        </Link>
        <p className="max-w-[58ch] text-sm text-silk-2 lg:hidden">
          Computer Engineering co-op student at McMaster University, Level 2. Available full-time and on-site, May to August 2027.
        </p>
      </div>
    </section>
  )
}
