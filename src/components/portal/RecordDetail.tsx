'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from './Icon'
import { Chip, useConfirm, useToast, Avatar } from './ui'
import { FieldValue } from './FieldValue'
import { RecordForm } from './RecordForm'
import { useRecords, deleteRecord, api } from './data'
import { modules, getModule } from '@/portal/modules'
import { fieldByKey, optionColor, optionLabel, type BaseRecord, type ModuleDef } from '@/portal/schema'
import { fmtRelative, fmtMoney, fmtDate } from '@/portal/format'
import { invoiceTotals } from '@/portal/zatca'
import type { LineItem } from '@/portal/schema'
import type { Activity } from '@/portal/store'

export function RecordDetail({ def, id, initial, canWrite }: { def: ModuleDef; id: string; initial: BaseRecord; canWrite: boolean }) {
  const router = useRouter()
  const toast = useToast()
  const { confirm, confirmNode } = useConfirm()
  const { rows } = useRecords(def.key)
  const rec = rows?.find(r => r.id === id) ?? initial
  const [editing, setEditing] = useState(false)
  const [activity, setActivity] = useState<Activity[]>([])

  useEffect(() => {
    api<{ activity: Activity[] }>(`/activity?module=${def.key}&recordId=${id}&limit=20`).then(r => setActivity(r.activity)).catch(() => {})
  }, [def.key, id, rec.updatedAt])

  const status = fieldByKey(def, def.statusField ?? '')
  const title = String(rec[def.titleField] ?? rec.number ?? def.singular)

  const remove = async () => {
    if (!(await confirm(`حذف «${title}» نهائياً؟ لا يمكن التراجع.`))) return
    try { await deleteRecord(def.key, id); toast('تم الحذف', 'success'); router.push(`/portal/${def.key}`) } catch (e) { toast((e as Error).message, 'error') }
  }

  // related records: any module with a relation field pointing at this module
  const related = modules.filter(m => m.key !== def.key && m.fields.some(f => f.type === 'relation' && f.relation === def.key))

  return (
    <div>
      <Link href={`/portal/${def.key}`} className="pt-dim" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}><Icon name="arrowLeft" size={14} style={{ transform: 'scaleX(-1)' }} /> كل {def.label}</Link>
      <div className="pt-page-head">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {def.key === 'team' && <Avatar name={title} color={rec.color ? String(rec.color) : undefined} size={56} />}
          <div>
            <div className="pt-eyebrow" style={{ color: def.color }}>{def.singular}{rec.number && def.titleField !== 'number' ? ` · ${rec.number}` : ''}</div>
            <h1 className="pt-h1" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {title}
              {status && rec[status.key] ? <Chip label={optionLabel(status, rec[status.key])} color={optionColor(status, rec[status.key])} /> : null}
            </h1>
            <p className="pt-lead">آخر تحديث {fmtRelative(rec.updatedAt)}{rec.createdAt ? ` · أُنشئ ${fmtDate(rec.createdAt)}` : ''}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {def.key === 'invoices' && <Link href={`/portal/invoices/${id}/print`} className="pt-btn"><Icon name="print" /> طباعة / PDF</Link>}
          {canWrite && <button type="button" className="pt-btn pt-btn-primary" onClick={() => setEditing(true)}><Icon name="edit" /> تعديل</button>}
          {canWrite && <button type="button" className="pt-btn pt-btn-danger pt-btn-icon" onClick={remove} aria-label="حذف"><Icon name="trash" /></button>}
        </div>
      </div>

      {/* Quick status switcher */}
      {status?.options && canWrite && (
        <div className="pt-filter-row" style={{ marginBottom: '1.25rem' }}>
          {status.options.map(o => (
            <QuickStatus key={o.value} def={def} rec={rec} field={status.key} value={o.value} label={o.label} color={o.color} />
          ))}
        </div>
      )}

      <div className="pt-detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <section className="pt-card pt-card-pad">
            <dl className="pt-dl">
              {def.fields.filter(f => f.type !== 'password' && f.key !== def.titleField && f.key !== status?.key).map(f => (
                <div key={f.key} className={f.type === 'textarea' || f.type === 'items' || f.type === 'tags' ? 'full' : ''}>
                  <dt>{f.label}</dt>
                  <dd className={f.type === 'textarea' ? 'pre' : ''}>
                    {f.type === 'items' ? <ItemsTable rec={rec} /> : <FieldValue field={f} value={rec[f.key]} record={rec} def={def} />}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {related.map(m => <RelatedList key={m.key} def={m} parentKey={def.key} parentId={id} parentTitle={title} canWrite={canWrite} />)}
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <section className="pt-card">
            <div className="pt-card-head"><h3 className="pt-card-title"><Icon name="activity" size={16} /> سجل النشاط</h3></div>
            <div className="pt-card-pad pt-timeline">
              {activity.length === 0 && <span className="pt-dim" style={{ fontSize: '0.8rem' }}>لا نشاط مسجّل بعد</span>}
              {activity.map(a => (
                <div key={a.id} className="pt-tl-item">
                  <i className="pt-tl-dot" style={{ background: a.action === 'create' ? '#2E9E6B' : a.action === 'delete' ? '#C4504A' : 'var(--gold)' }} />
                  <div>
                    <div><strong>{a.userName}</strong> {a.action === 'create' ? 'أنشأ السجل' : a.action === 'update' ? `عدّل: ${a.summary ?? ''}` : 'حذف'}</div>
                    <div className="pt-tl-when">{fmtRelative(a.at)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {editing && <RecordForm def={def} record={rec} onClose={() => setEditing(false)} />}
      {confirmNode}
    </div>
  )
}

function QuickStatus({ def, rec, field, value, label, color }: { def: ModuleDef; rec: BaseRecord; field: string; value: string; label: string; color?: string }) {
  const toast = useToast()
  const on = rec[field] === value
  const set = async () => {
    if (on) return
    try {
      const { updateRecord } = await import('./data')
      const patch: Record<string, unknown> = { [field]: value }
      if (def.key === 'invoices' && value === 'paid' && !rec.paidAt) patch.paidAt = new Date().toISOString().slice(0, 10)
      await updateRecord(def.key, rec.id, patch)
      toast(`الحالة الآن: ${label}`, 'success')
    } catch (e) { toast((e as Error).message, 'error') }
  }
  return <button type="button" className="pt-filter-pill" aria-pressed={on} onClick={set}><i className="pt-dot" style={{ background: color ?? '#6B7A99' }} />{label}</button>
}

function ItemsTable({ rec }: { rec: BaseRecord }) {
  const items = (rec.items as LineItem[]) ?? []
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

function RelatedList({ def, parentKey, parentId, parentTitle, canWrite }: { def: ModuleDef; parentKey: string; parentId: string; parentTitle: string; canWrite: boolean }) {
  const { rows } = useRecords(def.key)
  const [adding, setAdding] = useState(false)
  const relField = def.fields.find(f => f.type === 'relation' && f.relation === parentKey)!
  const items = (rows ?? []).filter(r => r[relField.key] === parentId)
  const status = fieldByKey(def, def.statusField ?? '')
  // only show modules the user can actually see (rows undefined + no error means still loading; a 403 redirects to login so this is fine)
  if (rows === undefined) return null
  return (
    <section className="pt-card">
      <div className="pt-card-head">
        <h3 className="pt-card-title" style={{ color: def.color }}><Icon name={def.icon} size={16} /> {def.label} <span className="pt-nav-count">{items.length}</span></h3>
        {canWrite && def.permissions.write.length > 0 && <button type="button" className="pt-btn pt-btn-sm" onClick={() => setAdding(true)}><Icon name="plus" size={14} /> {def.singular}</button>}
      </div>
      <div className="pt-list">
        {items.length === 0 && <div className="pt-dim" style={{ padding: '1rem 1.25rem', fontSize: '0.8rem' }}>لا {def.label} مرتبطة بـ «{parentTitle}» بعد</div>}
        {items.slice(0, 8).map(r => (
          <Link key={r.id} href={`/portal/${def.key}/${r.id}`} className="pt-list-item">
            <div className="pt-list-main">
              <div className="pt-list-title">{String(r[def.titleField] ?? r.number ?? '')}</div>
              <div className="pt-list-sub">{r.dueDate || r.publishAt || r.issueDate || r.date ? fmtDate(r.dueDate || r.publishAt || r.issueDate || r.date) : ''}{def.key === 'invoices' ? ` · ${fmtMoney(invoiceTotals(r.items as LineItem[], r.discount, r.vatRate).total)}` : ''}{def.key === 'expenses' ? ` · ${fmtMoney(r.amount)}` : ''}</div>
            </div>
            {status && r[status.key] ? <Chip label={optionLabel(status, r[status.key])} color={optionColor(status, r[status.key])} small /> : null}
          </Link>
        ))}
        {items.length > 8 && <Link href={`/portal/${def.key}`} className="pt-list-item pt-dim" style={{ fontSize: '0.78rem', justifyContent: 'center' }}>عرض الكل ({items.length})</Link>}
      </div>
      {adding && <RecordForm def={def} initial={{ [relField.key]: parentId, ...(getModule(parentKey)?.key === 'projects' && def.fields.some(f => f.key === 'client') ? {} : {}) }} onClose={() => setAdding(false)} />}
    </section>
  )
}
