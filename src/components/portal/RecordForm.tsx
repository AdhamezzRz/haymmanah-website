'use client'

import { useMemo, useState } from 'react'
import { Drawer, Spinner, useToast } from './ui'
import { Icon } from './Icon'
import { useRecords, createRecord, updateRecord, ApiError } from './data'
import { emptyRecord, fieldVisible, type FieldDef, type ModuleDef, type LineItem, type BaseRecord, type ChecklistItem } from '@/portal/schema'
import { StarInput } from './charts'
import { fmtMoney } from '@/portal/format'
import { invoiceTotals } from '@/portal/zatca'
import { getModule } from '@/portal/modules'
import type { Role } from '@/portal/schema'

/* ── datetime helpers: inputs are Riyadh-local, storage is ISO with +03:00 ── */
function isoToLocalInput(v: unknown): string {
  if (!v) return ''
  const d = new Date(String(v))
  if (Number.isNaN(d.getTime())) return ''
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d)
  const g = (t: string) => p.find(x => x.type === t)?.value ?? '00'
  return `${g('year')}-${g('month')}-${g('day')}T${g('hour')}:${g('minute')}`
}
const localInputToIso = (v: string) => (v ? `${v}:00+03:00` : '')

export function RecordForm({ def, record, initial, onClose, onSaved, role }: {
  def: ModuleDef
  /** Current user's role — hides fields this role may not change (e.g. task rating). */
  role?: Role
  record?: BaseRecord            // editing
  initial?: Record<string, unknown>   // prefill for create (e.g. date from calendar)
  onClose: () => void
  onSaved?: (rec: BaseRecord) => void
}) {
  const toast = useToast()
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const base: Record<string, unknown> = { ...emptyRecord(def), ...(record ?? {}), ...(initial ?? {}) }
    // a new record's required date/time starts at "now" (e.g. logging a call)
    if (!record) for (const f of def.fields) if (f.type === 'datetime' && f.required && !base[f.key]) base[f.key] = new Date().toISOString()
    return base
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const set = (k: string, v: unknown) => { setValues(s => ({ ...s, [k]: v })); setErrors(e => { const { [k]: _omit, ...rest } = e; void _omit; return rest }) }

  const editable = def.fields.filter(f => !f.readonly && (!f.writeRoles || !role || f.writeRoles.includes(role)))
  const shown = editable.filter(f => fieldVisible(f, values))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const payload: Record<string, unknown> = {}
      for (const f of shown) {
        const v = values[f.key]
        if (f.type === 'password' && !v) continue
        payload[f.key] = v
      }
      const saved = record ? await updateRecord(def.key, record.id, payload) : await createRecord(def.key, payload)
      toast(record ? 'تم حفظ التعديلات' : `تمت إضافة ${def.singular}`, 'success')
      onSaved?.(saved)
      onClose()
    } catch (err) {
      if (err instanceof ApiError && err.errors) setErrors(err.errors)
      toast((err as Error).message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Drawer
      title={record ? `تعديل ${def.singular}` : `إضافة ${def.singular}`}
      onClose={onClose}
      wide={def.fields.some(f => f.type === 'items')}
      footer={
        <>
          <button type="submit" form={`form-${def.key}`} className="pt-btn pt-btn-primary" disabled={busy}>{busy ? <Spinner /> : <Icon name="check" />} {record ? 'حفظ التعديلات' : 'إضافة'}</button>
          <button type="button" className="pt-btn pt-btn-ghost" onClick={onClose}>إلغاء</button>
          <span className="pt-dim" style={{ marginInlineStart: 'auto', fontSize: '0.7rem' }}>Esc للإغلاق</span>
        </>
      }
    >
      <form id={`form-${def.key}`} onSubmit={submit} className="pt-form-grid">
        {shown.map(f => (
          <Field key={f.key} field={f} value={values[f.key]} onChange={v => set(f.key, v)} error={errors[f.key]} values={values} />
        ))}
      </form>
    </Drawer>
  )
}

function Field({ field: f, value, onChange, error, values }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void; error?: string; values: Record<string, unknown> }) {
  const wide = !f.half || f.type === 'textarea' || f.type === 'items' || f.type === 'tags' || f.type === 'multiselect' || f.type === 'url' || f.type === 'checklist' || f.type === 'rating'
  const id = `f-${f.key}`
  const common = { id, 'aria-invalid': !!error, required: f.required && f.type !== 'password' }
  let control: React.ReactNode
  switch (f.type) {
    case 'textarea':
      control = <textarea {...common} className="pt-textarea" value={String(value ?? '')} onChange={e => onChange(e.target.value)} placeholder={f.placeholder} />; break
    case 'number': case 'money': case 'percent':
      control = <input {...common} className="pt-input pt-num" type="number" inputMode="decimal" dir="ltr" value={value === null || value === undefined ? '' : String(value)} onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))} min={f.min} max={f.max} step={f.step ?? (f.type === 'money' ? 0.01 : 1)} placeholder={f.placeholder} />; break
    case 'date':
      control = <input {...common} className="pt-input" type="date" dir="ltr" value={String(value ?? '').slice(0, 10)} onChange={e => onChange(e.target.value)} />; break
    case 'datetime':
      control = <input {...common} className="pt-input" type="datetime-local" dir="ltr" value={isoToLocalInput(value)} onChange={e => onChange(localInputToIso(e.target.value))} />; break
    case 'select':
      control = (
        <select {...common} className="pt-select" value={String(value ?? '')} onChange={e => onChange(e.target.value)}>
          <option value="">— اختر —</option>
          {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ); break
    case 'multiselect':
      control = (
        <div className="pt-multi" role="group" aria-labelledby={`${id}-label`}>
          {f.options?.map(o => {
            const on = Array.isArray(value) && (value as string[]).includes(o.value)
            return <button key={o.value} type="button" className="pt-multi-opt" aria-pressed={on} onClick={() => onChange(on ? (value as string[]).filter(x => x !== o.value) : [...((value as string[]) ?? []), o.value])}>{o.label}</button>
          })}
        </div>
      ); break
    case 'relation':
      control = <RelationSelect id={id} module={f.relation!} value={String(value ?? '')} onChange={onChange} required={!!f.required} invalid={!!error} />; break
    case 'boolean':
      control = (
        <label className="pt-switch" style={{ paddingTop: '0.4rem' }}>
          <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} />
          <span className="pt-muted">{value ? 'نعم' : 'لا'}</span>
        </label>
      ); break
    case 'color':
      control = <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><input {...common} className="pt-input" type="color" value={String(value || '#4C63C7')} onChange={e => onChange(e.target.value)} /><span className="pt-dim" dir="ltr" style={{ fontSize: '0.75rem' }}>{String(value || '')}</span></div>; break
    case 'tags':
      control = <TagsInput id={id} value={(value as string[]) ?? []} onChange={onChange} />; break
    case 'items':
      control = <ItemsEditor value={(value as LineItem[]) ?? []} onChange={onChange} discount={values.discount} vatRate={values.vatRate} />; break
    case 'rating':
      control = <StarInput value={typeof value === 'number' ? value : null} onChange={onChange} />; break
    case 'checklist':
      control = <ChecklistEditor value={(value as ChecklistItem[]) ?? []} onChange={onChange} />; break
    case 'password':
      control = <input {...common} className="pt-input" type="password" dir="ltr" autoComplete="new-password" value={String(value ?? '')} onChange={e => onChange(e.target.value)} placeholder="••••••••" minLength={8} />; break
    case 'email':
      control = <input {...common} className="pt-input" type="email" dir="ltr" value={String(value ?? '')} onChange={e => onChange(e.target.value)} placeholder={f.placeholder} />; break
    case 'phone':
      control = <input {...common} className="pt-input pt-num" type="tel" dir="ltr" value={String(value ?? '')} onChange={e => onChange(e.target.value)} placeholder={f.placeholder} />; break
    case 'url':
      control = <input {...common} className="pt-input" type="text" dir="ltr" value={String(value ?? '')} onChange={e => onChange(e.target.value)} placeholder={f.placeholder ?? 'https://'} />; break
    default:
      control = <input {...common} className="pt-input" type="text" value={String(value ?? '')} onChange={e => onChange(e.target.value)} placeholder={f.placeholder} />
  }
  return (
    <div className={`pt-field ${wide ? 'pt-field-full' : 'pt-field-half'}`}>
      <label className="pt-label" htmlFor={id} id={`${id}-label`}>{f.label}{f.required && f.type !== 'password' && <span className="req">*</span>}</label>
      {control}
      {error ? <span className="pt-error">{error}</span> : f.help ? <span className="pt-help">{f.help}</span> : null}
    </div>
  )
}

function RelationSelect({ id, module, value, onChange, required, invalid }: { id: string; module: string; value: string; onChange: (v: string) => void; required: boolean; invalid: boolean }) {
  const { rows, loading } = useRecords(module)
  const def = getModule(module)
  const titleKey = def?.titleField ?? 'name'
  const sorted = useMemo(() => [...(rows ?? [])].filter(r => module !== 'team' || r.active !== false).sort((a, b) => String(a[titleKey] ?? '').localeCompare(String(b[titleKey] ?? ''), 'ar')), [rows, titleKey, module])
  return (
    <select id={id} className="pt-select" value={value} onChange={e => onChange(e.target.value)} required={required} aria-invalid={invalid}>
      <option value="">{loading ? 'جارٍ التحميل…' : `— اختر ${def?.singular ?? ''} —`}</option>
      {sorted.map(r => <option key={r.id} value={r.id}>{String(r[titleKey] ?? r.number ?? '')}</option>)}
    </select>
  )
}

function ChecklistEditor({ value, onChange }: { value: ChecklistItem[]; onChange: (v: ChecklistItem[]) => void }) {
  const [draft, setDraft] = useState('')
  const add = () => { const t = draft.trim(); if (t) onChange([...value, { text: t, done: false }]); setDraft('') }
  return (
    <div className="pt-check">
      {value.map((it, i) => (
        <div key={i} className="pt-check-row" data-done={it.done}>
          <input type="checkbox" checked={it.done} onChange={e => onChange(value.map((x, j) => (j === i ? { ...x, done: e.target.checked } : x)))} aria-label={`تم: ${it.text}`} />
          <input type="text" value={it.text} onChange={e => onChange(value.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} aria-label="نص الخطوة" />
          <button type="button" className="pt-btn pt-btn-ghost pt-btn-icon" style={{ width: 28, height: 28 }} onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="حذف الخطوة"><Icon name="close" size={13} /></button>
        </div>
      ))}
      <div className="pt-check-row">
        <Icon name="plus" size={16} style={{ opacity: 0.5 }} />
        <input type="text" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }} onBlur={add} placeholder="أضف خطوة واضغط Enter — مثال: تجهيز قائمة اللقطات" />
      </div>
    </div>
  )
}

function TagsInput({ id, value, onChange }: { id: string; value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState('')
  const add = () => { const t = draft.trim().replace(/^#/, ''); if (t && !value.includes(t)) onChange([...value, t]); setDraft('') }
  return (
    <div className="pt-tags" onClick={() => document.getElementById(id)?.focus()}>
      {value.map(t => <span key={t} className="pt-tag">#{t}<button type="button" onClick={() => onChange(value.filter(x => x !== t))} aria-label={`حذف ${t}`}>×</button></span>)}
      <input id={id} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } else if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1)) }} onBlur={add} placeholder={value.length ? '' : 'اكتب وسماً واضغط Enter'} />
    </div>
  )
}

function ItemsEditor({ value, onChange, discount, vatRate }: { value: LineItem[]; onChange: (v: LineItem[]) => void; discount: unknown; vatRate: unknown }) {
  const rows = value.length ? value : [{ description: '', qty: 1, price: 0 }]
  const set = (i: number, patch: Partial<LineItem>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const t = invoiceTotals(rows, discount, vatRate)
  return (
    <div className="pt-items">
      <div className="pt-items-row pt-items-head"><span>البيان</span><span>الكمية</span><span>السعر</span><span>الإجمالي</span><span /></div>
      {rows.map((r, i) => (
        <div className="pt-items-row" key={i}>
          <input className="pt-input" value={r.description} onChange={e => set(i, { description: e.target.value })} placeholder="مثال: إدارة حسابات التواصل — شهر نوفمبر" />
          <input className="pt-input pt-num" type="number" dir="ltr" min={0} step={1} value={r.qty} onChange={e => set(i, { qty: Number(e.target.value) })} />
          <input className="pt-input pt-num" type="number" dir="ltr" min={0} step={0.01} value={r.price} onChange={e => set(i, { price: Number(e.target.value) })} />
          <span className="pt-money pt-muted">{fmtMoney((Number(r.qty) || 0) * (Number(r.price) || 0))}</span>
          <button type="button" className="pt-btn pt-btn-ghost pt-btn-icon" onClick={() => onChange(rows.filter((_, j) => j !== i))} aria-label="حذف البند" disabled={rows.length === 1}><Icon name="trash" size={15} /></button>
        </div>
      ))}
      <div><button type="button" className="pt-btn pt-btn-sm" onClick={() => onChange([...rows, { description: '', qty: 1, price: 0 }])}><Icon name="plus" size={14} /> بند جديد</button></div>
      <div className="pt-items-total">
        <span className="pt-muted">المجموع قبل الضريبة: <span className="pt-money">{fmtMoney(t.subtotal)}</span></span>
        {t.discount > 0 && <span className="pt-muted">الخصم: <span className="pt-money">− {fmtMoney(t.discount)}</span></span>}
        <span className="pt-muted">ضريبة القيمة المضافة {t.vatRate}٪: <span className="pt-money">{fmtMoney(t.vat)}</span></span>
        <strong>الإجمالي: <span className="pt-money">{fmtMoney(t.total)}</span></strong>
      </div>
    </div>
  )
}
