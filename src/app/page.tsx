import { Constellation } from '@/components/signature/Constellation'
import { KhatamStar } from '@/components/signature/KhatamStar'
import { CapabilityBars } from '@/components/signature/CapabilityBars'
import { Marquee } from '@/components/signature/Marquee'
import { GlowCard } from '@/components/signature/GlowCard'
import { ParallaxSection } from '@/components/signature/ParallaxSection'
import { ClipReveal } from '@/components/signature/ClipReveal'
import { Reveal } from '@/components/ui/Reveal'
import { ArabicCounter } from '@/components/ui/ArabicCounter'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { JsonLd } from '@/components/seo/JsonLd'
import { faqSchema, BASE_URL } from '@/lib/schema'
import { work } from '@/lib/work'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'هيمنة | وكالة تسويق رقمي في الرياض — إعلانات الأداء، SEO، هوية بصرية',
  description: 'هيمنة للخدمات التسويقية — وكالة تسويق رقمي في الرياض، السعودية. متخصصون في إعلانات الأداء على ميتا وجوجل، تحسين محركات البحث، بناء الهوية البصرية، وإدارة المنصات. نَصنع الهيمنة، لا نُطاردها.',
  alternates: { canonical: BASE_URL },
}

const homeFaqs = [
  { q: 'ما هي هيمنة للخدمات التسويقية؟', a: 'هيمنة وكالة تسويق رقمي سعودية مقرها الرياض، متخصصة في إعلانات الأداء على ميتا وجوجل، بناء الهوية البصرية، تحسين محركات البحث (SEO)، إنتاج المحتوى، وإدارة منصات التواصل الاجتماعي.' },
  { q: 'أين تقع هيمنة؟', a: 'يقع مقر هيمنة في حي المربع، الرياض، المملكة العربية السعودية. رقم السجل التجاري: 1010612147.' },
  { q: 'ما خدمات هيمنة التسويقية؟', a: 'تشمل خدمات هيمنة: إعلانات الأداء الرقمية (ميتا، جوجل، تيك توك)، بناء الهوية البصرية، إنتاج المحتوى، تحسين محركات البحث SEO، إدارة منصات التواصل الاجتماعي، والاستراتيجية التسويقية.' },
  { q: 'هل تقدم هيمنة استشارة مجانية؟', a: 'نعم. هيمنة تقدم استشارة تسويقية مجانية مدتها ٣٠ دقيقة. يمكن الحجز عبر صفحة التواصل أو الاتصال على +966 57 059 1088.' },
]

const disciplines = [
  'إعلانات الأداء', 'الهوية البصرية', 'إنتاج المحتوى',
  'تحسين محركات البحث', 'إدارة المنصات', 'الاستراتيجية التسويقية',
]

const stats = [
  { value: 120, suffix: '+', label: 'مشروع منجز' },
  { value: 480, suffix: '+', label: 'حملة مُدارة' },
  { value: 12,  suffix: '',  label: 'قطاع نخدمه' },
  { value: 340, suffix: '٪', label: 'متوسط نمو العملاء' },
]

const process = [
  { n: '١', title: 'التشخيص', body: 'نقرأ السوق ونكشف الفرص قبل أن نُنفق ريالاً.' },
  { n: '٢', title: 'الاستراتيجية', body: 'نبني خارطة طريق تربط كل قرار بالنتيجة التجارية.' },
  { n: '٣', title: 'التنفيذ', body: 'نُنفّذ بدقة عسكرية وسرعة تجارية.' },
  { n: '٤', title: 'النمو', body: 'نُحلّل، نُطوّر، ونُعيد الكرة حتى تتضاعف النتائج.' },
]

const testimonials = [
  { quote: 'في ٦ أشهر تضاعفت مبيعاتنا الرقمية ٥ مرات. أفضل استثمار تسويقي عملناه.', author: 'محمد الشهري', company: 'أوتو ماسك' },
  { quote: 'هيمنة لم تبِع لنا إعلانات — بنوا لنا ماكينة نمو حقيقية.', author: 'فهد العتيبي', company: 'زاد الخليج' },
  { quote: 'الافتتاح تجاوز كل توقعاتنا. بنوا لنا جمهوراً قبل أن نفتح الأبواب.', author: 'عبدالله الغامدي', company: 'ويست أفينيو مول' },
]

const featuredWork = work.slice(0, 3)

export default function Home() {
  return (
    <div style={{ background: 'var(--navy)', color: 'var(--ivory)', overflow: 'hidden' }}>
      <JsonLd data={faqSchema(homeFaqs)} />

      {/* ── HERO ── */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '8rem 2rem 4rem',
          overflow: 'hidden',
        }}
      >
        {/* Canvas constellation behind */}
        <Constellation style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

        {/* Ambient khatam — parallax float */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.07, pointerEvents: 'none' }}>
          <ParallaxSection speed={0.2} style={{ display: 'flex' }}>
            <div className="float-ambient">
              <KhatamStar size={640} mode="spin" stroke="var(--gold)" />
            </div>
          </ParallaxSection>
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: 900 }}>
          <ClipReveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              السيادة الرقمية — الرياض
            </p>
          </ClipReveal>

          <ClipReveal delay={300}>
            <h1
              className="text-gold-grad heading-glow"
              style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-display)', lineHeight: 0.95, letterSpacing: '-0.02em' }}
            >
              هيمنة
            </h1>
          </ClipReveal>

          <ClipReveal delay={600}>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: 'var(--muted)', maxWidth: 600 }}>
              نَصنع الهيمنة، لا نُطاردها
            </p>
          </ClipReveal>

          <Reveal delay={450}>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'rgba(32,26,18,0.62)', maxWidth: 520, lineHeight: 1.7 }}>
              وكالة تسويقية سعودية تبني منظومات نمو حقيقية للعلامات الطموحة.
              لا إعلانات فارغة، لا نتائج مزيفة.
            </p>
          </Reveal>

          <Reveal delay={600}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
              <Button href="/contact" variant="primary" size="lg">احجز استشارتك</Button>
              <Button href="/work" variant="outline" size="lg">شاهد أعمالنا</Button>
            </div>
          </Reveal>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.4 }}>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
          <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: '0.625rem', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>تمرير</p>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop: '1px solid rgba(201,161,74,0.15)', borderBottom: '1px solid rgba(201,161,74,0.15)', padding: '1.25rem 0', background: 'var(--ink)' }}>
        <Marquee items={disciplines} />
      </div>

      {/* ── STAT BAND ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--navy-2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4rem' }}>
              الأرقام تتحدث
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div>
                  <div style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', lineHeight: 1 }}>
                    <ArabicCounter value={s.value} suffix={s.suffix} style={{ color: 'var(--gold)' }} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', marginTop: '0.5rem' }}>{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORK TEASER ── */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <SectionHeading eyebrow="أعمالنا" sub="نتائج حقيقية، عملاء حقيقيون." className="mb-12">
              قضايا الهيمنة
            </SectionHeading>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
            {featuredWork.map((c, i) => (
              <Reveal key={c.slug} delay={i * 120}>
                <Link href={`/work/${c.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <GlowCard style={{ background: 'var(--navy-2)', padding: '2rem' }}>
                    <div style={{ position: 'absolute', insetInlineEnd: '-1rem', bottom: '-1rem', opacity: 0.04, pointerEvents: 'none' }}>
                      <KhatamStar size={160} mode="static" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.1em', padding: '0.25rem 0.75rem', border: '1px solid rgba(201,161,74,0.3)', borderRadius: 3, textTransform: 'uppercase' }}>
                        {c.sector}
                      </span>
                      <span style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>{c.year}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '0.5rem' }}>{c.client}</h3>
                    <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', marginBottom: '1.5rem' }}>{c.tagline}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h2)' }}>{c.results[0].value}</span>
                      <span style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)' }}>{c.results[0].label}</span>
                    </div>
                  </GlowCard>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Button href="/work" variant="outline">عرض جميع الأعمال</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CAPABILITY BARS ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--ink)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <Reveal>
            <SectionHeading eyebrow="كفاءاتنا" gold>
              نفوق في كل ما نلمسه
            </SectionHeading>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--muted)', lineHeight: 1.8, marginTop: '1.5rem', maxWidth: '45ch' }}>
              لا نبيع خدمات، نبني كفاءات. كل قدرة نطورها تُضاف إلى منظومة متكاملة تخدم هدفك التجاري.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <CapabilityBars />
          </Reveal>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--navy-2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <SectionHeading eyebrow="منهجيتنا" className="mb-16" sub="أربع خطوات تحوّل الفكرة إلى هيمنة.">
              كيف نعمل
            </SectionHeading>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            {process.map((p, i) => (
              <Reveal key={p.n} delay={i * 100}>
                <div style={{ padding: '2rem', borderTop: '2px solid rgba(201,161,74,0.3)' }}>
                  <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: '3rem', lineHeight: 1, marginBottom: '1rem' }}>{p.n}</p>
                  <h3 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--ivory)', marginBottom: '0.75rem' }}>{p.title}</h3>
                  <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: 'var(--muted)', lineHeight: 1.7 }}>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Button href="/approach" variant="ghost">اكتشف المنهجية الكاملة ←</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <SectionHeading eyebrow="يقول عملاؤنا" className="mb-12">
              الثقة لا تُطلب، تُكسب
            </SectionHeading>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 120}>
                <div style={{ padding: '2rem', background: 'var(--navy-2)', borderRadius: 8, border: '1px solid rgba(201,161,74,0.1)', position: 'relative' }}>
                  <p style={{ fontFamily: 'var(--font-role-display)', fontSize: '3rem', color: 'var(--gold)', lineHeight: 0.5, marginBottom: '1rem', opacity: 0.4 }}>"</p>
                  <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', color: 'var(--ivory)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    {t.quote}
                  </p>
                  <div>
                    <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-small)', color: 'var(--gold)' }}>{t.author}</p>
                    <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>{t.company}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ padding: '8rem 2rem', background: 'var(--ink)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Twin stars */}
        <div style={{ position: 'absolute', top: '50%', insetInlineStart: '5%', transform: 'translateY(-50%)', opacity: 0.06, pointerEvents: 'none' }}>
          <KhatamStar size={300} mode="spin" />
        </div>
        <div style={{ position: 'absolute', top: '50%', insetInlineEnd: '5%', transform: 'translateY(-50%)', opacity: 0.06, pointerEvents: 'none' }}>
          <KhatamStar size={300} mode="spin" stroke="var(--gold-bright)" />
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              جاهز للهيمنة؟
            </p>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              ابدأ مشروعك معنا
            </h2>
          </Reveal>
          <Reveal delay={300}>
            <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              استشارة مجانية ٣٠ دقيقة — نشخّص وضعك ونضع خارطة طريق واضحة. بلا التزام.
            </p>
          </Reveal>
          <Reveal delay={450}>
            <Button href="/contact" variant="primary" size="lg">احجز استشارتك المجانية</Button>
          </Reveal>
        </div>
      </section>

    </div>
  )
}
