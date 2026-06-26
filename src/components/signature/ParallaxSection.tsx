'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

interface ParallaxSectionProps {
  children: React.ReactNode
  speed?: number
  className?: string
  style?: React.CSSProperties
}

export function ParallaxSection({ children, speed = 0.3, className, style }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -80}px`, `${speed * 80}px`])

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden', ...style }}>
      <motion.div style={reduced ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  )
}
