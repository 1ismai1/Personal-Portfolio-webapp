import Reveal from './Reveal'

const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
)

export default function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal>
          <div className="sec-label">Let&apos;s Connect</div>
          <h2 className="sec-title" id="contact-title">Get in touch</h2>
        </Reveal>

        <Reveal delay={100}>
          <p style={{ fontSize: '17px', color: 'var(--txt2)', lineHeight: 1.8, marginTop: '18px', maxWidth: '520px' }}>
            I&apos;m actively seeking software engineering internships. If you&apos;re building something interesting, I&apos;d love to hear from you.
          </p>
          <div className="clinks">
            <a href="mailto:Ismail.ahm22d@gmail.com" className="clink">
              <EmailIcon />
              Ismail.ahm22d@gmail.com
            </a>
            <a href="https://github.com/1ismai1" target="_blank" rel="noopener noreferrer" className="clink">
              <GitHubIcon />
              github.com/1ismai1
            </a>
          </div>
        </Reveal>

        <div className="divider" />
        <div className="foot-row">
          <span>© 2026 Ismail Ahmed</span>
          <span>Oakville, ON&nbsp;&nbsp;·&nbsp;&nbsp;McMaster Engineering</span>
        </div>
      </div>
    </section>
  )
}
