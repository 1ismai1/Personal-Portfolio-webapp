import Image from 'next/image'

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow" aria-hidden="true">
            2nd Year Computer Engineering&nbsp;&nbsp;·&nbsp;&nbsp;McMaster University
          </div>
          <h1 className="hero-name">
            <span className="name-line1">Ismail</span>
            <span className="name-line2">Ahmed</span>
          </h1>
          <p className="hero-desc">
            Second-year computer engineering student at McMaster University. Wrote bare-metal firmware that logs
            motion data to an SD card at 100&nbsp;Hz. 3.9/4.0&nbsp;GPA.
            Seeking a firmware, hardware, or software engineering internship.
          </p>
          <div className="hero-actions">
            <a href="#embedded" className="btn-primary">View Projects</a>
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
              Oakville, ON&nbsp;&nbsp;·&nbsp;&nbsp;<strong>3.9/4.0 GPA</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll</span>
        <div className="scroll-bar" />
      </div>
    </div>
  )
}
