import { services } from '@/lib/services'
import { KhatamStar } from '@/components/signature/KhatamStar'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'الخدمات — ترسانة الهيمنة' }

export default function ServicesPage() {
  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ padding: '10rem 2rem 5rem', textAlign: 'center', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.05, pointerEvents: 'none' }}>
          <KhatamStar size={600} mode="spin" />
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              ترسانة الهيمنة
            </p>
          </Reveal>
          <Reveal delay={150}>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)', marginBottom: '1.5rem' }}>
              ست كفاءات. نتيجة واحدة.
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              كل خدمة نقدمها مُصممة لتحقيق هدف تجاري محدد في السوق السعودي.
              لا نبيع ساعات — نبيع نتائج.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services grid */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80}>
              <Link
                href={`/services/${s.slug}`}
                style={{
                  display: 'block',
                  background: 'var(--navy-2)',
                  border: '1px solid rgba(201,161,74,0.1)',
                  borderRadius: 8,
                  padding: '2.5rem',
                  textDecoration: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', insetInlineEnd: '-1.5rem', bottom: '-1.5rem', opacity: 0.04, pointerEvents: 'none' }}>
                  <KhatamStar size={180} mode="static" />
                </div>
                <div style={{ width: 48, height: 48, background: 'rgba(201,161,74,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon} />
                  </svg>
                </div>
                <h2 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '0.75rem' }}>{s.name}</h2>
                <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--gold)', marginBottom: '1rem', fontStyle: 'italic' }}>{s.promise}</p>
                <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {s.problem.slice(0, 110)}…
                </p>
                <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.8125rem', color: 'var(--gold)' }}>اعرف المزيد ←</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ padding: '5rem 2rem', textAlign: 'center', background: 'var(--ink)' }}>
        <Reveal>
          <SectionHeading gold className="items-center">لا تعرف من أين تبدأ؟</SectionHeading>
          <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-role-body)', maxWidth: 400, margin: '1.5rem auto 2rem', lineHeight: 1.7 }}>
            في استشارة واحدة نُحدد الخدمة الأنسب لمرحلتك ونضع خطة عمل واضحة.
          </p>
          <Button href="/contact" variant="primary" size="lg">احجز استشارة مجانية</Button>
        </Reveal>
      </section>
    </div>
  )
}
