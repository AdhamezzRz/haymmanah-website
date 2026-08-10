'use client'

import { useActionState } from 'react'
import { submitCallbackRequest, type CallbackFormState } from './actions'
import { inputStyle, labelStyle, RadioPill, FieldGroup } from './FormFields'

const initialState: CallbackFormState = { status: 'idle' }

const timeOptions = [
  { value: 'morning', label: 'صباحاً' },
  { value: 'afternoon', label: 'ظهراً' },
  { value: 'evening', label: 'مساءً' },
  { value: 'anytime', label: 'أي وقت' },
]

export function QuickCallbackForm() {
  const [state, action, pending] = useActionState(submitCallbackRequest, initialState)

  if (state.status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
        <p style={{ fontFamily: 'var(--font-role-heading)', color: 'var(--gold)', fontSize: '1.0625rem', marginBottom: '0.375rem' }}>
          تم استلام طلبك
        </p>
        <p style={{ fontFamily: 'var(--font-role-body)', color: 'var(--muted)', fontSize: 'var(--text-small)' }}>
          سنتصل بك في الوقت الذي اخترته.
        </p>
      </div>
    )
  }

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={labelStyle}>الاسم *</label>
          <input name="name" required placeholder="اسمك" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>الهاتف *</label>
          <input name="phone" type="tel" required placeholder="+966 5X XXX XXXX" style={{ ...inputStyle, direction: 'ltr' }} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>الوقت المفضل للاتصال</label>
        <FieldGroup columns={4}>
          {timeOptions.map((o, i) => (
            <RadioPill key={o.value} name="time" value={o.value} label={o.label} defaultChecked={i === 3} />
          ))}
        </FieldGroup>
      </div>

      {state.status === 'error' && (
        <p style={{ fontFamily: 'var(--font-role-body)', fontSize: 'var(--text-small)', color: '#e25050', padding: '0.625rem 0.875rem', background: 'rgba(226,80,80,0.08)', borderRadius: 4, border: '1px solid rgba(226,80,80,0.2)' }}>
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          background: 'transparent',
          color: 'var(--gold)',
          border: '1px solid var(--gold)',
          borderRadius: 4,
          padding: '0.75rem 1.5rem',
          fontFamily: 'var(--font-role-heading)',
          fontSize: '0.9375rem',
          fontWeight: 700,
          cursor: pending ? 'wait' : 'pointer',
          opacity: pending ? 0.7 : 1,
          transition: 'opacity 0.2s, background 0.2s',
          letterSpacing: '0.05em',
        }}
      >
        {pending ? 'جارٍ الإرسال…' : 'اطلب اتصالاً سريعاً'}
      </button>
    </form>
  )
}
