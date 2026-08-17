import { ImageResponse } from 'next/og'
import { getInsight } from '@/lib/insights'
import { loadOgFont } from '@/lib/ogFont'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ins = getInsight(slug)
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
          background: 'linear-gradient(135deg, #14173A 0%, #2E3373 140%)',
          fontFamily: 'Almarai',
          direction: 'rtl',
          textAlign: 'right',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: '#4C63C7', display: 'flex' }} />
          <span style={{ fontSize: 28, color: '#4C63C7', letterSpacing: 4 }}>هيمنة — المقالات</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {ins && (
            <span style={{ fontSize: 24, color: '#9AACD6' }}>
              {ins.topic} · {ins.readingTime} دقائق قراءة
            </span>
          )}
          <span style={{ fontSize: 56, color: '#EBF4FB', lineHeight: 1.3 }}>
            {ins?.title ?? 'مقال من هيمنة'}
          </span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Almarai', data: fontData, style: 'normal', weight: 700 }] }
  )
}
