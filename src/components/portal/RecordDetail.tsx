'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from './Icon'
import { Chip, useConfirm, useToast, Avatar, RelTime } from './ui'
import { FieldValue } from './FieldValue'
import { RecordForm } from './RecordForm'
import { StarInput, Stars } from './charts'
import { useRecords, deleteRecord, updateRecord, api } from './data'
import { modules, getModule, dealProbability, DEAL_CLOSED } from '@/portal/modules'
import { fieldByKey, fieldVisible, optionColor, optionLabel, type BaseRecord, type ModuleDef, type Role, type ChecklistItem, type LineItem } from '@/portal/schema'
import { fmtMoney, fmtDate, fmtDateTime, fmtNumber, dayKey } from '@/portal/format'
import { invoiceTotals } from '@/portal/zatca'
import type { Activity } from '@/portal/store'
import { TeamAccountPanel } from './TeamAccountPanel'

/** 05xxxxxxxx / +9665… → wa.me link (Saudi numbers by default). */
function whatsappHref(phone: unknown): string | null {
  let d = String(phone ?? '').replace(/[^\d]/g, '')
  if (d.length < 9) return null
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('0')) d = `966${d.slice(1)}`
  else if (d.length === 9 && d.startsWith('5')) d = `966${d}`
  return `https://wa.me/${d}`
}

export function RecordDetail({ def, id, initial, canWrite, role, viewerId, autoInvite }: { def: ModuleDef; id: string; initial: BaseRecord; canWrite: boolean; role: Role; viewerId?: string; autoInvite?: boolean }) {
  const router = useRouter()
  const toast = useToast()
  const { confirm, confirmNode } = useConfirm()
  const { rows } = useRecords(def.key)
  const rec = rows?.find(r => r.id === id) ?? initial
  const [editing, setEditing] = useState(false)
  const [logging, setLogging] = useState(false)
  const [activity, setActivity] = useState<Activity[]>([])
  const isStaff = role === 'admin' || role === 'manager'

  useEffect(() => {
    api<{ activity: Activity[] }>(`/activity?module=${def.key}&recordId=${id}&limit=20`).then(r => setActivity(r.activity)).catch(() => {})
  }, [def.key, id, rec.updatedAt])

  const status = fieldByKey(def, def.statusField ?? '')
  const title = String(rec[def.titleField] ?? rec.number ?? def.singular)
  const interactionsDef = getModule('interactions')
  const canLog = isStaff && (def.key === 'clients' || def.key === 'deals') && !!interactionsDef
  const wa = def.key === 'clients' ? whatsappHref(rec.phone) : null

  const remove = async () => {
    if (!(await confirm(`حذف «${title}» نهائياً؟ لا يمكن التراجع.`))) return
    try { await deleteRecord(def.key, id); toast('تم الحذف', 'success'); router.push(`/portal/${def.key}`) } catch (e) { toast((e as Error).message, 'error') }
  }

  const related = modules.filter(m => m.key !== def.key && m.permissions.read.includes(role) && m.fields.some(f => f.type === 'relation' && f.relation === def.key))
  const shownFields = def.fields.filter(f => f.type !== 'password' && f.key !== def.titleField && f.key !== status?.key && fieldVisible(f, rec)
    && !(def.key === 'tasks' && (f.key === 'rating' || f.key === 'ratingNote' || f.key === 'checklist')))

  return (
    <div>
      <Link href={`/portal/${def.key}`} className="pt-dim" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}><Icon name="arrowLeft" size={14} style={{ transform: 'scaleX(-1)' }} /> كل {def.label}</Link>
      <div className="pt-page-head">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {def.key === 'team' && <Avatar name={title} color={rec.color ? String(rec.color) : undefined} size={56} />}
          <div>
            <div className="pt-eyebrow" style={{ color: def.color }}>{def.singular}{rec.number && def.titleField !== 'number' ? ` · ${rec.number}` : ''}{rec.demo === true ? ' · بيانات تجريبية' : ''}</div>
            <h1 className="pt-h1" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {title}
              {status && rec[status.key] ? <Chip label={optionLabel(status, rec[status.key])} color={optionColor(status, rec[status.key])} /> : null}
            </h1>
            <p className="pt-lead">آخر تحديث <RelTime at={rec.updatedAt} />{rec.createdAt ? ` · أُنشئ ${fmtDate(rec.createdAt)}` : ''}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="pt-btn"><Icon name="whatsapp" /> واتساب</a>}
          {canLog && <button type="button" className="pt-btn" onClick={() => setLogging(true)}><Icon name="phone" /> سجّل تواصل</button>}
          {def.key === 'invoices' && <Link href={`/portal/invoices/${id}/print`} className="pt-btn"><Icon name="print" /> طباعة / PDF</Link>}
          {canWrite && <button type="button" className="pt-btn pt-btn-primary" onClick={() => setEditing(true)}><Icon name="edit" /> تعديل</button>}
          {canWrite && <button type="button" className="pt-btn pt-btn-danger pt-btn-icon" onClick={remove} aria-label="حذف"><Icon name="trash" /></button>}
        </div>
      </div>

      {status?.options && canWrite && (
        <div className="pt-filter-row" style={{ marginBottom: '1.25rem' }}>
          {status.options.map(o => <QuickStatus key={o.value} def={def} rec={rec} field={status.key} value={o.value} label={o.label} color={o.color} />)}
        </div>
      )}

      <div className="pt-detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {def.key === 'deals' && <DealSummary rec={rec} />}
          {def.key === 'tasks' && <TaskChecklist rec={rec} canWrite={canWrite} />}

          <section className="pt-card pt-card-pad">
            <dl className="pt-dl">
              {shownFields.map(f => (
                <div key={f.key} className={f.type === 'textarea' || f.type === 'items' || f.type === 'tags' ? 'full' : ''}>
                  <dt>{f.label}</dt>
                  <dd className={f.type === 'textarea' ? 'pre' : ''}>
                    {f.type === 'items' ? <ItemsTable rec={rec} /> : <FieldValue field={f} value={rec[f.key]} record={rec} def={def} />}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {related.map(m => <RelatedList key={m.key} def={m} parent={rec} parentKey={def.key} parentTitle={title} role={role} />)}
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {def.key === 'team' && viewerId && <TeamAccountPanel member={rec} viewerId={viewerId} viewerRole={role} autoInvite={autoInvite} />}
          {def.key === 'tasks' && <TaskRating rec={rec} isStaff={isStaff} />}
          <section className="pt-card">
            <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="activity" size={16} /> سجل النشاط</h3></div>
            <div className="pt-card-pad pt-timeline">
              {activity.length === 0 && <span className="pt-dim" style={{ fontSize: '0.8rem' }}>لا نشاط مسجّل بعد</span>}
              {activity.map(a => (
                <div key={a.id} className="pt-tl-item">
                  <i className="pt-tl-dot" style={{ background: a.action === 'create' ? 'var(--viz-3)' : a.action === 'delete' ? 'var(--viz-8)' : 'var(--viz-1)' }} />
                  <div>
                    <div><strong>{a.userName}</strong> {a.action === 'create' ? 'أنشأ السجل' : a.action === 'update' ? `عدّل: ${a.summary ?? ''}` : 'حذف'}</div>
                    <div className="pt-tl-when"><RelTime at={a.at} /></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {editing && <RecordForm def={def} record={rec} role={role} onClose={() => setEditing(false)} />}
      {logging && interactionsDef && (
        <RecordForm
          def={interactionsDef} role={role}
          initial={def.key === 'deals' ? { deal: id, client: rec.client } : { client: id }}
          onClose={() => setLogging(false)}
        />
      )}
      {confirmNode}
    </div>
  )
}

/* ── Task: rating card ─────────────────────────────────────────────── */
function TaskRating({ rec, isStaff }: { rec: BaseRecord; isStaff: boolean }) {
  const toast = useToast()
  const done = rec.status === 'done'
  const rating = typeof rec.rating === 'number' ? rec.rating : null
  const [note, setNote] = useState(String(rec.ratingNote ?? ''))
  const [busy, setBusy] = useState(false)
  useEffect(() => { setNote(String(rec.ratingNote ?? '')) }, [rec.ratingNote])

  const save = async (patch: Record<string, unknown>, msg: string) => {
    setBusy(true)
    try { await updateRecord('tasks', rec.id, patch); toast(msg, 'success') } catch (e) { toast((e as Error).message, 'error') } finally { setBusy(false) }
  }
  const onTime = done && rec.dueDate ? dayKey(rec.completedAt || rec.updatedAt) <= String(rec.dueDate) : null

  return (
    <section className="pt-card">
      <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="star" size={16} /> تقييم الإنجاز</h3></div>
      <div className="pt-card-pad" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {!done ? (
          <p className="pt-muted" style={{ fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>
            التقييم يُفتح بعد أن تصبح المهمة <strong style={{ color: 'var(--pt-text)' }}>«مكتملة»</strong>. المشرف يعطيها من ١ إلى ٥ نجوم.
          </p>
        ) : isStaff ? (
          <>
            <StarInput value={rating} disabled={busy} onChange={v => save({ rating: v }, v ? `تم التقييم: ${v} من ٥` : 'أُزيل التقييم')} />
            <label className="pt-field">
              <span className="pt-label">ملاحظة للمكلّف (اختياري)</span>
              <textarea className="pt-textarea" style={{ minHeight: 70 }} value={note} onChange={e => setNote(e.target.value)} placeholder="ما الذي كان ممتازاً؟ ما الذي يتحسّن؟" />
            </label>
            {note !== String(rec.ratingNote ?? '') && <button type="button" className="pt-btn pt-btn-sm" disabled={busy} onClick={() => save({ ratingNote: note }, 'حُفظت الملاحظة')}>حفظ الملاحظة</button>}
          </>
        ) : (
          <>
            <Stars value={rating} size={24} showNumber />
            {rating === null && <p className="pt-muted" style={{ fontSize: '0.8rem', margin: 0 }}>بانتظار تقييم المشرف.</p>}
            {rec.ratingNote ? <p style={{ fontSize: '0.84rem', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>«{String(rec.ratingNote)}»</p> : null}
          </>
        )}
        {done && (
          <div className="pt-dim" style={{ fontSize: '0.74rem', lineHeight: 1.8, borderTop: '1px solid var(--pt-line)', paddingTop: '0.7rem' }}>
            {rec.completedAt ? <>اكتملت {fmtDateTime(rec.completedAt)}<br /></> : null}
            {onTime === null ? 'بدون تاريخ استحقاق' : onTime ? <span style={{ color: '#7FE0A8' }}>✓ سُلّمت في الموعد</span> : <span className="pt-overdue">سُلّمت بعد الموعد ({fmtDate(rec.dueDate)})</span>}
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Task: interactive checklist ───────────────────────────────────── */
function TaskChecklist({ rec, canWrite }: { rec: BaseRecord; canWrite: boolean }) {
  const toast = useToast()
  const items = Array.isArray(rec.checklist) ? (rec.checklist as ChecklistItem[]) : []
  const [draft, setDraft] = useState('')
  if (items.length === 0 && !canWrite) return null
  const done = items.filter(i => i.done).length
  const save = async (next: ChecklistItem[]) => {
    try { await updateRecord('tasks', rec.id, { checklist: next }) } catch (e) { toast((e as Error).message, 'error') }
  }
  const add = () => { const t = draft.trim(); if (!t) return; setDraft(''); save([...items, { text: t, done: false }]) }
  return (
    <section className="pt-card">
      <div className="pt-card-head">
        <h3 className="pt-card-title"><Icon name="tasks" size={16} /> خطوات فرعية {items.length > 0 && <span className="pt-nav-count">{done} / {items.length}</span>}</h3>
      </div>
      <div className="pt-card-pad" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.length > 0 && <div className="pt-progress"><i style={{ width: `${(done / items.length) * 100}%` }} /></div>}
        <div className="pt-check">
          {items.map((it, i) => (
            <label key={`${i}-${it.text}`} className="pt-check-row" data-done={it.done}>
              <input type="checkbox" checked={it.done} disabled={!canWrite} onChange={e => save(items.map((x, j) => (j === i ? { ...x, done: e.target.checked } : x)))} />
              <span>{it.text}</span>
            </label>
          ))}
          {canWrite && (
            <div className="pt-check-row">
              <Icon name="plus" size={16} style={{ opacity: 0.5 }} />
              <input type="text" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }} placeholder={items.length ? 'أضف خطوة أخرى واضغط Enter' : 'قسّم المهمة لخطوات — اكتب أول خطوة واضغط Enter'} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Deal: value × probability summary ─────────────────────────────── */
function DealSummary({ rec }: { rec: BaseRecord }) {
  const value = Number(rec.value) || 0
  const prob = dealProbability(rec)
  const closed = DEAL_CLOSED.includes(String(rec.stage))
  return (
    <section className="pt-card pt-card-pad" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
      <div><div className="pt-dim" style={{ fontSize: '0.72rem' }}>قيمة الفرصة</div><div className="pt-tile-value" style={{ fontSize: '1.4rem' }}>{fmtMoney(value)}</div></div>
      <div><div className="pt-dim" style={{ fontSize: '0.72rem' }}>احتمال الفوز</div><div className="pt-tile-value" style={{ fontSize: '1.4rem' }}>{fmtNumber(prob)}٪</div></div>
      <div>
        <div className="pt-dim" style={{ fontSize: '0.72rem' }}>{closed ? (rec.stage === 'won' ? 'الإيراد المحقّق' : 'خسرناها') : 'تُحسب في التوقّع بـ'}</div>
        <div className="pt-tile-value" style={{ fontSize: '1.4rem' }}>{fmtMoney(rec.stage === 'lost' ? 0 : Math.round(value * prob / 100))}</div>
      </div>
    </section>
  )
}

function QuickStatus({ def, rec, field, value, label, color }: { def: ModuleDef; rec: BaseRecord; field: string; value: string; label: string; color?: string }) {
  const toast = useToast()
  const on = rec[field] === value
  const set = async () => {
    if (on) return
    try {
      await updateRecord(def.key, rec.id, { [field]: value })
      toast(`الحالة الآن: ${label}`, 'success')
    } catch (e) { toast((e as Error).message, 'error') }
  }
  return <button type="button" className="pt-filter-pill" aria-pressed={on} onClick={set}><i className="pt-dot" style={{ background: color ?? '#6B7A99' }} />{label}</button>
}

function ItemsTable({ rec }: { rec: BaseRecord }) {
  const items = Array.isArray(rec.items) ? (rec.items as LineItem[]) : []
  const t = invoiceTotals(items, rec.discount, rec.vatRate)
  return (
    <div className="pt-table-wrap" style={{ marginTop: '0.25rem' }}>
      <table className="pt-table" style={{ minWidth: 0 }}>
        <thead><tr><th>البيان</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
        <tbody>
          {items.map((it, i) => <tr key={i} style={{ cursor: 'default' }}><td>{it.description}</td><td className="pt-num">{it.qty}</td><td className="pt-money">{fmtMoney(it.price)}</td><td className="pt-money">{fmtMoney(it.qty * it.price)}</td></tr>)}
          <tr style={{ cursor: 'default' }}><td colSpan={3} className="pt-muted">المجموع قبل الضريبة</td><td className="pt-money">{fmtMoney(t.subtotal)}</td></tr>
          {t.discount > 0 && <tr style={{ cursor: 'default' }}><td colSpan={3} className="pt-muted">الخصم</td><td className="pt-money">− {fmtMoney(t.discount)}</td></tr>}
          <tr style={{ cursor: 'default' }}><td colSpan={3} className="pt-muted">ضريبة القيمة المضافة {t.vatRate}٪</td><td className="pt-money">{fmtMoney(t.vat)}</td></tr>
          <tr style={{ cursor: 'default' }}><td colSpan={3}><strong>الإجمالي شامل الضريبة</strong></td><td className="pt-money"><strong>{fmtMoney(t.total)}</strong></td></tr>
        </tbody>
      </table>
    </div>
  )
}

function RelatedList({ def, parent, parentKey, parentTitle, role }: { def: ModuleDef; parent: BaseRecord; parentKey: string; parentTitle: string; role: Role }) {
  const { rows } = useRecords(def.key)
  const [adding, setAdding] = useState(false)
  const relField = def.fields.find(f => f.type === 'relation' && f.relation === parentKey)!
  const status = fieldByKey(def, def.statusField ?? '')
  const canAdd = def.permissions.write.includes(role)
  if (rows === undefined) return null
  const items = rows.filter(r => r[relField.key] === parent.id)
  const dateOf = (r: BaseRecord) => r.dueDate || r.publishAt || r.at || r.expectedClose || r.issueDate || r.date
  // when adding from a project/deal, carry its client along
  const prefill: Record<string, unknown> = { [relField.key]: parent.id }
  if (relField.key !== 'client' && parent.client && def.fields.some(f => f.key === 'client')) prefill.client = parent.client
  return (
    <section className="pt-card">
      <div className="pt-card-head">
        <h3 className="pt-card-title" style={{ color: def.color }}><Icon name={def.icon} size={16} /> {def.label} <span className="pt-nav-count">{items.length}</span></h3>
        {canAdd && <button type="button" className="pt-btn pt-btn-sm" onClick={() => setAdding(true)}><Icon name="plus" size={14} /> {def.singular}</button>}
      </div>
      <div className="pt-list">
        {items.length === 0 && <div className="pt-dim" style={{ padding: '1rem 1.25rem', fontSize: '0.8rem' }}>لا {def.label} مرتبطة بـ «{parentTitle}» بعد</div>}
        {items.slice(0, 8).map(r => (
          <Link key={r.id} href={`/portal/${def.key}/${r.id}`} className="pt-list-item">
            <div className="pt-list-main">
              <div className="pt-list-title">{String(r[def.titleField] ?? r.number ?? '')}</div>
              <div className="pt-list-sub">
                {dateOf(r) ? fmtDate(dateOf(r)) : ''}
                {def.key === 'invoices' ? ` · ${fmtMoney(invoiceTotals(r.items as LineItem[], r.discount, r.vatRate).total)}` : ''}
                {def.key === 'expenses' ? ` · ${fmtMoney(r.amount)}` : ''}
                {def.key === 'deals' ? ` · ${fmtMoney(r.value)}` : ''}
                {def.key === 'interactions' && r.nextAction ? ` · التالي: ${String(r.nextAction)}` : ''}
              </div>
            </div>
            {def.key === 'tasks' && typeof r.rating === 'number' && <Stars value={r.rating} size={13} />}
            {status && r[status.key] ? <Chip label={optionLabel(status, r[status.key])} color={optionColor(status, r[status.key])} small /> : null}
          </Link>
        ))}
        {items.length > 8 && <Link href={`/portal/${def.key}`} className="pt-list-item pt-dim" style={{ fontSize: '0.78rem', justifyContent: 'center' }}>عرض الكل ({items.length})</Link>}
      </div>
      {adding && <RecordForm def={def} role={role} initial={prefill} onClose={() => setAdding(false)} />}
    </section>
  )
}
