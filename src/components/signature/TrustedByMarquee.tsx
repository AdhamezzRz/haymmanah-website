'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useReducedMotion } from 'motion/react'

interface LogoItem {
  slug: string
  client: string
  logo: string
  width: number
  height: number
}

export function TrustedByMarquee({ items, speed = 55 }: { items: LogoItem[]; speed?: number }) {
  const reduced = useReducedMotion()
  const doubled = [...items, ...items]
  const duration = (items.length * speed) / 4

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          width: 'max-content',
          animation: reduced ? 'none' : `trusted-marquee ${duration}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <Link
            key={`${item.slug}-${i}`}
            href={`/work/${item.slug}`}
            title={item.client}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 100, minWidth: 170, padding: '0 1.75rem',
              background: 'var(--navy-2)', border: '1px solid rgba(76,99,199,0.12)', borderRadius: 12,
              transition: 'border-color 0.2s, transform 0.2s',
            }}
          >
            <Image
              src={item.logo}
              alt={item.client}
              width={item.width}
              height={item.height}
              style={{ maxHeight: 46, width: 'auto', height: 'auto', maxWidth: 130, objectFit: 'contain', borderRadius: 4 }}
            />
          </Link>
        ))}
      </div>
      <style>{`
        @keyframes trusted-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
