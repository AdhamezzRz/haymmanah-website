'use client'

import { useEffect, useRef, useState } from 'react'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const curr = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)
  const [big, setBig] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(hover: none)').matches
    if (reduced || touch) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      setVisible(true)
    }
    const onLeave = () => setVisible(false)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const loop = () => {
      curr.current.x = lerp(curr.current.x, pos.current.x, 0.12)
      curr.current.y = lerp(curr.current.y, pos.current.y, 0.12)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${curr.current.x}px, ${curr.current.y}px) translate(-50%, -50%)`
      }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)

    const onEnter = (e: Event) => {
      const t = e.target as HTMLElement
      if (t.matches('a, button, [role="button"], input, textarea, select, label')) {
        setBig(true)
      }
    }
    const onExitEl = () => setBig(false)

    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onExitEl)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onExitEl)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: big ? 48 : 20,
        height: big ? 48 : 20,
        borderRadius: '50%',
        border: `1.5px solid var(--gold)`,
        background: big ? 'rgba(201,161,74,0.08)' : 'transparent',
        pointerEvents: 'none',
        zIndex: 9998,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s, width 0.3s var(--ease-sovereign), height 0.3s var(--ease-sovereign), background 0.3s',
        mixBlendMode: 'normal',
      }}
    />
  )
}
