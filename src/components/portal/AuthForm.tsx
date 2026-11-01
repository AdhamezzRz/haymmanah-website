'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from './Icon'
import { Spinner } from './ui'

export function AuthForm({ mode, storageError }: { mode: 'login' | 'setup'; storageError?: string }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(null)
    try {
      const res = await fetch(`/api/portal/auth/${mode}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'setup' ? { name, email, password } : { email, password }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error ?? 'تعذّر تسجيل الدخول')
      router.push('/portal')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
      setBusy(false)
    }
  }

  return (
    <form className="pt-card pt-auth-card" onSubmit={submit}>
      <div className="pt-auth-logo">
        <span className="pt-brand-mark">هـ</span>
        <div>
          <div className="pt-brand-name">هيمنة</div>
          <div className="pt-brand-sub">Team OS · نظام إدارة الوكالة</div>
        </div>
      </div>

      <h1 className="pt-h1" style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>
        {mode === 'setup' ? 'أهلاً بك — لنُعدّ حسابك الأول' : 'تسجيل الدخول'}
      </h1>
      <p className="pt-lead" style={{ marginBottom: '1.5rem' }}>
        {mode === 'setup'
          ? 'هذا الحساب سيكون مدير النظام. تستطيع إضافة بقية الفريق من قسم «الفريق» بعد الدخول.'
          : 'ادخل ببريدك الإلكتروني وكلمة المرور التي أنشأها لك مدير النظام.'}
      </p>

      {storageError && (
        <div className="pt-banner" role="alert">
          <Icon name="alert" style={{ color: 'var(--pt-warn)', flexShrink: 0 }} />
          <div><strong>لا يمكن حفظ البيانات على هذه الاستضافة.</strong><br /><code dir="ltr" style={{ fontSize: '0.72rem' }}>{storageError}</code></div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mode === 'setup' && (
          <label className="pt-field">
            <span className="pt-label">اسمك</span>
            <input className="pt-input" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" placeholder="مثال: أدهم" />
          </label>
        )}
        <label className="pt-field">
          <span className="pt-label">البريد الإلكتروني</span>
          <input className="pt-input" type="email" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="you@himna.sa" />
        </label>
        <label className="pt-field">
          <span className="pt-label">كلمة المرور {mode === 'setup' && <span className="pt-help">(٨ أحرف على الأقل)</span>}</span>
          <input className="pt-input" type="password" dir="ltr" value={password} onChange={e => setPassword(e.target.value)} required minLength={mode === 'setup' ? 8 : 1} autoComplete={mode === 'setup' ? 'new-password' : 'current-password'} />
        </label>
        {error && <div className="pt-error" role="alert" style={{ fontSize: '0.85rem' }}>{error}</div>}
        <button type="submit" className="pt-btn pt-btn-primary" disabled={busy || !!storageError} style={{ justifyContent: 'center', padding: '0.8rem' }}>
          {busy ? <Spinner /> : mode === 'setup' ? 'إنشاء الحساب والدخول' : 'دخول'}
        </button>
      </div>

      <p className="pt-dim" style={{ fontSize: '0.72rem', marginTop: '1.5rem', textAlign: 'center' }}>
        نظام داخلي لفريق هيمنة — غير مخصص للعملاء.
      </p>
    </form>
  )
}
