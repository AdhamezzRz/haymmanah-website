'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface KhatamStarProps {
  size?: number
  stroke?: string
  mode?: 'draw' | 'spin' | 'static'
  strokeWidth?: number
  className?: string
  style?: React.CSSProperties
}

export function KhatamStar({
  size = 100,
  stroke = 'var(--gold)',
  mode = 'spin',
  strokeWidth = 1.5,
  className,
  style,
}: KhatamStarProps) {
  const reduced = useReducedMotion()

  const outerPoints = '50,8 61.8,34.5 90,34.5 67.6,52.5 76.4,79 50,62 23.6,79 32.4,52.5 10,34.5 38.2,34.5'
  const innerPoints = '50,22 57.5,40 76,40 62,51.5 67,70 50,59 33,70 38,51.5 24,40 42.5,40'

  if (mode === 'draw') {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        style={style}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`kg-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--gold-deep)" />
            <stop offset="50%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="var(--gold-bright)" />
          </linearGradient>
        </defs>
        <polygon points={outerPoints} fill="none" stroke="rgba(201,161,74,0.1)" strokeWidth={strokeWidth} />
        <motion.polygon
          points={outerPoints}
          fill="none"
          stroke={`url(#kg-${size})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.polygon
          points={innerPoints}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth * 0.7}
          strokeLinecap="round"
          opacity={0.4}
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    )
  }

  if (mode === 'spin') {
    return (
      <motion.svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        style={style}
        aria-hidden="true"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <polygon points={outerPoints} fill="none" stroke={stroke} strokeWidth={strokeWidth} opacity={0.6} />
        <polygon points={innerPoints} fill="none" stroke={stroke} strokeWidth={strokeWidth * 0.6} opacity={0.3} />
      </motion.svg>
    )
  }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true">
      <polygon points={outerPoints} fill="none" stroke={stroke} strokeWidth={strokeWidth} opacity={0.6} />
      <polygon points={innerPoints} fill="none" stroke={stroke} strokeWidth={strokeWidth * 0.6} opacity={0.3} />
    </svg>
  )
}
