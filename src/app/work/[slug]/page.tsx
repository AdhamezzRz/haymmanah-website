import { notFound } from 'next/navigation'
import { work, getCase } from '@/lib/work'
import { KhatamStar } from '@/components/signature/KhatamStar'
import { ClipReveal } from '@/components/signature/ClipReveal'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return work.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const c = getCase(slug)
  if (!c) return {}
  return {
    title: `${c.client} — أعمال هيمنة`,
    description: `${c.tagline} — دراسة حالة من هيمنة للخدمات التسويقية`,
  }
}

const sectorIconPaths: Record<string, string> = {
  'مطاعم': 'M32 24v18c0 5.523 4.477 10 10 10h4M38 24v12M44 24v12M58 38m-10 0a10 10 0 1 0 20 0 10 10 0 0 0-20 0M48 62v10M34 72h28',
  'أمن':   'M48 20L26 30v16c0 13.255 9.401 25.647 22 29 12.599-3.353 22-15.745 22-29V30L48 20zM38 48l7 7 13-14',
  'تجزئة': 'M28 30h40l-5 26H33L28 30zM28 30l-4-8H18M38 30c0-5.523 4.477-10 10-10s10 4.477 10 10',
  'سيارات':'M20 54h56v8H20zM24 54l8-16h32l8 16M32 64m-5 0a5 5 0 1 0 10 0 5 5 0 0 0-10 0M64 64m-5 0a5 5 0 1 0 10 0 5 5 0 0 0-10 0',
  'تعليم': 'M48 26L20 40l28 14 28-14-28-14zM76 40v14M30 48v12c0 5 8 10 18 10s18-5 18-10V48',
  'عقارات':'M24 72V32h28v40M52 72V44h20v28M20 72h56',
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getCase(slug)
  if (!c) notFound()

  const nextCase = getCase(c.nextSlug)

  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>

      {/* ── Cover ── */}
      <section style={{
        minHeight: '72vh',
        padding: '9rem 2rem 5rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        background: `linear-gradient(155deg, var(--ink) 40%, ${c.sectorColor}60 100%)`,
      }}>
        {/* Grid pattern overlay */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cover-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="var(--gold)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cover-grid)"/>
        </svg>

        {/* Giant khatam */}
        <div style={{ position: 'absolute', insetInlineEnd: '-8rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.05, pointerEvents: 'none' }}>
          <KhatamStar size={720} mode="spin" />
        </div>

        {/* Large sector icon watermark */}
        {sectorIconPaths[c.sector] && (
          <div style={{ position: 'absolute', insetInlineStart: '2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.06, pointerEvents: 'none' }}>
            <svg viewBox="0 0 96 96" width={280} height={280} fill="none">
              <path d={sectorIconPaths[c.sector]} stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 2, width: '100%' }}>
          <ClipReveal>
            <Link href="/work" style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 8H3M7 5l3 3-3 3" style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}/></svg>
              جميع الأعمال
            </Link>
          </ClipReveal>

          <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <ClipReveal delay={100}>
              <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', border: '1px solid rgba(201,161,74,0.3)', padding: '0.2rem 0.75rem', borderRadius: 20 }}>
                {c.sector}
              </span>
            </ClipReveal>
            <ClipReveal delay={150}>
              <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', letterSpacing: '0.12em', color: 'var(--muted)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.2rem 0.75rem', borderRadius: 20 }}>
                {c.year}
              </span>
            </ClipReveal>
          </div>

          <ClipReveal delay={200}>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)', lineHeight: 0.95, marginBottom: '1rem' }}>
              {c.client}
            </h1>
          </ClipReveal>
          <ClipReveal delay={350}>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'clamp(1rem,2vw,1.375rem)', color: 'var(--muted)', maxWidth: 560 }}>
              {c.tagline}
            </p>
          </ClipReveal>
        </div>
      </section>

      {/* ── Quick stats strip ── */}
      <section style={{ background: 'var(--ink)', borderBottom: '1px solid rgba(201,161,74,0.1)', padding: '0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: `repeat(${c.results.length}, 1fr)`, gap: 0 }}>
          {c.results.map((r, i) => (
            <div
              key={r.label}
              style={{
                padding: '2rem 1.5rem',
                textAlign: 'center',
                borderInlineEnd: i < c.results.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(1.5rem,3vw,2.25rem)', lineHeight: 1 }}>
                {r.value}
              </p>
              <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.375rem', letterSpacing: '0.03em' }}>
                {r.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Challenge ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--navy-2)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(201,161,74,0.12)', border: '1px solid rgba(201,161,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <path d="M10 6v4M10 14h.01" strokeLinecap="round"/>
                  <circle cx="10" cy="10" r="8"/>
                </svg>
              </div>
              <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                التحدي
              </p>
            </div>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--ivory)', lineHeight: 2.1, maxWidth: '62ch' }}>
              {c.challenge}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Strategy + deliverables ── */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '5rem', alignItems: 'start' }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(201,161,74,0.12)', border: '1px solid rgba(201,161,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <path d="M3 7h14M7 11h6M9 15h2" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                الاستراتيجية
              </p>
            </div>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--ivory)', lineHeight: 2.1, maxWidth: '62ch' }}>
              {c.strategy}
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(201,161,74,0.12)', border: '1px solid rgba(201,161,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <path d="M5 10l4 4 6-8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                المخرجات
              </p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {c.deliverables.map((d, i) => (
                <li
                  key={d}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.875rem',
                    fontFamily: 'var(--font-role-body)',
                    fontSize: 'var(--text-small)',
                    color: 'var(--muted)',
                    lineHeight: 1.6,
                    padding: '0.875rem 1rem',
                    background: 'rgba(201,161,74,0.04)',
                    borderRadius: 6,
                    border: '1px solid rgba(201,161,74,0.08)',
                  }}
                >
                  <span style={{ color: 'var(--gold)', flexShrink: 0, fontFamily: 'var(--font-role-heading)', fontSize: '0.75rem', marginTop: '0.1rem', opacity: 0.7 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section style={{ padding: '6rem 2rem', background: `linear-gradient(135deg, var(--ink), ${c.sectorColor}20)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.03, pointerEvents: 'none' }}>
          <KhatamStar size={600} mode="static" />
        </div>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <Reveal>
            {/* Quote mark */}
            <div style={{ fontFamily: 'var(--font-role-display)', fontSize: '5rem', color: 'var(--gold)', lineHeight: 0.6, opacity: 0.4, marginBottom: '2rem' }}>
              "
            </div>
            <blockquote style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', color: 'var(--ivory)', lineHeight: 1.75, marginBottom: '2.5rem', fontStyle: 'normal' }}>
              {c.testimonial.quote}
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: `${c.sectorColor}60`, border: '2px solid rgba(201,161,74,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-role-display)', fontSize: '1.1rem', color: 'var(--gold)' }}>
                  {c.testimonial.author[0]}
                </span>
              </div>
              <div style={{ textAlign: 'start' }}>
                <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.9375rem', color: 'var(--gold)' }}>
                  {c.testimonial.author}
                </p>
                <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                  {c.testimonial.role}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Next case ── */}
      {nextCase && (
        <section style={{ padding: '4rem 2rem', background: 'var(--navy-2)', borderTop: '1px solid rgba(201,161,74,0.08)' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                الدراسة التالية
              </p>
              <Link href={`/work/${nextCase.slug}`} style={{ textDecoration: 'none' }}>
                <h2 className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h2)', lineHeight: 1 }}>
                  {nextCase.client}
                </h2>
                <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', marginTop: '0.375rem' }}>
                  {nextCase.tagline}
                </p>
              </Link>
            </div>
            <Button href={`/work/${nextCase.slug}`} variant="outline">
              القصة التالية →
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}
