import Reveal from './Reveal'
import Image from 'next/image'

export default function Reflection() {
  return (
    <section id="reflection" className="reflection" aria-labelledby="refl-title">
      <div className="container">
        <Reveal className="sec-head">
          <div className="sec-label">Exo Arm — ENG 1P13</div>
          <h2 className="sec-title" id="refl-title">
            Learning<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Reflection</em>
          </h2>
        </Reveal>

        {/* Intro + device photos */}
        <Reveal className="refl-intro">
          <div className="refl-intro-text">
            <p>
              For Design Project 3, our team built the <strong style={{ color: 'var(--txt)', fontWeight: 500 }}>Exo Arm</strong> — a 3D-printed forearm-mounted assistive device for Mark, a 64-year-old client living with Juvenile Rheumatoid Arthritis. The device uses a male-female connector system so Mark can hold cups, utensils, and other everyday objects without grip strength.
            </p>
            <p>
              This reflection traces a single pivotal moment in Week 8 that changed how I think about testing — and ultimately made the device better.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
              {['3D Printing / PLA', 'CAD Modelling', 'Iterative Design', 'User Testing', 'Jan 5 – Apr 3, 2026'].map(tag => (
                <span key={tag} className="ttag">{tag}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="refl-device-img">
              <Image src="/Exo-arm-main.png" alt="Final Exo Arm — 3D-printed blue PLA forearm frame with Velcro straps" fill style={{ objectFit: 'cover', filter: 'grayscale(10%) contrast(1.06)' }} />
              <div className="img-overlay" aria-hidden="true" />
              <div className="refl-device-cap">Final Design — 3D-printed PLA frame with Velcro straps &amp; connector system</div>
            </div>
            <div className="refl-device-img">
              <Image src="/Exo-arm-attachments.png" alt="Connector attachments — red, blue and white twist-on clips" fill style={{ objectFit: 'cover', filter: 'grayscale(10%) contrast(1.06)' }} />
              <div className="img-overlay" aria-hidden="true" />
              <div className="refl-device-cap">Connector Attachments — twist-on clip system for everyday objects</div>
            </div>
          </div>
        </Reveal>

        {/* What / So What / Now What */}
        <div className="refl-steps">

          {/* What? */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">What?</div>
              <div className="refl-step-line" aria-hidden="true" />
            </div>
            <div>
              <h3 className="refl-step-q">The chopstick problem</h3>
              <p>
                It was Week 8, Design Studio, and we had a problem. Mark lives with Juvenile Rheumatoid Arthritis — a chronic condition where joint inflammation steadily strips away grip strength and fine motor control — and he could not be present for every testing session. So we had to simulate his limitations ourselves.
              </p>
              <p>
                Our first idea was chopsticks wedged between our fingers to block hand closure. It felt logical. But the moment we actually tried it, something was wrong: the chopsticks slid around, every teammate held them at a different angle, and there was none of the actual resistance or stiffness that damaged joints produce. The results between testers were all over the place.
              </p>
              <div className="refl-pullquote">
                <p>&ldquo;We threw out that method entirely and switched to tapping our fingertips firmly against our palms before each trial — mimicking the reduced range of motion and grip strength Mark experiences day to day.&rdquo;</p>
              </div>
              <p>
                Suddenly the data was consistent. Suddenly the device&apos;s real weaknesses became visible. It was a small change that quietly changed everything about how we understood our own design.
              </p>
            </div>
          </Reveal>

          {/* So What? */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">So What?</div>
              <div className="refl-step-line" aria-hidden="true" />
            </div>
            <div>
              <h3 className="refl-step-q">The cost of bad data</h3>
              <p>
                The chopstick data was useless, and that stung more than I expected. We had spent real time running those tests, recording numbers, comparing results across teammates, and none of it actually told us anything about Mark. That was the hard part to sit with.
              </p>
              <p>
                On the positive side, catching the flaw before Milestone 6 meant we still had time to fix it. The fingertip-tapping method worked, the revised data was consistent, and the design changes we made based on it genuinely improved the device. But I kept thinking about how close we came to presenting results built on a broken foundation.
              </p>
              <div className="refl-pullquote">
                <p>&ldquo;What changed for me was how I now think about testing itself. The simulation method is a design decision — one that shapes every number that comes after it.&rdquo;</p>
              </div>
              <p>
                I used to treat the test as something that happens after the design decisions. This experience forced me to see that if nobody questions it early, nobody questions it at all. Below are the scores testers gave after we modified the device based on the corrected fingertip-tapping results.
              </p>

              {/* Charts */}
              <div className="refl-charts">
                {/* User Independence Scores */}
                <div className="chart-card">
                  <div className="chart-title">User Independence Scores</div>
                  <div className="chart-svg-wrap">
                    <svg viewBox="0 0 300 180" width="100%" aria-label="Bar chart: user independence scores. Score 10: 1 person, 9: 1 person, 8: 3 people, 7: 2 people">
                      <line x1="40" y1="20"  x2="280" y2="20"  stroke="rgba(237,232,224,.07)" strokeWidth="1"/>
                      <line x1="40" y1="57"  x2="280" y2="57"  stroke="rgba(237,232,224,.07)" strokeWidth="1"/>
                      <line x1="40" y1="94"  x2="280" y2="94"  stroke="rgba(237,232,224,.07)" strokeWidth="1"/>
                      <line x1="40" y1="131" x2="280" y2="131" stroke="rgba(237,232,224,.07)" strokeWidth="1"/>
                      <text x="34" y="24"  fill="#5a5450" fontSize="9" textAnchor="end" fontFamily="DM Sans, sans-serif">3</text>
                      <text x="34" y="61"  fill="#5a5450" fontSize="9" textAnchor="end" fontFamily="DM Sans, sans-serif">2</text>
                      <text x="34" y="98"  fill="#5a5450" fontSize="9" textAnchor="end" fontFamily="DM Sans, sans-serif">1</text>
                      <text x="34" y="135" fill="#5a5450" fontSize="9" textAnchor="end" fontFamily="DM Sans, sans-serif">0</text>
                      <rect x="55"  y="94"  width="28" height="37"  rx="3" fill="rgba(224,147,64,.75)"/>
                      <rect x="105" y="94"  width="28" height="37"  rx="3" fill="rgba(224,147,64,.75)"/>
                      <rect x="155" y="20"  width="28" height="111" rx="3" fill="rgba(224,147,64,.75)"/>
                      <rect x="205" y="57"  width="28" height="74"  rx="3" fill="rgba(224,147,64,.75)"/>
                      <text x="69"  y="148" fill="#5a5450" fontSize="9" textAnchor="middle" fontFamily="DM Sans, sans-serif">10</text>
                      <text x="119" y="148" fill="#5a5450" fontSize="9" textAnchor="middle" fontFamily="DM Sans, sans-serif">9</text>
                      <text x="169" y="148" fill="#5a5450" fontSize="9" textAnchor="middle" fontFamily="DM Sans, sans-serif">8</text>
                      <text x="219" y="148" fill="#5a5450" fontSize="9" textAnchor="middle" fontFamily="DM Sans, sans-serif">7</text>
                      <line x1="40" y1="131" x2="280" y2="131" stroke="rgba(237,232,224,.18)" strokeWidth="1"/>
                      <text x="160" y="166" fill="#5a5450" fontSize="9" textAnchor="middle" fontFamily="DM Sans, sans-serif" letterSpacing=".08em">SCORE (out of 10)</text>
                    </svg>
                  </div>
                </div>

                {/* Comfortability Scores */}
                <div className="chart-card">
                  <div className="chart-title">Comfortability Scores by Weight</div>
                  <div className="chart-svg-wrap">
                    <svg viewBox="0 0 300 180" width="100%" aria-label="Bar chart: comfortability scores. 1kg — score 10: 3, score 9: 3, score 8: 1. 2kg — score 10: 1, score 9: 3, score 8: 2, score 7: 1">
                      <line x1="40" y1="20"  x2="280" y2="20"  stroke="rgba(237,232,224,.07)" strokeWidth="1"/>
                      <line x1="40" y1="57"  x2="280" y2="57"  stroke="rgba(237,232,224,.07)" strokeWidth="1"/>
                      <line x1="40" y1="94"  x2="280" y2="94"  stroke="rgba(237,232,224,.07)" strokeWidth="1"/>
                      <line x1="40" y1="131" x2="280" y2="131" stroke="rgba(237,232,224,.07)" strokeWidth="1"/>
                      <text x="34" y="24"  fill="#5a5450" fontSize="9" textAnchor="end" fontFamily="DM Sans, sans-serif">3</text>
                      <text x="34" y="61"  fill="#5a5450" fontSize="9" textAnchor="end" fontFamily="DM Sans, sans-serif">2</text>
                      <text x="34" y="98"  fill="#5a5450" fontSize="9" textAnchor="end" fontFamily="DM Sans, sans-serif">1</text>
                      <text x="34" y="135" fill="#5a5450" fontSize="9" textAnchor="end" fontFamily="DM Sans, sans-serif">0</text>
                      <rect x="50"  y="20"  width="16" height="111" rx="2" fill="rgba(224,147,64,.8)"/>
                      <rect x="68"  y="94"  width="16" height="37"  rx="2" fill="rgba(192,69,42,.7)"/>
                      <rect x="100" y="20"  width="16" height="111" rx="2" fill="rgba(224,147,64,.8)"/>
                      <rect x="118" y="20"  width="16" height="111" rx="2" fill="rgba(192,69,42,.7)"/>
                      <rect x="150" y="94"  width="16" height="37"  rx="2" fill="rgba(224,147,64,.8)"/>
                      <rect x="168" y="57"  width="16" height="74"  rx="2" fill="rgba(192,69,42,.7)"/>
                      <rect x="218" y="94"  width="16" height="37"  rx="2" fill="rgba(192,69,42,.7)"/>
                      <text x="67"  y="148" fill="#5a5450" fontSize="9" textAnchor="middle" fontFamily="DM Sans, sans-serif">10</text>
                      <text x="117" y="148" fill="#5a5450" fontSize="9" textAnchor="middle" fontFamily="DM Sans, sans-serif">9</text>
                      <text x="167" y="148" fill="#5a5450" fontSize="9" textAnchor="middle" fontFamily="DM Sans, sans-serif">8</text>
                      <text x="217" y="148" fill="#5a5450" fontSize="9" textAnchor="middle" fontFamily="DM Sans, sans-serif">7</text>
                      <line x1="40" y1="131" x2="280" y2="131" stroke="rgba(237,232,224,.18)" strokeWidth="1"/>
                      <text x="160" y="166" fill="#5a5450" fontSize="9" textAnchor="middle" fontFamily="DM Sans, sans-serif" letterSpacing=".08em">SCORE (out of 10)</text>
                    </svg>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(224,147,64,.8)' }} />1 kg</div>
                    <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(192,69,42,.7)' }} />2 kg</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Now What? */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">Now What?</div>
              <div className="refl-step-line" aria-hidden="true" />
            </div>
            <div>
              <h3 className="refl-step-q">Validate the method before the test</h3>
              <p>
                What I learned is that a simulation method is not a formality. It is a design decision, and it needs to be treated like one. Getting it wrong does not just produce bad numbers — it produces bad design choices that feel justified because the data said so.
              </p>
              <p>
                In engineering, we are often designing for people who cannot easily tell us when something is wrong. If our testing method fails to represent them accurately, the whole process quietly drifts away from the actual problem.
              </p>
              <div className="refl-pullquote">
                <p>&ldquo;Going forward, before I run a single test, I want to ask: can this method consistently replicate the condition being studied? Has anyone challenged the assumptions behind it?&rdquo;</p>
              </div>
              <p>
                For the next group project I work on, that question gets asked at the start — not after the data already looks suspicious.
              </p>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}
