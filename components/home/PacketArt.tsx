/** v1 fields from the OTA repository. Field widths and the transfer example are illustrative. */
const rows = [
  [['magic', '4 B'], ['header_version', '2 B'], ['header_size', '2 B'], ['fw_version', '4 B'], ['payload_size', '4 B'], ['payload_crc32', '4 B']],
  [['load_addr', '4 B'], ['flags', '4 B'], ['header_crc32', '4 B'], ['reserved', '32 B'], ['signature', '64 B']],
]
export default function PacketArt() {
  return (
    <svg viewBox="0 0 640 360" className="block h-full w-full" role="img" aria-label="The v1 image has a 128-byte header containing magic, format version, header size, firmware version, payload size and CRC, load address, flags, header CRC, reserved bytes and a future signature. The payload is sent in acknowledged chunks of up to 256 bytes.">
      <g fontFamily="var(--font-mono)">
        <text x="32" y="38" fontSize="13" fill="var(--silk-2)">128-byte header, then firmware payload</text>
        {rows.map((row,r) => row.map(([name,size],i) => {
          const w=576/row.length, x=32+i*w, y=55+r*68
          return <g key={name}><rect x={x} y={y} width={w-5} height="57" rx="2" fill="var(--mask-700)" stroke="var(--phos-dim)" /><text x={x+7} y={y+23} fontSize="10" fill="var(--phos)">{name}</text><text x={x+7} y={y+43} fontSize="11" fill="var(--silk-2)">{size}</text></g>
        }))}
        <text x="32" y="220" fontSize="12" fill="var(--silk-2)">UART · up to 256 bytes per chunk</text>
        {['START','DATA 0','DATA 1','retry 1','END'].map((label,i) => {
          const x=32+i*116, retry=i===3
          return <g key={label}><rect x={x} y="239" width="108" height="35" rx="2" fill="var(--mask-800)" stroke={retry?'var(--fault)':'var(--trace)'} /><text x={x+54} y="262" textAnchor="middle" fontSize="12" fill="var(--silk)">{label}</text><path d={`M${x+54} 280 v23`} stroke="var(--silk-3)" /><text x={x+54} y="325" textAnchor="middle" fontSize="12" fill={i===2?'var(--fault)':'var(--trace)'}>{i===2?'ACK lost':'ACK'}</text></g>
        })}
      </g>
    </svg>
  )
}
