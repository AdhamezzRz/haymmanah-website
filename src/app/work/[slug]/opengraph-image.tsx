import { ImageResponse } from 'next/og'
import { getCase } from '@/lib/work'
import { loadOgFont } from '@/lib/ogFont'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getCase(slug)
  const fontData = await loadOgFont('700')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: `linear-gradient(135deg, #0a1030 0%, ${c?.sectorColor ?? '#0a1030'} 140%)`,
          fontFamily: 'Almarai',
          direction: 'rtl',
          textAlign: 'right',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: '#c9a14a', display: 'flex' }} />
          <span style={{ fontSize: 28, color: '#c9a14a', letterSpacing: 4 }}>هيمنة — دراسة حالة</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 26, color: '#8a93bf' }}>{c?.sector ?? 'أعمالنا'}</span>
          <span style={{ fontSize: 64, color: '#f3ecda', lineHeight: 1.15 }}>{c?.client ?? 'دراسة حالة'}</span>
          {c && (
            <div style={{ display: 'flex', gap: 48, marginTop: 24 }}>
              {c.results.slice(0, 3).map(r => (
                <div key={r.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 40, color: '#ecd08a' }}>{r.value}</span>
                  <span style={{ fontSize: 20, color: '#8a93bf' }}>{r.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Almarai', data: fontData, style: 'normal', weight: 700 }] }
  )
}
