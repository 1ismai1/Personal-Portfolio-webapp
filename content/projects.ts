/**
 * The single source of truth for projects.
 * Adding a project = adding one object here. The home page cards and the
 * /projects/[slug] page header are generated from this data. To give a project
 * a case-study body, register a component in app/projects/[slug]/bodies.tsx.
 *
 * Facts come from the resume. Never invent metrics: if a number is not in the
 * resume, the repo, or public/data/*.json, leave a TODO(ismail) marker.
 */

export type StatusTone = 'ok' | 'live' | 'neutral'

export interface Stat {
  value: string
  unit?: string
  label: string
}

export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
  /** CSS object-position for the card crop. */
  position?: string
}

export interface Project {
  slug: string
  title: string
  /** Shown on the home page: 'embedded' leads, 'other' sits in the smaller grid. */
  group: 'embedded' | 'other'
  /** Short category, e.g. "Firmware". */
  kind: string
  /** One line under the title: tools and context. */
  sub: string
  /** Card copy. Two or three sentences, plain words. */
  summary: string
  /** Page intro. Falls back to summary. */
  lead?: string
  status: { label: string; tone: StatusTone }
  stack: string[]
  team?: string
  repo?: string
  image?: ProjectImage
  /** Up to four. The first one is the headline number on the card. */
  stats?: Stat[]
}

export const projects: Project[] = [
  {
    slug: 'imu-logger',
    title: 'IMU Logger',
    group: 'embedded',
    kind: 'Real-time firmware',
    sub: 'C, STM32 Cortex-M4, FreeRTOS, DMA',
    summary:
      'Register-level firmware that reads a 6-axis IMU at 100 Hz and logs every sample to an SD card. Four prioritized FreeRTOS tasks keep storage from ever delaying sampling, and DMA with ping-pong buffers removed 1.5 ms of CPU busy-waiting from each 10 ms sample.',
    lead:
      'Real-time firmware for an 84 MHz STM32 Cortex-M4 that reads an IMU at 100 Hz, filters it into roll and pitch, and logs every sample to an SD card. Drivers are written at register level and every claim below is backed by a capture or a log.',
    status: { label: 'Built and measured', tone: 'ok' },
    stack: ['C', 'STM32F411', 'FreeRTOS', 'DMA', 'I2C 100 kHz', 'SPI 10.5 MHz', 'FatFS'],
    repo: 'https://github.com/1ismai1/imu-logger-stm32',
    image: {
      src: '/imu-logger/hero-shot.jpg',
      alt: 'STM32 Nucleo board wired to an IMU breakout, a microSD module, and a logic analyzer',
      width: 2000,
      height: 1096,
      position: '55% 50%',
    },
    stats: [
      { value: '1.5', unit: 'ms', label: 'CPU busy-wait removed per 10 ms sample' },
      { value: '4', label: 'prioritized FreeRTOS tasks' },
      { value: '20+', label: 'hardware and firmware faults debugged' },
      { value: '<0.06', unit: '%', label: 'clock error, down from 1.5%' },
    ],
  },
  {
    slug: 'imu-shield',
    title: 'Sensor Shield PCB',
    group: 'embedded',
    kind: 'PCB design',
    sub: 'Altium Designer, 2-layer, JLCPCB',
    summary:
      'A 68.6 × 53.3 mm shield for the NUCLEO-F411RE carrying the MPU-6050, a XIAO ESP32-C3 radio and a microSD socket. A GPIO-switched 3.3 V regulator lets firmware power-cycle a locked SD card. Assembled and tested: 3 pin conflicts caught before power-on.',
    lead:
      'A 2-layer shield for the NUCLEO-F411RE that turns the IMU logger bench wiring into one board: MPU-6050, XIAO ESP32-C3 radio, microSD socket with switchable power, battery sensing and debug test points.',
    status: { label: 'Assembled and tested', tone: 'ok' },
    stack: ['Altium Designer', '2-layer PCB', 'NUCLEO-F411RE', 'JLCPCB', 'Power switching'],
    repo: 'https://github.com/1ismai1/imu-logger-shield',
    image: {
      src: '/imu-shield/shield-on-nucleo.jpg',
      alt: 'The assembled sensor shield plugged onto a NUCLEO-F411RE, powered on, with the MPU-6050 breakout and a microSD card fitted',
      width: 2000,
      height: 1532,
      position: '50% 45%',
    },
    stats: [
      { value: '0', unit: 'V', label: 'on the SD rail when switched off (measured)' },
      { value: '3', label: 'pin conflicts caught before power-on' },
      { value: '0', label: 'electrical rule violations' },
    ],
  },
  {
    slug: 'ota-update',
    title: 'OTA Firmware Update System',
    group: 'embedded',
    kind: 'Bootloader and host tools',
    sub: 'Python, C, STM32, team of 2',
    summary:
      'Firmware updates for STM32 over UART. I built the Python host tools: a packager that wraps each build in a versioned, CRC-32-checked image and a sender that streams it in acknowledged chunks, plus the bootloader’s jump-to-app logic, verified on hardware.',
    status: { label: 'In progress', tone: 'live' },
    stack: ['Python', 'C', 'STM32', 'UART', 'CRC-32', 'Bootloader'],
    team: 'Team of 2',
    stats: [
      { value: '23', label: 'tests covering lost ACKs and corrupted data' },
    ],
  },
  {
    slug: 'end-effector',
    title: 'Q-Arm End Effector',
    group: 'other',
    kind: 'Engineering design',
    sub: 'ENG 1P13, CAD and Python',
    summary:
      'A modular gripper for McMaster’s Q-Arm that scans, grips and sorts parcels of different shapes. Fully 3D-printed and under 100 g. I wrote the Python that drives the pick, scan and pack sequence.',
    status: { label: 'Course project', tone: 'neutral' },
    stack: ['CAD', 'Python', 'Rack and pinion', 'Prototyping'],
    image: { src: '/End-Effector-CAD.png', alt: 'CAD render of the Q-Arm end effector', width: 249, height: 155 },
  },
  {
    slug: 'exo-arm',
    title: 'Exo Arm',
    group: 'other',
    kind: 'Engineering design',
    sub: 'ENG 1P13, PLA and CAD',
    summary:
      'A 3D-printed forearm-mounted assistive device for a client with Juvenile Rheumatoid Arthritis. A connector system holds everyday objects without grip strength, built within a $100 budget and a 20-hour print limit.',
    status: { label: 'Course project', tone: 'neutral' },
    stack: ['CAD', '3D printing', 'Iterative design', 'User testing'],
    image: { src: '/Exo-arm-main.png', alt: 'The Exo Arm: a blue 3D-printed forearm frame with Velcro straps', width: 249, height: 155 },
  },
  {
    slug: 'disillusionary-tale',
    title: 'Disillusionary Tale',
    group: 'other',
    kind: 'Personal project',
    sub: 'Fantasy RPG, Unreal Engine 5',
    summary:
      'A fantasy RPG built around a hidden trust system that steers the player toward one of two endings. Dialogue, saving and parry-based combat all run on one data-driven Unreal Engine 5 architecture.',
    status: { label: 'Personal project', tone: 'neutral' },
    stack: ['Unreal Engine 5', 'C++ and Blueprints', 'Data-driven dialogue', 'Combat design'],
  },
]

export const getProject = (slug: string) => projects.find(p => p.slug === slug)
