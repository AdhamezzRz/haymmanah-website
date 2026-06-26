import { KhatamStar } from '@/components/signature/KhatamStar'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, BASE_URL } from '@/lib/schema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'من نحن — هيمنة للخدمات التسويقية، الرياض',
  description: 'هيمنة وكالة تسويق رقمي سعودية تأسست في الرياض. متخصصون في إعلانات الأداء، الهوية البصرية، SEO، وإدارة المنصات. السجل التجاري: 1010612147.',
  alternates: { canonical: `${BASE_URL}/about` },
}

const values = [
  { n: '١', title: 'الصدق أولاً', body: 'نقول ما نُعتقد، لا ما يُرضي. إذا كانت استراتيجيتك خاطئة، سنقولها قبل أن نأخذ ريالاً.' },
  { n: '٢', title: 'النتائج أم لا شيء', body: 'لا نتفاخر بعدد الساعات ولا بجمال التقارير. الإثبات الوحيد هو الرقم في حسابك.' },
  { n: '٣', title: 'السوق السعودي عمقنا', body: 'لا ننسخ نماذج غربية ونُعيد تسميتها بالعربي. نبني استراتيجيات مصممة للمستهلك السعودي تحديداً.' },
  { n: '٤', title: 'الشراكة لا الاستشارة', body: 'نعمل كامتداد لفريقك، لا كمورد خارجي. نجاحك نجاحنا — هذا ليس شعاراً، هذا هو نموذج عملنا.' },
]

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>
      <JsonLd data={breadcrumbSchema([{ name: 'الرئيسية', url: BASE_URL }, { name: 'من نحن', url: `${BASE_URL}/about` }])} />

      {/* Hero */}
      <section style={{ padding: '10rem 2rem 6rem', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', insetInlineStart: '-8rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.04, pointerEvents: 'none' }}>
          <KhatamStar size={700} mode="spin" />
        </div>
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>من نحن</p>
          </Reveal>
          <Reveal delay={150}>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)', lineHeight: 1.1, marginBottom: '2rem' }}>
              وكالة بُنيت على<br />
              <span className="text-gold-grad">رفض المتوسط</span>
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--muted)', lineHeight: 1.9, maxWidth: '60ch' }}>
              هيمنة تأسست عام ٢٠١٦ في الرياض بفكرة واحدة: أن العلامات التجارية السعودية تستحق
              تسويقاً يُضاهي المستوى العالمي، مُصمماً لجمهورها المحلي تحديداً.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Manifesto */}
      <section style={{ padding: '6rem 2rem', background: 'var(--navy-2)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>العقيدة</p>
          </Reveal>
          <Reveal delay={100}>
            <p style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', lineHeight: 1.7, marginBottom: '2rem' }}>
              الهيمنة لا تُطلب، تُفرض.
            </p>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              'نرفض أن يكون التسويق مجرد ضجيج. كل ريال تُنفقه يجب أن يخدم هدفاً واضحاً.',
              'نرفض النماذج المستوردة الجاهزة. السوق السعودي له خصوصية، وفهم هذه الخصوصية هو ميزتنا الحقيقية.',
              'نرفض العلاقات الاستشارية الباردة. نعمل كجزء من فريقك، نحتفل بانتصاراتك ونتعلم من إخفاقاتك.',
              'نرفض الحلول المؤقتة. نبني منظومات تنمو معك، لا حملات تنتهي عند انتهاء الميزانية.',
            ].map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--muted)', lineHeight: 1.8, paddingInlineStart: '1.5rem', borderInlineStart: '2px solid rgba(201,161,74,0.3)' }}>
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Est + star */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <KhatamStar size={120} mode="draw" stroke="var(--gold)" />
          </div>
          <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            EST. ٢٠١٦ · الرياض، المملكة العربية السعودية
          </p>
        </Reveal>
      </section>

      {/* Values */}
      <section style={{ padding: '6rem 2rem', background: 'var(--ink)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <SectionHeading eyebrow="القيم" className="mb-12">
              أربعة مبادئ تحكم كل قرار
            </SectionHeading>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            {values.map((v, i) => (
              <Reveal key={v.n} delay={i * 100}>
                <div style={{ padding: '2rem', borderTop: '2px solid rgba(201,161,74,0.3)' }}>
                  <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: '3rem', lineHeight: 1, marginBottom: '1rem' }}>{v.n}</p>
                  <h3 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '0.75rem' }}>{v.title}</h3>
                  <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', lineHeight: 1.7 }}>{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Exit pull */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <Reveal>
          <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', marginBottom: '2rem' }}>تريد أن تعرف كيف نعمل فعلاً؟</p>
          <Button href="/approach" variant="primary" size="lg">اكتشف المنهجية</Button>
        </Reveal>
      </section>
    </div>
  )
}
