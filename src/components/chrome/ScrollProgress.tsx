'use client'

import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop || document.body.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        insetInlineStart: 0,
        width: `${pct}%`,
        height: 2,
        background: 'var(--gold-grad)',
        zIndex: 9997,
        pointerEvents: 'none',
        transition: 'width 0.05s linear',
      }}
    />
  )
}
