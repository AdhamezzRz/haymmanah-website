import { notFound } from 'next/navigation'
import { insights, getInsight } from '@/lib/insights'
import { KhatamStar } from '@/components/signature/KhatamStar'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return insights.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ins = getInsight(slug)
  if (!ins) return {}
  return { title: `${ins.title} — هيمنة`, description: ins.excerpt }
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ins = getInsight(slug)
  if (!ins) notFound()

  const related = insights.filter(i => i.slug !== slug).slice(0, 2)

  const bodyHtml = ins.body
    .split('\n\n')
    .map(block => {
      if (block.startsWith('## ')) {
        return `<h2 style="font-family:var(--font-role-heading);font-size:var(--text-h3);color:var(--ivory);margin:2.5rem 0 1rem;line-height:1.3">${block.slice(3)}</h2>`
      }
      if (block.startsWith('**') && block.endsWith('**')) {
        return `<p style="font-family:var(--font-role-body);font-size:var(--text-body);color:var(--ivory);line-height:1.9;font-weight:600">${block.slice(2, -2)}</p>`
      }
      if (block.match(/^[١٢٣٤٥٦٧٨٩]\./)) {
        return `<p style="font-family:var(--font-role-body);font-size:var(--text-body);color:var(--muted);line-height:1.9;padding-inline-start:1rem">${block}</p>`
      }
      const processed = block.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--ivory)">$1</strong>')
      return `<p style="font-family:var(--font-role-body);font-size:var(--text-body);color:var(--muted);line-height:1.9">${processed}</p>`
    })
    .join('')

  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ padding: '10rem 2rem 5rem', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', insetInlineEnd: '-5rem', bottom: '-3rem', opacity: 0.04, pointerEvents: 'none' }}>
          <KhatamStar size={500} mode="spin" />
        </div>
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Reveal>
            <Link href="/insights" style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              ← المقالات
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <span style={{ display: 'inline-block', marginTop: '2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(201,161,74,0.25)', padding: '0.25rem 0.75rem', borderRadius: 3 }}>
              {ins.topic} · {ins.readingTime} دقائق قراءة
            </span>
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

      {/* Drop cap opener + body */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Gold drop cap on first paragraph */}
          <Reveal>
            <div
              style={{ fontFamily: 'var(--font-role-body)', lineHeight: 1.9, color: 'var(--muted)', fontSize: 'var(--text-body)' }}
              dangerouslySetInnerHTML={{ __html: bodyHtml.replace(
                '<p style="font-family:var(--font-role-body);font-size:var(--text-body);color:var(--muted);line-height:1.9">',
                '<p style="font-family:var(--font-role-body);font-size:var(--text-body);color:var(--muted);line-height:1.9"><span style=\'font-family:var(--font-role-display);font-size:4rem;line-height:0.85;float:right;margin-left:0.25em;margin-bottom:0.1em;color:var(--gold);\'>' + ins.body[0] + '</span>' + ins.body.split('\n\n')[0].slice(1) + '</p>'
              )}}
            />
          </Reveal>
        </div>
      </section>

      {/* Divider + khatam */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', opacity: 0.3 }}>
        <KhatamStar size={48} mode="static" />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: '5rem 2rem', background: 'var(--navy-2)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
              مقالات ذات صلة
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {related.map(r => (
                <Link key={r.slug} href={`/insights/${r.slug}`} style={{ display: 'block', padding: '1.5rem', background: 'var(--navy)', borderRadius: 6, border: '1px solid rgba(201,161,74,0.1)', textDecoration: 'none' }}>
                  <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{r.topic}</p>
                  <h3 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--ivory)' }}>{r.title}</h3>
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
          <Button href="/contact" variant="primary">احجز استشارة</Button>
        </Reveal>
      </section>
    </div>
  )
}
