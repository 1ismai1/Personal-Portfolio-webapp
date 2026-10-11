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
      'SysTick & timer interrupts',
      { name: 'DMA on I2C & SPI, ping-pong buffering', note: 'Hardware copies data in the background while the CPU does other work.' },
      { name: 'FreeRTOS tasks & ISR notifications', note: 'A small operating system that runs several jobs at once.' },
      { name: 'PLL clock config (1.5% → <0.06% error)', note: 'Switched to the board’s crystal-based clock, cutting timing error from 1.5% to under 0.06%.' },
      { name: 'Errata workaround (I2C bus-busy fix)', note: 'Errata are the manufacturer’s list of known chip bugs. Fixed the I2C bus-busy lock-up with a software reset.' },
    ],
  },
  {
    label: 'Storage',
    span: 3,
    skills: [
      'SD card driver over SPI (10.5 MHz)',
      'FatFS / exFAT, custom disk layer',
      { name: 'Power-loss-safe logging', note: 'A ring buffer and a sync once per second, so a power pull only loses the last second.' },
    ],
  },
  {
    label: 'Reliability & Testing',
    span: 3,
    skills: [
      'Bounded timeouts on every wait',
      'Automatic I2C recovery',
      { name: 'Fault-injection testing', note: 'Unplugged data and power wires mid-log and proved the logger recovered with zero bad samples.' },
    ],
  },
  {
    label: 'Sensors & Signal Processing',
    span: 4,
    skills: [
      { name: 'MPU-6050 IMU', note: 'A motion sensor: accelerometer plus gyroscope.' },
      'Burst reads & unit conversion',
      'Gyro & accelerometer calibration',
      { name: 'Complementary filter', note: 'Blends two imperfect sensors into one good tilt-angle estimate.' },
      'Sensor low-pass filter',
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
      'Compiler warnings as a bug filter',
    ],
  },
  {
    label: 'Hardware',
    span: 4,
    skills: [
      'Altium Designer (2-layer PCB)',
      'KiCad',
      'Soldering & rework',
      'Probing',
      'Verilog on a real FPGA',
    ],
  },
  {
    label: 'Languages',
    span: 6,
    skills: ['C', 'C++', 'Verilog', 'Python', 'MATLAB', 'TypeScript / JavaScript', 'HTML', 'Java', 'SQL'],
  },
  {
    label: 'Other projects',
    span: 6,
    skills: [
      'Unreal Engine 5 game (C++ & Blueprints)',
      { name: 'OTA bootloader (in progress, server side)', note: 'Lets you update a device’s firmware wirelessly.' },
    ],
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
