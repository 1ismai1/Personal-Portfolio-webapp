export const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)
export const GearIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
  </svg>
)

export interface Project {
  slug: string
  badge: React.ReactNode
  badgeClass: string
  title: string
  sub: string
  desc: string
  stack: string[]
  /** Shorter intro for the project page header; falls back to desc. */
  lead?: string
  /** Source repository, shown as a button at the top of the project page. */
  repo?: string
  /** Shown big on the home page: takes the top half of the Projects screen. */
  featured?: boolean
  image?: string
  imageAlt?: string
}

export const projects: Project[] = [
  {
    slug: 'end-effector',
    badge: <><GearIcon />Engineering Design</>,
    badgeClass: 'badge-aub',
    title: 'Q-Arm End Effector',
    sub: 'ENG 1P13 P1 · CAD + Python',
    desc: 'A modular end effector engineered for McMaster’s Q-Arm robotic platform, built to scan, grip, and sort warehouse parcels of different shapes, sizes, and weights. Our team combined a rack-and-pinion arm for flat-edged objects with a ball-and-socket concave disc for irregular ones, all inside a fully 3D-printed assembly under 100 grams. I wrote the Python control code that drove the arm through its full pick, scan, and pack sequence.',
    stack: ['CAD', 'Python', 'Rack & Pinion', 'Q-Arm Robotics', 'Prototyping'],
  },
  {
    slug: 'imu-logger',
    badge: <><GearIcon />Embedded Firmware</>,
    badgeClass: 'badge-silver',
    title: 'IMU Logger',
    sub: 'STM32F4 Bare-Metal Firmware · C + FreeRTOS + DMA',
    desc: 'Register-level bare-metal firmware for an STM32F4 — no HAL — with hand-written drivers for GPIO, I2C, SPI, UART, and timers. Reads a 6-axis IMU at 100 Hz over DMA and fuses orientation with a complementary filter, while FreeRTOS tasks split acquisition, filtering, and SD-card logging across queues with a ring buffer to prevent dropped samples. Verified bus timing and interrupt latency on a logic analyzer.',
    stack: ['C', 'STM32F4', 'FreeRTOS', 'DMA', 'SPI/I2C'],
    lead: 'Bare-metal firmware for an STM32F411 that reads a 6-axis IMU at 100 Hz, fuses it into roll and pitch, and logs every sample to an SD card as CSV.',
    repo: 'https://github.com/1ismai1/imu-logger-stm32',
    featured: true,
    image: '/imu-logger/hero-shot.jpg',
    imageAlt: 'STM32 Nucleo board wired to an IMU breakout, a microSD module, and a logic analyzer',
  },
  {
    slug: 'exo-arm',
    badge: <><GearIcon />Engineering Design</>,
    badgeClass: 'badge-eng',
    title: 'Exo Arm',
    sub: 'ENG 1P13 P3 · PLA + CAD Modelling',
    desc: 'A 3D-printed forearm-mounted assistive device for Mark, a 64-year-old client with Juvenile Rheumatoid Arthritis. A male-female connector system lets users hold everyday objects without needing grip strength. We designed it within a $100 budget and a 20-hour print limit, and it earned 4 out of 5 or better comfort ratings from more than 10 testers.',
    stack: ['CAD', '3D Printing', 'PLA', 'Iterative Design', 'User Testing'],
  },
  {
    slug: 'disillusionary-tale',
    badge: <><StarIcon />Personal Project</>,
    badgeClass: 'badge-gold',
    title: 'Disillusionary Tale',
    sub: 'Fantasy RPG · Unreal Engine 5',
    desc: 'A fantasy RPG built around a hidden trust system: three story beats quietly accumulate a TrustLevel that locks the player into one of two endings, biased through writing psychology rather than point-tuning. Dialogue, reputation, saving, and a parry-based combat loop all run on the same data-driven Unreal Engine 5 architecture, so one reusable system does the work instead of one-off logic per scene.',
    stack: ['Unreal Engine 5', 'C++ & Blueprints', 'Data-Driven Dialogue', 'Save System', 'Combat Design'],
  },
]
