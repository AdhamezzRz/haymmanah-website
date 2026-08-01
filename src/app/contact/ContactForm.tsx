'use client'

import { useActionState, useEffect } from 'react'
import { submitContact, type ContactFormState } from './actions'
import { KhatamStar } from '@/components/signature/KhatamStar'
import { services } from '@/lib/services'

const initialState: ContactFormState = { status: 'idle' }

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--navy)',
  border: '1px solid rgba(201,161,74,0.25)',
  borderRadius: 6,
  padding: '0.875rem 1rem',
  fontFamily: 'var(--font-role-body)',
  fontSize: 'var(--text-body)',
  color: 'var(--ivory)',
  outline: 'none',
  transition: 'border-color 0.2s',
  direction: 'rtl',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-role-heading)',
  fontSize: 'var(--text-eyebrow)',
  color: 'var(--gold)',
  letterSpacing: '0.1em',
  marginBottom: '0.5rem',
  textTransform: 'uppercase',
}

export function ContactForm({ preService }: { preService?: string }) {
  const [state, action, pending] = useActionState(submitContact, initialState)

  if (state.status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <KhatamStar size={120} mode="draw" />
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
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

      <div>
        <label style={labelStyle}>البريد الإلكتروني *</label>
        <input name="email" type="email" required placeholder="email@company.com" style={{ ...inputStyle, direction: 'ltr' }} />
      </div>

      <div>
        <label style={labelStyle}>رقم الهاتف</label>
        <input name="phone" type="tel" placeholder="+966 5X XXX XXXX" style={{ ...inputStyle, direction: 'ltr' }} />
      </div>

      <div>
        <label style={labelStyle}>الخدمة المطلوبة</label>
        <select name="service" defaultValue={preService || ''} style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="">اختر الخدمة</option>
          {services.map(s => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
          <option value="other">أخرى / غير محدد</option>
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
          color: 'var(--ivory)',
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
