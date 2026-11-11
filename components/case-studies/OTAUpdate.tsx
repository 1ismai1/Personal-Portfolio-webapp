import { Section } from '@/components/kit'
import PacketArt from '@/components/home/PacketArt'

// Sources: shared/image_format.md, tools/send_update.py, tools/test_{package,update}.py
// and stm32/bootloader/Core/Src/main.c in ronitbhanot4/stm32-ota-bootloader at 18ee3f0.
const fields = [
  ['0', '4', 'magic', 'OTA1 identifies an update image.'],
  ['4', '2', 'header_version', 'Image format version: 1.'],
  ['6', '2', 'header_size', '128 bytes.'],
  ['8', '4', 'fw_version', 'The application version.'],
  ['12', '4', 'payload_size', 'Padded payload length, up to 196,608 bytes.'],
  ['16', '4', 'payload_crc32', 'CRC-32 of the padded payload.'],
  ['20', '4', 'load_addr', 'Slot A: 0x08010000. Slot B: 0x08040000.'],
  ['24', '4', 'flags', 'Reserved; currently zero.'],
  ['28', '4', 'header_crc32', 'CRC-32 of header bytes 0 through 27.'],
  ['32', '32', 'reserved', 'Zero-filled space for future fields.'],
  ['64', '64', 'signature', 'Zero-filled placeholder; signing is future work.'],
]
const coverage = [
  ['Image packaging', '8 tests', 'CRC reference value, round-trip packing, padding, wrong-slot and oversized images, damaged header or payload, and invalid magic.'],
  ['Frame decoding', '4 tests', 'Round-trip frames, partial reads, junk before a frame, and damaged frames.'],
  ['Sender', '7 tests', 'Successful transfers, lost ACKs, corrupted chunks, junk replies, wrong-slot rejection, a silent board, and the largest supported image.'],
  ['Simulated receiver', '4 tests', 'Data before START, out-of-order chunks, writes beyond the payload, and an incomplete image failing its final CRC.'],
]
export default function OTAUpdate() {
  return (
    <div className="wrap pb-8">
      <Section refId="TP1" label="Overview" title="New firmware without a programmer">
        <p>A two-person project to update an STM32 over a serial link. I built the Python packager and sender, plus the bootloader’s jump-to-app logic, which I verified on hardware.</p>
        <p>The host transfer path is tested against a simulated board. The shared UART receiver protocol is still a draft awaiting team sign-off. The complete update path has not yet been verified on hardware.</p>
        <figure className="panel my-6 overflow-hidden p-3 md:p-5"><PacketArt /><figcaption className="px-4 pb-3 text-xs text-silk-3">The v1 image fields and acknowledged transfer. Field widths and the example chunk sequence are illustrative.</figcaption></figure>
      </Section>
      <Section refId="TP2" label="Image format" title="One format shared by the host and bootloader">
        <p>Each image starts with a 128-byte little-endian header. The application binary follows, padded with 0xFF to a multiple of 4 bytes. Separate CRC-32 values protect the header and payload.</p>
        <div className="my-6 overflow-x-auto rounded border border-line" tabIndex={0} role="region" aria-label="Image header fields, horizontally scrollable">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <caption className="sr-only">Version 1 image header, offsets and sizes in bytes</caption>
            <thead><tr className="bg-mask-700 text-xs text-silk-2">{['Offset', 'Bytes', 'Field', 'Purpose'].map(h => <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody>{fields.map(([offset,size,name,note]) => <tr key={name} className="border-t border-line bg-mask-800"><td className="px-4 py-3 font-mono">{offset}</td><td className="px-4 py-3 font-mono">{size}</td><th scope="row" className="px-4 py-3 font-mono font-medium text-phos">{name}</th><td className="px-4 py-3">{note}</td></tr>)}</tbody>
          </table>
        </div>
        <p><a className="link" href="https://github.com/ronitbhanot4/stm32-ota-bootloader/blob/main/shared/image_format.md">Read the image format specification</a>.</p>
      </Section>
      <Section refId="TP3" label="Transfer protocol" title="Send a chunk, then wait for its acknowledgement">
        <p>The current sender uses 115200-baud UART. START carries the image header, DATA carries up to 256 payload bytes per chunk, and END requests a final check. Each reply must match both the frame type and sequence number.</p>
        <p>A missing reply or frame-CRC rejection resends the same frame, with a limit of 5 attempts. Other rejection reasons stop the transfer. Timeouts are 15 seconds for START, 1 second for DATA and 3 seconds for END.</p>
        <p>The simulated receiver acknowledges a repeated chunk without writing it twice. This handles the case where the data arrived but its acknowledgement was lost.</p>
      </Section>
      <Section refId="TP4" label="Testing" title="23 tests, including the unhappy paths">
        <dl className="divide-y divide-line">{coverage.map(([name,count,what]) => <div key={name} className="grid gap-2 py-5 md:grid-cols-[180px_minmax(0,1fr)]"><dt className="text-sm font-medium text-silk">{name}<span className="mt-1 block font-mono text-xs text-trace">{count}</span></dt><dd className="max-w-prose text-base">{what}</dd></div>)}</dl>
        <p>These Python tests exercise the packager, sender and simulated receiver. They do not replace flash-write or recovery testing on the STM32.</p>
        {/* TODO(ismail): supply notebook bug stories with symptom, cause, fix and lesson. Test cases are not personal debugging anecdotes. */}
      </Section>
      <Section refId="TP5" label="Bootloader" title="Validate the vectors before handing over control">
        <p>The bootloader checks that the initial stack pointer is inside RAM and the reset address lies inside the application slot. It then relocates VTOR, sets the application stack pointer and jumps to the reset handler. This jump-to-app path is verified on hardware.</p>
        <p>Next are watchdog rollback, digital signatures and a Go server for Wi-Fi updates through the ESP32-C3.</p>
      </Section>
    </div>
  )
}
