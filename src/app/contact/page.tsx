import { KhatamStar } from '@/components/signature/KhatamStar'
import { Reveal } from '@/components/ui/Reveal'
import { ContactForm } from './ContactForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'تواصل معنا — هيمنة' }

const contactDetails = [
  { label: 'هاتف', value: '+966 57 059 1088', href: 'tel:+966570591088', ltr: true },
  { label: 'بريد إلكتروني', value: 'RH-2025@outlook.sa', href: 'mailto:RH-2025@outlook.sa', ltr: true },
  { label: 'الموقع', value: 'حي المربع، الرياض', href: null, ltr: false },
  { label: 'السجل التجاري', value: '1010612147', href: null, ltr: true },
]

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams

  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>

      {/* Header */}
      <section style={{ padding: '10rem 2rem 5rem', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', insetInlineEnd: '-5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.05, pointerEvents: 'none' }}>
          <KhatamStar size={600} mode="spin" />
        </div>
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              تواصل
            </p>
          </Reveal>
          <Reveal delay={150}>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)', lineHeight: 1.1 }}>
              كل رحلة هيمنة<br />
              <span className="text-gold-grad">تبدأ بمحادثة</span>
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Two columns */}
      <section style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '5rem', alignItems: 'flex-start' }}>

          {/* Left — contact info */}
          <div>
            <Reveal>
              <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '3rem' }}>
                استشارة مجانية ٣٠ دقيقة — نشخّص وضعك ونضع خطة عمل أولية.
                لا التزام. لا ضغط.
              </p>
            </Reveal>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {contactDetails.map((d, i) => (
                <Reveal key={d.label} delay={i * 80}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                      {d.label}
                    </p>
                    {d.href ? (
                      <a href={d.href} style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--ivory)', textDecoration: 'none', direction: d.ltr ? 'ltr' : 'rtl', display: 'inline-block' }}>
                        {d.value}
                      </a>
                    ) : (
                      <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--ivory)' }}>
                        {d.value}
                      </p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Khatam */}
            <div style={{ marginTop: '4rem', opacity: 0.15 }}>
              <KhatamStar size={100} mode="static" />
            </div>
          </div>

          {/* Right — form */}
          <Reveal delay={200}>
            <div style={{ background: 'var(--navy-2)', border: '1px solid rgba(201,161,74,0.12)', borderRadius: 10, padding: '3rem' }}>
              <h2 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '2rem' }}>
                أرسل رسالتك
              </h2>
              <ContactForm preService={service} />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
