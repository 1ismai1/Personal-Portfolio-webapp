/** Decorative, finite SVG entrances. No animation runtime or fetched assets. */
export default function ProjectArrival({ slug }: { slug: string }) {
  if (!['imu-logger', 'imu-shield', 'ota-update'].includes(slug)) return null

  return (
    <div className={`project-arrival arrival-${slug}`} aria-hidden="true">
      <svg viewBox="0 0 720 320" fill="none" focusable="false">
        {slug === 'imu-logger' && <>
          <g className="arrival-grid" stroke="var(--line-2)">
            {[80, 160, 240].map(y => <path key={y} d={`M0 ${y}H720`} />)}
            {[120, 240, 360, 480, 600].map(x => <path key={x} d={`M${x} 0V320`} />)}
          </g>
          <g className="arrival-wave" strokeWidth="2">
            <path stroke="var(--phos)" d="M0 110H80V60H145V110H210V60H250V110H335V60H400V110H465V60H530V110H600V60H665V110H720" />
            <path stroke="var(--trace)" d="M0 220H50V170H100V220H150V170H200V220H250V170H300V220H350V170H400V220H450V170H500V220H550V170H600V220H650V170H700V220H720" />
          </g>
          <rect className="arrival-wave-cover" width="720" height="320" fill="var(--mask-900)" />
          <path className="arrival-scan" d="M0 24V296" stroke="var(--phos)" strokeWidth="3" />
        </>}
        {slug === 'imu-shield' && [0, 1, 2].map(layer => (
          <g key={layer} className={`arrival-board arrival-board-${layer}`} stroke={layer === 1 ? 'var(--phos)' : 'var(--trace)'} strokeWidth="2">
            <rect x="140" y="54" width="440" height="212" rx="14" fill="var(--mask-900)" fillOpacity=".65" />
            <rect x="298" y="112" width="124" height="88" rx="4" />
            <path d="M160 100H235L275 140H298M160 220H245L280 180H298M422 140H475L515 100H560M422 180H465L505 220H560" />
            {[164, 556].flatMap(x => [78, 242].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="5" />))}
            {[320, 344, 368, 392].map(x => <path key={x} d={`M${x} 100V112M${x} 200V212`} />)}
          </g>
        ))}
        {slug === 'ota-update' && <>
          <path d="M0 160H660" stroke="var(--trace-dim)" strokeWidth="2" />
          <path className="arrival-bank" d="M620 64H690V256H620M636 88H672M636 112H672M636 208H672M636 232H672" stroke="var(--trace)" strokeWidth="2" />
          {[0, 1, 2, 3, 4].map(i => (
            <g key={i} className="arrival-packet" style={{ '--packet': i } as React.CSSProperties}>
              <rect x={62 + i * 108} y="132" width="80" height="56" rx="3" fill="var(--mask-800)" stroke="var(--phos)" strokeWidth="2" />
              <path d={`M${76 + i * 108} 146V174M${88 + i * 108} 146V174M${100 + i * 108} 146V174M${116 + i * 108} 146V174`} stroke="var(--trace)" strokeWidth="3" />
            </g>
          ))}
        </>}
      </svg>
    </div>
  )
}
