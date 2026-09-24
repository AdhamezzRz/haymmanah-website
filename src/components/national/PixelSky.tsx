'use client'

import { useEffect, useRef } from 'react'

/* ── Saudi green pixel palette (matches the 2026 identity's checker language) ── */
const PALETTE = ['#0B6B3A', '#0F9A4F', '#18B364', '#7FE0A8', '#F4FBF6']

interface Pixel {
  x: number; y: number
  vx: number; vy: number
  size: number
  color: string
  alpha: number
  life: number      // 1 → 0 for bursts; Infinity for ambient drift
  spin: number      // sway phase
  ambient: boolean
}

/**
 * Ambient pixel-confetti over the whole site: small green squares drifting down
 * like the identity's checkerboard dissolving, plus a burst wherever the visitor
 * clicks. Pointer-events none, pauses when the tab is hidden, honours
 * prefers-reduced-motion (static, sparse, no bursts).
 */
export function PixelSky() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0
    const pixels: Pixel[] = []

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const ambientCount = reduced ? 14 : (w < 768 ? 22 : 44)
    const spawnAmbient = (fromTop: boolean): Pixel => ({
      x: Math.random() * w,
      y: fromTop ? -10 : Math.random() * h,
      vx: 0,
      vy: reduced ? 0 : 12 + Math.random() * 22,        // px/s
      size: 3 + Math.round(Math.random() * 4),
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      alpha: 0.35 + Math.random() * 0.5,
      life: Infinity,
      spin: Math.random() * Math.PI * 2,
      ambient: true,
    })
    for (let i = 0; i < ambientCount; i++) pixels.push(spawnAmbient(false))

    const burst = (x: number, y: number, n = 26, power = 260) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const v = power * (0.35 + Math.random() * 0.65)
        pixels.push({
          x, y,
          vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80,
          size: 4 + Math.round(Math.random() * 5),
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          alpha: 1,
          life: 1,
          spin: Math.random() * Math.PI * 2,
          ambient: false,
        })
      }
    }

    const onPointer = (e: PointerEvent) => {
      if (reduced) return
      const t = e.target as HTMLElement | null
      if (t?.closest('[data-nd-intro]')) return   // the intro handles its own exit
      burst(e.clientX, e.clientY)
    }
    const onBurstEvent = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number; n?: number; power?: number }>).detail
      if (d) burst(d.x, d.y, d.n, d.power)
    }
    window.addEventListener('pointerdown', onPointer, { passive: true })
    window.addEventListener('haymanah:nd-burst', onBurstEvent)
    window.addEventListener('resize', resize)

    let raf = 0
    let last = performance.now()
    let running = true
    const tick = (now: number) => {
      if (!running) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, w, h)
      for (let i = pixels.length - 1; i >= 0; i--) {
        const p = pixels[i]
        if (p.ambient) {
          p.spin += dt * 1.4
          p.x += Math.sin(p.spin) * 10 * dt
          p.y += p.vy * dt
          if (p.y > h + 12) pixels[i] = spawnAmbient(true)
        } else {
          p.vy += 520 * dt            // gravity
          p.vx *= 0.985
          p.x += p.vx * dt; p.y += p.vy * dt
          p.life -= dt * 0.9
          if (p.life <= 0 || p.y > h + 20) { pixels.splice(i, 1); continue }
        }
        ctx.globalAlpha = p.ambient ? p.alpha : Math.max(0, Math.min(1, p.life * 1.4))
        ctx.fillStyle = p.color
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf) }
      else if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick) }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('haymanah:nd-burst', onBurstEvent)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none', opacity: 0.9 }}
    />
  )
}
