'use client'

import { useState } from 'react'
import { work, sectors } from '@/lib/work'
import type { Sector } from '@/lib/work'
import { KhatamStar } from '@/components/signature/KhatamStar'
import { Reveal } from '@/components/ui/Reveal'
import Link from 'next/link'

export default function WorkPage() {
  const [active, setActive] = useState<Sector | 'الكل'>('الكل')
  const filtered = active === 'الكل' ? work : work.filter(c => c.sector === active)

  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ padding: '10rem 2rem 5rem', background: 'var(--ink)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.05, pointerEvents: 'none' }}>
          <KhatamStar size={600} mode="spin" />
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              معرض الإنجازات
            </p>
          </Reveal>
          <Reveal delay={150}>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)' }}>
              أعمالنا
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', maxWidth: 480, margin: '1.5rem auto 0', lineHeight: 1.7 }}>
              نتائج حقيقية، أرقام حقيقية، عملاء حقيقيون. هذا ما تبدو عليه الهيمنة.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter tabs */}
      <div style={{ padding: '2rem', borderBottom: '1px solid rgba(201,161,74,0.1)', background: 'var(--navy-2)', position: 'sticky', top: 72, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {(['الكل', ...sectors] as const).map(sec => (
            <button
              key={sec}
              onClick={() => setActive(sec as Sector | 'الكل')}
              style={{
                fontFamily: 'var(--font-role-heading)',
                fontSize: 'var(--text-eyebrow)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.4rem 1rem',
                borderRadius: 3,
                border: '1px solid',
                borderColor: active === sec ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                background: active === sec ? 'rgba(201,161,74,0.12)' : 'transparent',
                color: active === sec ? 'var(--gold)' : 'var(--muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section style={{ padding: '4rem 2rem 6rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <Link
                href={`/work/${c.slug}`}
                style={{
                  display: 'block',
                  background: 'var(--navy-2)',
                  border: '1px solid rgba(201,161,74,0.1)',
                  borderRadius: 8,
                  padding: '2.5rem',
                  textDecoration: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s',
                }}
              >
                {/* Sector color tint */}
                <div style={{ position: 'absolute', inset: 0, background: `${c.sectorColor}18`, pointerEvents: 'none' }} />

                {/* Khatam */}
                <div style={{ position: 'absolute', insetInlineEnd: '-2rem', bottom: '-2rem', opacity: 0.05, pointerEvents: 'none' }}>
                  <KhatamStar size={200} mode="static" />
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.25rem 0.75rem', border: '1px solid rgba(201,161,74,0.25)', borderRadius: 3 }}>
                      {c.sector}
                    </span>
                    <span style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>{c.year}</span>
                  </div>

                  <h2 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '0.5rem' }}>{c.client}</h2>
                  <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', marginBottom: '2rem' }}>{c.tagline}</p>

                  {/* Results preview */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {c.results.slice(0, 2).map(r => (
                      <div key={r.label}>
                        <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h3)', lineHeight: 1 }}>{r.value}</p>
                        <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{r.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
