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

            {/* WhatsApp CTA */}
            <Reveal delay={400}>
              <a
                href="https://wa.me/966570591088?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D9%87%D9%8A%D9%85%D9%86%D8%A9"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginTop: '2.5rem',
                  background: 'linear-gradient(135deg, #1a9e4f, #128c7e)',
                  color: 'white',
                  fontFamily: 'var(--font-role-heading)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  padding: '0.875rem 1.75rem',
                  borderRadius: 6,
                  textDecoration: 'none',
                  boxShadow: '0 4px 24px rgba(37,211,102,0.25)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <svg viewBox="0 0 24 24" width={22} height={22} fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                تواصل عبر واتساب
              </a>
            </Reveal>

            {/* Khatam */}
            <div style={{ marginTop: '3rem', opacity: 0.15 }}>
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
