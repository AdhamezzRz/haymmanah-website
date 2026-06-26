import { Eyebrow, SectionHeading, Button, Reveal, ArabicCounter } from '@/components/ui'

export const metadata = { title: 'Styleguide — هيمنة' }

function Token({ name, value, type }: { name: string; value: string; type?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      {type === 'color' && (
        <div style={{ width: 40, height: 40, borderRadius: 4, background: value, flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }} />
      )}
      <div>
        <code style={{ color: 'var(--gold)', fontSize: '0.875rem' }}>{name}</code>
        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', margin: 0 }}>{value}</p>
      </div>
    </div>
  )
}

export default function StyleguidePage() {
  const colors = [
    { name: '--ink',        value: '#05081a' },
    { name: '--navy',       value: '#0a1030' },
    { name: '--navy-2',     value: '#0f1741' },
    { name: '--royal',      value: '#1d2f7a' },
    { name: '--gold',       value: '#c9a14a' },
    { name: '--gold-bright',value: '#ecd08a' },
    { name: '--gold-deep',  value: '#8a6d2c' },
    { name: '--ivory',      value: '#f3ecda' },
    { name: '--muted',      value: '#8a93bf' },
  ]

  const typeScale = [
    { name: '--text-display', value: 'clamp(3rem, 8vw, 8rem)' },
    { name: '--text-h1',      value: 'clamp(2.5rem, 5vw, 5rem)' },
    { name: '--text-h2',      value: 'clamp(2rem, 4vw, 3.5rem)' },
    { name: '--text-h3',      value: 'clamp(1.5rem, 2.5vw, 2rem)' },
    { name: '--text-body',    value: 'clamp(1rem, 1.1vw, 1.15rem)' },
    { name: '--text-small',   value: '0.875rem' },
    { name: '--text-eyebrow', value: '0.75rem' },
  ]

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh', color: 'var(--ivory)', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(201,161,74,0.3)' }}>
          <h1 className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-display)', lineHeight: 1 }}>
            هيمنة
          </h1>
          <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-role-body)', marginTop: '1rem' }}>
            نظام التصميم — السيادة / Sovereign
          </p>
        </div>

        {/* Colors */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--gold)', marginBottom: '1.5rem' }}>الألوان</h2>
          {colors.map(c => <Token key={c.name} name={c.name} value={c.value} type="color" />)}
        </section>

        {/* Type scale */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--gold)', marginBottom: '1.5rem' }}>مقياس الخط</h2>
          {typeScale.map(t => <Token key={t.name} name={t.name} value={t.value} />)}
        </section>

        {/* Font roles */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--gold)', marginBottom: '1.5rem' }}>أدوار الخط</h2>
          <p style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h2)', marginBottom: '1rem' }}>Aref Ruqaa — العرض والعناوين الكبرى</p>
          <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', marginBottom: '1rem' }}>Reem Kufi — العناوين والتسميات</p>
          <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-body)', lineHeight: 1.7, color: 'var(--muted)' }}>
            Tajawal — نص الجسم والمحتوى — نَصنع الهيمنة، لا نُطاردها. نبني علامات تجارية تفرض حضورها وتسود في سوقها.
          </p>
        </section>

        {/* UI Primitives */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--gold)', marginBottom: '2rem' }}>المكونات الأساسية</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Eyebrow */}
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Eyebrow</p>
              <Eyebrow>الخدمات التسويقية</Eyebrow>
            </div>

            {/* SectionHeading */}
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>SectionHeading</p>
              <SectionHeading eyebrow="الخدمات" sub="نبني منظومة تسويقية متكاملة تفرض حضور علامتك في السوق السعودي.">
                السيادة الرقمية
              </SectionHeading>
            </div>

            {/* Gold heading */}
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>SectionHeading (gold)</p>
              <SectionHeading gold>نَصنع الهيمنة</SectionHeading>
            </div>

            {/* Buttons */}
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>Button variants</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button variant="primary">احجز استشارتك</Button>
                <Button variant="outline">شاهد أعمالنا</Button>
                <Button variant="ghost">اكتشف المزيد</Button>
                <Button variant="primary" size="sm">صغير</Button>
                <Button variant="primary" size="lg">كبير</Button>
              </div>
            </div>

            {/* Arabic counter */}
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>ArabicCounter</p>
              <div style={{ display: 'flex', gap: '3rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <ArabicCounter value={120} prefix="+" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--gold)' }} />
                  <p style={{ color: 'var(--muted)', fontSize: 'var(--text-small)' }}>مشروع منجز</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <ArabicCounter value={480} prefix="+" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--gold)' }} />
                  <p style={{ color: 'var(--muted)', fontSize: 'var(--text-small)' }}>إعلان مُدار</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <ArabicCounter value={340} suffix="٪" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h1)', color: 'var(--gold)' }} />
                  <p style={{ color: 'var(--muted)', fontSize: 'var(--text-small)' }}>نمو وسطي</p>
                </div>
              </div>
            </div>

            {/* Reveal */}
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>Reveal (scroll-triggered)</p>
              <Reveal delay={0}>
                <div style={{ padding: '1.5rem', background: 'var(--navy-2)', borderRadius: 6, border: '1px solid rgba(201,161,74,0.2)' }}>
                  <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--ivory)' }}>هذا العنصر يظهر بسلاسة عند التمرير — Reveal component</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Motion tokens */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-h3)', color: 'var(--gold)', marginBottom: '1.5rem' }}>رموز الحركة</h2>
          <Token name="--ease-sovereign" value="cubic-bezier(0.22, 1, 0.36, 1)" />
          <Token name="--dur-reveal"     value="1.1s" />
          <Token name="--dur-micro"      value="0.3s" />
        </section>

      </div>
    </div>
  )
}
