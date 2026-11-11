import { Figure, Section } from '@/components/kit'


export default function DisillusionaryTale() {
  return (
    <div className="wrap pb-8"><>{/* Intro + gameplay clip */}<Section refId="TP1" label="Overview" title="A story shaped by trust"><div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]"><div className="space-y-4 text-base text-silk-2">
            <p>
              <strong style={{ color: 'var(--silk)', fontWeight: 500 }}>Disillusionary Tale</strong> is a fantasy RPG I&apos;m building in Unreal Engine 5, built around a hidden variable that decides how the story ends. Every system underneath it, dialogue, reputation, saving, combat, was designed to be data-driven and reusable rather than hard-coded per scene, so new content is a matter of adding data, not rewriting logic.
            </p>
            <p>
              This page walks through each system on its own: what it does, how it&apos;s built, and what I had to debug or design around to get it working.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
              {['Fantasy RPG', 'Unreal Engine 5', 'C++ & Blueprints', 'Data-Driven Systems'].map(tag => (
                <span key={tag} className="chip">{tag}</span>
              ))}
            </div>
          </div><div>
            <figure className="my-6"><video className="w-full rounded border border-line" src="/disillusionary-tale-bomb.mp4" controls preload="none" playsInline /><figcaption className="mt-3 text-xs text-silk-3">Gameplay footage from Disillusionary Tale</figcaption></figure>
            
          </div></div></Section><>{/* Dialogue System */}<Section refId="TP2" label="Dialogue" title="One function driving every conversation"><p>
                NPC lines and choices live entirely in DataTables (<span className="chip">DT_NpcOpening</span>, <span className="chip">DT_TrustChoice</span>), keyed by a composite row name built at runtime from enums (<span className="chip">NPC_Beat_Stage</span>). Adding a new NPC or story beat means adding a row, not writing new logic.
              </p><p>
                Opening lines and reaction lines both run through a single reusable <span className="chip">PlayLineBlock</span> function, the same code path for both, so there&apos;s no duplicated dialogue logic to keep in sync. The text itself reveals with a typewriter effect: a looping timer slices the string down character by character, and the player can skip mid-reveal if they don&apos;t want to wait.
              </p><p>
                Choice buttons stay dumb on purpose. They apply the trust logic locally, then report the selection upward through an event dispatcher, so the same button can be reused anywhere without knowing anything about the wider trust system.
              </p><div className="my-6 max-w-prose border-l-2 border-phos pl-5 text-silk">
                <p>&ldquo;A None beat value lets NPCs run full conversations, intros, ambient chatter, without ever touching the trust variable. It&apos;s a small safety gate, but it&apos;s what keeps casual dialogue from accidentally shaping the ending.&rdquo;</p>
              </div><p>
                Voice lines, mid-line events, and branching dialogue trees were planned into the data structures from the start, so extending the system later shouldn&apos;t need a refactor.
              </p></Section>{/* Trust / Reputation System */}<Section refId="TP3" label="Trust" title="A hidden number that decides the ending"><p>
                A hidden <span className="chip">TrustLevel</span> variable accumulates silently across three story beats and determines which of two endings the player locks into. The player never sees the number, only the conversations that quietly move it.
              </p><div className="my-6 max-w-prose border-l-2 border-phos pl-5 text-silk">
                <p>&ldquo;The bias toward one ending doesn&apos;t come from unbalanced point values. It comes from writing psychology, confirmation bias, negativity bias, baked into how the choices are framed.&rdquo;</p>
              </div><p>
                That was a deliberate call: tuning numbers would have made the bias feel arbitrary, where writing the choices to lean on real cognitive biases makes the outcome feel earned by the conversation instead of engineered by a spreadsheet.
              </p></Section>{/* Save System */}<Section refId="TP4" label="Save" title="Persisting a story, not just a checkpoint"><p>
                Persistence runs through the <span className="chip">GameInstance</span>: mission stage, a string-keyed set of resolved story beats, the current trust level, and whether an outcome has been locked in.
              </p><p>
                While building it I ran into a redundant-save bug, writes were firing once per loop iteration instead of once per operation, silently multiplying save calls every time a beat resolved. Tracing it back to the loop and moving the write outside it was a good reminder that persistence bugs hide in control flow, not just in the data being saved.
              </p></Section>{/* Combat System */}<Section refId="TP5" label="Combat" title="Chase, parry, counter, repeat"><p>
                Combat runs on a parry-based melee loop: chase, attack, parry, counter, death. Getting the timing to feel fair took cleaning out earlier timer-based reset logic that was left over from an earlier version of the state machine.
              </p><div className="my-6">
                <figure className="my-6"><video className="w-full rounded border border-line" src="/disillusionary-tale-parry.mp4" controls preload="none" playsInline /><figcaption className="mt-3 text-xs text-silk-3">The parry and counter loop in action</figcaption></figure>
                
              </div></Section></></></div>
  )
}
