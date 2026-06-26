'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function GlowCard({ children, className, style }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 })
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      opacity: 1,
    })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setGlow(g => ({ ...g, opacity: 0 })) }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 8,
        border: `1px solid ${hovered ? 'rgba(201,161,74,0.3)' : 'rgba(201,161,74,0.1)'}`,
        transition: 'border-color 0.3s',
        ...style,
      }}
    >
      {/* Rotating gradient border on hover */}
      {hovered && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: 9,
            background: 'conic-gradient(from var(--angle), var(--gold-deep), var(--gold), var(--gold-bright), var(--gold-deep))',
            zIndex: 0,
            animation: 'spin-border 3s linear infinite',
            opacity: 0.4,
          }}
        />
      )}

      {/* Cursor glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(350px circle at ${glow.x}% ${glow.y}%, rgba(201,161,74,0.09), transparent 70%)`,
          opacity: glow.opacity,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Shimmer sweep on enter */}
      {hovered && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, transparent 30%, rgba(236,208,138,0.06) 50%, transparent 70%)',
            animation: 'shimmer-sweep 0.6s ease forwards',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </motion.div>
  )
}
