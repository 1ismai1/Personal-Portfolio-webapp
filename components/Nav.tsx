import Link from 'next/link'

const links = [
  { href: '/#replay', label: 'Replay' },
  { href: '/#work', label: 'Work' },
  { href: '/#skills', label: 'Skills' },
]

/** Fixed top bar. Server component: no scroll listeners, no client JS. */
export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-mask-900/90 backdrop-blur-md">
      <nav className="wrap flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link href="/" className="flex min-h-[44px] items-center gap-2.5 font-mono text-sm font-medium text-silk no-underline transition-colors duration-fast hover:text-phos active:text-phos" aria-label="Ismail Ahmed, home">
          <span className="tp" aria-hidden="true" />
          <span>Ismail Ahmed</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="hidden min-h-[44px] items-center rounded-sm px-3 text-sm text-silk-2 no-underline transition-colors duration-fast hover:text-silk active:text-phos sm:inline-flex">
              {l.label}
            </Link>
          ))}
          <Link href="/#contact" className="btn btn-line min-h-[40px] px-4">Contact</Link>
        </div>
      </nav>
    </header>
  )
}
