'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface LogoMarkProps {
  size?: number
  /** Tint color applied via CSS mask — the raster emblem has no literal stroke, but this keeps the same call-site shape as the old KhatamStar's `stroke` prop. */
  stroke?: string
  mode?: 'draw' | 'spin' | 'static'
  className?: string
  style?: React.CSSProperties
}

export function LogoMark({
  size = 100,
  stroke = 'var(--gold)',
  mode = 'static',
  className,
  style,
}: LogoMarkProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(mode !== 'draw')

  useEffect(() => {
    if (mode !== 'draw' || reduced) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.unobserve(el) } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [mode, reduced])

  const maskStyle: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor: stroke,
    WebkitMaskImage: 'url(/logo-icon.png)',
    maskImage: 'url(/logo-icon.png)',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  }

  if (mode === 'spin') {
    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ ...style, width: size, height: size, display: 'inline-block' }}
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        <div style={maskStyle} />
      </motion.div>
    )
  }

  if (mode === 'draw') {
    return (
      <div ref={ref} className={className} style={{ ...style, width: size, height: size, display: 'inline-block' }} aria-hidden="true">
        <motion.div
          style={maskStyle}
          initial={reduced ? false : { opacity: 0, scale: 0.7, rotate: -18 }}
          animate={visible ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    )
  }

  return (
    <div ref={ref} className={className} style={{ ...style, width: size, height: size, display: 'inline-block' }} aria-hidden="true">
      <div style={maskStyle} />
    </div>
  )
}
