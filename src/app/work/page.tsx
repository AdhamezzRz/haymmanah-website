'use client'

import { useState, useEffect, useId } from 'react'
import { work, sectors, disciplines, disciplineColors } from '@/lib/work'
import type { CaseStudy, Sector, Discipline } from '@/lib/work'
import { SectorIcon, DisciplineIcon } from '@/components/work/icons'
import { LogoMark } from '@/components/signature/LogoMark'
import { GlowCard } from '@/components/signature/GlowCard'
import { ClipReveal } from '@/components/signature/ClipReveal'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'

type Mode = 'sector' | 'discipline'

/* ─── Card visual header ────────────────────────────── */
function CardVisual({ c, height = 240 }: { c: CaseStudy; height?: number }) {
  const cover = c.media?.[0]

  return (
    <div style={{ position: 'relative', height, overflow: 'hidden', background: `linear-gradient(145deg, var(--ink) 0%, ${c.sectorColor}55 100%)` }}>
      {cover ? (
        <>
          <Image src={cover} alt={c.client} fill sizes="(max-width: 768px) 100vw, 480px" style={{ objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, ${c.sectorColor}90 100%)` }} />
        </>
      ) : (
        <>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`g-${c.slug}`} width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="var(--gold)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#g-${c.slug})`} />
          </svg>

          <div style={{ position: 'absolute', bottom: -40, insetInlineEnd: -40, opacity: 0.07, pointerEvents: 'none' }}>
            <LogoMark size={220} mode="static" stroke={c.sectorColor} />
          </div>

          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SectorIcon sector={c.sector} size={80} />
          </div>
        </>
      )}

      <div style={{ position: 'absolute', top: '1rem', insetInlineStart: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.75rem', color: 'var(--muted)', background: 'rgba(var(--glass-rgb),0.8)', border: '1px solid rgba(var(--ivory-rgb),0.08)', padding: '0.2rem 0.6rem', borderRadius: 20 }}>
          {c.year}
        </span>
      </div>

      <div style={{ position: 'absolute', top: '1rem', insetInlineEnd: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--gold-deep)', background: 'rgba(var(--glass-rgb),0.85)', border: '1px solid rgba(201,161,74,0.35)', padding: '0.2rem 0.6rem', borderRadius: 20, textTransform: 'uppercase' }}>
          {c.sector}
        </span>
      </div>
    </div>
  )
}

/* ─── Discipline chip row (cross-links the two taxonomies) ── */
function DisciplineChips({ items, onPick }: { items: Discipline[]; onPick: (d: Discipline, e: React.MouseEvent) => void }) {
  return (
    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
      {items.map(d => (
        <button
          key={d}
          onClick={(e) => onPick(d, e)}
          title={`عرض كل أعمال ${d}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontFamily: 'var(--font-role-heading)',
            fontSize: '0.6875rem',
            letterSpacing: '0.02em',
            color: 'var(--muted)',
            background: `${disciplineColors[d]}12`,
            border: `1px solid ${disciplineColors[d]}35`,
            borderRadius: 20,
            padding: '0.2rem 0.6rem',
            cursor: 'pointer',
            transition: 'transform 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <DisciplineIcon discipline={d} size={12} color={disciplineColors[d]} />
          {d}
        </button>
      ))}
    </div>
  )
}

const aggregates = [
  { value: '١١+', label: 'قطاع نخدمه' },
  { value: '٩٢٠٪', label: 'أعلى نمو حققناه' },
  { value: '٨.٢×', label: 'أعلى عائد إنفاق إعلاني' },
]

export default function WorkPage() {
  const [mode, setMode] = useState<Mode>('sector')
  const [activeSector, setActiveSector] = useState<Sector | 'الكل'>('الكل')
  const [activeDiscipline, setActiveDiscipline] = useState<Discipline | 'الكل'>('الكل')
  const filterBarId = useId()

  // Support deep-links from case-study pages: /work?discipline=... or /work?sector=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const d = params.get('discipline')
    const s = params.get('sector')
    if (d && (disciplines as string[]).includes(d)) {
      setMode('discipline')
      setActiveDiscipline(d as Discipline)
    } else if (s && (sectors as string[]).includes(s)) {
      setMode('sector')
      setActiveSector(s as Sector)
    }
  }, [])

  const filtered =
    mode === 'sector'
      ? activeSector === 'الكل' ? work : work.filter(c => c.sector === activeSector)
      : activeDiscipline === 'الكل' ? work : work.filter(c => c.disciplines.includes(activeDiscipline as Discipline))

  const featured = filtered[0]
  const rest = filtered.slice(1)

  function jumpToDiscipline(d: Discipline, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setMode('discipline')
    setActiveDiscipline(d)
    document.getElementById(filterBarId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ padding: '10rem 2rem 5rem', background: 'var(--ink)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, pointerEvents: 'none' }}>
          <LogoMark size={640} mode="spin" />
        </div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 680, margin: '0 auto' }}>
          <ClipReveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              معرض الإنجازات
            </p>
          </ClipReveal>
          <ClipReveal delay={200}>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)', marginBottom: '1.25rem', lineHeight: 1 }}>
              أعمالنا
            </h1>
          </ClipReveal>
          <ClipReveal delay={400}>
            <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', maxWidth: 460, margin: '0 auto', lineHeight: 1.8 }}>
              نتائج حقيقية، أرقام حقيقية، عملاء حقيقيون.<br />هذا ما تبدو عليه الهيمنة.
            </p>
          </ClipReveal>
        </div>
      </section>

      {/* ── Stats band ── */}
      <section style={{ background: 'var(--navy-2)', borderBottom: '1px solid rgba(201,161,74,0.15)', padding: '2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
          {aggregates.map((a, i) => (
            <Reveal key={a.label} delay={i * 100}>
              <div>
                <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', lineHeight: 1 }}>
                  {a.value}
                </p>
                <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--muted)', letterSpacing: '0.1em', marginTop: '0.375rem' }}>
                  {a.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Mode toggle + filter pills ── */}
      <div id={filterBarId} style={{ padding: '1.75rem 2rem', borderBottom: '1px solid rgba(201,161,74,0.08)', background: 'var(--navy-2)', position: 'sticky', top: 72, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>

          {/* Segmented mode switcher */}
          <div style={{ display: 'inline-flex', padding: 4, background: 'var(--navy)', border: '1px solid rgba(201,161,74,0.25)', borderRadius: 40, gap: 2 }}>
            {([
              { id: 'sector' as Mode, label: 'تصفّح حسب القطاع' },
              { id: 'discipline' as Mode, label: 'تصفّح حسب التخصص' },
            ]).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                style={{
                  position: 'relative',
                  padding: '0.6rem 1.5rem',
                  borderRadius: 40,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-role-heading)',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.02em',
                }}
              >
                {mode === id && (
                  <motion.div
                    layoutId="mode-pill-bg"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    style={{ position: 'absolute', inset: 0, background: 'var(--gold-grad)', borderRadius: 40, zIndex: 0 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1, color: mode === id ? 'var(--on-gold)' : 'var(--muted)', fontWeight: mode === id ? 600 : 400, transition: 'color 0.2s' }}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Filter pills — sector or discipline depending on mode */}
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {mode === 'sector' ? (
                (['الكل', ...sectors] as const).map(sec => {
                  const isActive = activeSector === sec
                  return (
                    <motion.button
                      key={sec}
                      onClick={() => setActiveSector(sec as Sector | 'الكل')}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        fontFamily: 'var(--font-role-heading)', fontSize: '0.8rem', letterSpacing: '0.05em',
                        padding: '0.4rem 1rem', borderRadius: 40, border: '1px solid',
                        borderColor: isActive ? 'var(--gold)' : 'rgba(var(--ivory-rgb),0.12)',
                        background: isActive ? 'rgba(201,161,74,0.12)' : 'transparent',
                        color: isActive ? 'var(--gold)' : 'var(--muted)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      {sec !== 'الكل' && (
                        <span style={{ display: 'inline-flex', opacity: isActive ? 1 : 0.75 }}>
                          <SectorIcon sector={sec as Sector} size={16} ring={false} />
                        </span>
                      )}
                      {sec}
                    </motion.button>
                  )
                })
              ) : (
                (['الكل', ...disciplines] as const).map(d => {
                  const isActive = activeDiscipline === d
                  const color = d === 'الكل' ? 'var(--gold)' : disciplineColors[d as Discipline]
                  return (
                    <motion.button
                      key={d}
                      onClick={() => setActiveDiscipline(d as Discipline | 'الكل')}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.45rem',
                        fontFamily: 'var(--font-role-heading)', fontSize: '0.8rem', letterSpacing: '0.02em',
                        padding: '0.4rem 1.1rem', borderRadius: 40, border: '1px solid',
                        borderColor: isActive ? 'var(--gold)' : `${color}30`,
                        background: isActive ? 'rgba(201,161,74,0.12)' : `${color}0a`,
                        color: isActive ? 'var(--gold)' : 'var(--muted)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      {d !== 'الكل' && <DisciplineIcon discipline={d as Discipline} size={14} color={isActive ? 'var(--gold)' : color} />}
                      {d}
                    </motion.button>
                  )
                })
              )}
          </div>
        </div>
      </div>

      <section style={{ padding: '4rem 2rem 6rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div key={`${mode}-${activeSector}-${activeDiscipline}`}>

              {/* ── Featured card (first result) ── */}
              {featured && (
                <Reveal>
                  <Link href={`/work/${featured.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '1.5rem' }}>
                    <GlowCard style={{ background: 'var(--navy-2)', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 340 }}>
                      <div style={{ position: 'relative' }}>
                        <CardVisual c={featured} height={340} />
                        <div style={{ position: 'absolute', bottom: '1.25rem', insetInlineStart: '1.25rem', zIndex: 3 }}>
                          <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--on-gold)', background: 'var(--gold)', padding: '0.25rem 0.75rem', borderRadius: 20, textTransform: 'uppercase' }}>
                            ★ دراسة الحالة المميزة
                          </span>
                        </div>
                      </div>

                      <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h2 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(1.5rem,2.5vw,2rem)', color: 'var(--ivory)', marginBottom: '0.5rem', lineHeight: 1.1 }}>
                            {featured.client}
                          </h2>
                          <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
                            {featured.tagline}
                          </p>

                          <div style={{ marginBottom: '1.5rem' }}>
                            <DisciplineChips items={featured.disciplines} onPick={jumpToDiscipline} />
                          </div>

                          {featured.results && featured.results.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(var(--ivory-rgb),0.08)', marginBottom: '1.5rem' }}>
                              {featured.results.map(r => (
                                <div key={r.label}>
                                  <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(1.25rem,2vw,1.625rem)', lineHeight: 1 }}>{r.value}</p>
                                  <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.25rem', letterSpacing: '0.03em' }}>{r.label}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {featured.testimonial && (
                            <>
                              <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'rgba(var(--ivory-rgb),0.6)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.5rem' }}>
                                "{featured.testimonial.quote.slice(0, 90)}…"
                              </p>
                              <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.1em' }}>
                                — {featured.testimonial.author}
                              </p>
                            </>
                          )}
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                          <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.875rem', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            اقرأ القصة كاملة
                            <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 8H3M7 5l3 3-3 3" /></svg>
                          </span>
                        </div>
                      </div>
                    </GlowCard>
                  </Link>
                </Reveal>
              )}

              {/* ── Rest: 3-col grid ── */}
              {rest.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {rest.map((c, i) => (
                    <Reveal key={c.slug} delay={i * 70}>
                      <Link href={`/work/${c.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                        <GlowCard style={{ background: 'var(--navy-2)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <CardVisual c={c} height={200} />

                          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <h2 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '0.375rem', lineHeight: 1.1 }}>
                              {c.client}
                            </h2>
                            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
                              {c.tagline}
                            </p>

                            <div style={{ marginBottom: '1.25rem' }}>
                              <DisciplineChips items={c.disciplines} onPick={jumpToDiscipline} />
                            </div>

                            {c.results && c.results.length > 0 && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(var(--ivory-rgb),0.08)', marginBottom: '1.25rem', marginTop: 'auto' }}>
                                {c.results.slice(0, 2).map(r => (
                                  <div key={r.label}>
                                    <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(1.1rem,2vw,1.375rem)', lineHeight: 1 }}>{r.value}</p>
                                    <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.675rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{r.label}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.8rem', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                              اقرأ القصة
                              <svg viewBox="0 0 16 16" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 8H3M7 5l3 3-3 3" /></svg>
                            </span>
                          </div>
                        </GlowCard>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}

              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--muted)' }}>
                  <LogoMark size={64} mode="static" />
                  <p style={{ fontFamily: 'var(--font-role-heading)', marginTop: '1.5rem' }}>لا توجد أعمال مطابقة حالياً</p>
                </div>
              )}

          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, pointerEvents: 'none' }}>
          <LogoMark size={500} mode="spin" />
        </div>
        <Reveal>
          <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            قصتك القادمة
          </p>
          <h2 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h2)', color: 'var(--ivory)', marginBottom: '1rem', lineHeight: 1.1 }}>
            دورك أن تكون هنا
          </h2>
          <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-role-body)', maxWidth: 360, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            كل قصة نجاح بدأت باستشارة واحدة.
            انضم لعملائنا وابنِ هيمنتك.
          </p>
          <Button href="/contact" variant="primary" size="lg">ابدأ قصتك</Button>
        </Reveal>
      </section>
    </div>
  )
}
