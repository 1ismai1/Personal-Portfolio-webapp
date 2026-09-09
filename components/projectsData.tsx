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
}

export const projects: Project[] = [
  {
    slug: 'baraka-circle',
    badge: <><StarIcon />1st Place — Fintech</>,
    badgeClass: 'badge-gold',
    title: 'Baraka Circle',
    sub: 'Ummah Hack · SvelteKit + Firebase',
    desc: 'An interest-free alternative to traditional loans — groups form rotating savings circles coordinated through a real-time Firebase backend. Integrated Ethereum smart contracts to record and confirm transactions on-chain, delivering a fully functional fintech product under hackathon time pressure.',
    stack: ['SvelteKit', 'Firebase', 'Ethereum', 'Smart Contracts'],
  },
  {
    slug: 'safepulse',
    badge: <><StarIcon />2nd / 63 Teams — Mac-a-Thon</>,
    badgeClass: 'badge-silver',
    title: 'SafePulse',
    sub: 'Mac-a-Thon 2026 · Next.js + Gemini API',
    desc: 'An AI-powered civic reporting platform converting voice and photo input into structured, city-ready 311 reports aligned with real City of Hamilton standards. Features a fully voice-navigable UI and a live heatmapped neighbourhood map for hands-free, real-time community issue reporting.',
    stack: ['Next.js', 'Firebase', 'Gemini API', 'Voice UI', 'Maps'],
  },
  {
    slug: 'exo-arm',
    badge: <><GearIcon />Engineering Design</>,
    badgeClass: 'badge-eng',
    title: 'Exo Arm',
    sub: 'ENG 1P13 P3 · PLA + CAD Modelling',
    desc: 'A 3D-printed forearm-mounted assistive device for Mark, a 64-year-old client with Juvenile Rheumatoid Arthritis. A male-female connector system lets users hold everyday objects without grip strength. Designed within a $100 budget and 20-hour print limit — achieving ≥ 4/5 comfort ratings across 10+ testers.',
    stack: ['CAD', '3D Printing', 'PLA', 'Iterative Design', 'User Testing'],
  },
]
