'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const KHATAM_PATH =
  'M50,5 L61,35 L93,35 L68,54 L79,84 L50,65 L21,84 L32,54 L7,35 L39,35 Z M50,15 L57,37 L80,37 L62,50 L70,73 L50,60 L30,73 L38,50 L20,37 L43,37 Z'

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
          {/* Khatam star drawing */}
          <svg
            viewBox="0 0 100 100"
            width={120}
            height={120}
            style={{ overflow: 'visible' }}
            aria-hidden="true"
          >
            <path
              d={KHATAM_PATH}
              fill="none"
              stroke="rgba(201,161,74,0.15)"
              strokeWidth="1"
            />
            <motion.path
              d={KHATAM_PATH}
              fill="none"
              stroke="url(#goldGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: pct / 100 }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8a6d2c" />
                <stop offset="50%" stopColor="#c9a14a" />
                <stop offset="100%" stopColor="#ecd08a" />
              </linearGradient>
            </defs>
          </svg>

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
