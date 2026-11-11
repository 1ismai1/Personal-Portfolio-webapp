import { Figure, Section } from '@/components/kit'



export default function ExoArm() {
  return (
    <div className="wrap pb-8"><>{/* Intro + device photos */}<Section refId="TP1" label="Overview" title="Built around everyday objects"><div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]"><div className="space-y-4 text-base text-silk-2">
            <p>
              For Design Project 3, our team built the <strong style={{ color: 'var(--silk)', fontWeight: 500 }}>Exo Arm</strong>, a 3D-printed forearm-mounted assistive device for Mark, a 64-year-old client living with Juvenile Rheumatoid Arthritis. It uses a male-female connector system so he can hold cups, utensils, and other everyday objects without needing grip strength.
            </p>
            <p>
              This reflection is about one moment in Week 8 that changed how I think about testing, and ended up making the device better too.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
              {['3D Printing / PLA', 'CAD Modelling', 'Iterative Design', 'User Testing', 'Jan 5 – Apr 3, 2026'].map(tag => (
                <span key={tag} className="chip">{tag}</span>
              ))}
            </div>
          </div><div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="max-w-[420px]" style={{maxWidth:314}}><Figure src="/Exo-arm-main.png" alt="Final Exo Arm, a 3D-printed blue PLA forearm frame with Velcro straps" width={314} height={164} sizes="(max-width: 600px) 85vw, 314px" caption={<>Final design: 3D-printed PLA frame with Velcro straps and connector system</>} /></div>
            <div className="max-w-[420px]" style={{maxWidth:217}}><Figure src="/Exo-arm-attachments.png" alt="Connector attachments: red, blue, and white twist-on clips" width={217} height={188} sizes="(max-width: 600px) 85vw, 217px" caption={<>Connector attachments: a twist-on clip system for everyday objects</>} /></div>
          </div></div></Section>{/* What / So What / Now What */}<>{/* What? */}<Section refId="TP2" label="What?" title="The chopstick problem"><p>
                It was Week 8, Design Studio, and we hit a snag. Mark lives with Juvenile Rheumatoid Arthritis, a chronic condition where joint inflammation gradually takes away grip strength and fine motor control, and he couldn&apos;t make it to every testing session. So we had to figure out how to simulate his limitations ourselves.
              </p><p>
                Our first idea was chopsticks wedged between our fingers to block hand closure. It felt logical. But the moment we actually tried it, something was wrong: the chopsticks slid around, every teammate held them at a different angle, and there was none of the actual resistance or stiffness that damaged joints produce. The results between testers were all over the place.
              </p><div className="my-6 max-w-prose border-l-2 border-phos pl-5 text-silk">
                <p>&ldquo;We threw out that method entirely and switched to tapping our fingertips firmly against our palms before each trial, which mimicked the reduced range of motion and grip strength Mark deals with every day.&rdquo;</p>
              </div><p>
                Suddenly the data was consistent. Suddenly the device&apos;s real weaknesses became visible. It was a small change that quietly changed everything about how we understood our own design.
              </p></Section>{/* So What? */}<Section refId="TP3" label="So What?" title="The cost of bad data"><p>
                The chopstick data was useless, and that stung more than I expected. We had spent real time running those tests, recording numbers, comparing results across teammates, and none of it actually told us anything about Mark. That was the hard part to sit with.
              </p><p>
                On the positive side, catching the flaw before Milestone 6 meant we still had time to fix it. The fingertip-tapping method worked, the revised data was consistent, and the design changes we made based on it genuinely improved the device. But I kept thinking about how close we came to presenting results built on a broken foundation.
              </p><div className="my-6 max-w-prose border-l-2 border-phos pl-5 text-silk">
                <p>&ldquo;What changed for me was how I think about testing now. The simulation method is a design decision, and it shapes every number that comes after it.&rdquo;</p>
              </div><p>
                I used to treat the test as something that happens after the design decisions. This experience forced me to see that if nobody questions it early, nobody questions it at all. Below are the scores testers gave after we modified the device based on the corrected fingertip-tapping results.
              </p>{/* Charts */}<div className="my-6 grid gap-5 md:grid-cols-2">
                {/* User Independence Scores */}
                <figure className="panel p-5"><figcaption className="mb-4 text-sm font-medium text-silk">User Independence Scores</figcaption><div className="w-full">
                    <svg role="img" viewBox="0 0 300 180" width="100%" aria-label="Bar chart: user independence scores. Score 10: 1 person, 9: 1 person, 8: 3 people, 7: 2 people">
                      <line x1="40" y1="20"  x2="280" y2="20"  stroke="var(--line)" strokeWidth="1"/>
                      <line x1="40" y1="57"  x2="280" y2="57"  stroke="var(--line)" strokeWidth="1"/>
                      <line x1="40" y1="94"  x2="280" y2="94"  stroke="var(--line)" strokeWidth="1"/>
                      <line x1="40" y1="131" x2="280" y2="131" stroke="var(--line)" strokeWidth="1"/>
                      <text x="34" y="24"  fill="var(--silk-2)" fontSize="9" textAnchor="end" fontFamily="var(--font-body), sans-serif">3</text>
                      <text x="34" y="61"  fill="var(--silk-2)" fontSize="9" textAnchor="end" fontFamily="var(--font-body), sans-serif">2</text>
                      <text x="34" y="98"  fill="var(--silk-2)" fontSize="9" textAnchor="end" fontFamily="var(--font-body), sans-serif">1</text>
                      <text x="34" y="135" fill="var(--silk-2)" fontSize="9" textAnchor="end" fontFamily="var(--font-body), sans-serif">0</text>
                      <rect x="55"  y="94"  width="28" height="37"  rx="3" fill="var(--phos)"/>
                      <rect x="105" y="94"  width="28" height="37"  rx="3" fill="var(--phos)"/>
                      <rect x="155" y="20"  width="28" height="111" rx="3" fill="var(--phos)"/>
                      <rect x="205" y="57"  width="28" height="74"  rx="3" fill="var(--phos)"/>
                      <text x="69"  y="148" fill="var(--silk-2)" fontSize="9" textAnchor="middle" fontFamily="var(--font-body), sans-serif">10</text>
                      <text x="119" y="148" fill="var(--silk-2)" fontSize="9" textAnchor="middle" fontFamily="var(--font-body), sans-serif">9</text>
                      <text x="169" y="148" fill="var(--silk-2)" fontSize="9" textAnchor="middle" fontFamily="var(--font-body), sans-serif">8</text>
                      <text x="219" y="148" fill="var(--silk-2)" fontSize="9" textAnchor="middle" fontFamily="var(--font-body), sans-serif">7</text>
                      <line x1="40" y1="131" x2="280" y2="131" stroke="var(--line-2)" strokeWidth="1"/>
                      <text x="160" y="166" fill="var(--silk-2)" fontSize="9" textAnchor="middle" fontFamily="var(--font-body), sans-serif" letterSpacing=".08em">Score (out of 10)</text>
                    </svg>
                  </div></figure>

                {/* Comfortability Scores */}
                <figure className="panel p-5"><figcaption className="mb-4 text-sm font-medium text-silk">Comfortability Scores by Weight</figcaption><div className="w-full">
                    <svg role="img" viewBox="0 0 300 180" width="100%" aria-label="Bar chart: comfortability scores. At 1kg, score 10: 3 people, score 9: 3 people, score 8: 1 person. At 2kg, score 10: 1 person, score 9: 3 people, score 8: 2 people, score 7: 1 person.">
                      <line x1="40" y1="20"  x2="280" y2="20"  stroke="var(--line)" strokeWidth="1"/>
                      <line x1="40" y1="57"  x2="280" y2="57"  stroke="var(--line)" strokeWidth="1"/>
                      <line x1="40" y1="94"  x2="280" y2="94"  stroke="var(--line)" strokeWidth="1"/>
                      <line x1="40" y1="131" x2="280" y2="131" stroke="var(--line)" strokeWidth="1"/>
                      <text x="34" y="24"  fill="var(--silk-2)" fontSize="9" textAnchor="end" fontFamily="var(--font-body), sans-serif">3</text>
                      <text x="34" y="61"  fill="var(--silk-2)" fontSize="9" textAnchor="end" fontFamily="var(--font-body), sans-serif">2</text>
                      <text x="34" y="98"  fill="var(--silk-2)" fontSize="9" textAnchor="end" fontFamily="var(--font-body), sans-serif">1</text>
                      <text x="34" y="135" fill="var(--silk-2)" fontSize="9" textAnchor="end" fontFamily="var(--font-body), sans-serif">0</text>
                      <rect x="50"  y="20"  width="16" height="111" rx="2" fill="var(--phos)"/>
                      <rect x="68"  y="94"  width="16" height="37"  rx="2" fill="var(--trace)"/>
                      <rect x="100" y="20"  width="16" height="111" rx="2" fill="var(--phos)"/>
                      <rect x="118" y="20"  width="16" height="111" rx="2" fill="var(--trace)"/>
                      <rect x="150" y="94"  width="16" height="37"  rx="2" fill="var(--phos)"/>
                      <rect x="168" y="57"  width="16" height="74"  rx="2" fill="var(--trace)"/>
                      <rect x="218" y="94"  width="16" height="37"  rx="2" fill="var(--trace)"/>
                      <text x="67"  y="148" fill="var(--silk-2)" fontSize="9" textAnchor="middle" fontFamily="var(--font-body), sans-serif">10</text>
                      <text x="117" y="148" fill="var(--silk-2)" fontSize="9" textAnchor="middle" fontFamily="var(--font-body), sans-serif">9</text>
                      <text x="167" y="148" fill="var(--silk-2)" fontSize="9" textAnchor="middle" fontFamily="var(--font-body), sans-serif">8</text>
                      <text x="217" y="148" fill="var(--silk-2)" fontSize="9" textAnchor="middle" fontFamily="var(--font-body), sans-serif">7</text>
                      <line x1="40" y1="131" x2="280" y2="131" stroke="var(--line-2)" strokeWidth="1"/>
                      <text x="160" y="166" fill="var(--silk-2)" fontSize="9" textAnchor="middle" fontFamily="var(--font-body), sans-serif" letterSpacing=".08em">Score (out of 10)</text>
                    </svg>
                  </div><div className="mt-3 flex gap-5 text-xs text-silk-2">
                    <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-xs" style={{ background: 'var(--phos)' }} />1 kg</div>
                    <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-xs" style={{ background: 'var(--trace)' }} />2 kg</div>
                  </div></figure>
              </div></Section>{/* Now What? */}<Section refId="TP4" label="Now What?" title="Validate the method before the test"><p>
                What I learned is that a simulation method isn&apos;t just a formality. It&apos;s a design decision, and it needs to be treated like one. Getting it wrong doesn&apos;t just produce bad numbers, it produces bad design choices that feel justified because the data backed them up.
              </p><p>
                In engineering, we are often designing for people who cannot easily tell us when something is wrong. If our testing method fails to represent them accurately, the whole process quietly drifts away from the actual problem.
              </p><div className="my-6 max-w-prose border-l-2 border-phos pl-5 text-silk">
                <p>&ldquo;Going forward, before I run a single test, I want to ask: can this method consistently replicate the condition being studied? Has anyone challenged the assumptions behind it?&rdquo;</p>
              </div><p>
                For the next group project I work on, that question gets asked at the start, not after the data already looks suspicious.
              </p></Section></></></div>
  )
}
