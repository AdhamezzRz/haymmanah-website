'use client'

import { useEffect, useRef, useState } from 'react'
import { NATIONAL_DAY_EDITION } from '@/lib/nationalDay'

const SLOGAN = 'عِزّنا بطبعنا'
const SESSION_KEY = 'haymanah-nd-intro'

const DEEP = '#04231C'
const BAND_A = '#052F24'
const BAND_B = '#0A3D2C'
const SPARK = '#0F9A4F'
const EDGE = '#18B364'
const TEXT = '#F4FBF6'

interface Cell { tx: number; ty: number; sx: number; sy: number; delay: number; vx: number; vy: number }

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2)

/**
 * Once-per-session celebration takeover, played right after the site preloader:
 * a checkered identity band draws in, the slogan assembles out of thousands of
 * flying pixels (rendered from the real Kufi glyphs, then sampled to a grid), the
 * edition line fades in, and the whole thing bursts apart as the overlay wipes up.
 */
export function NationalIntro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'assemble' | 'hold' | 'exit'>('assemble')
  const exitRef = useRef<() => void>(() => {})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    // guard against a 0×0 viewport (hidden tab / pane) — never rasterise into an empty canvas
    const w = Math.max(window.innerWidth, 320), h = Math.max(window.innerHeight, 480)
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr)
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let raf = 0
    let cancelled = false
    let exitAt: number | null = null
    let start = 0

    const family = getComputedStyle(document.documentElement).getPropertyValue('--font-kufi').trim() || 'sans-serif'

    // ── Rasterise the slogan once, sample it to a pixel grid ──
    const build = async () => {
      const probe = `800 100px ${family}`
      try { await document.fonts.load(probe, SLOGAN) } catch { /* fall through with fallback font */ }
      if (cancelled) return

      const targetW = Math.min(w * 0.82, 920)
      const off = document.createElement('canvas')
      const octx = off.getContext('2d')!
      octx.font = probe
      const m = octx.measureText(SLOGAN)
      const fontPx = Math.floor((100 * targetW) / Math.max(m.width, 1))
      const textW = m.width * (fontPx / 100)
      const textH = fontPx * 1.15
      off.width = Math.ceil(textW + fontPx * 0.4); off.height = Math.ceil(textH + fontPx * 0.4)
      octx.font = `800 ${fontPx}px ${family}`
      octx.textAlign = 'center'; octx.textBaseline = 'middle'
      octx.fillStyle = '#fff'
      octx.direction = 'rtl'
      octx.fillText(SLOGAN, off.width / 2, off.height / 2)

      const cell = Math.max(4, Math.round(textW / 150))
      const img = octx.getImageData(0, 0, off.width, off.height).data
      const cells: Cell[] = []
      const ox = (w - off.width) / 2, oy = h * 0.46 - off.height / 2
      for (let y = 0; y < off.height; y += cell) {
        for (let x = 0; x < off.width; x += cell) {
          const px = Math.min(off.width - 1, x + (cell >> 1)), py = Math.min(off.height - 1, y + (cell >> 1))
          if (img[(py * off.width + px) * 4 + 3] > 110) {
            const a = Math.random() * Math.PI * 2
            const r = Math.max(w, h) * (0.35 + Math.random() * 0.5)
            cells.push({
              tx: ox + x, ty: oy + y,
              sx: w / 2 + Math.cos(a) * r, sy: h / 2 + Math.sin(a) * r,
              delay: Math.random() * 650,
              vx: (Math.random() - 0.5) * 900, vy: -200 - Math.random() * 700,
            })
          }
        }
      }

      const band = {
        x: ox - fontPx * 0.35, y: oy - fontPx * 0.12,
        w: off.width + fontPx * 0.7, h: off.height + fontPx * 0.24,
        cell: cell * 2,
      }
      // sparse "live" cells in the band that flicker like the identity's checker
      const sparks = Array.from({ length: 70 }, () => ({
        cx: Math.floor(Math.random() * (band.w / band.cell)),
        cy: Math.floor(Math.random() * (band.h / band.cell)),
        ph: Math.random() * 10,
      }))
      // background grid flicker
      const gridCell = 22
      const gcols = Math.ceil(w / gridCell) + 1, grows = Math.ceil(h / gridCell) + 1
      const gseed = Array.from({ length: gcols * grows }, () => Math.random())

      const ASSEMBLE_END = reduced ? 400 : 1900
      const HOLD_END = reduced ? 1600 : 3400

      start = performance.now()
      let holdFired = false

      const draw = (now: number) => {
        if (cancelled) return
        const t = now - start
        const exiting = exitAt !== null
        const et = exiting ? (now - exitAt!) / 1000 : 0

        ctx.clearRect(0, 0, w, h)
        // deep ground
        ctx.fillStyle = DEEP
        ctx.fillRect(0, 0, w, h)
        // faint animated checker across the whole screen
        const gridIn = Math.min(1, t / 700)
        for (let gy = 0; gy < grows; gy++) {
          for (let gx = 0; gx < gcols; gx++) {
            const s = gseed[gy * gcols + gx]
            const on = ((gx + gy) & 1) === 0
            const flick = 0.5 + 0.5 * Math.sin(t / 900 + s * 12)
            const a = (on ? 0.16 : 0.06) * gridIn * (0.6 + 0.4 * flick) * (exiting ? Math.max(0, 1 - et * 1.6) : 1)
            if (a < 0.02) continue
            ctx.fillStyle = s > 0.985 ? SPARK : BAND_B
            ctx.globalAlpha = a
            ctx.fillRect(gx * gridCell, gy * gridCell, gridCell - 1, gridCell - 1)
          }
        }
        ctx.globalAlpha = 1

        // identity band draws in from the centre
        const bandP = reduced ? 1 : easeInOutQuint(Math.min(1, Math.max(0, (t - 150) / 550)))
        const bandFade = exiting ? Math.max(0, 1 - et * 2.2) : 1
        if (bandP > 0 && bandFade > 0) {
          ctx.save()
          ctx.globalAlpha = bandFade
          const bw = band.w * bandP
          const bx = band.x + (band.w - bw) / 2
          ctx.beginPath(); ctx.rect(bx, band.y, bw, band.h); ctx.clip()
          const cols = Math.ceil(band.w / band.cell), rows = Math.ceil(band.h / band.cell)
          for (let cy = 0; cy < rows; cy++) {
            for (let cx = 0; cx < cols; cx++) {
              ctx.fillStyle = ((cx + cy) & 1) === 0 ? BAND_A : BAND_B
              ctx.fillRect(band.x + cx * band.cell, band.y + cy * band.cell, band.cell, band.cell)
            }
          }
          for (const s of sparks) {
            const k = 0.5 + 0.5 * Math.sin(t / 500 + s.ph)
            if (k < 0.55) continue
            ctx.globalAlpha = bandFade * (k - 0.55) * 2
            ctx.fillStyle = SPARK
            ctx.fillRect(band.x + s.cx * band.cell, band.y + s.cy * band.cell, band.cell, band.cell)
          }
          ctx.globalAlpha = bandFade
          ctx.strokeStyle = EDGE; ctx.lineWidth = 2
          ctx.strokeRect(bx + 1, band.y + 1, bw - 2, band.h - 2)
          ctx.restore()
        }

        // slogan pixels
        ctx.fillStyle = TEXT
        for (const c of cells) {
          let x = c.tx, y = c.ty, a = 1
          if (exiting) {
            x = c.tx + c.vx * et + c.vx * et * et * 0.3
            y = c.ty + c.vy * et + 1400 * et * et
            a = Math.max(0, 1 - et * 1.4)
          } else if (!reduced) {
            const p = easeOutCubic(Math.min(1, Math.max(0, (t - 300 - c.delay) / 950)))
            if (p <= 0) continue
            x = c.sx + (c.tx - c.sx) * p
            y = c.sy + (c.ty - c.sy) * p
            a = Math.min(1, p * 1.6)
          }
          ctx.globalAlpha = a
          ctx.fillRect(Math.round(x), Math.round(y), cell - 1, cell - 1)
        }
        ctx.globalAlpha = 1

        if (!holdFired && t >= ASSEMBLE_END) { holdFired = true; setPhase('hold') }
        if (!exiting && t >= HOLD_END) exitRef.current()
        if (exiting && et > 0.95) { onDone(); return }
        raf = requestAnimationFrame(draw)
      }
      raf = requestAnimationFrame(draw)
    }

    exitRef.current = () => {
      if (exitAt !== null) return
      exitAt = performance.now()
      setPhase('exit')
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* private mode */ }
      // hand the celebration to the ambient layer
      window.dispatchEvent(new CustomEvent('haymanah:nd-burst', { detail: { x: w / 2, y: h * 0.46, n: 80, power: 520 } }))
    }

    build().catch(() => {
      // never trap the visitor behind a broken overlay
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* private mode */ }
      onDone()
    })
    return () => { cancelled = true; cancelAnimationFrame(raf) }
  }, [onDone])

  const skip = () => exitRef.current()

  return (
    <div
      ref={rootRef}
      data-nd-intro=""
      role="dialog"
      aria-label={`احتفال اليوم الوطني السعودي ${NATIONAL_DAY_EDITION}`}
      onPointerDown={skip}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998, cursor: 'pointer', background: DEEP,
        clipPath: phase === 'exit' ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
        transition: 'clip-path 0.85s cubic-bezier(0.76, 0, 0.24, 1) 0.15s',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />

      <div
        style={{
          position: 'absolute', insetInline: 0, top: '65%', textAlign: 'center', pointerEvents: 'none',
          opacity: phase === 'assemble' ? 0 : phase === 'hold' ? 1 : 0,
          transform: phase === 'assemble' ? 'translateY(14px)' : 'translateY(0)',
          transition: 'opacity 0.7s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <p style={{ fontFamily: 'var(--font-kufi), var(--font-role-heading)', fontWeight: 800, fontSize: 'clamp(1.15rem, 3.2vw, 2rem)', color: TEXT, letterSpacing: '0.02em', margin: 0 }}>
          اليوم الوطني السعودي {NATIONAL_DAY_EDITION.toLocaleString('ar-EG')}
        </p>
        <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'clamp(0.6rem, 1.3vw, 0.8rem)', color: '#7FE0A8', letterSpacing: '0.42em', textTransform: 'uppercase', marginTop: '0.75rem', direction: 'ltr' }}>
          Saudi National Day · 23 Sep
        </p>
        <p style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', color: 'rgba(244,251,246,0.7)', marginTop: '1.4rem' }}>
          من فريق هيمنة — كل عام والوطن بخير
        </p>
      </div>

      <button
        type="button"
        onPointerDown={e => { e.stopPropagation(); skip() }}
        style={{
          position: 'absolute', bottom: '2rem', insetInlineStart: '2rem',
          fontFamily: 'var(--font-role-heading)', fontSize: '0.75rem', letterSpacing: '0.15em',
          color: '#7FE0A8', background: 'rgba(4,35,28,0.6)', border: '1px solid rgba(24,179,100,0.4)',
          borderRadius: 30, padding: '0.5rem 1rem', cursor: 'pointer',
          opacity: phase === 'exit' ? 0 : 1, transition: 'opacity 0.3s',
        }}
      >
        تخطّي ←
      </button>
    </div>
  )
}
