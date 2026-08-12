import { Reveal } from '@/components/ui/Reveal'

interface Section {
  title: string
  body: string[]
}

export function LegalPage({
  eyebrow, title, updated, intro, sections,
}: {
  eyebrow: string
  title: string
  updated: string
  intro: string
  sections: Section[]
}) {
  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>
      <section style={{ padding: '10rem 2rem 4rem', background: 'var(--ink)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              {eyebrow}
            </p>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)', lineHeight: 1.1, marginBottom: '1rem' }}>
              {title}
            </h1>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.8125rem', color: 'var(--muted)' }}>
              آخر تحديث: {updated}
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem 6rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '3rem' }}>
              {intro}
            </p>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {sections.map((s, i) => (
              <Reveal key={s.title} delay={i * 40}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-role-heading)', fontSize: '1.1875rem', color: 'var(--gold)', marginBottom: '0.875rem' }}>
                    {s.title}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {s.body.map((p, j) => (
                      <p key={j} style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', lineHeight: 1.9 }}>
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
