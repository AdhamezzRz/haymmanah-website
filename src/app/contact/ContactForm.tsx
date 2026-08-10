'use client'

import { useActionState } from 'react'
import { submitContact, type ContactFormState } from './actions'
import { LogoMark } from '@/components/signature/LogoMark'
import { services } from '@/lib/services'
import { inputStyle, labelStyle, CheckboxPill, RadioPill, FieldGroup } from './FormFields'

const initialState: ContactFormState = { status: 'idle' }

const budgetOptions = [
  { value: 'under-5k', label: 'أقل من ٥,٠٠٠ ريال' },
  { value: '5k-15k', label: '٥,٠٠٠ – ١٥,٠٠٠ ريال' },
  { value: '15k-30k', label: '١٥,٠٠٠ – ٣٠,٠٠٠ ريال' },
  { value: 'over-30k', label: 'أكثر من ٣٠,٠٠٠ ريال' },
  { value: 'not-set', label: 'غير محدد بعد' },
]

const timelineOptions = [
  { value: 'now', label: 'فوراً' },
  { value: 'month', label: 'خلال شهر' },
  { value: 'quarter', label: 'خلال ٣ أشهر' },
  { value: 'exploring', label: 'أستكشف فقط' },
]

const sourceOptions = [
  { value: 'instagram', label: 'انستقرام' },
  { value: 'tiktok', label: 'تيك توك' },
  { value: 'google', label: 'جوجل / بحث' },
  { value: 'referral', label: 'توصية صديق' },
  { value: 'other', label: 'أخرى' },
]

const contactMethodOptions = [
  { value: 'phone', label: 'مكالمة هاتفية' },
  { value: 'whatsapp', label: 'واتساب' },
  { value: 'email', label: 'بريد إلكتروني' },
]

export function ContactForm({ preService }: { preService?: string }) {
  const [state, action, pending] = useActionState(submitContact, initialState)

  if (state.status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <LogoMark size={120} mode="draw" />
        </div>
        <h3 style={{ fontFamily: 'var(--font-role-display)', fontSize: 'var(--text-h2)', color: 'var(--gold)', marginBottom: '1rem' }}>
          وصلتنا رسالتك
        </h3>
        <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', lineHeight: 1.7 }}>
          سنتواصل معك خلال ٢٤ ساعة عمل. شكراً لثقتك بهيمنة.
        </p>
      </div>
    )
  }

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div>
          <label style={labelStyle}>الاسم *</label>
          <input name="name" required placeholder="محمد العتيبي" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>الشركة</label>
          <input name="company" placeholder="شركتك" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div>
          <label style={labelStyle}>البريد الإلكتروني *</label>
          <input name="email" type="email" required placeholder="email@company.com" style={{ ...inputStyle, direction: 'ltr' }} />
        </div>
        <div>
          <label style={labelStyle}>رقم الهاتف *</label>
          <input name="phone" type="tel" required placeholder="+966 5X XXX XXXX" style={{ ...inputStyle, direction: 'ltr' }} />
        </div>
      </div>

      {/* Preferred contact method */}
      <div>
        <label style={labelStyle}>طريقة التواصل المفضلة</label>
        <FieldGroup columns={3}>
          {contactMethodOptions.map((o, i) => (
            <RadioPill key={o.value} name="contactMethod" value={o.value} label={o.label} defaultChecked={i === 1} />
          ))}
        </FieldGroup>
      </div>

      {/* Services wanted — multi-select */}
      <div>
        <label style={labelStyle}>الخدمات المطلوبة (يمكن اختيار أكثر من واحدة)</label>
        <FieldGroup columns={2}>
          {services.map(s => (
            <CheckboxPill key={s.slug} name="services" value={s.name} label={s.name} defaultChecked={s.slug === preService} />
          ))}
        </FieldGroup>
      </div>

      {/* Budget */}
      <div>
        <label style={labelStyle}>الميزانية الشهرية التقريبية</label>
        <FieldGroup columns={3}>
          {budgetOptions.map((o, i) => (
            <RadioPill key={o.value} name="budget" value={o.value} label={o.label} defaultChecked={i === 4} />
          ))}
        </FieldGroup>
      </div>

      {/* Timeline */}
      <div>
        <label style={labelStyle}>متى تريد البدء؟</label>
        <FieldGroup columns={4}>
          {timelineOptions.map(o => (
            <RadioPill key={o.value} name="timeline" value={o.value} label={o.label} />
          ))}
        </FieldGroup>
      </div>

      {/* How did you hear about us */}
      <div>
        <label style={labelStyle}>كيف سمعت عنّا؟</label>
        <select name="source" defaultValue="" style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="">اختر</option>
          {sourceOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>رسالتك *</label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="أخبرنا عن مشروعك، هدفك، والتحدي الذي تواجهه…"
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
        />
      </div>

      {state.status === 'error' && (
        <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: '#e25050', padding: '0.75rem 1rem', background: 'rgba(226,80,80,0.08)', borderRadius: 4, border: '1px solid rgba(226,80,80,0.2)' }}>
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          background: 'var(--gold-grad)',
          color: 'var(--on-gold)',
          border: 'none',
          borderRadius: 4,
          padding: '1rem 2rem',
          fontFamily: 'var(--font-role-heading)',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: pending ? 'wait' : 'pointer',
          opacity: pending ? 0.7 : 1,
          transition: 'opacity 0.2s',
          letterSpacing: '0.05em',
        }}
      >
        {pending ? 'جارٍ الإرسال…' : 'أرسل الرسالة'}
      </button>
    </form>
  )
}
