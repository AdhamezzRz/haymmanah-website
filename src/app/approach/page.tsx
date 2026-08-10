import { LogoMark } from '@/components/signature/LogoMark'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'منهجيتنا — هيمنة' }

const phases = [
  {
    n: '١',
    title: 'التشخيص',
    subtitle: 'Diagnose',
    philosophy: 'لا نبدأ بالحلول قبل أن نفهم المشكلة. كثير من الوكالات تبيع حلولها قبل أن تفهم وضعك. نحن نعكس هذا.',
    deliverables: [
      'تحليل وضعك الرقمي الحالي',
      'فهم جمهورك وسلوكه الشرائي',
      'تحليل المنافسين والفرص الغائبة',
      'تشخيص نقاط القوة والضعف',
    ],
  },
  {
    n: '٢',
    title: 'الاستراتيجية',
    subtitle: 'Strategize',
    philosophy: 'الاستراتيجية الجيدة تقول "لا" لأشياء كثيرة. نبني خارطة طريق واضحة تُركز مواردك على ما يُحرك الإبرة فعلاً.',
    deliverables: [
      'تحديد الهدف التجاري الرئيسي',
      'اختيار القنوات والتكتيكات المناسبة',
      'جدول تنفيذ مفصل بمؤشرات نجاح واضحة',
      'ميزانية مُوزَّعة على أساس العائد المتوقع',
    ],
  },
  {
    n: '٣',
    title: 'التنفيذ',
    subtitle: 'Execute',
    philosophy: 'التنفيذ المتقن هو ما يفرق بين الوكالات. لدينا فريق داخلي لكل تخصص — لا نُسنِد عملك لمستقلين.',
    deliverables: [
      'تنفيذ سريع بمعايير عالية',
      'تواصل أسبوعي واضح',
      'مرونة في التعديل بناءً على البيانات',
      'اختبار مستمر لتحسين الأداء',
    ],
  },
  {
    n: '٤',
    title: 'النمو',
    subtitle: 'Scale',
    philosophy: 'الهدف ليس الحملة الواحدة — الهدف بناء ماكينة نمو مستمرة. نُكرر ما ينجح، نتخلى عما لا يعمل، ونضخم الأثر.',
    deliverables: [
      'تقرير أداء شهري شامل',
      'اجتماع استراتيجي ربعي',
      'توصيات نمو مبنية على بيانات حقيقية',
      'توسيع تدريجي للقنوات الناجحة',
    ],
  },
]

export default function ApproachPage() {
  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ padding: '10rem 2rem 6rem', background: 'var(--ink)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, pointerEvents: 'none' }}>
          <LogoMark size={700} mode="spin" />
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              منهجية الهيمنة
            </p>
          </Reveal>
          <Reveal delay={150}>
            <h1 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--ivory)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              كيف نحوّل الطموح<br />
              <span className="text-gold-grad">إلى هيمنة</span>
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
              أربع مراحل. منهجية واحدة. نتيجة واضحة.
              هذا هو النظام الذي نُطبّقه على كل مشروع بلا استثناء.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Phases */}
      <div>
        {phases.map((phase, i) => (
          <section
            key={phase.n}
            style={{
              padding: '6rem 2rem',
              background: i % 2 === 0 ? 'var(--navy-2)' : 'var(--navy)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Large phase number watermark */}
            <div style={{ position: 'absolute', insetInlineEnd: '2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.03, pointerEvents: 'none', lineHeight: 1 }}>
              <span style={{ fontFamily: 'var(--font-role-display)', fontSize: '30vw', color: 'var(--gold)' }}>{phase.n}</span>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start', position: 'relative', zIndex: 2 }}>
              <Reveal>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
                    <span className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: '5rem', lineHeight: 1 }}>{phase.n}</span>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h2)', color: 'var(--ivory)', lineHeight: 1 }}>{phase.title}</h2>
                      <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-eyebrow)', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{phase.subtitle}</p>
                    </div>
                  </div>
                  <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--muted)', lineHeight: 1.8 }}>
                    {phase.philosophy}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={150}>
                <div style={{ paddingTop: '1rem' }}>
                  <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    المخرجات
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {phase.deliverables.map((d, j) => (
                      <li key={j} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--gold)', marginTop: '0.2rem', flexShrink: 0 }}>◆</span>
                        <span style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--ivory)', lineHeight: 1.6 }}>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            {/* Khatam progress indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', opacity: 0.15 }}>
              <LogoMark size={60} mode="static" style={{ transform: `rotate(${i * 45}deg)` }} />
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <section style={{ padding: '8rem 2rem', background: 'var(--ink)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, pointerEvents: 'none' }}>
          <LogoMark size={500} mode="draw" />
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <h2 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h2)', color: 'var(--ivory)', marginBottom: '1.5rem' }}>
              جاهز لتطبيق المنهجية على مشروعك؟
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', maxWidth: 420, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              ابدأ بجلسة تشخيص مجانية. في ٣٠ دقيقة نعطيك صورة واضحة وخطة عمل أولية.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <Button href="/contact" variant="primary" size="lg">ابدأ مشروعك</Button>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
