import Image from 'next/image'

export default function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow" aria-hidden="true">
            McMaster Engineering&nbsp;&nbsp;·&nbsp;&nbsp;Class of 2029
          </div>
          <h1 className="hero-name">
            <span className="name-line1">Ismail</span>
            <span className="name-line2">Ahmed</span>
          </h1>
          <p className="hero-desc">
            First-year engineering student building things that matter — from AI civic platforms
            to wearable assistive devices. 3.9&nbsp;GPA. 2× hackathon winner.
            Seeking a software engineering internship.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">View Projects</a>
            <a href="#contact" className="btn-ghost">Get in touch&nbsp;→</a>
          </div>
        </div>

        <div className="photo-side">
          <div className="photo-outer">
            <div className="photo-glow" aria-hidden="true" />
            <div className="photo-frame">
              <Image
                src="/photo.jpeg"
                alt="Ismail Ahmed"
                width={290}
                height={370}
                priority
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%', filter: 'grayscale(12%) contrast(1.06) brightness(.97)' }}
              />
              <div className="photo-wash" aria-hidden="true" />
            </div>
            <div className="photo-tag" aria-hidden="true">
              Oakville, ON&nbsp;&nbsp;·&nbsp;&nbsp;<strong>3.9 GPA</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll</span>
        <div className="scroll-bar" />
      </div>
    </section>
  )
}
