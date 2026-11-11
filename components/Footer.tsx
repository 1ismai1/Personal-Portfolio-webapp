const contacts = [
  { label: 'Email', value: 'Ismail.ahm22d@gmail.com', href: 'mailto:Ismail.ahm22d@gmail.com' },
  { label: 'GitHub', value: 'github.com/1ismai1', href: 'https://github.com/1ismai1' },
  { label: 'LinkedIn', value: 'linkedin.com/in/ismail-ahmed-90210compeng', href: 'https://www.linkedin.com/in/ismail-ahmed-90210compeng' },
]

/** Contact block + footer, shown on every page. */
export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-mask-950">
      <div className="wrap grid gap-10 py-section lg:grid-cols-2">
        <div>
          <h2 className="display max-w-[16ch] text-2xl md:text-3xl">Hiring for Summer 2027?</h2>
          <p className="mt-5 max-w-[48ch] text-base text-silk-2">
            I am looking for a firmware, embedded or hardware co-op, full-time and on-site from May to August 2027. Email is the fastest way to reach me.
          </p>
          <a href="mailto:Ismail.ahm22d@gmail.com" className="btn btn-solid mt-7">Email me</a>
        </div>
        <ul className="m-0 list-none self-end p-0">
          {contacts.map(c => (
            <li key={c.label} className="border-t border-line last:border-b">
              <a
                href={c.href}
                {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group grid min-h-[56px] grid-cols-[88px_minmax(0,1fr)] items-center gap-4 py-3 no-underline"
              >
                <span className="ref">{c.label}</span>
                <span className="truncate text-sm text-silk transition-colors duration-fast group-hover:text-phos group-active:text-phos">{c.value}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="wrap flex flex-wrap justify-between gap-2 border-t border-line py-6 font-mono text-xs text-silk-3">
        <span>© 2026 Ismail Ahmed</span>
        <span>Oakville, ON. McMaster Computer Engineering.</span>
      </div>
    </footer>
  )
}
