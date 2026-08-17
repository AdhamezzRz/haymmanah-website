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
          background: `linear-gradient(135deg, #14173A 0%, ${c?.sectorColor ?? '#14173A'} 140%)`,
          fontFamily: 'Almarai',
          direction: 'rtl',
          textAlign: 'right',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: '#4C63C7', display: 'flex' }} />
          <span style={{ fontSize: 28, color: '#4C63C7', letterSpacing: 4 }}>هيمنة — دراسة حالة</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 26, color: '#9AACD6' }}>{c?.sector ?? 'أعمالنا'}</span>
          <span style={{ fontSize: 64, color: '#EBF4FB', lineHeight: 1.15 }}>{c?.client ?? 'دراسة حالة'}</span>
          {c && c.results && c.results.length > 0 && (
            <div style={{ display: 'flex', gap: 48, marginTop: 24 }}>
              {c.results.slice(0, 3).map(r => (
                <div key={r.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 40, color: '#8CA6E5' }}>{r.value}</span>
                  <span style={{ fontSize: 20, color: '#9AACD6' }}>{r.label}</span>
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
