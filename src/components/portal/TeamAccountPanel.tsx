'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from './Icon'
import { Spinner, useToast, useConfirm } from './ui'
import { ChangePasswordForm } from './AuthScreens'
import { invalidate } from './data'
import { fmtDateTime } from '@/portal/format'
import type { BaseRecord, Role } from '@/portal/schema'

/** wa.me link with a ready-to-send Arabic message. Saudi numbers by default. */
function whatsappShare(phone: unknown, text: string): string {
  let d = String(phone ?? '').replace(/[^\d]/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('0')) d = `966${d.slice(1)}`
  else if (d.length === 9 && d.startsWith('5')) d = `966${d}`
  const q = encodeURIComponent(text)
  return d.length >= 11 ? `https://wa.me/${d}?text=${q}` : `https://wa.me/?text=${q}`
}

export function TeamAccountPanel({ member, viewerId, viewerRole, autoInvite }: { member: BaseRecord; viewerId: string; viewerRole: Role; autoInvite?: boolean }) {
  const router = useRouter()
  const toast = useToast()
  const { confirm, confirmNode } = useConfirm()
  const isAdmin = viewerRole === 'admin'
  const isSelf = member.id === viewerId
  const pending = member.joinStatus === 'pending'
  const hasPassword = member.hasPassword !== false
  const [link, setLink] = useState<{ url: string; expiresAt: string; purpose: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [role, setRole] = useState<Role>('member')
  const autoDone = useRef(false)
  const first = String(member.name ?? '').split(' ')[0]

  const makeLink = useCallback(async () => {
    setBusy(true)
    try {
      const res = await fetch('/api/portal/auth/link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: member.id }) })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? 'تعذّر إنشاء الرابط')
      setLink({ url: `${window.location.origin}${body.path}`, expiresAt: body.expiresAt, purpose: body.purpose })
    } catch (e) { toast((e as Error).message, 'error') } finally { setBusy(false) }
  }, [member.id, toast])

  // arriving from "add member without a password": generate the invite straight away
  useEffect(() => {
    if (autoInvite && isAdmin && !hasPassword && !pending && !autoDone.current) { autoDone.current = true; makeLink() }
  }, [autoInvite, isAdmin, hasPassword, pending, makeLink])

  const copy = async () => {
    if (!link) return
    try { await navigator.clipboard.writeText(link.url); toast('تم نسخ الرابط', 'success') }
    catch { toast('انسخ الرابط يدوياً من الخانة', 'info') }
  }

  const decide = async (approve: boolean) => {
    if (!approve && !(await confirm(`رفض طلب ${String(member.name)} وحذفه؟`))) return
    setBusy(true)
    try {
      const res = await fetch('/api/portal/auth/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: member.id, approve, role }) })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? 'تعذّر التنفيذ')
      invalidate('team')
      if (approve) { toast(`تم قبول ${first} — يقدر يدخل الآن`, 'success'); router.refresh() }
      else { toast('تم رفض الطلب', 'success'); router.push('/portal/team') }
    } catch (e) { toast((e as Error).message, 'error') } finally { setBusy(false) }
  }

  if (!isAdmin && !isSelf) return null

  const message = link
    ? link.purpose === 'invite'
      ? `أهلاً ${first} 👋\nتمت إضافتك لنظام هيمنة. افتح الرابط واختر كلمة مرورك:\n${link.url}\n(الرابط صالح ٣ أيام ويعمل مرة واحدة)`
      : `أهلاً ${first}،\nهذا رابط لاختيار كلمة مرور جديدة لنظام هيمنة:\n${link.url}\n(صالح لساعتين ويعمل مرة واحدة)`
    : ''

  return (
    <section className="pt-card">
      <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="shield" size={16} /> الحساب والدخول</h3></div>
      <div className="pt-card-pad" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="pt-acct-status">
          {pending ? <><i className="pt-dot" style={{ background: '#D98E04' }} /> طلب انضمام بانتظار موافقتك</>
            : member.active === false ? <><i className="pt-dot" style={{ background: '#C4504A' }} /> الحساب موقوف</>
            : !hasPassword ? <><i className="pt-dot" style={{ background: '#D98E04' }} /> لم يفعّل حسابه بعد — أرسل له رابط الدعوة</>
            : <><i className="pt-dot" style={{ background: '#2E9E6B' }} /> الحساب فعّال</>}
        </div>

        {isAdmin && pending && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {member.joinNote ? <p className="pt-muted" style={{ fontSize: '0.8rem', margin: 0, lineHeight: 1.8 }}>رسالته: «{String(member.joinNote)}»</p> : null}
            <label className="pt-field">
              <span className="pt-label">الصلاحية عند القبول</span>
              <select className="pt-select" value={role} onChange={e => setRole(e.target.value as Role)}>
                <option value="member">عضو — المشاريع والمهام والمحتوى</option>
                <option value="manager">مشرف — كل شيء عدا الإعدادات والفريق</option>
                <option value="admin">مدير — كل شيء</option>
              </select>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="pt-btn pt-btn-primary" disabled={busy} onClick={() => decide(true)} style={{ flex: 1, justifyContent: 'center' }}>{busy ? <Spinner /> : <Icon name="check" />} قبول</button>
              <button type="button" className="pt-btn pt-btn-danger" disabled={busy} onClick={() => decide(false)}>رفض</button>
            </div>
          </div>
        )}

        {isAdmin && !pending && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <p className="pt-muted" style={{ fontSize: '0.78rem', margin: 0, lineHeight: 1.8 }}>
              {hasPassword
                ? `نسي ${first} كلمة المرور؟ أنشئ رابطاً يختار منه كلمة جديدة وأرسله له.`
                : `أرسل لـ${first} رابط الدعوة ليختار كلمة مروره ويدخل.`}
            </p>
            {!link ? (
              <button type="button" className="pt-btn" disabled={busy} onClick={makeLink}>{busy ? <Spinner /> : <Icon name="link" />} {hasPassword ? 'رابط إعادة تعيين' : 'رابط الدعوة'}</button>
            ) : (
              <>
                <div className="pt-acct-link">
                  <input className="pt-input" dir="ltr" readOnly value={link.url} onFocus={e => e.currentTarget.select()} aria-label="الرابط" />
                  <button type="button" className="pt-btn pt-btn-icon" onClick={copy} title="نسخ" aria-label="نسخ الرابط"><Icon name="copy" /></button>
                </div>
                <a className="pt-btn pt-btn-primary" style={{ justifyContent: 'center' }} href={whatsappShare(member.phone, message)} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" /> أرسله على واتساب</a>
                <span className="pt-dim" style={{ fontSize: '0.7rem' }}>صالح حتى {fmtDateTime(link.expiresAt)} · يعمل مرة واحدة · إنشاء رابط جديد يُلغي السابق</span>
              </>
            )}
          </div>
        )}

        {isSelf && !pending && (
          <details className="pt-howto" style={{ marginBottom: 0 }}>
            <summary><Icon name="key" size={15} /> تغيير كلمة المرور</summary>
            <div className="pt-howto-body"><ChangePasswordForm /></div>
          </details>
        )}
      </div>
      {confirmNode}
    </section>
  )
}
