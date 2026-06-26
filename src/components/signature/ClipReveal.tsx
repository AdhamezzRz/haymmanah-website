'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface ClipRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export function ClipReveal({ children, delay = 0, className, style }: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) { setVisible(true); return }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.unobserve(el) } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden', ...style }}>
      <motion.div
        initial={reduced ? false : { clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
        animate={visible ? { clipPath: 'inset(0% 0 0 0)', opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
