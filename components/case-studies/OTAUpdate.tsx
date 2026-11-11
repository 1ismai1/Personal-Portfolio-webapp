import { Section } from '@/components/kit'

/**
 * OTA Firmware Update System: STUB on the kit. Facts are from the resume only.
 * HANDOFF.md task 3 lists what to add (diagram, captures, bug cards).
 */
const done = [
  ['Packager', 'Wraps each build in a versioned image with a CRC-32, so the bootloader can reject a damaged or mismatched file.'],
  ['Sender', 'Streams the image over UART in chunks and waits for an acknowledgement after each one.'],
  ['Tests', '23 tests cover lost ACKs and corrupted data.'],
  ['Jump to app', 'The bootloader checks the application’s vector table, relocates VTOR, and jumps. Verified on hardware.'],
]
const next = ['Watchdog rollback to the last good image', 'Digital signatures', 'A Go server for Wi-Fi updates through an ESP32-C3']

export default function OTAUpdate() {
  return (
    <div className="wrap pb-8">
      <Section refId="TP1" label="Overview" title="New firmware without a programmer">
        <p>
          A two-person project to update an STM32 over a serial link instead of a debug probe. I built the Python host tools and the bootloader’s jump-to-app logic.
        </p>
      </Section>

      <Section refId="TP2" label="Built so far" title="Host tools and the first jump">
        <dl className="my-2 overflow-hidden rounded border border-line">
          {done.map(([name, what]) => (
            <div key={name} className="grid gap-x-6 gap-y-1 border-b border-line bg-mask-800 px-5 py-4 last:border-b-0 md:grid-cols-[150px_minmax(0,1fr)]">
              <dt className="font-mono text-xs text-phos">{name}</dt>
              <dd className="max-w-prose text-sm text-silk-2">{what}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section refId="TP3" label="Next" title="What is not built yet">
        <ul className="m-0 list-none p-0">
          {next.map(n => (
            <li key={n} className="flex items-center gap-3 border-t border-line py-3 text-base text-silk-2 last:border-b">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-silk-3" aria-hidden="true" />
              {n}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
