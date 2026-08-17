import { notFound } from 'next/navigation'
import Image from 'next/image'
import { work, getCase } from '@/lib/work'
import { LogoMark } from '@/components/signature/LogoMark'
import { SectorIcon, DisciplineIcon } from '@/components/work/icons'
import { disciplineColors } from '@/lib/work'
import { AmbientReel } from '@/components/work/AmbientReel'
import { SpotlightVideo } from '@/components/work/SpotlightVideo'
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
          <LogoMark size={720} mode="spin" />
        </div>

        {/* Large sector icon watermark */}
        <div style={{ position: 'absolute', insetInlineStart: '2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.06, pointerEvents: 'none' }}>
          <SectorIcon sector={c.sector} size={280} ring={false} />
        </div>

        <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 2, width: '100%' }}>
          <ClipReveal>
            <Link href="/work" style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 8H3M7 5l3 3-3 3" style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}/></svg>
              جميع الأعمال
            </Link>
          </ClipReveal>

          <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <ClipReveal delay={100}>
              <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', border: '1px solid rgba(76,99,199,0.3)', padding: '0.2rem 0.75rem', borderRadius: 20 }}>
                {c.sector}
              </span>
            </ClipReveal>
            <ClipReveal delay={150}>
              <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', letterSpacing: '0.12em', color: 'var(--muted)', border: '1px solid rgba(var(--ivory-rgb),0.12)', padding: '0.2rem 0.75rem', borderRadius: 20 }}>
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
      {c.results && c.results.length > 0 && (
        <section style={{ background: 'var(--ink)', borderBottom: '1px solid rgba(76,99,199,0.1)', padding: '0' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: `repeat(${c.results.length}, 1fr)`, gap: 0 }}>
            {c.results.map((r, i) => (
              <div
                key={r.label}
                style={{
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  borderInlineEnd: i < c.results!.length - 1 ? '1px solid rgba(var(--ivory-rgb),0.08)' : 'none',
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
      )}

      {/* ── Video reel ── */}
      {(c.ambientReel || c.spotlightVideo) && (
        <section style={{ padding: '5rem 2rem 2rem', background: 'var(--ink)' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <Reveal>
              <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'center' }}>
                من الفيديوهات المُنتَجة فعلياً
              </p>
              {c.ambientReel && <AmbientReel src={c.ambientReel.video} poster={c.ambientReel.poster} />}
              {c.spotlightVideo && <SpotlightVideo src={c.spotlightVideo.video} poster={c.spotlightVideo.poster} />}
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Real delivered creative gallery ── */}
      {c.media && c.media.length > 0 && (
        <section style={{ padding: (c.ambientReel || c.spotlightVideo) ? '3rem 2rem 5rem' : '5rem 2rem', background: 'var(--ink)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <Reveal>
              <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem', textAlign: 'center' }}>
                من التصاميم المُسلَّمة فعلياً
              </p>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {c.media.map((src, i) => (
                <Reveal key={src} delay={Math.min(i * 40, 400)}>
                  <div style={{ position: 'relative', aspectRatio: '4 / 5', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(76,99,199,0.15)' }}>
                    <Image
                      src={src}
                      alt={`${c.client} — تصميم ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 45vw, 220px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Challenge ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--navy-2)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(76,99,199,0.12)', border: '1px solid rgba(76,99,199,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(76,99,199,0.12)', border: '1px solid rgba(76,99,199,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(76,99,199,0.12)', border: '1px solid rgba(76,99,199,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    background: 'rgba(76,99,199,0.04)',
                    borderRadius: 6,
                    border: '1px solid rgba(76,99,199,0.08)',
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

      {/* ── Disciplines used ── */}
      <section style={{ padding: '4rem 2rem 5rem', background: 'var(--navy-2)', borderTop: '1px solid rgba(76,99,199,0.08)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              التخصصات المستخدمة في هذا المشروع
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {c.disciplines.map(d => (
                <Link
                  key={d}
                  href={`/work?discipline=${encodeURIComponent(d)}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-role-heading)',
                    fontSize: '0.8125rem',
                    color: 'var(--ivory)',
                    background: `${disciplineColors[d]}12`,
                    border: `1px solid ${disciplineColors[d]}40`,
                    borderRadius: 30,
                    padding: '0.5rem 1rem',
                    textDecoration: 'none',
                    transition: 'transform 0.15s',
                  }}
                >
                  <DisciplineIcon discipline={d} size={16} color={disciplineColors[d]} />
                  {d}
                  <span style={{ opacity: 0.4, fontSize: '0.7rem' }}>عرض المزيد ←</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonial ── */}
      {c.testimonial && (
        <section style={{ padding: '6rem 2rem', background: `linear-gradient(135deg, var(--ink), ${c.sectorColor}20)`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.03, pointerEvents: 'none' }}>
            <LogoMark size={600} mode="static" />
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
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: `${c.sectorColor}60`, border: '2px solid rgba(76,99,199,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      )}

      {/* ── Next case ── */}
      {nextCase && (
        <section style={{ padding: '4rem 2rem', background: 'var(--navy-2)', borderTop: '1px solid rgba(76,99,199,0.08)' }}>
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
