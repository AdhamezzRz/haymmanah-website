import { notFound } from 'next/navigation'
import { insights, getInsight, getRelatedInsights } from '@/lib/insights'
import { KhatamStar } from '@/components/signature/KhatamStar'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { JsonLd } from '@/components/seo/JsonLd'
import { blogPostingSchema, breadcrumbSchema, faqSchema, BASE_URL } from '@/lib/schema'
import Link from 'next/link'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return insights.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ins = getInsight(slug)
  if (!ins) return {}
  const url = `${BASE_URL}/insights/${ins.slug}`
  return {
    title: ins.title,
    description: ins.excerpt,
    keywords: ins.keywords,
    authors: [{ name: 'هيمنة للخدمات التسويقية', url: BASE_URL }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: ins.title,
      description: ins.excerpt,
      publishedTime: ins.date,
      modifiedTime: ins.date,
      section: ins.topic,
      tags: ins.keywords,
      images: [{ url: `${BASE_URL}/logo.png`, width: 280, height: 153, alt: ins.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ins.title,
      description: ins.excerpt,
      images: [`${BASE_URL}/logo.png`],
    },
  }
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ins = getInsight(slug)
  if (!ins) notFound()

  const related = getRelatedInsights(slug, ins.topic, 3)

  const bodyHtml = ins.body
    .split('\n\n')
    .map(block => {
      if (block.startsWith('## ')) {
        return `<h2 style="font-family:var(--font-role-heading);font-size:var(--text-h3);color:var(--ivory);margin:2.5rem 0 1rem;line-height:1.3">${block.slice(3)}</h2>`
      }
      if (block.match(/^[١٢٣٤٥٦٧٨٩]\d?\./)) {
        const processed = block.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--ivory)">$1</strong>')
        return `<p style="font-family:var(--font-role-body);font-size:var(--text-body);color:var(--muted);line-height:1.9;padding-inline-start:1rem">${processed}</p>`
      }
      const processed = block.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--ivory)">$1</strong>')
      return `<p style="font-family:var(--font-role-body);font-size:var(--text-body);color:var(--muted);line-height:1.9">${processed}</p>`
    })
    .join('')

  const schemas = [
    blogPostingSchema(ins),
    breadcrumbSchema([
      { name: 'الرئيسية', url: BASE_URL },
      { name: 'المقالات', url: `${BASE_URL}/insights` },
      { name: ins.title, url: `${BASE_URL}/insights/${ins.slug}` },
    ]),
    ...(ins.faqs ? [faqSchema(ins.faqs)] : []),
  ]

  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>
      {schemas.map((s, i) => <JsonLd key={i} data={s} />)}

      {/* Hero */}
      <section style={{ padding: '10rem 2rem 5rem', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', insetInlineEnd: '-5rem', bottom: '-3rem', opacity: 0.04, pointerEvents: 'none' }}>
          <KhatamStar size={500} mode="spin" />
        </div>
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Reveal>
            <nav aria-label="مسار التنقل" style={{ marginBottom: '2rem' }}>
              <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                <li><Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontFamily: 'var(--font-role-heading)', fontSize: '0.8125rem' }}>الرئيسية</Link></li>
                <li style={{ color: 'rgba(138,147,191,0.4)', fontSize: '0.75rem' }}>/</li>
                <li><Link href="/insights" style={{ color: 'var(--gold)', textDecoration: 'none', fontFamily: 'var(--font-role-heading)', fontSize: '0.8125rem' }}>المقالات</Link></li>
                <li style={{ color: 'rgba(138,147,191,0.4)', fontSize: '0.75rem' }}>/</li>
                <li style={{ color: 'var(--muted)', fontFamily: 'var(--font-role-heading)', fontSize: '0.8125rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ins.topic}</li>
              </ol>
            </nav>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(201,161,74,0.25)', padding: '0.25rem 0.75rem', borderRadius: 3 }}>
                {ins.topic}
              </span>
              <span style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                {ins.readingTime} دقائق قراءة · {ins.wordCount.toLocaleString('ar-SA')} كلمة
              </span>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h1 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h2)', color: 'var(--ivory)', lineHeight: 1.3, marginBottom: '1.5rem' }}>
              {ins.title}
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--muted)', lineHeight: 1.7 }}>
              {ins.excerpt}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Article body */}
      <article
        itemScope
        itemType="https://schema.org/BlogPosting"
        style={{ padding: '5rem 2rem' }}
      >
        <meta itemProp="headline" content={ins.title} />
        <meta itemProp="description" content={ins.excerpt} />
        <meta itemProp="datePublished" content={ins.date} />
        <meta itemProp="inLanguage" content="ar-SA" />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Reveal>
            <div
              style={{ fontFamily: 'var(--font-role-body)', lineHeight: 1.9, color: 'var(--muted)', fontSize: 'var(--text-body)' }}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </Reveal>
        </div>
      </article>

      {/* FAQ section */}
      {ins.faqs && ins.faqs.length > 0 && (
        <section style={{ padding: '3rem 2rem 5rem', background: 'var(--navy-2)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <Reveal>
              <h2 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '2rem' }}>
                أسئلة شائعة
              </h2>
            </Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {ins.faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div style={{ borderBottom: '1px solid rgba(201,161,74,0.1)', paddingBottom: '1.5rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-role-heading)', fontSize: '1.0625rem', color: 'var(--gold)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                      {faq.q}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--muted)', lineHeight: 1.8 }}>
                      {faq.a}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', opacity: 0.3 }}>
        <KhatamStar size={48} mode="static" />
      </div>

      {/* Keywords tag cloud */}
      <section style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {ins.keywords.map(k => (
            <span key={k} style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)', border: '1px solid rgba(138,147,191,0.15)', borderRadius: 3, padding: '0.2rem 0.6rem' }}>
              {k}
            </span>
          ))}
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section style={{ padding: '4rem 2rem 5rem', background: 'var(--navy-2)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
              مقالات ذات صلة
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {related.map(r => (
                <Link key={r.slug} href={`/insights/${r.slug}`} style={{ display: 'block', padding: '1.5rem', background: 'var(--navy)', borderRadius: 6, border: '1px solid rgba(201,161,74,0.1)', textDecoration: 'none', transition: 'border-color 0.2s' }}>
                  <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{r.topic}</p>
                  <h3 style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.9375rem', color: 'var(--ivory)', lineHeight: 1.4 }}>{r.title}</h3>
                  <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.5rem' }}>{r.readingTime} دقائق</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <Reveal>
          <p style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '1.5rem' }}>
            جاهز لتطبيق هذا على مشروعك؟
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="/contact" variant="primary">احجز استشارة مجانية</Button>
            <Button href="/insights" variant="ghost">قراءة المزيد</Button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
