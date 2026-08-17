import { LogoMark } from '@/components/signature/LogoMark'
import { Reveal } from '@/components/ui/Reveal'
import { Calculator } from './Calculator'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, BASE_URL } from '@/lib/schema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'أداة حساب العائد المتوقع من التسويق',
  description: 'أداة تفاعلية مجانية تقدّر عدد العملاء المحتملين والإيراد الإضافي المتوقع من ميزانيتك التسويقية الشهرية في السوق السعودي.',
  alternates: { canonical: `${BASE_URL}/calculator` },
  openGraph: {
    type: 'website',
    url: `${BASE_URL}/calculator`,
    title: 'أداة حساب العائد المتوقع — هيمنة',
    description: 'قدّر عدد العملاء والإيراد المتوقع من ميزانيتك التسويقية في دقيقة واحدة.',
  },
}

export default function CalculatorPage() {
  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>
      <JsonLd data={breadcrumbSchema([{ name: 'الرئيسية', url: BASE_URL }, { name: 'أداة حساب العائد', url: `${BASE_URL}/calculator` }])} />

      <section style={{ padding: '10rem 2rem 4rem', background: 'var(--ink)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.05, pointerEvents: 'none' }}>
          <LogoMark size={560} mode="spin" />
        </div>
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              أداة مجانية
            </p>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)', lineHeight: 1.05, marginBottom: '1.25rem' }}>
              كم يمكن أن تكسب من <span className="text-gold-grad">ميزانيتك التسويقية؟</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', lineHeight: 1.8 }}>
              اختر مجالك وحرّك الميزانية — واحصل على تقدير فوري للعملاء والإيراد المتوقع.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem 6rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Reveal delay={150}>
            <div style={{ background: 'var(--navy-2)', border: '1px solid rgba(76,99,199,0.15)', borderRadius: 14, padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
              <Calculator />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
