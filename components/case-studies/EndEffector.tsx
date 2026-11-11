import { Figure, Section } from '@/components/kit'



export default function EndEffector() {
  return (
    <div className="wrap pb-8"><>{/* Intro + team photo */}<Section refId="TP1" label="Overview" title="A gripper for different parcels"><div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]"><div className="space-y-4 text-base text-silk-2">
            <p>
              For our first Engineering 1P13 project, our team of five designed and built a robotic end effector for McMaster&apos;s Q-Arm platform. The brief was a warehouse picking system: scan a parcel&apos;s barcode, figure out what it is, and place it in the right spot without a person ever touching it. Every parcel was a different shape, size, and weight, so a simple claw wasn&apos;t going to cut it.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
              {['CAD Modelling', 'Rack & Pinion', 'Ball & Socket', 'Python', 'Team of 5'].map(tag => (
                <span key={tag} className="chip">{tag}</span>
              ))}
            </div>
          </div><div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="max-w-[420px]" style={{maxWidth:425}}><Figure src="/End-Effector-Team-Photo.png" alt="Team Mon-20 gathered around a table with laptops and the Q-Arm controller during Design Studio" width={425} height={313} sizes="(max-width: 600px) 85vw, 425px" caption={<>Team Mon-20: the five of us working through the build together</>} /></div>
          </div></div></Section>{/* Design + build */}<Section refId="TP2" label="Design" title="Two mechanisms, one gripper"><div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]"><div className="space-y-4 text-base text-silk-2">
            <p>
              We built the gripper around two mechanisms working together. A rack and pinion arm, driven by a servo motor, closes around parcels with flat edges the way a pair of tongs would. For anything less predictable, like a rounded bowl or an awkwardly balanced piece, a second arm ends in a concave disc on a ball and socket joint, so it settles against the object&apos;s actual shape instead of forcing the object to match the gripper. A high friction material on the disc did the rest.
            </p>
            <p>
              The whole assembly, fasteners included, had to stay under 100 grams, and every printed feature had to be 1mm or larger, so a good chunk of the process was simplifying the design down to something that could actually be fabricated.
            </p>
          </div><div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="max-w-[420px]" style={{maxWidth:400}}><Figure src="/End-Effector-Sketch.png" alt="Hand-drawn concept sketch of the end effector showing the rack and pinion, servo motor, and ball and socket gripper" width={400} height={606} sizes="(max-width: 600px) 85vw, 400px" caption={<>Our finalized concept sketch: rack and pinion on top, ball and socket gripper below</>} /></div>
            <div className="max-w-[420px]" style={{maxWidth:249}}><Figure src="/End-Effector-CAD.png" alt="CAD model of the finished end effector assembly attached to the Q-Arm" width={249} height={155} sizes="(max-width: 600px) 85vw, 249px" caption={<>The CAD model turning that sketch into a real, printable assembly</>} /></div>
          </div></div></Section>{/* My role */}<><Section refId="TP3" label="My Role" title="Coding the Q-Arm"><p>
                My part of the build was on the software side. Once the mechanism was fabricated, someone had to actually move it, and that was me.
              </p><div className="my-6 max-w-prose border-l-2 border-phos pl-5 text-silk">
                <p>&ldquo;I wrote the Python code that drove the Q-Arm itself: the base, shoulder, and elbow rotations, the gripper opening and closing, all sequenced so the arm could pick up, scan, and pack a parcel on its own.&rdquo;</p>
              </div><p>
                Every product in our catalog, sponges, bottles, a chess rook, and more, needed its own sequence of joint angles to pick up cleanly and set down without dropping or crushing it, so I worked through the arm&apos;s motion product by product, homing it between each move until the sequence was repeatable. The design went through real rounds of feedback too. Our TA caught early sketches that weren&apos;t fully dimensioned, so we rebuilt them until the rack and pinion sat centered when the arms closed, and on the code side we cut out repeated messages and folded in the item coordinates we&apos;d measured by hand until the full pick, scan, and pack sequence ran start to finish.
              </p></Section></></></div>
  )
}
