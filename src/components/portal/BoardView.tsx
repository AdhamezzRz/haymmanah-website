'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateRecord } from './data'
import { useToast, Chip } from './ui'
import { RelationValue } from './FieldValue'
import { Stars } from './charts'
import { Icon } from './Icon'
import { fieldByKey, type BaseRecord, type ModuleDef, type ChecklistItem, type LineItem } from '@/portal/schema'
import { fmtDate, fmtMoney, isOverdue } from '@/portal/format'
import { invoiceTotals } from '@/portal/zatca'

const DONE_LIKE = ['done', 'paid', 'void', 'published', 'delivered', 'archived', 'ended', 'won', 'lost']

/** Kanban by the module's status field. Native drag & drop, optimistic update. */
export function BoardView({ def, rows, canWrite, onNew }: { def: ModuleDef; rows: BaseRecord[]; canWrite: boolean; onNew?: (prefill: Record<string, unknown>) => void }) {
  const router = useRouter()
  const toast = useToast()
  const status = fieldByKey(def, def.statusField ?? '')
  const [dragging, setDragging] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  if (!status?.options) return null

  const drop = async (value: string) => {
    setOver(null)
    if (!dragging || !canWrite) return
    const rec = rows.find(r => r.id === dragging)
    setDragging(null)
    if (!rec || rec[status.key] === value) return
    try {
      await updateRecord(def.key, rec.id, { [status.key]: value })
      if (def.key === 'tasks' && value === 'done') toast('أحسنت! اكتملت المهمة — بانتظار تقييم المشرف ⭐', 'success')
      if (def.key === 'deals' && value === 'won') toast('مبروك! 🎉 الفرصة مكسوبة والعميل أصبح نشطاً', 'success')
    } catch (e) {
      toast((e as Error).message, 'error')
    }
  }

  const columnTotal = (items: BaseRecord[]) => {
    if (def.key === 'deals') return fmtMoney(items.reduce((s, r) => s + (Number(r.value) || 0), 0))
    if (def.key === 'invoices') return fmtMoney(items.reduce((s, r) => s + invoiceTotals(r.items as LineItem[], r.discount, r.vatRate).total, 0))
    return null
  }

  return (
    <div className="pt-board">
      {status.options.map(col => {
        const items = rows.filter(r => String(r[status.key] ?? '') === col.value)
        const total = columnTotal(items)
        return (
          <section
            key={col.value}
            className="pt-col"
            data-over={over === col.value}
            onDragOver={e => { if (canWrite) { e.preventDefault(); setOver(col.value) } }}
            onDragLeave={() => setOver(o => (o === col.value ? null : o))}
            onDrop={() => drop(col.value)}
            aria-label={col.label}
          >
            <header className="pt-col-head" style={{ background: 'rgba(10,13,40,0.6)' }}>
              <i className="pt-dot" style={{ background: col.color ?? '#6B7A99' }} />
              <span>{col.label}</span>
              <span className="pt-nav-count">{items.length}</span>
              {onNew && canWrite && <button type="button" className="pt-btn pt-btn-ghost pt-btn-icon" style={{ marginInlineStart: 'auto', width: 28, height: 28 }} onClick={() => onNew({ [status.key]: col.value })} aria-label={`إضافة في ${col.label}`}><Icon name="plus" size={14} /></button>}
            </header>
            {total && items.length > 0 && <div className="pt-dim pt-num" style={{ fontSize: '0.72rem', padding: '0.4rem 1rem 0' }}>{total}</div>}
            <div className="pt-col-body">
              {items.map(r => {
                const due = r.dueDate ?? r.publishAt ?? r.expectedClose ?? r.nextFollowUp ?? r.issueDate
                const late = due && isOverdue(due) && !DONE_LIKE.includes(col.value)
                const sub = def.subtitleField ? fieldByKey(def, def.subtitleField) : undefined
                const checklist = Array.isArray(r.checklist) ? (r.checklist as ChecklistItem[]) : []
                const doneSteps = checklist.filter(c => c.done).length
                return (
                  <article
                    key={r.id}
                    className="pt-kcard"
                    draggable={canWrite}
                    data-dragging={dragging === r.id}
                    onDragStart={e => { setDragging(r.id); e.dataTransfer.effectAllowed = 'move' }}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => router.push(`/portal/${def.key}/${r.id}`)}
                  >
                    <div className="pt-kcard-title">{String(r[def.titleField] ?? r.number ?? '')}</div>
                    {sub && r[sub.key] ? <div className="pt-kcard-sub">{sub.type === 'relation' ? <RelationValue module={sub.relation!} id={r[sub.key]} avatar={false} /> : String(r[sub.key])}</div> : null}
                    {checklist.length > 0 && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <div className="pt-progress" aria-label={`${doneSteps} من ${checklist.length} خطوات`}><i style={{ width: `${(doneSteps / checklist.length) * 100}%` }} /></div>
                        <div className="pt-dim pt-num" style={{ fontSize: '0.68rem', marginTop: '0.2rem' }}>{doneSteps} / {checklist.length} خطوة</div>
                      </div>
                    )}
                    {def.key === 'tasks' && col.value === 'done' && <div style={{ marginBottom: '0.4rem' }}><Stars value={typeof r.rating === 'number' ? r.rating : null} size={14} /></div>}
                    <div className="pt-kcard-meta">
                      <span className={late ? 'pt-overdue' : ''}>{due ? fmtDate(due) : ''}</span>
                      {def.key === 'invoices' && <span className="pt-money" style={{ color: 'var(--pt-text)' }}>{fmtMoney(invoiceTotals(r.items as LineItem[], r.discount, r.vatRate).total)}</span>}
                      {def.key === 'deals' && <span className="pt-money" style={{ color: 'var(--pt-text)' }}>{fmtMoney(r.value)}</span>}
                      {def.key === 'clients' && r.retainer ? <span className="pt-money" style={{ color: 'var(--pt-text)' }}>{fmtMoney(r.retainer)}/شهر</span> : null}
                      {(r.priority === 'high' || r.priority === 'urgent') && <Chip label={r.priority === 'urgent' ? 'عاجلة' : 'عالية'} color={r.priority === 'urgent' ? '#C4504A' : '#D98E04'} small />}
                      {r.assignee ? <RelationValue module="team" id={r.assignee} /> : r.owner ? <RelationValue module="team" id={r.owner} /> : null}
                    </div>
                  </article>
                )
              })}
              {items.length === 0 && <div className="pt-dim" style={{ fontSize: '0.75rem', textAlign: 'center', padding: '1.5rem 0' }}>{canWrite ? 'اسحب بطاقة إلى هنا' : 'لا شيء هنا'}</div>}
            </div>
          </section>
        )
      })}
    </div>
  )
}
