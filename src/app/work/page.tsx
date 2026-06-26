'use client'

import { useState } from 'react'
import { work, sectors } from '@/lib/work'
import type { CaseStudy, Sector } from '@/lib/work'
import { KhatamStar } from '@/components/signature/KhatamStar'
import { GlowCard } from '@/components/signature/GlowCard'
import { ClipReveal } from '@/components/signature/ClipReveal'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'

/* ─── Sector SVG icons ─────────────────────────────── */
function IconRestaurant() {
  return (
    <svg viewBox="0 0 96 96" width={80} height={80} fill="none">
      <circle cx="48" cy="48" r="40" fill="rgba(201,161,74,0.08)" stroke="rgba(201,161,74,0.2)" strokeWidth="1"/>
      <path d="M32 24v18c0 5.523 4.477 10 10 10h4" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M38 24v12" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" opacity=".6"/>
      <path d="M44 24v12" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" opacity=".6"/>
      <circle cx="58" cy="38" r="10" stroke="var(--gold)" strokeWidth="2.5"/>
      <path d="M58 28v4M58 44v4" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M48 62v10" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M34 72h28" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}
function IconSecurity() {
  return (
    <svg viewBox="0 0 96 96" width={80} height={80} fill="none">
      <circle cx="48" cy="48" r="40" fill="rgba(201,161,74,0.08)" stroke="rgba(201,161,74,0.2)" strokeWidth="1"/>
      <path d="M48 20L26 30v16c0 13.255 9.401 25.647 22 29 12.599-3.353 22-15.745 22-29V30L48 20z" stroke="var(--gold)" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M38 48l7 7 13-14" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconRetail() {
  return (
    <svg viewBox="0 0 96 96" width={80} height={80} fill="none">
      <circle cx="48" cy="48" r="40" fill="rgba(201,161,74,0.08)" stroke="rgba(201,161,74,0.2)" strokeWidth="1"/>
      <path d="M28 30h40l-5 26H33L28 30z" stroke="var(--gold)" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M28 30l-4-8H18" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="37" cy="64" r="3" fill="var(--gold)"/>
      <circle cx="59" cy="64" r="3" fill="var(--gold)"/>
      <path d="M38 30c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" opacity=".5"/>
    </svg>
  )
}
function IconCar() {
  return (
    <svg viewBox="0 0 96 96" width={80} height={80} fill="none">
      <circle cx="48" cy="48" r="40" fill="rgba(201,161,74,0.08)" stroke="rgba(201,161,74,0.2)" strokeWidth="1"/>
      <path d="M20 54h56v8H20z" stroke="var(--gold)" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M24 54l8-16h32l8 16" stroke="var(--gold)" strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="32" cy="64" r="5" stroke="var(--gold)" strokeWidth="2.5"/>
      <circle cx="64" cy="64" r="5" stroke="var(--gold)" strokeWidth="2.5"/>
      <path d="M34 46h28" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
      <path d="M20 58h4M72 58h4" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" opacity=".5"/>
    </svg>
  )
}
function IconEducation() {
  return (
    <svg viewBox="0 0 96 96" width={80} height={80} fill="none">
      <circle cx="48" cy="48" r="40" fill="rgba(201,161,74,0.08)" stroke="rgba(201,161,74,0.2)" strokeWidth="1"/>
      <path d="M48 26L20 40l28 14 28-14-28-14z" stroke="var(--gold)" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M76 40v14" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M30 48v12c0 5 8 10 18 10s18-5 18-10V48" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="76" cy="56" r="3" fill="var(--gold)"/>
    </svg>
  )
}
function IconBuilding() {
  return (
    <svg viewBox="0 0 96 96" width={80} height={80} fill="none">
      <circle cx="48" cy="48" r="40" fill="rgba(201,161,74,0.08)" stroke="rgba(201,161,74,0.2)" strokeWidth="1"/>
      <path d="M24 72V32h28v40" stroke="var(--gold)" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M52 72V44h20v28" stroke="var(--gold)" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M20 72h56" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="30" y="40" width="8" height="8" rx="1" stroke="var(--gold)" strokeWidth="1.5" opacity=".6"/>
      <rect x="30" y="54" width="8" height="8" rx="1" stroke="var(--gold)" strokeWidth="1.5" opacity=".6"/>
      <rect x="44" y="40" width="8" height="8" rx="1" stroke="var(--gold)" strokeWidth="1.5" opacity=".6"/>
      <rect x="58" y="52" width="8" height="8" rx="1" stroke="var(--gold)" strokeWidth="1.5" opacity=".6"/>
    </svg>
  )
}

const sectorIcons: Record<string, React.ReactNode> = {
  'مطاعم': <IconRestaurant />,
  'أمن':   <IconSecurity />,
  'تجزئة': <IconRetail />,
  'سيارات':<IconCar />,
  'تعليم': <IconEducation />,
  'عقارات':<IconBuilding />,
}

/* ─── Card visual header ────────────────────────────── */
function CardVisual({ c, height = 240 }: { c: CaseStudy; height?: number }) {
  return (
    <div style={{ position: 'relative', height, overflow: 'hidden', background: `linear-gradient(145deg, var(--ink) 0%, ${c.sectorColor}55 100%)` }}>
      {/* Subtle grid pattern */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`g-${c.slug}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="var(--gold)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${c.slug})`}/>
      </svg>

      {/* Khatam star */}
      <div style={{ position: 'absolute', bottom: -40, insetInlineEnd: -40, opacity: 0.07, pointerEvents: 'none' }}>
        <KhatamStar size={220} mode="static" stroke={c.sectorColor} />
      </div>

      {/* Sector icon */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {sectorIcons[c.sector] ?? <KhatamStar size={72} mode="static" />}
      </div>

      {/* Year pill */}
      <div style={{ position: 'absolute', top: '1rem', insetInlineStart: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.75rem', color: 'var(--muted)', background: 'rgba(5,8,26,0.6)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.2rem 0.6rem', borderRadius: 20 }}>
          {c.year}
        </span>
      </div>

      {/* Sector badge */}
      <div style={{ position: 'absolute', top: '1rem', insetInlineEnd: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--gold)', background: 'rgba(5,8,26,0.7)', border: '1px solid rgba(201,161,74,0.3)', padding: '0.2rem 0.6rem', borderRadius: 20, textTransform: 'uppercase' }}>
          {c.sector}
        </span>
      </div>
    </div>
  )
}

/* ─── Aggregate stats ───────────────────────────────── */
const aggregates = [
  { value: '٦+', label: 'عميل ناجح' },
  { value: '٤٨٠٪', label: 'أعلى نمو في المبيعات' },
  { value: '٨.٢×', label: 'أعلى عائد إنفاق إعلاني' },
]

export default function WorkPage() {
  const [active, setActive] = useState<Sector | 'الكل'>('الكل')
  const filtered = active === 'الكل' ? work : work.filter(c => c.sector === active)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ padding: '10rem 2rem 5rem', background: 'var(--ink)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, pointerEvents: 'none' }}>
          <KhatamStar size={640} mode="spin" />
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
              نتائج حقيقية، أرقام حقيقية، عملاء حقيقيون.<br/>هذا ما تبدو عليه الهيمنة.
            </p>
          </ClipReveal>
        </div>
      </section>

      {/* ── Stats band ── */}
      <section style={{ background: 'rgba(10,16,48,0.95)', borderBottom: '1px solid rgba(201,161,74,0.12)', padding: '2rem' }}>
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

      {/* ── Filter tabs ── */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(201,161,74,0.08)', background: 'var(--navy-2)', position: 'sticky', top: 72, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: '0.625rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {(['الكل', ...sectors] as const).map(sec => (
            <motion.button
              key={sec}
              onClick={() => setActive(sec as Sector | 'الكل')}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: 'var(--font-role-heading)',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.375rem 1rem',
                borderRadius: 40,
                border: '1px solid',
                borderColor: active === sec ? 'var(--gold)' : 'rgba(255,255,255,0.08)',
                background: active === sec ? 'rgba(201,161,74,0.12)' : 'transparent',
                color: active === sec ? 'var(--gold)' : 'var(--muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {active === sec && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
              )}
              {sec}
            </motion.button>
          ))}
        </div>
      </div>

      <section style={{ padding: '4rem 2rem 6rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

              {/* ── Featured card (first result) ── */}
              {featured && (
                <Reveal>
                  <Link href={`/work/${featured.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '1.5rem' }}>
                    <GlowCard style={{ background: 'var(--navy-2)', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 340 }}>
                      {/* Visual */}
                      <div style={{ position: 'relative' }}>
                        <CardVisual c={featured} height={340} />
                        {/* Featured badge */}
                        <div style={{ position: 'absolute', bottom: '1.25rem', insetInlineStart: '1.25rem', zIndex: 3 }}>
                          <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--ink)', background: 'var(--gold)', padding: '0.25rem 0.75rem', borderRadius: 20, textTransform: 'uppercase' }}>
                            ★ دراسة الحالة المميزة
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h2 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(1.5rem,2.5vw,2rem)', color: 'var(--ivory)', marginBottom: '0.5rem', lineHeight: 1.1 }}>
                            {featured.client}
                          </h2>
                          <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                            {featured.tagline}
                          </p>

                          {/* 4 results */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem' }}>
                            {featured.results.map(r => (
                              <div key={r.label}>
                                <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(1.25rem,2vw,1.625rem)', lineHeight: 1 }}>{r.value}</p>
                                <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.25rem', letterSpacing: '0.03em' }}>{r.label}</p>
                              </div>
                            ))}
                          </div>

                          {/* Testimonial pull */}
                          <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'rgba(243,236,218,0.55)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.5rem' }}>
                            "{featured.testimonial.quote.slice(0, 90)}…"
                          </p>
                          <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.1em' }}>
                            — {featured.testimonial.author}
                          </p>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                          <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.875rem', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            اقرأ القصة كاملة
                            <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 8H3M7 5l3 3-3 3"/></svg>
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
                            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.6, flex: 1 }}>
                              {c.tagline}
                            </p>

                            {/* 2 results */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.25rem' }}>
                              {c.results.slice(0, 2).map(r => (
                                <div key={r.label}>
                                  <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(1.1rem,2vw,1.375rem)', lineHeight: 1 }}>{r.value}</p>
                                  <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.675rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{r.label}</p>
                                </div>
                              ))}
                            </div>

                            <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.8rem', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                              اقرأ القصة
                              <svg viewBox="0 0 16 16" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 8H3M7 5l3 3-3 3"/></svg>
                            </span>
                          </div>
                        </GlowCard>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--muted)' }}>
                  <KhatamStar size={64} mode="static" />
                  <p style={{ fontFamily: 'var(--font-role-heading)', marginTop: '1.5rem' }}>لا توجد أعمال في هذا القطاع حالياً</p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, pointerEvents: 'none' }}>
          <KhatamStar size={500} mode="spin" />
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
