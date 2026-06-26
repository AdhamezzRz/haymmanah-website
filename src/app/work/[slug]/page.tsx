import { notFound } from 'next/navigation'
import { work, getCase } from '@/lib/work'
import { KhatamStar } from '@/components/signature/KhatamStar'
import { Reveal } from '@/components/ui/Reveal'
import { ArabicCounter } from '@/components/ui/ArabicCounter'
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
  return { title: `${c.client} — هيمنة`, description: c.tagline }
}

function parseArabicNumber(val: string): number {
  const cleaned = val.replace(/[٪٪+×,%]/g, '').replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
  return parseInt(cleaned) || 0
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getCase(slug)
  if (!c) notFound()

  const nextCase = getCase(c.nextSlug)

  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>

      {/* Cover */}
      <section style={{ minHeight: '70vh', padding: '10rem 2rem 5rem', background: 'var(--ink)', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `${c.sectorColor}20` }} />
        <div style={{ position: 'absolute', insetInlineEnd: '-6rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.06, pointerEvents: 'none' }}>
          <KhatamStar size={700} mode="spin" />
        </div>

        <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 2, width: '100%' }}>
          <Reveal>
            <Link href="/work" style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              ← أعمالنا
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <span style={{ display: 'inline-block', marginTop: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', border: '1px solid rgba(201,161,74,0.3)', padding: '0.25rem 0.75rem', borderRadius: 3 }}>
              {c.sector} · {c.year}
            </span>
          </Reveal>
          <Reveal delay={200}>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)', lineHeight: 1, marginBottom: '1rem' }}>{c.client}</h1>
          </Reveal>
          <Reveal delay={300}>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--muted)' }}>{c.tagline}</p>
          </Reveal>
        </div>
      </section>

      {/* Challenge */}
      <section style={{ padding: '6rem 2rem', background: 'var(--navy-2)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>التحدي</p>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--ivory)', lineHeight: 2, maxWidth: '65ch' }}>{c.challenge}</p>
          </Reveal>
        </div>
      </section>

      {/* Strategy */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gap: '4rem', gridTemplateColumns: '1fr auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>الاستراتيجية</p>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--ivory)', lineHeight: 2, maxWidth: '65ch' }}>{c.strategy}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {c.deliverables.map(d => (
                <li key={d} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0 }}>◆</span>{d}
                </li>
              ))}
            </ul>
          </Reveal>
          <div style={{ opacity: 0.08, pointerEvents: 'none' }}>
            <KhatamStar size={180} mode="static" />
          </div>
        </div>
      </section>

      {/* Results */}
      <section style={{ padding: '6rem 2rem', background: 'var(--ink)', textAlign: 'center' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4rem' }}>النتائج</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
            {c.results.map((r, i) => (
              <Reveal key={r.label} delay={i * 100}>
                <div>
                  <div className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', lineHeight: 1 }}>
                    {r.value}
                  </div>
                  <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', marginTop: '0.75rem' }}>{r.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ padding: '6rem 2rem', background: 'var(--navy-2)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
              <KhatamStar size={60} mode="draw" />
            </div>
            <blockquote style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', lineHeight: 1.6, marginBottom: '2rem', fontStyle: 'normal' }}>
              «{c.testimonial.quote}»
            </blockquote>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-small)', color: 'var(--gold)' }}>{c.testimonial.author}</p>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>{c.testimonial.role}</p>
          </Reveal>
        </div>
      </section>

      {/* Next case */}
      {nextCase && (
        <section style={{ padding: '5rem 2rem', background: 'var(--ink)', textAlign: 'center' }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>القضية التالية</p>
            <Link href={`/work/${nextCase.slug}`} style={{ textDecoration: 'none', display: 'inline-block' }}>
              <h2 className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h2)', marginBottom: '0.5rem' }}>{nextCase.client}</h2>
              <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)' }}>{nextCase.tagline} →</p>
            </Link>
          </Reveal>
        </section>
      )}
    </div>
  )
}
