'use client'

import { useEffect, useRef } from 'react'
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

const CARD_W = 170
const GAP = 16
const STEP = (CARD_W + GAP) * 2

/**
 * Auto-scrolling logo strip the visitor can actually control:
 * pauses on hover, drags with the pointer, and nudges with the arrow buttons.
 * `speed` is px/s.
 */
export function TrustedByMarquee({ items, speed = 42 }: { items: LogoItem[]; speed?: number }) {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const x = useRef(0)
  const target = useRef<number | null>(null)
  const paused = useRef(false)
  const dragging = useRef(false)
  const dragMoved = useRef(0)
  const lastPointerX = useRef(0)

  const doubled = [...items, ...items]

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const el = trackRef.current
      if (el) {
        const half = el.scrollWidth / 2
        if (target.current !== null) {
          const diff = target.current - x.current
          if (Math.abs(diff) < 0.5) {
            x.current = target.current
            target.current = null
          } else {
            x.current += diff * Math.min(1, dt * 9)
          }
        } else if (!paused.current && !dragging.current && !reduced) {
          x.current -= speed * dt
        }
        if (half > 0) {
          if (x.current <= -half) {
            x.current += half
            if (target.current !== null) target.current += half
          } else if (x.current > 0) {
            x.current -= half
            if (target.current !== null) target.current -= half
          }
        }
        el.style.transform = `translate3d(${x.current}px,0,0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [speed, reduced])

  const nudge = (dir: 1 | -1) => {
    const base = target.current ?? x.current
    target.current = base + dir * STEP
  }

  const arrowStyle: React.CSSProperties = {
    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--navy-2)', border: '1px solid rgba(76,99,199,0.25)',
    color: 'var(--gold)', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1rem', direction: 'ltr' }}>
      <button
        type="button"
        aria-label="السابق"
        onClick={() => nudge(1)}
        style={arrowStyle}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(76,99,199,0.25)')}
      >
        <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8l5 5" /></svg>
      </button>

      <div
        style={{ overflow: 'hidden', flex: 1, cursor: 'grab', touchAction: 'pan-y', userSelect: 'none' }}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => { paused.current = false; dragging.current = false }}
        onPointerDown={e => {
          dragging.current = true
          dragMoved.current = 0
          lastPointerX.current = e.clientX
          target.current = null
          e.currentTarget.setPointerCapture(e.pointerId)
          e.currentTarget.style.cursor = 'grabbing'
        }}
        onPointerMove={e => {
          if (!dragging.current) return
          const dx = e.clientX - lastPointerX.current
          lastPointerX.current = e.clientX
          dragMoved.current += Math.abs(dx)
          x.current += dx
        }}
        onPointerUp={e => {
          dragging.current = false
          e.currentTarget.style.cursor = 'grab'
        }}
        onPointerCancel={() => (dragging.current = false)}
        onClickCapture={e => {
          // A drag that ends on a logo shouldn't navigate.
          if (dragMoved.current > 6) { e.preventDefault(); e.stopPropagation() }
        }}
      >
        <div
          ref={trackRef}
          style={{ display: 'flex', gap: GAP, width: 'max-content', willChange: 'transform' }}
        >
          {doubled.map((item, i) => (
            <Link
              key={`${item.slug}-${i}`}
              href={`/work/${item.slug}`}
              title={item.client}
              draggable={false}
              tabIndex={i >= items.length ? -1 : 0}
              aria-hidden={i >= items.length}
              onFocus={() => (paused.current = true)}
              onBlur={() => (paused.current = false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 100, minWidth: CARD_W, padding: '0 1.75rem',
                background: 'var(--navy-2)', border: '1px solid rgba(76,99,199,0.12)', borderRadius: 12,
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(76,99,199,0.45)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(76,99,199,0.12)')}
            >
              <Image
                src={item.logo}
                alt={item.client}
                width={item.width}
                height={item.height}
                draggable={false}
                style={{ maxHeight: 46, width: 'auto', height: 'auto', maxWidth: 130, objectFit: 'contain', borderRadius: 4, pointerEvents: 'none' }}
              />
            </Link>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="التالي"
        onClick={() => nudge(-1)}
        style={arrowStyle}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(76,99,199,0.25)')}
      >
        <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3l5 5-5 5" /></svg>
      </button>
    </div>
  )
}
