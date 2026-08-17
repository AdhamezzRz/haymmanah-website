'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const logoMaskStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  WebkitMaskImage: 'url(/logo-icon.png)',
  maskImage: 'url(/logo-icon.png)',
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
}

export function Preloader() {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('haymanah-loaded')) {
      setDone(true)
      return
    }

    const DURATION = 2200
    const start = performance.now()

    const safety = setTimeout(() => {
      sessionStorage.setItem('haymanah-loaded', '1')
      setDone(true)
    }, DURATION + 600)

    const tick = (now: number) => {
      const p = Math.min(Math.round(((now - start) / DURATION) * 100), 100)
      setPct(p)
      if (p >= 100) {
        clearTimeout(safety)
        setTimeout(() => {
          sessionStorage.setItem('haymanah-loaded', '1')
          setDone(true)
        }, 500)
      } else {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
    return () => clearTimeout(safety)
  }, [])

  const toArabicIndic = (n: number) =>
    n.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'var(--ink)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {/* Logo mark, filling in with load progress */}
          <div style={{ position: 'relative', width: 100, height: 164 }} aria-hidden="true">
            <div style={{ ...logoMaskStyle, background: 'rgba(76,99,199,0.15)' }} />
            <motion.div
              style={{
                ...logoMaskStyle,
                background: 'linear-gradient(160deg, #33449E, #4C63C7 45%, #8CA6E5)',
                clipPath: `inset(${100 - pct}% 0 0 0)`,
              }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>

          {/* Brand name */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: pct > 20 ? 1 : 0, y: pct > 20 ? 0 : 10 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: 'var(--font-role-display)',
              fontSize: '2rem',
              color: 'var(--gold)',
              letterSpacing: '-0.02em',
            }}
          >
            هيمنة
          </motion.p>

          {/* Percent counter */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontFamily: 'var(--font-role-heading)',
              fontSize: '0.875rem',
              color: 'var(--muted)',
              letterSpacing: '0.1em',
            }}
          >
            {toArabicIndic(pct)}٪
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
