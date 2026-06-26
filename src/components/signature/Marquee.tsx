'use client'

import { useReducedMotion } from 'motion/react'

interface MarqueeProps {
  items: string[]
  speed?: number
  separator?: string
}

export function Marquee({ items, speed = 40, separator = '·' }: MarqueeProps) {
  const reduced = useReducedMotion()
  const doubled = [...items, ...items]
  const duration = (items.length * speed) / 1

  return (
    <div style={{ overflow: 'hidden', width: '100%' }} aria-hidden="true">
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          width: 'max-content',
          animation: reduced ? 'none' : `marquee ${duration}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '2rem', whiteSpace: 'nowrap', fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {item}
            <span style={{ color: 'var(--gold)' }}>{separator}</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
