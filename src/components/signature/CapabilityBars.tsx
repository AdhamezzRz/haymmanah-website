'use client'

import { useEffect, useRef, useState } from 'react'

interface Bar {
  label: string
  value: number
}

interface CapabilityBarsProps {
  bars?: Bar[]
}

const defaultBars: Bar[] = [
  { label: 'إعلانات الأداء', value: 96 },
  { label: 'الهوية البصرية', value: 92 },
  { label: 'إنتاج المحتوى', value: 88 },
  { label: 'تحسين محركات البحث', value: 85 },
  { label: 'إدارة منصات التواصل', value: 94 },
  { label: 'استراتيجية العلامة التجارية', value: 90 },
]

export function CapabilityBars({ bars = defaultBars }: CapabilityBarsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = ref.current
    if (!el) return

    if (reduced) { setVisible(true); return }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el) } },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {bars.map((bar, i) => (
        <div key={bar.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-small)', color: 'var(--ivory)' }}>
              {bar.label}
            </span>
            <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-small)', color: 'var(--gold)' }}>
              {bar.value}٪
            </span>
          </div>
          <div style={{ height: 2, background: 'rgba(32,26,18,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'var(--gold-grad)',
                borderRadius: 2,
                width: visible ? `${bar.value}%` : '0%',
                transition: `width 1.2s var(--ease-sovereign) ${i * 120}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
