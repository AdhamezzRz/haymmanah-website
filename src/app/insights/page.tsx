import { insights } from '@/lib/insights'
import { KhatamStar } from '@/components/signature/KhatamStar'
import { Reveal } from '@/components/ui/Reveal'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'المقالات — هيمنة' }

export default function InsightsPage() {
  const [featured, ...rest] = insights

  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ padding: '10rem 2rem 5rem', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', insetInlineEnd: '-6rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.04, pointerEvents: 'none' }}>
          <KhatamStar size={600} mode="spin" />
        </div>
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>المعرفة سلطة</p>
          </Reveal>
          <Reveal delay={150}>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              مقالات هيمنة
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', maxWidth: '55ch', lineHeight: 1.7 }}>
              رؤى ودراسات عميقة حول التسويق الرقمي في السوق السعودي. نكتب ما نؤمن به ونُطبّقه.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Featured */}
          <Reveal>
            <Link
              href={`/insights/${featured.slug}`}
              style={{ display: 'block', background: 'var(--navy-2)', border: '1px solid rgba(201,161,74,0.15)', borderRadius: 8, padding: '3rem', textDecoration: 'none', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', insetInlineEnd: '-2rem', bottom: '-2rem', opacity: 0.04, pointerEvents: 'none' }}>
                <KhatamStar size={220} mode="static" />
              </div>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(201,161,74,0.3)', padding: '0.2rem 0.75rem', borderRadius: 3 }}>مقال مُختار</span>
                  <span style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>{featured.topic}</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h2)', color: 'var(--ivory)', marginBottom: '1rem', maxWidth: '55ch', lineHeight: 1.3 }}>{featured.title}</h2>
                <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--muted)', maxWidth: '60ch', lineHeight: 1.7, marginBottom: '1.5rem' }}>{featured.excerpt}</p>
                <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-small)', color: 'var(--gold)' }}>{featured.readingTime} دقائق قراءة ←</p>
              </div>
            </Link>
          </Reveal>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {rest.map((ins, i) => (
              <Reveal key={ins.slug} delay={i * 100}>
                <Link
                  href={`/insights/${ins.slug}`}
                  style={{ display: 'block', background: 'var(--navy-2)', border: '1px solid rgba(201,161,74,0.1)', borderRadius: 8, padding: '2rem', textDecoration: 'none' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{ins.topic}</span>
                    <span style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.7rem', color: 'var(--muted)' }}>{ins.readingTime} د</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '0.875rem', lineHeight: 1.4 }}>{ins.title}</h3>
                  <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', lineHeight: 1.7 }}>{ins.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
