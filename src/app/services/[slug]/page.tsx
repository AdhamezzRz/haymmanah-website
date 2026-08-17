import { notFound } from 'next/navigation'
import { services, getService } from '@/lib/services'
import { work } from '@/lib/work'
import { LogoMark } from '@/components/signature/LogoMark'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { JsonLd } from '@/components/seo/JsonLd'
import { serviceSchema, breadcrumbSchema, BASE_URL } from '@/lib/schema'
import Link from 'next/link'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const s = getService(slug)
  if (!s) return {}
  const url = `${BASE_URL}/services/${s.slug}`
  return {
    title: `${s.name} في السعودية — هيمنة للتسويق الرقمي`,
    description: `${s.promise} — هيمنة للخدمات التسويقية، الرياض، المملكة العربية السعودية.`,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', url,
      title: `${s.name} — هيمنة`,
      description: s.promise,
      images: [{ url: `${BASE_URL}/logo.png`, alt: s.name }],
    },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = getService(slug)
  if (!s) notFound()

  const related = work.filter(c => s.relatedCaseSlugs.includes(c.slug))

  const schemas = [
    serviceSchema(s),
    breadcrumbSchema([
      { name: 'الرئيسية', url: BASE_URL },
      { name: 'الخدمات', url: `${BASE_URL}/services` },
      { name: s.name, url: `${BASE_URL}/services/${s.slug}` },
    ]),
  ]

  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>
      {schemas.map((sc, i) => <JsonLd key={i} data={sc} />)}

      {/* Hero */}
      <section style={{ padding: '10rem 2rem 6rem', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', insetInlineEnd: '-4rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.05, pointerEvents: 'none' }}>
          <LogoMark size={500} mode="spin" />
        </div>
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Reveal>
            <Link href="/services" style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textDecoration: 'none', textTransform: 'uppercase' }}>
              ← الخدمات
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)', margin: '1.5rem 0 1rem', lineHeight: 1.1 }}>
              {s.name}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', marginBottom: '2rem' }}>
              {s.promise}
            </p>
          </Reveal>
          <Reveal delay={300}>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '65ch' }}>
              {s.problem}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Methodology */}
      <section style={{ padding: '6rem 2rem', background: 'var(--navy-2)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Reveal>
            <SectionHeading eyebrow="المنهجية" className="mb-12">كيف ننجزها</SectionHeading>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '3rem' }}>
            {s.methodology.map((m, i) => (
              <Reveal key={m.phase} delay={i * 100}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'flex-start', paddingBottom: '2rem', borderBottom: '1px solid rgba(var(--ivory-rgb),0.08)' }}>
                  <span className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: '3rem', lineHeight: 1, minWidth: 60, textAlign: 'center' }}>{m.phase}</span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '0.5rem' }}>{m.title}</h3>
                    <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--muted)', lineHeight: 1.7 }}>{m.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Reveal>
            <SectionHeading eyebrow="المخرجات" className="mb-8">ماذا تحصل؟</SectionHeading>
          </Reveal>
          <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {s.deliverables.map((d, i) => (
              <Reveal key={i} delay={i * 80}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', background: 'var(--navy-2)', borderRadius: 6, border: '1px solid rgba(76,99,199,0.1)' }}>
                  <span style={{ color: 'var(--gold)', fontSize: '1.25rem', flexShrink: 0 }}>◆</span>
                  <span style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--ivory)' }}>{d}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Related case studies */}
      {related.length > 0 && (
        <section style={{ padding: '6rem 2rem', background: 'var(--ink)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <Reveal>
              <SectionHeading eyebrow="أعمال ذات صلة" className="mb-8">نتائج حقيقية بهذه الخدمة</SectionHeading>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              {related.map((c, i) => (
                <Reveal key={c.slug} delay={i * 100}>
                  <Link href={`/work/${c.slug}`} style={{ display: 'block', padding: '2rem', background: 'var(--navy-2)', borderRadius: 8, border: '1px solid rgba(76,99,199,0.1)', textDecoration: 'none' }}>
                    <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c.sector}</p>
                    <h3 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '0.5rem' }}>{c.client}</h3>
                    <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)' }}>{c.tagline}</p>
                    {c.results && c.results[0] && (
                      <>
                        <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h2)', marginTop: '1rem' }}>{c.results[0].value}</p>
                        <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>{c.results[0].label}</p>
                      </>
                    )}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <Reveal>
          <h2 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h2)', color: 'var(--ivory)', marginBottom: '1.5rem' }}>جاهز للبدء؟</h2>
          <Button href={`/contact?service=${s.slug}`} variant="primary" size="lg">اطلب {s.name}</Button>
        </Reveal>
      </section>
    </div>
  )
}
