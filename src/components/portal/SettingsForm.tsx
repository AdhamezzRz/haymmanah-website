'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from './Icon'
import { Spinner, useToast } from './ui'
import { api } from './data'
import type { FieldDef } from '@/portal/schema'

export function SettingsForm({ fields, initial, storage }: { fields: FieldDef[]; initial: Record<string, unknown>; storage: { ok: boolean; dir: string; error?: string } }) {
  const toast = useToast()
  const [values, setValues] = useState<Record<string, unknown>>(initial)
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const [demo, setDemo] = useState<number | null>(null)
  const [demoBusy, setDemoBusy] = useState(false)
  useEffect(() => { api<{ count: number }>('/demo').then(r => setDemo(r.count)).catch(() => setDemo(0)) }, [])
  const demoAction = async (method: 'POST' | 'DELETE') => {
    setDemoBusy(true)
    try {
      const r = await api<{ count?: number; removed?: number }>('/demo', { method })
      setDemo(method === 'POST' ? r.count ?? 0 : 0)
      toast(method === 'POST' ? `تم تحميل ${r.count} سجلاً تجريبياً` : `تم حذف ${r.removed} سجلاً تجريبياً`, 'success')
      router.refresh()
    } catch (err) { toast((err as Error).message, 'error') } finally { setDemoBusy(false) }
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const r = await api<{ settings: Record<string, unknown> }>('/settings', { method: 'PUT', body: JSON.stringify(values) })
      setValues(v => ({ ...v, ...r.settings }))
      toast('تم حفظ الإعدادات', 'success')
    } catch (err) { toast((err as Error).message, 'error') } finally { setBusy(false) }
  }

  return (
    <form onSubmit={save}>
      <div className="pt-page-head">
        <div>
          <div className="pt-eyebrow">النظام</div>
          <h1 className="pt-h1">الإعدادات</h1>
          <p className="pt-lead">بيانات المنشأة كما تظهر على الفواتير ورمز QR، وإعدادات الضريبة والسداد الافتراضية.</p>
        </div>
        <button type="submit" className="pt-btn pt-btn-primary" disabled={busy}>{busy ? <Spinner /> : <Icon name="check" />} حفظ</button>
      </div>

      <div className="pt-grid pt-grid-2">
        <section className="pt-card pt-card-pad">
          <div className="pt-form-grid">
            {fields.map(f => (
              <div key={f.key} className={`pt-field ${f.half && f.type !== 'textarea' ? 'pt-field-half' : 'pt-field-full'}`}>
                <label className="pt-label" htmlFor={`s-${f.key}`}>{f.label}{f.required && <span className="req">*</span>}</label>
                {f.type === 'textarea'
                  ? <textarea id={`s-${f.key}`} className="pt-textarea" value={String(values[f.key] ?? '')} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} />
                  : <input id={`s-${f.key}`} className="pt-input" dir={['vatNumber', 'crNumber', 'phone', 'email', 'iban'].includes(f.key) || f.type === 'number' || f.type === 'percent' ? 'ltr' : undefined} type={f.type === 'number' || f.type === 'percent' ? 'number' : f.type === 'email' ? 'email' : 'text'} value={values[f.key] === null || values[f.key] === undefined ? '' : String(values[f.key])} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} placeholder={f.placeholder} required={f.required} />}
                {f.help && <span className="pt-help">{f.help}</span>}
              </div>
            ))}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <section className="pt-card pt-card-pad">
            <h3 className="pt-card-title" style={{ marginBottom: '0.75rem' }}><Icon name="settings" size={16} /> التخزين</h3>
            <p style={{ fontSize: '0.82rem', color: storage.ok ? '#7FE0A8' : '#FFB4AE', margin: '0 0 0.4rem' }}>{storage.ok ? '● يعمل — البيانات تُحفظ على هذا الخادم' : '● غير متاح على هذه الاستضافة'}</p>
            <code dir="ltr" style={{ fontSize: '0.7rem', color: 'var(--pt-dim)', wordBreak: 'break-all' }}>{storage.dir}</code>
            {storage.error && <p className="pt-error" style={{ marginTop: '0.5rem' }}>{storage.error}</p>}
            <p className="pt-dim" style={{ fontSize: '0.74rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
              النسخ الاحتياطي: انسخ مجلد <code dir="ltr">haymanah-portal-data</code> من المجلد الرئيسي لحساب Hostinger (خارج مجلد التطبيق، فلا يُمسح عند النشر). كل وحدة ملف JSON مستقل يمكن فتحه وقراءته.
            </p>
          </section>
          <section className="pt-card pt-card-pad">
            <h3 className="pt-card-title" style={{ marginBottom: '0.75rem' }}><Icon name="sparkles" size={16} /> بيانات تجريبية</h3>
            <p className="pt-muted" style={{ fontSize: '0.8rem', lineHeight: 1.8, margin: '0 0 0.75rem' }}>
              عملاء وفرص ومهام وهمية معلّمة بكلمة «تجريبي» لتجرّب الرسوم والتنبيهات. لا تمسّ بياناتكم الحقيقية وتُحذف بضغطة.
            </p>
            {demo === null ? <Spinner /> : demo > 0 ? (
              <button type="button" className="pt-btn pt-btn-danger" disabled={demoBusy} onClick={() => demoAction('DELETE')}>{demoBusy ? <Spinner /> : <Icon name="trash" />} حذف البيانات التجريبية ({demo})</button>
            ) : (
              <button type="button" className="pt-btn" disabled={demoBusy} onClick={() => demoAction('POST')}>{demoBusy ? <Spinner /> : <Icon name="sparkles" />} تحميل بيانات تجريبية</button>
            )}
          </section>
          <section className="pt-card pt-card-pad">
            <h3 className="pt-card-title" style={{ marginBottom: '0.75rem' }}><Icon name="sparkles" size={16} /> اختصارات</h3>
            <ul style={{ margin: 0, paddingInlineStart: '1.1rem', fontSize: '0.8rem', color: 'var(--pt-muted)', lineHeight: 2 }}>
              <li><kbd>⌘K</kbd> بحث وأوامر سريعة من أي مكان</li>
              <li>اسحب البطاقات بين أعمدة اللوحة لتغيير الحالة</li>
              <li>اضغط أي يوم في التقويم لإضافة منشور فيه</li>
              <li>زر التنزيل في كل وحدة يصدّر CSV للإكسل</li>
            </ul>
          </section>
        </aside>
      </div>
    </form>
  )
}
