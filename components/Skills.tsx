import Reveal from './Reveal'

/** `note` is a plain-English gloss, shown as a hover tooltip. */
type Skill = string | { name: string; note: string }

interface Category {
  label: string
  skills: Skill[]
  /** Width on the 12-column desktop grid. */
  span: 3 | 4 | 6
}

const categories: Category[] = [
  {
    label: 'Embedded Firmware',
    span: 6,
    skills: [
      'Bare-metal C (STM32)',
      { name: 'Register-level drivers', note: 'No vendor library: the chip’s hardware is driven directly instead of through ST’s ready-made functions.' },
      'GPIO · UART · I2C · SPI',
      { name: 'DMA on I2C & SPI, ping-pong buffering', note: 'Hardware copies data in the background while the CPU does other work.' },
      { name: 'FreeRTOS tasks & ISR notifications', note: 'A small operating system that runs several jobs at once.' },
      { name: 'PLL clock config (1.5% → <0.06% error)', note: 'Switched to the board’s crystal-based clock, cutting timing error from 1.5% to under 0.06%.' },
    ],
  },
  {
    label: 'Storage & Reliability',
    span: 6,
    skills: [
      'SD card driver over SPI (10.5 MHz)',
      'FatFS / exFAT, custom disk layer',
      { name: 'Power-loss-safe logging', note: 'A ring buffer and a sync once per second, so a power pull only loses the last second.' },
      { name: 'Fault-injection testing', note: 'Unplugged data and power wires mid-log and proved the logger recovered with zero bad samples.' },
    ],
  },
  {
    label: 'Debugging & Tools',
    span: 4,
    skills: [
      '24 MHz logic analyzer (PulseView)',
      'I2C / SPI timing capture',
      'STM32CubeIDE & CubeMX',
      'Git / GitHub',
    ],
  },
  {
    label: 'Hardware',
    span: 4,
    skills: [
      'Altium Designer (2-layer PCB)',
      'KiCad',
      'Soldering & rework',
      'Verilog on a real FPGA',
    ],
  },
  {
    label: 'Languages',
    span: 4,
    skills: ['C', 'C++', 'Verilog', 'Python', 'MATLAB', 'TypeScript / JavaScript'],
  },
]

function Pill({ skill }: { skill: Skill }) {
  const s = typeof skill === 'string' ? { name: skill, note: undefined } : skill
  return <span className="spill" title={s.note}>{s.name}</span>
}

export default function Skills() {
  return (
    <section className="skills" aria-labelledby="skills-title">
      <div className="container">
        <Reveal className="sec-head">
          <div className="sec-label">Technical Toolkit</div>
          <h2 className="sec-title" id="skills-title">Skills</h2>
        </Reveal>

        <div className="skills-cols">
          {categories.map((cat, i) => (
            <Reveal key={cat.label} delay={i * 70} className={`skill-s${cat.span}`}>
              <div className="skill-cat">{cat.label}</div>
              <div className="skill-row">
                {cat.skills.map(s => <Pill key={typeof s === 'string' ? s : s.name} skill={s} />)}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
