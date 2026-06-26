'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  intensity?: number
}

export function TiltCard({ children, className, style, intensity = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [glow, setGlow] = useState({ x: 50, y: 50 })

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 300, damping: 30 })

  const onMove = (e: React.MouseEvent) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const rect = ref.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const onLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setGlow({ x: 50, y: 50 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      className={className}
    >
      {/* Cursor-follow glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(400px circle at ${glow.x}% ${glow.y}%, rgba(201,161,74,0.07) 0%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'background 0.1s',
          zIndex: 1,
        }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </motion.div>
  )
}
