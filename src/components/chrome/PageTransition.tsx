'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname

    const el = overlayRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    el.style.opacity = '1'
    el.style.pointerEvents = 'all'

    const t = setTimeout(() => {
      el.style.opacity = '0'
      el.style.pointerEvents = 'none'
    }, 300)

    return () => clearTimeout(t)
  }, [pathname])

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--ink)',
          zIndex: 9996,
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s var(--ease-sovereign)',
        }}
      />
      {children}
    </>
  )
}
