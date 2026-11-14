'use client'

import Link from 'next/link'
import { Chip, OptionChip, Avatar } from './ui'
import { Icon } from './Icon'
import { useLookup } from './data'
import { fmtMoney, fmtNumber, fmtDate, fmtDateTime, isOverdue, daysUntil } from '@/portal/format'
import type { FieldDef, LineItem, ModuleDef, ChecklistItem } from '@/portal/schema'
import { Stars } from './charts'
import { invoiceTotals } from '@/portal/zatca'
import { getModule } from '@/portal/modules'

/** Label of a related record (client name, team member…) with a link. */
export function RelationValue({ module, id, avatar }: { module: string; id: unknown; avatar?: boolean }) {
  const lookup = useLookup(id ? module : undefined)
  if (!id) return <span className="pt-dim">—</span>
  const rec = lookup.get(String(id))
  const def = getModule(module)
  const label = rec ? String(rec[def?.titleField ?? 'name'] ?? rec.number ?? '') : '…'
  if (module === 'team' && avatar !== false) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
        <Avatar name={label} color={rec?.color ? String(rec.color) : undefined} size={22} />
        <span>{label}</span>
      </span>
    )
  }
  return <Link href={`/portal/${module}/${id}`} onClick={e => e.stopPropagation()} style={{ color: 'var(--gold-bright)' }}>{label}</Link>
}

export function FieldValue({ field, value, record, def, compact }: { field: FieldDef; value: unknown; record?: Record<string, unknown>; def?: ModuleDef; compact?: boolean }) {
  if (field.type === 'rating') return <Stars value={typeof value === 'number' ? value : null} size={compact ? 14 : 18} showNumber={!compact} />
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
    return <span className="pt-dim">—</span>
  }
  switch (field.type) {
    case 'money': return <span className="pt-money">{fmtMoney(value)}</span>
    case 'number': return <span className="pt-num">{fmtNumber(value)}</span>
    case 'percent': return <span className="pt-num">{fmtNumber(value)}٪</span>
    case 'date': {
      const late = isOverdue(value) && def?.statusField && record && !['done', 'paid', 'void', 'published', 'delivered', 'archived', 'ended'].includes(String(record[def.statusField]))
      const d = daysUntil(value)
      return (
        <span className={late ? 'pt-overdue pt-num' : 'pt-num'} title={d !== null ? (d === 0 ? 'اليوم' : d > 0 ? `بعد ${d} يوم` : `متأخر ${-d} يوم`) : undefined}>
          {fmtDate(value)}
        </span>
      )
    }
    case 'datetime': return <span className="pt-num">{fmtDateTime(value)}</span>
    case 'select': return <OptionChip option={field.options?.find(o => o.value === value)} value={value} small={compact} />
    case 'multiselect':
      return <span style={{ display: 'inline-flex', gap: '0.3rem', flexWrap: 'wrap' }}>{(value as string[]).slice(0, compact ? 2 : 99).map(v => <Chip key={v} label={field.options?.find(o => o.value === v)?.label ?? v} color="#6B7A99" small />)}{compact && (value as string[]).length > 2 && <span className="pt-dim" style={{ fontSize: '0.7rem' }}>+{(value as string[]).length - 2}</span>}</span>
    case 'tags':
      return <span style={{ display: 'inline-flex', gap: '0.3rem', flexWrap: 'wrap' }}>{(value as string[]).map(v => <span key={v} className="pt-tag">#{v}</span>)}</span>
    case 'relation': return <RelationValue module={field.relation!} id={value} />
    case 'boolean': return value ? <span style={{ color: '#7FE0A8', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Icon name="check" size={14} /> نعم</span> : <span className="pt-dim">لا</span>
    case 'color': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><i style={{ width: 14, height: 14, borderRadius: 4, background: String(value), display: 'inline-block' }} /><span className="pt-dim" dir="ltr">{String(value)}</span></span>
    case 'url': return <a href={String(value)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--gold-bright)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }} dir="ltr"><span style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(value).replace(/^https?:\/\//, '')}</span><Icon name="external" size={12} /></a>
    case 'email': return <a href={`mailto:${value}`} onClick={e => e.stopPropagation()} dir="ltr" style={{ color: 'var(--gold-bright)' }}>{String(value)}</a>
    case 'phone': return <a href={`tel:${value}`} onClick={e => e.stopPropagation()} dir="ltr" className="pt-num" style={{ color: 'var(--gold-bright)' }}>{String(value)}</a>
    case 'items': {
      const t = invoiceTotals(value as LineItem[], record?.discount, record?.vatRate)
      return <span className="pt-money">{fmtMoney(t.total)} <span className="pt-dim" style={{ fontSize: '0.72rem' }}>({(value as LineItem[]).length} بند)</span></span>
    }
    case 'textarea': return <span className={compact ? '' : 'pre'} style={compact ? { display: 'inline-block', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'bottom' } : { whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{String(value)}</span>
    case 'checklist': {
      const items = value as ChecklistItem[]
      const done = items.filter(i => i.done).length
      return <span className="pt-num">{done} / {items.length} خطوة</span>
    }
    case 'password': return <span className="pt-dim">••••••••</span>
    default: return <>{String(value)}</>
  }
}
