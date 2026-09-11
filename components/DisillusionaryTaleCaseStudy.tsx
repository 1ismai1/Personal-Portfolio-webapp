import Reveal from './Reveal'

export default function DisillusionaryTaleCaseStudy() {
  return (
    <div className="reflection">
      <div className="container">
        {/* Intro + gameplay clip */}
        <Reveal className="refl-intro">
          <div className="refl-intro-text">
            <p>
              <strong style={{ color: 'var(--txt)', fontWeight: 500 }}>Disillusionary Tale</strong> is a fantasy RPG I&apos;m building in Unreal Engine 5, built around a hidden variable that decides how the story ends. Every system underneath it, dialogue, reputation, saving, combat, was designed to be data-driven and reusable rather than hard-coded per scene, so new content is a matter of adding data, not rewriting logic.
            </p>
            <p>
              This page walks through each system on its own: what it does, how it&apos;s built, and what I had to debug or design around to get it working.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
              {['Fantasy RPG', 'Unreal Engine 5', 'C++ & Blueprints', 'Data-Driven Systems'].map(tag => (
                <span key={tag} className="ttag">{tag}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="refl-video">
              <video src="/disillusionary-tale-bomb.mp4" controls preload="metadata" playsInline />
            </div>
            <div className="refl-video-cap">Gameplay footage from Disillusionary Tale</div>
          </div>
        </Reveal>

        <div className="refl-steps">

          {/* Dialogue System */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">Dialogue</div>
              <div className="refl-step-line" aria-hidden="true" />
            </div>
            <div>
              <h3 className="refl-step-q">One function driving every conversation</h3>
              <p>
                NPC lines and choices live entirely in DataTables (<span className="code-chip">DT_NpcOpening</span>, <span className="code-chip">DT_TrustChoice</span>), keyed by a composite row name built at runtime from enums (<span className="code-chip">NPC_Beat_Stage</span>). Adding a new NPC or story beat means adding a row, not writing new logic.
              </p>
              <p>
                Opening lines and reaction lines both run through a single reusable <span className="code-chip">PlayLineBlock</span> function, the same code path for both, so there&apos;s no duplicated dialogue logic to keep in sync. The text itself reveals with a typewriter effect: a looping timer slices the string down character by character, and the player can skip mid-reveal if they don&apos;t want to wait.
              </p>
              <p>
                Choice buttons stay dumb on purpose. They apply the trust logic locally, then report the selection upward through an event dispatcher, so the same button can be reused anywhere without knowing anything about the wider trust system.
              </p>
              <div className="refl-pullquote">
                <p>&ldquo;A None beat value lets NPCs run full conversations, intros, ambient chatter, without ever touching the trust variable. It&apos;s a small safety gate, but it&apos;s what keeps casual dialogue from accidentally shaping the ending.&rdquo;</p>
              </div>
              <p>
                Voice lines, mid-line events, and branching dialogue trees were planned into the data structures from the start, so extending the system later shouldn&apos;t need a refactor.
              </p>
            </div>
          </Reveal>

          {/* Trust / Reputation System */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">Trust</div>
              <div className="refl-step-line" aria-hidden="true" />
            </div>
            <div>
              <h3 className="refl-step-q">A hidden number that decides the ending</h3>
              <p>
                A hidden <span className="code-chip">TrustLevel</span> variable accumulates silently across three story beats and determines which of two endings the player locks into. The player never sees the number, only the conversations that quietly move it.
              </p>
              <div className="refl-pullquote">
                <p>&ldquo;The bias toward one ending doesn&apos;t come from unbalanced point values. It comes from writing psychology, confirmation bias, negativity bias, baked into how the choices are framed.&rdquo;</p>
              </div>
              <p>
                That was a deliberate call: tuning numbers would have made the bias feel arbitrary, where writing the choices to lean on real cognitive biases makes the outcome feel earned by the conversation instead of engineered by a spreadsheet.
              </p>
            </div>
          </Reveal>

          {/* Save System */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">Save</div>
              <div className="refl-step-line" aria-hidden="true" />
            </div>
            <div>
              <h3 className="refl-step-q">Persisting a story, not just a checkpoint</h3>
              <p>
                Persistence runs through the <span className="code-chip">GameInstance</span>: mission stage, a string-keyed set of resolved story beats, the current trust level, and whether an outcome has been locked in.
              </p>
              <p>
                While building it I ran into a redundant-save bug, writes were firing once per loop iteration instead of once per operation, silently multiplying save calls every time a beat resolved. Tracing it back to the loop and moving the write outside it was a good reminder that persistence bugs hide in control flow, not just in the data being saved.
              </p>
            </div>
          </Reveal>

          {/* Combat System */}
          <Reveal className="refl-step">
            <div className="refl-step-marker">
              <div className="refl-step-num">Combat</div>
              <div className="refl-step-line" aria-hidden="true" />
            </div>
            <div>
              <h3 className="refl-step-q">Chase, parry, counter, repeat</h3>
              <p>
                Combat runs on a parry-based melee loop: chase, attack, parry, counter, death. Getting the timing to feel fair took cleaning out legacy timer-based reset logic that was left over from an earlier version of the state machine.
              </p>
              <div className="refl-step-video">
                <div className="refl-video">
                  <video src="/disillusionary-tale-parry.mp4" controls preload="metadata" playsInline />
                </div>
                <div className="refl-video-cap">The parry → counter loop in action</div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  )
}
