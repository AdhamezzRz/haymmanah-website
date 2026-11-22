'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from './Icon'
import { Spinner } from './ui'

/* ── Shared pieces ─────────────────────────────────────────────────── */

async function post<T = Record<string, unknown>>(path: string, body: unknown): Promise<{ ok: boolean; status: number; data: T & { error?: string; errors?: Record<string, string> } }> {
  try {
    const res = await fetch(`/api/portal/auth/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, data }
  } catch {
    return { ok: false, status: 0, data: { error: 'تعذّر الاتصال بالخادم — تحقق من الإنترنت وحاول مجدداً' } as T & { error: string } }
  }
}

function AuthCard({ title, lead, children, footer, icon }: { title: string; lead?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode; icon?: string }) {
  return (
    <div className="pt-card pt-auth-card">
      <div className="pt-auth-logo">
        <span className="pt-brand-mark">هـ</span>
        <div>
          <div className="pt-brand-name">هيمنة</div>
          <div className="pt-brand-sub">Team OS · نظام إدارة الوكالة</div>
        </div>
      </div>
      <h1 className="pt-h1 pt-auth-title">{icon && <Icon name={icon} size={22} style={{ color: 'var(--gold-bright)' }} />} {title}</h1>
      {lead && <p className="pt-lead pt-auth-lead">{lead}</p>}
      {children}
      {footer && <div className="pt-auth-foot">{footer}</div>}
    </div>
  )
}

function Field({ label, error, hint, children, aside }: { label: string; error?: string; hint?: React.ReactNode; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <label className="pt-field">
      <span className="pt-label pt-auth-label"><span>{label}</span>{aside}</span>
      {children}
      {error ? <span className="pt-error">{error}</span> : hint ? <span className="pt-help">{hint}</span> : null}
    </label>
  )
}

function Alert({ kind = 'error', children }: { kind?: 'error' | 'ok' | 'info'; children: React.ReactNode }) {
  return (
    <div className="pt-auth-alert" data-kind={kind} role={kind === 'error' ? 'alert' : 'status'}>
      <Icon name={kind === 'error' ? 'alert' : kind === 'ok' ? 'check' : 'sparkles'} size={16} />
      <div>{children}</div>
    </div>
  )
}

export function scorePassword(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: '' }
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[A-Za-z؀-ۿ]/.test(pw) && /\d/.test(pw)) s++
  if (/[^A-Za-z0-9؀-ۿ]/.test(pw) || (/[a-z]/.test(pw) && /[A-Z]/.test(pw))) s++
  if (pw.length < 8) s = Math.min(s, 1)
  return { score: s, label: ['ضعيفة جداً', 'ضعيفة', 'مقبولة', 'جيدة', 'قوية'][s] }
}

function PasswordInput({ value, onChange, autoComplete, meter, invalid, id, placeholder }: {
  value: string; onChange: (v: string) => void; autoComplete: string; meter?: boolean; invalid?: boolean; id?: string; placeholder?: string
}) {
  const [show, setShow] = useState(false)
  const { score, label } = useMemo(() => scorePassword(value), [value])
  return (
    <>
      <span className="pt-pw">
        <input
          id={id} className="pt-input" dir="ltr" type={show ? 'text' : 'password'} value={value}
          onChange={e => onChange(e.target.value)} autoComplete={autoComplete} aria-invalid={invalid}
          placeholder={placeholder} required minLength={meter ? 8 : 1} spellCheck={false}
        />
        <button type="button" className="pt-pw-toggle" onClick={() => setShow(s => !s)} aria-label={show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'} title={show ? 'إخفاء' : 'إظهار'}>
          <Icon name={show ? 'eyeOff' : 'eye'} size={17} />
        </button>
      </span>
      {meter && value && (
        <span className="pt-strength" data-score={score} aria-live="polite">
          <span className="pt-strength-bars">{[1, 2, 3, 4].map(i => <i key={i} data-on={score >= i} />)}</span>
          <span>قوة كلمة المرور: <strong>{label}</strong></span>
        </span>
      )}
    </>
  )
}

/* ── Login ─────────────────────────────────────────────────────────── */

export function LoginForm({ signupOpen }: { signupOpen: boolean }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(null)
    const r = await post('login', { email, password })
    if (r.ok) { router.push('/portal'); router.refresh(); return }
    setError(r.data.error ?? 'تعذّر تسجيل الدخول')
    setBusy(false)
  }

  return (
    <AuthCard
      title="تسجيل الدخول"
      lead="ادخل ببريدك الإلكتروني وكلمة المرور."
      footer={
        <>
          {signupOpen && <p>جديد في فريق هيمنة؟ <Link href="/portal/signup">اطلب الانضمام</Link></p>}
          <p className="pt-dim">نظام داخلي لفريق هيمنة — غير مخصص للعملاء.</p>
        </>
      }
    >
      <form className="pt-auth-form" onSubmit={submit}>
        <Field label="البريد الإلكتروني">
          <input className="pt-input" type="email" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="you@himna.sa" autoFocus />
        </Field>
        <Field label="كلمة المرور" aside={<Link href="/portal/forgot" className="pt-auth-inline">نسيت كلمة المرور؟</Link>}>
          <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" />
        </Field>
        {error && <Alert>{error}{error.includes('غير صحيحة') && <> — <Link href="/portal/forgot">استعد كلمة المرور</Link></>}</Alert>}
        <button type="submit" className="pt-btn pt-btn-primary pt-auth-submit" disabled={busy}>{busy ? <Spinner /> : 'دخول'}</button>
      </form>
    </AuthCard>
  )
}

/* ── Forgot password ───────────────────────────────────────────────── */

export function ForgotForm({ mailEnabled }: { mailEnabled: boolean }) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(null)
    const r = await post('forgot', { email })
    if (r.ok) setSent(true)
    else setError(r.data.error ?? 'حدث خطأ — حاول مجدداً')
    setBusy(false)
  }

  return (
    <AuthCard
      title="نسيت كلمة المرور؟" icon="key"
      lead="لا مشكلة. اختر الطريقة المناسبة لك لاستعادة الدخول."
      footer={<p><Link href="/portal/login">← رجوع لتسجيل الدخول</Link></p>}
    >
      {mailEnabled && (
        sent ? (
          <Alert kind="ok">إذا كان <strong dir="ltr">{email}</strong> مسجّلاً لدينا فسيصلك رابط خلال دقائق. الرابط صالح لساعتين — تحقق من مجلد البريد غير المرغوب أيضاً.</Alert>
        ) : (
          <form className="pt-auth-form pt-auth-option" onSubmit={submit}>
            <h2 className="pt-auth-option-title"><Icon name="mail" size={17} /> أرسل لي رابطاً على بريدي</h2>
            <Field label="البريد الإلكتروني">
              <input className="pt-input" type="email" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="you@himna.sa" autoFocus />
            </Field>
            {error && <Alert>{error}</Alert>}
            <button type="submit" className="pt-btn pt-btn-primary pt-auth-submit" disabled={busy}>{busy ? <Spinner /> : 'أرسل رابط إعادة التعيين'}</button>
          </form>
        )
      )}

      <div className="pt-auth-option">
        <h2 className="pt-auth-option-title"><Icon name="whatsapp" size={17} /> {mailEnabled ? 'أو اطلب الرابط من المدير' : 'اطلب رابطاً من مدير النظام'}</h2>
        <p className="pt-auth-p">
          تواصل مع مدير النظام في الفريق. يفتح صفحتك من «الفريق» ويضغط <strong>«رابط إعادة تعيين»</strong> ثم يرسله لك على واتساب — تفتحه وتختار كلمة مرور جديدة خلال دقيقة.
        </p>
      </div>

      <div className="pt-auth-option">
        <h2 className="pt-auth-option-title"><Icon name="shield" size={17} /> أنت مدير النظام ولا تستطيع الدخول؟</h2>
        <p className="pt-auth-p">استعد الدخول برمز يُكتب في ملف على السيرفر — يحتاج فقط وصولك لمدير ملفات Hostinger.</p>
        <Link href="/portal/recover" className="pt-btn pt-auth-submit">استعادة دخول المدير</Link>
      </div>
    </AuthCard>
  )
}

/* ── Reset / invite: choose a new password ─────────────────────────── */

export function ResetForm({ token, valid, name, purpose }: { token: string; valid: boolean; name?: string; purpose?: 'reset' | 'invite' }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  if (!valid) {
    return (
      <AuthCard title="الرابط غير صالح" icon="alert" footer={<p><Link href="/portal/login">← تسجيل الدخول</Link></p>}>
        <Alert>هذا الرابط منتهي الصلاحية أو استُخدم من قبل. روابط إعادة التعيين صالحة لساعتين، وروابط الدعوة لثلاثة أيام، وكل رابط يعمل مرة واحدة.</Alert>
        <Link href="/portal/forgot" className="pt-btn pt-btn-primary pt-auth-submit" style={{ marginTop: '1rem' }}>اطلب رابطاً جديداً</Link>
      </AuthCard>
    )
  }

  const first = (name ?? '').split(' ')[0]
  const mismatch = confirm.length > 0 && confirm !== password

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('كلمتا المرور غير متطابقتين'); return }
    setBusy(true); setError(null)
    const r = await post<{ loggedIn?: boolean; message?: string }>('reset', { token, password })
    if (r.ok && r.data.loggedIn) { router.push('/portal'); router.refresh(); return }
    if (r.ok) { setDone(r.data.message ?? 'تم حفظ كلمة المرور.'); setBusy(false); return }
    setError(r.data.errors?.password ?? r.data.error ?? 'تعذّر الحفظ')
    setBusy(false)
  }

  if (done) {
    return (
      <AuthCard title="تم حفظ كلمة المرور" icon="check" footer={<p><Link href="/portal/login">← تسجيل الدخول</Link></p>}>
        <Alert kind="info">{done}</Alert>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title={purpose === 'invite' ? `أهلاً ${first} 👋` : 'اختر كلمة مرور جديدة'}
      icon={purpose === 'invite' ? undefined : 'key'}
      lead={purpose === 'invite' ? 'تمت دعوتك لنظام هيمنة. اختر كلمة مرور لحسابك وستدخل مباشرة.' : `${first ? `${first}، ` : ''}اختر كلمة مرور جديدة. ستُسجَّل خروجك من أي جهاز آخر.`}
    >
      <form className="pt-auth-form" onSubmit={submit}>
        <Field label="كلمة المرور الجديدة" hint="٨ أحرف على الأقل. الأفضل: جملة قصيرة تحفظها، مثل «قهوة-الصباح-2026».">
          <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" meter />
        </Field>
        <Field label="أعد كتابتها للتأكيد" error={mismatch ? 'غير متطابقة' : undefined}>
          <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" invalid={mismatch} />
        </Field>
        {error && <Alert>{error}</Alert>}
        <button type="submit" className="pt-btn pt-btn-primary pt-auth-submit" disabled={busy || mismatch}>{busy ? <Spinner /> : purpose === 'invite' ? 'تفعيل الحساب والدخول' : 'حفظ والدخول'}</button>
      </form>
    </AuthCard>
  )
}

/* ── Sign up = join request ────────────────────────────────────────── */

export function SignupForm() {
  const [v, setV] = useState({ name: '', email: '', title: '', phone: '', note: '', password: '', confirm: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const set = (k: keyof typeof v) => (x: string) => { setV(s => ({ ...s, [k]: x })); setErrors(e => ({ ...e, [k]: '' })) }
  const mismatch = v.confirm.length > 0 && v.confirm !== v.password

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (v.password !== v.confirm) { setError('كلمتا المرور غير متطابقتين'); return }
    setBusy(true); setError(null)
    const r = await post('signup', { name: v.name, email: v.email, title: v.title, phone: v.phone, note: v.note, password: v.password })
    if (r.ok) { setSent(true); setBusy(false); return }
    setErrors(r.data.errors ?? {})
    setError(r.data.error ?? 'تعذّر إرسال الطلب')
    setBusy(false)
  }

  if (sent) {
    return (
      <AuthCard title="تم إرسال طلبك ✓" footer={<p><Link href="/portal/login">← تسجيل الدخول</Link></p>}>
        <Alert kind="ok">وصل طلب انضمامك إلى مدير النظام. بعد موافقته تقدر تدخل مباشرة بنفس البريد وكلمة المرور التي اخترتها.</Alert>
        <p className="pt-auth-p" style={{ marginTop: '1rem' }}>تستعجل؟ أرسل رسالة للمدير ليوافق على طلبك من التنبيهات.</p>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="طلب انضمام للفريق" icon="userPlus"
      lead="عبّئ بياناتك ويصل طلبك لمدير النظام. يفعّل حسابك بعد مراجعته — هكذا تبقى بيانات العملاء آمنة."
      footer={<p>عندك حساب؟ <Link href="/portal/login">سجّل الدخول</Link></p>}
    >
      <form className="pt-auth-form" onSubmit={submit}>
        <Field label="الاسم الكامل" error={errors.name}>
          <input className="pt-input" value={v.name} onChange={e => set('name')(e.target.value)} required autoComplete="name" placeholder="مثال: فهد الشهري" autoFocus aria-invalid={!!errors.name} />
        </Field>
        <Field label="البريد الإلكتروني" error={errors.email} hint="هذا البريد هو اسم الدخول.">
          <input className="pt-input" type="email" dir="ltr" value={v.email} onChange={e => set('email')(e.target.value)} required autoComplete="email" placeholder="you@himna.sa" aria-invalid={!!errors.email} />
        </Field>
        <div className="pt-auth-row">
          <Field label="المسمى الوظيفي">
            <input className="pt-input" value={v.title} onChange={e => set('title')(e.target.value)} placeholder="مثال: مصمم جرافيك" autoComplete="organization-title" />
          </Field>
          <Field label="الجوال">
            <input className="pt-input" type="tel" dir="ltr" value={v.phone} onChange={e => set('phone')(e.target.value)} placeholder="05xxxxxxxx" autoComplete="tel" />
          </Field>
        </div>
        <Field label="كلمة المرور" error={errors.password}>
          <PasswordInput value={v.password} onChange={set('password')} autoComplete="new-password" meter invalid={!!errors.password} />
        </Field>
        <Field label="أعد كتابتها للتأكيد" error={mismatch ? 'غير متطابقة' : undefined}>
          <PasswordInput value={v.confirm} onChange={set('confirm')} autoComplete="new-password" invalid={mismatch} />
        </Field>
        <Field label="رسالة للمدير (اختياري)">
          <textarea className="pt-textarea" style={{ minHeight: 64 }} value={v.note} onChange={e => set('note')(e.target.value)} placeholder="مثال: انضممت لفريق التصميم هذا الأسبوع" maxLength={500} />
        </Field>
        {error && <Alert>{error}{error.includes('مسجّل مسبقاً') && <> — <Link href="/portal/forgot">نسيت كلمة المرور؟</Link></>}</Alert>}
        <button type="submit" className="pt-btn pt-btn-primary pt-auth-submit" disabled={busy || mismatch}>{busy ? <Spinner /> : 'إرسال طلب الانضمام'}</button>
      </form>
    </AuthCard>
  )
}

/* ── Owner recovery (no email needed) ──────────────────────────────── */

interface Account { id: string; name: string; email: string; role: string }

export function RecoverForm() {
  const router = useRouter()
  const [step, setStep] = useState<'start' | 'code' | 'choose'>('start')
  const [code, setCode] = useState('')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mismatch = confirm.length > 0 && confirm !== password

  const issue = async () => {
    setBusy(true); setError(null)
    const r = await post('recover', { step: 'issue' })
    if (r.ok) setStep('code'); else setError(r.data.error ?? 'تعذّر إنشاء الرمز')
    setBusy(false)
  }
  const verify = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(null)
    const r = await post<{ accounts?: Account[] }>('recover', { step: 'verify', code })
    if (r.ok && r.data.accounts) {
      setAccounts(r.data.accounts)
      setUserId(r.data.accounts[0]?.id ?? '')
      setStep('choose')
    } else setError(r.data.error ?? 'الرمز غير صحيح')
    setBusy(false)
  }
  const reset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('كلمتا المرور غير متطابقتين'); return }
    setBusy(true); setError(null)
    const r = await post('recover', { step: 'reset', code, userId, password })
    if (r.ok) { router.push('/portal'); router.refresh(); return }
    setError(r.data.errors?.password ?? r.data.error ?? 'تعذّر الحفظ')
    setBusy(false)
  }

  return (
    <AuthCard
      title="استعادة دخول المدير" icon="shield"
      lead="لمالك النظام فقط: نثبت أنك المالك برمز نكتبه في ملف على السيرفر لا يفتحه إلا من يملك حساب Hostinger."
      footer={<p><Link href="/portal/login">← رجوع لتسجيل الدخول</Link></p>}
    >
      <ol className="pt-auth-steps">
        <li data-state={step === 'start' ? 'now' : 'done'}>إنشاء الرمز</li>
        <li data-state={step === 'code' ? 'now' : step === 'choose' ? 'done' : 'next'}>كتابة الرمز</li>
        <li data-state={step === 'choose' ? 'now' : 'next'}>كلمة مرور جديدة</li>
      </ol>

      {step === 'start' && (
        <div className="pt-auth-form">
          <p className="pt-auth-p">عند الضغط سننشئ ملفاً اسمه <code dir="ltr">RECOVERY-CODE.txt</code> داخل مجلد التطبيق على Hostinger فيه رمز من ٨ أحرف صالح لـ ٣٠ دقيقة.</p>
          {error && <Alert>{error}</Alert>}
          <button type="button" className="pt-btn pt-btn-primary pt-auth-submit" onClick={issue} disabled={busy}>{busy ? <Spinner /> : 'أنشئ رمز الاستعادة'}</button>
        </div>
      )}

      {step === 'code' && (
        <form className="pt-auth-form" onSubmit={verify}>
          <div className="pt-auth-howto">
            <strong>افتح الرمز من Hostinger:</strong>
            <ol>
              <li>hPanel ← <b>Websites</b> ← himna.sa ← <b>File Manager</b></li>
              <li>افتح مجلد التطبيق ثم <code dir="ltr">data</code> ← <code dir="ltr">portal</code></li>
              <li>افتح ملف <code dir="ltr">RECOVERY-CODE.txt</code> وانسخ الرمز</li>
            </ol>
          </div>
          <Field label="رمز الاستعادة">
            <input className="pt-input pt-code-input" dir="ltr" value={code} onChange={e => setCode(e.target.value.toUpperCase())} required placeholder="XXXX-XXXX" autoComplete="one-time-code" autoFocus maxLength={12} />
          </Field>
          {error && <Alert>{error}</Alert>}
          <button type="submit" className="pt-btn pt-btn-primary pt-auth-submit" disabled={busy}>{busy ? <Spinner /> : 'تحقق من الرمز'}</button>
          <button type="button" className="pt-btn pt-btn-ghost pt-auth-submit" onClick={issue} disabled={busy}>لم أجد الملف؟ أنشئ رمزاً جديداً</button>
        </form>
      )}

      {step === 'choose' && (
        <form className="pt-auth-form" onSubmit={reset}>
          <Alert kind="ok">الرمز صحيح. هذه حسابات المدير المسجّلة — اختر حسابك:</Alert>
          <div className="pt-auth-accounts" role="radiogroup">
            {accounts.map(a => (
              <label key={a.id} className="pt-auth-account" data-on={userId === a.id}>
                <input type="radio" name="acct" value={a.id} checked={userId === a.id} onChange={() => setUserId(a.id)} />
                <span><strong>{a.name}</strong><span dir="ltr">{a.email}</span></span>
              </label>
            ))}
          </div>
          <Field label="كلمة المرور الجديدة">
            <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" meter />
          </Field>
          <Field label="أعد كتابتها للتأكيد" error={mismatch ? 'غير متطابقة' : undefined}>
            <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" invalid={mismatch} />
          </Field>
          {error && <Alert>{error}</Alert>}
          <button type="submit" className="pt-btn pt-btn-primary pt-auth-submit" disabled={busy || mismatch || !userId}>{busy ? <Spinner /> : 'حفظ والدخول'}</button>
        </form>
      )}
    </AuthCard>
  )
}

/* ── First-run setup ───────────────────────────────────────────────── */

export function SetupForm({ storageError }: { storageError?: string }) {
  const router = useRouter()
  const [v, setV] = useState({ setupCode: '', name: '', email: '', password: '', confirm: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const set = (k: keyof typeof v) => (x: string) => setV(s => ({ ...s, [k]: x }))
  const mismatch = v.confirm.length > 0 && v.confirm !== v.password

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (v.password !== v.confirm) { setError('كلمتا المرور غير متطابقتين'); return }
    setBusy(true); setError(null)
    const r = await post('setup', { setupCode: v.setupCode, name: v.name, email: v.email, password: v.password })
    if (r.ok) { router.push('/portal'); router.refresh(); return }
    setError(r.data.error ?? 'تعذّر الإعداد')
    setBusy(false)
  }

  return (
    <AuthCard
      title="أهلاً بك — لنُعدّ حسابك الأول"
      lead="هذا الحساب سيكون مدير النظام. تضيف بقية الفريق من قسم «الفريق» بعد الدخول."
    >
      {storageError && <Alert>لا يمكن حفظ البيانات على هذه الاستضافة.<br /><code dir="ltr" style={{ fontSize: '0.72rem' }}>{storageError}</code></Alert>}
      <form className="pt-auth-form" onSubmit={submit}>
        <div className="pt-auth-howto">
          <strong>أولاً: رمز الإعداد</strong> — يثبت أنك صاحب الموقع. افتح من Hostinger: <b>File Manager</b> ← مجلد التطبيق ← <code dir="ltr">data/portal/SETUP-CODE.txt</code> وانسخ الرمز.
        </div>
        <Field label="رمز الإعداد">
          <input className="pt-input pt-code-input" dir="ltr" value={v.setupCode} onChange={e => set('setupCode')(e.target.value.toUpperCase())} required placeholder="XXXX-XXXX" autoComplete="one-time-code" maxLength={12} />
        </Field>
        <Field label="اسمك">
          <input className="pt-input" value={v.name} onChange={e => set('name')(e.target.value)} required autoComplete="name" placeholder="مثال: أدهم" />
        </Field>
        <Field label="البريد الإلكتروني">
          <input className="pt-input" type="email" dir="ltr" value={v.email} onChange={e => set('email')(e.target.value)} required autoComplete="email" placeholder="you@himna.sa" />
        </Field>
        <Field label="كلمة المرور">
          <PasswordInput value={v.password} onChange={set('password')} autoComplete="new-password" meter />
        </Field>
        <Field label="أعد كتابتها للتأكيد" error={mismatch ? 'غير متطابقة' : undefined}>
          <PasswordInput value={v.confirm} onChange={set('confirm')} autoComplete="new-password" invalid={mismatch} />
        </Field>
        {error && <Alert>{error}</Alert>}
        <button type="submit" className="pt-btn pt-btn-primary pt-auth-submit" disabled={busy || !!storageError || mismatch}>{busy ? <Spinner /> : 'إنشاء الحساب والدخول'}</button>
      </form>
    </AuthCard>
  )
}

/* ── Change own password (used on your team page) ──────────────────── */

export function ChangePasswordForm({ onDone }: { onDone?: () => void }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const mismatch = confirm.length > 0 && confirm !== next

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (next !== confirm) { setMsg({ kind: 'error', text: 'كلمتا المرور غير متطابقتين' }); return }
    setBusy(true); setMsg(null)
    const r = await post('password', { current, next })
    if (r.ok) {
      setMsg({ kind: 'ok', text: 'تم تغيير كلمة المرور. سُجّل خروجك من أي جهاز آخر.' })
      setCurrent(''); setNext(''); setConfirm('')
      onDone?.()
    } else setMsg({ kind: 'error', text: r.data.errors?.current ? 'كلمة المرور الحالية غير صحيحة' : r.data.errors?.next ?? r.data.error ?? 'تعذّر الحفظ' })
    setBusy(false)
  }

  return (
    <form className="pt-auth-form" onSubmit={submit}>
      <Field label="كلمة المرور الحالية">
        <PasswordInput value={current} onChange={setCurrent} autoComplete="current-password" />
      </Field>
      <Field label="كلمة المرور الجديدة">
        <PasswordInput value={next} onChange={setNext} autoComplete="new-password" meter />
      </Field>
      <Field label="أعد كتابتها للتأكيد" error={mismatch ? 'غير متطابقة' : undefined}>
        <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" invalid={mismatch} />
      </Field>
      {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
      <button type="submit" className="pt-btn pt-btn-primary" disabled={busy || mismatch}>{busy ? <Spinner /> : 'تغيير كلمة المرور'}</button>
    </form>
  )
}
