'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icon } from './Icon'
import { Spinner } from './ui'
import { useRecords } from './data'
import { RecordTable } from './RecordTable'
import { BoardView } from './BoardView'
import { CalendarView } from './CalendarView'
import { RecordForm } from './RecordForm'
import { fieldByKey, type ModuleDef, type ViewKind, type BaseRecord } from '@/portal/schema'
import { fmtMoney } from '@/portal/format'
import { invoiceTotals } from '@/portal/zatca'
import type { LineItem } from '@/portal/schema'

const VIEW_META: Record<ViewKind, { label: string; icon: string }> = {
  table: { label: 'جدول', icon: 'table' },
  board: { label: 'لوحة', icon: 'board' },
  calendar: { label: 'تقويم', icon: 'calendar' },
}

export function ModuleView({ def, canWrite }: { def: ModuleDef; canWrite: boolean }) {
  const router = useRouter()
  const search = useSearchParams()
  const { rows, loading, error, refresh } = useRecords(def.key)
  const views = def.views?.length ? def.views : ['table' as ViewKind]
  const [view, setView] = useState<ViewKind>(views[0])
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [form, setForm] = useState<{ open: boolean; prefill?: Record<string, unknown> }>({ open: false })

  // remembered view per module
  useEffect(() => {
    try { const v = localStorage.getItem(`hm-view-${def.key}`) as ViewKind | null; if (v && views.includes(v)) setView(v) } catch { /* ignore */ }
  }, [def.key, views])
  const pickView = (v: ViewKind) => { setView(v); try { localStorage.setItem(`hm-view-${def.key}`, v) } catch { /* ignore */ } }

  // ?new=1 from ⌘K
  useEffect(() => {
    if (search.get('new') === '1' && canWrite) { setForm({ open: true }); router.replace(`/portal/${def.key}`) }
  }, [search, canWrite, def.key, router])

  const status = fieldByKey(def, def.statusField ?? '')
  const searchKeys = def.fields.filter(f => f.search).map(f => f.key)

  const filtered = useMemo(() => {
    let out = rows ?? []
    if (statusFilter.length && status) out = out.filter(r => statusFilter.includes(String(r[status.key] ?? '')))
    const term = q.trim().toLowerCase()
    if (term) out = out.filter(r => searchKeys.some(k => String(r[k] ?? '').toLowerCase().includes(term)) || String(r.number ?? '').toLowerCase().includes(term))
    return out
  }, [rows, statusFilter, status, q, searchKeys])

  const summary = useMemo(() => {
    if (def.key === 'invoices') {
      const t = (filtered as BaseRecord[]).reduce((acc, r) => { const x = invoiceTotals(r.items as LineItem[], r.discount, r.vatRate).total; if (r.status === 'paid') acc.paid += x; else if (r.status !== 'void' && r.status !== 'draft') acc.open += x; return acc }, { paid: 0, open: 0 })
      return `محصّل ${fmtMoney(t.paid)} · مستحق ${fmtMoney(t.open)}`
    }
    if (def.key === 'expenses') return `الإجمالي ${fmtMoney((filtered as BaseRecord[]).reduce((s, r) => s + (Number(r.amount) || 0), 0))}`
    if (def.key === 'clients') return `${filtered.filter(r => r.status === 'active').length} نشط من ${filtered.length}`
    return `${filtered.length} · ${def.label}`
  }, [filtered, def])

  const exportCsv = () => {
    const cols = def.fields.filter(f => f.type !== 'password' && f.type !== 'items')
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const lines = [cols.map(c => esc(c.label)).join(','), ...filtered.map(r => cols.map(c => esc(Array.isArray(r[c.key]) ? (r[c.key] as string[]).join(' | ') : r[c.key])).join(','))]
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${def.key}-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(a.href)
  }

  return (
    <div>
      <div className="pt-page-head">
        <div>
          <div className="pt-eyebrow" style={{ color: def.color }}>{summary}</div>
          <h1 className="pt-h1">{def.label}</h1>
          <p className="pt-lead">{def.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button type="button" className="pt-btn pt-btn-ghost pt-btn-icon" onClick={exportCsv} title="تصدير CSV" aria-label="تصدير CSV"><Icon name="download" /></button>
          <button type="button" className="pt-btn pt-btn-ghost pt-btn-icon" onClick={() => refresh()} title="تحديث" aria-label="تحديث"><Icon name="activity" /></button>
          {canWrite && <button type="button" className="pt-btn pt-btn-primary" onClick={() => setForm({ open: true })}><Icon name="plus" /> {def.newLabel}</button>}
        </div>
      </div>

      <div className="pt-toolbar">
        {views.length > 1 && (
          <div className="pt-seg" role="tablist">
            {views.map(v => <button key={v} type="button" role="tab" aria-pressed={view === v} onClick={() => pickView(v)}><Icon name={VIEW_META[v].icon} size={14} /> {VIEW_META[v].label}</button>)}
          </div>
        )}
        <input className="pt-input" placeholder={`ابحث في ${def.label}…`} value={q} onChange={e => setQ(e.target.value)} />
        {status?.options && (
          <div className="pt-filter-row">
            {status.options.map(o => {
              const on = statusFilter.includes(o.value)
              const n = (rows ?? []).filter(r => r[status.key] === o.value).length
              return <button key={o.value} type="button" className="pt-filter-pill" aria-pressed={on} onClick={() => setStatusFilter(s => (on ? s.filter(x => x !== o.value) : [...s, o.value]))}><i className="pt-dot" style={{ background: o.color ?? '#6B7A99' }} />{o.label} <span className="pt-dim">{n}</span></button>
            })}
          </div>
        )}
      </div>

      {error && <div className="pt-banner" role="alert"><Icon name="alert" /> {error}</div>}
      {loading ? (
        <div className="pt-empty"><Spinner size={28} /></div>
      ) : view === 'board' ? (
        <BoardView def={def} rows={filtered} canWrite={canWrite} onNew={canWrite ? prefill => setForm({ open: true, prefill }) : undefined} />
      ) : view === 'calendar' ? (
        <CalendarView def={def} rows={filtered} canWrite={canWrite} onNew={canWrite ? prefill => setForm({ open: true, prefill }) : undefined} />
      ) : (
        <RecordTable def={def} rows={filtered} onNew={canWrite ? () => setForm({ open: true }) : undefined} />
      )}

      {form.open && <RecordForm def={def} initial={form.prefill} onClose={() => setForm({ open: false })} />}
    </div>
  )
}
