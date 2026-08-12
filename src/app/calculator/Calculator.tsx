'use client'

import { useMemo, useState } from 'react'
import { industries, calculate, formatSAR } from '@/lib/calculator'
import { Button } from '@/components/ui/Button'

const toArabicIndic = (s: string) =>
  s.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])

function LiveNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  return <span>{toArabicIndic(formatSAR(value)) + suffix}</span>
}

export function Calculator() {
  const [industrySlug, setIndustrySlug] = useState(industries[0].slug)
  const [budget, setBudget] = useState(15000)

  const industry = industries.find(i => i.slug === industrySlug)!
  const result = useMemo(() => calculate(budget, industry), [budget, industry])

  return (
    <div>
      {/* Industry picker */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          مجال نشاطك
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
          {industries.map(ind => {
            const active = ind.slug === industrySlug
            return (
              <button
                key={ind.slug}
                onClick={() => setIndustrySlug(ind.slug)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 0.75rem',
                  borderRadius: 8,
                  border: `1px solid ${active ? 'var(--gold)' : 'rgba(201,161,74,0.2)'}`,
                  background: active ? 'rgba(201,161,74,0.08)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke={active ? 'var(--gold)' : 'var(--muted)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ind.icon} />
                </svg>
                <span style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.8125rem', color: active ? 'var(--ivory)' : 'var(--muted)', textAlign: 'center', lineHeight: 1.3 }}>
                  {ind.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Budget slider */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-role-heading)', fontSize: 'var(--text-eyebrow)', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ميزانيتك الشهرية
          </p>
          <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: '1.5rem' }}>
            {toArabicIndic(budget.toLocaleString('ar-SA'))} ريال
          </p>
        </div>
        <input
          type="range"
          min={2000}
          max={100000}
          step={1000}
          value={budget}
          onChange={e => setBudget(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--gold)',
            cursor: 'pointer',
            height: 6,
          }}
          aria-label="الميزانية الشهرية بالريال"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>٢,٠٠٠ ريال</span>
          <span style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>١٠٠,٠٠٠ ريال</span>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'عملاء محتملون شهرياً', value: result.leads, suffix: '' },
          { label: 'عملاء فعليون متوقعون', value: result.customers, suffix: '' },
          { label: 'إيراد إضافي تقديري', value: result.revenue, suffix: ' ريال' },
        ].map(stat => (
          <div key={stat.label} style={{ padding: '1.5rem', background: 'var(--navy-2)', border: '1px solid rgba(201,161,74,0.15)', borderRadius: 10, textAlign: 'center' }}>
            <p className="text-gold-grad" style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(1.25rem,2.5vw,1.75rem)', lineHeight: 1, marginBottom: '0.5rem' }}>
              <LiveNumber value={stat.value} suffix={stat.suffix} />
            </p>
            <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>
              {stat.label}
            </p>
          </div>
        ))}
        <div style={{ padding: '1.5rem', background: 'var(--gold-grad)', borderRadius: 10, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-role-display)', fontSize: 'clamp(1.25rem,2.5vw,1.75rem)', lineHeight: 1, marginBottom: '0.5rem', color: 'var(--on-gold)' }}>
            <LiveNumber value={result.roas} suffix="×" />
          </p>
          <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--on-gold)', opacity: 0.85 }}>
            عائد تقديري لكل ريال
          </p>
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-role-body)', fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
        * هذا تقدير تقريبي مبني على متوسطات السوق السعودي في مجال نشاطك، وليس ضماناً للنتائج — الأداء الفعلي يعتمد على عوامل خاصة بمنتجك وجمهورك وقنواتك. للحصول على خطة دقيقة مبنية على بياناتك الفعلية، احجز استشارة مجانية.
      </p>

      <Button href={`/contact?service=strategy`} variant="primary" size="lg">
        احصل على خطة دقيقة لنشاطك
      </Button>
    </div>
  )
}
