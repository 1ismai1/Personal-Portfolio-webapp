/**
 * Card art for the OTA project until there is a real photo or capture:
 * a schematic of the update image and the acknowledged-chunk stream.
 * Illustrative only: field order and chunk count are not to scale.
 */
export default function PacketArt() {
  const chunks = [0, 1, 2, 3, 4, 5]
  return (
    <svg viewBox="0 0 640 360" className="block h-full w-full" role="img"
      aria-label="Diagram: an update image with version, length and CRC-32 fields, sent over UART in chunks that are each acknowledged. One lost acknowledgement triggers a resend.">
      <g fontFamily="var(--font-mono)" fontSize="13">
        <text x="40" y="62" fill="var(--silk-3)">image</text>
        {[['version', 40, 96], ['length', 140, 96], ['CRC-32', 240, 104]].map(([t, x, w]) => (
          <g key={t as string}>
            <rect x={x as number} y="76" width={w as number} height="44" rx="2" fill="var(--mask-700)" stroke="var(--phos-dim)" />
            <text x={(x as number) + 12} y="103" fill="var(--phos)">{t}</text>
          </g>
        ))}
        <rect x="348" y="76" width="252" height="44" rx="2" fill="var(--mask-800)" stroke="var(--line-2)" />
        <text x="360" y="103" fill="var(--silk-2)">firmware build</text>

        <text x="40" y="186" fill="var(--silk-3)">host, UART</text>
        <text x="40" y="290" fill="var(--silk-3)">bootloader</text>
        {chunks.map(i => {
          const x = 150 + i * 76, lost = i === 3
          return (
            <g key={i}>
              <rect x={x} y="164" width="60" height="34" rx="2" fill={lost ? 'var(--fault-dim, #7A2E24)' : 'var(--trace-dim)'} stroke={lost ? 'var(--fault)' : 'var(--trace)'} />
              <text x={x + 30} y="186" textAnchor="middle" fill="var(--silk)">{lost ? 'resend' : `#${i < 3 ? i + 1 : i}`}</text>
              <line x1={x + 30} y1="204" x2={x + 30} y2="262" stroke={lost ? 'var(--fault)' : 'var(--silk-3)'} strokeDasharray={lost ? '3 4' : undefined} />
              <text x={x + 30} y="290" textAnchor="middle" fill={lost ? 'var(--fault)' : 'var(--trace)'}>{lost ? 'no ACK' : 'ACK'}</text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
