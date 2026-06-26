'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface SplitTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
  stagger?: number
  once?: boolean
}

export function SplitText({
  text,
  className,
  style,
  delay = 0,
  stagger = 0.04,
  once = true,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) { setVisible(true); return }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once, reduced])

  const chars = Array.from(text)

  return (
    <span ref={ref} className={className} style={{ display: 'inline-block', ...style }} aria-label={text}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
          initial={reduced ? false : { opacity: 0, y: 60, rotateX: -40 }}
          animate={visible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.7,
            delay: delay / 1000 + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}
