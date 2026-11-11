import { ImageResponse } from 'next/og'

export const alt = 'Ismail Ahmed. Firmware and embedded hardware. Summer 2027 co-op. 1.5 ms of CPU busy-wait removed per sample.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '70px 76px', background: '#0A1312', color: '#FFFFFF', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 28, height: 28, border: '7px solid #F5B546', borderRadius: '50%' }} />
        <span style={{ fontSize: 24, color: '#AEBAB2' }}>Ismail Ahmed / Engineering portfolio</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontSize: 86, fontWeight: 700, letterSpacing: -3 }}>ISMAIL AHMED</div>
        <div style={{ fontSize: 29 }}>Firmware and embedded hardware. Summer 2027 co-op.</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, borderTop: '1px solid #1F3531', paddingTop: 28 }}>
        <span style={{ fontSize: 64, color: '#F5B546', fontWeight: 700 }}>-1.5 ms</span>
        <span style={{ fontSize: 24, color: '#AEBAB2' }}>CPU busy-wait per 10 ms sample</span>
      </div>
    </div>,
    size,
  )
}
